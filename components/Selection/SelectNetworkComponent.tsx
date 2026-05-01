import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  FlatList,
  Pressable,
  ScrollView,
  TextInput,
  View,
  StatusBar as RNStatusBar,
} from "react-native";
import {
  Avatar,
  Button,
  IconButton,
  List,
  Searchbar,
  Text,
  useTheme,
} from "react-native-paper";
import BottomSheet from "../models/BottomSheet";
import { useCallback, useEffect, useRef, useState } from "react";
import { NetworksType } from "@/constants/Types";
import * as Contacts from "expo-contacts";
import { isValidMobileNumber } from "@/constants/Utils";
import { showMessage } from "react-native-flash-message";
import { Networks } from "@/constants/DemoList";
import { Storage } from "@/constants/Storage";
import { useFocusEffect } from "expo-router";

interface SelectNetworkComponentProps {
  onChangeText: (text: string) => void;
  showNetworksSheet?: boolean;
  onSelectNetwork: (data: typeof Networks[0]) => void;
}
const SelectNetworkComponent = ({
  onSelectNetwork,
  showNetworksSheet = false,
  onChangeText,
}: SelectNetworkComponentProps) => {
  const [selectNetworkVisible, setselectNetworkVisible] = useState(false);
  const theme = useTheme();
  const [selectedNetwork, setSelectedNetwork] = useState<typeof Networks[0]>();
  const mobileNumberRef = useRef<TextInput>(null);
  const [mobileNumber, setMobileNumber] = useState("");
  const [contactsSheetVisible, setContactsSheetVisible] = useState(false);
  const [usersearchInputText, setUsersearchInputText] = useState("");
  const [contacts, setContacts] = useState<Contacts.ExistingContact[]>();
  const [networks, setNetworks] = useState<Array<typeof Networks[0]>>([]);
  const [searchContacts, setSearchContacts] =
    useState<Contacts.ExistingContact[]>();

  useFocusEffect(
    useCallback(() => {
      loadNetworks();
    }, []),
  );

  useEffect(() => {
    if (isValidMobileNumber(mobileNumber)) {
      if (!selectedNetwork) {
        let network = networks[0];
        if (network) {
          setSelectedNetwork(network);
          onSelectNetwork(network);
        }
      }
    }
  }, [mobileNumber]);

  useEffect(() => {
    setselectNetworkVisible(showNetworksSheet);
  }, [!showNetworksSheet]);

  const initializeNumber = () => {
    // setMobileNumber("07026426748");
    // onChangeText("07026426748");
  };

  const selectContact = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === "granted") {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers],
      });

      if (data.length > 0) {
        const contacts = data;
        setContacts(contacts);
        setSearchContacts(contacts);
        setContactsSheetVisible(true);
      } else {
        showMessage({
          message: "No Contacts Found on this device",
          type: "warning",
          icon: "warning",
        });
      }
    } else {
    }
  };

  const getNumber = (item: Contacts.PhoneNumber[] | undefined) => {
    if (item) {
      return item[0].number;
    }
    return "";
  };

  const getName = (item: Contacts.ExistingContact) => {
    if (item.firstName == undefined && item.lastName == undefined) {
      return "Unknown";
    }
    return `${item.firstName ?? ""}  ${item.lastName ?? ""}`;
  };

  const handleSelectNumber = (number: string | undefined) => {
    if (number) {
      if (isValidMobileNumber(number)) {
        if (number.trim().length == 14 && number.startsWith("+234")) {
          number = "0".concat(number.replace("+234", ""));
        }
        setMobileNumber(number);
        onChangeText(number);
        setContactsSheetVisible(false);
        setUsersearchInputText("");
      } else {
        showMessage({
          message: "Invali Number",
          description: "This number is not valid",
          type: "danger",
        });
      }
    }
  };

  useEffect(() => {
    const handleSearch = () => {
      if (usersearchInputText.trim() != "") {
        handleSearchContact();
        return;
      }
      setSearchContacts(contacts);
    };
    handleSearch();
  }, [usersearchInputText]);

  const loadNetworks = async () => {
    try {
      const networksString = await Storage.secureGet("networks");
      if (networksString) {
        setNetworks(JSON.parse(networksString));
      }
    } catch (error) {}
  };

  const handleSearchContact = () => {
    const result: any = [];

    contacts?.map((contact) => {
      if (
        contact.firstName
          ?.toLowerCase()
          .match(usersearchInputText.toLowerCase()) ||
        contact.lastName?.toLowerCase().match(usersearchInputText.toLowerCase())
      ) {
        result.push(contact);
      }

      setSearchContacts(result);
    });
  };

  return (
    <View className="px-5">
      <View
        style={{ borderColor: theme.colors.onBackground, borderRadius: 15 }}
        className="w-[100%] h-[55px] flex-row border  p-1 px-2"
      >
        <View className="flex-row items-center">
          <Pressable
            onPress={() => setselectNetworkVisible(true)}
            className="w-[30px] h-[30px] rounded-full bg-slate-600"
          >
            <Avatar.Image
              size={30}
              source={{ uri: selectedNetwork?.icon, height: 30, width: 30 }}
            />
          </Pressable>
          <IconButton
            size={8}
            onPress={() => setselectNetworkVisible(true)}
            icon={() => (
              <MaterialIcons
                name="keyboard-arrow-down"
                size={24}
                color={theme.colors.onBackground}
              />
            )}
          />
        </View>
        <TextInput
          onChangeText={(text: string) => {
            setMobileNumber(text);
            onChangeText(text);
          }}
          value={mobileNumber}
          ref={mobileNumberRef}
          style={{ fontSize: 18, color: theme.colors.onBackground }}
          className="h-full flex-1"
          keyboardType="numeric"
          placeholder="Mobile Number"
          placeholderTextColor={theme.colors.onBackground}
          maxLength={11}
          autoFocus={true}
          focusable
        />
        <View className="flex-row">
          {mobileNumber.length > 0 && (
            <IconButton
              onPress={() => {
                mobileNumberRef?.current?.clear();
                setMobileNumber("");
                onChangeText("");
              }}
              size={20}
              icon={"close-circle"}
            />
          )}
          {mobileNumber.length == 0 && (
            <IconButton onPress={selectContact} size={20} icon={"contacts"} />
          )}
        </View>
      </View>
      <BottomSheet
        mode="full-width"
        height={"50%"}
        visible={selectNetworkVisible}
        onDismiss={() => setselectNetworkVisible(false)}
      >
        <View className="flex-1">
          <View className="p-3">
            <Text className="text-lg font-bold">Select Network</Text>
          </View>

          <ScrollView className="px-5 mb-[40px]">
            <List.Section>
              {networks.map((network) => (
                <List.Item
                  key={network.id}
                  onPress={() => {
                    setselectNetworkVisible(false);
                    setSelectedNetwork(network);
                    onSelectNetwork(network);
                  }}
                  left={() => (
                    <Avatar.Image
                      size={40}
                      source={{ uri: network?.icon, height: 40, width: 40 }}
                    />
                  )}
                  titleStyle={{ fontSize: 20, fontWeight: "bold" }}
                  title={network.name.toLocaleUpperCase()}
                />
              ))}
            </List.Section>
          </ScrollView>

          <View className="bottom-0 w-full mb-2 px-4 hidden">
            <Button
              onPress={() => setselectNetworkVisible(false)}
              mode="outlined"
            >
              Close
            </Button>
          </View>
        </View>
      </BottomSheet>
      <BottomSheet
        height={"70%"}
        visible={contactsSheetVisible}
        mode="full-width"
        onDismiss={setContactsSheetVisible}
      >
        <View style={{ paddingTop: RNStatusBar.currentHeight }}>
          <View className="px-2 m-2">
            <Searchbar
              placeholder="Search Contact"
              value={usersearchInputText}
              onChangeText={(text) => {
                setUsersearchInputText(text);
              }}
            />
          </View>
          <FlatList
            data={searchContacts}
            renderItem={({ item }) => (
              <View>
                {!getNumber(item.phoneNumbers) ? (
                  ""
                ) : (
                  <View className="px-5">
                    <List.Item
                      onPress={() =>
                        handleSelectNumber(getNumber(item?.phoneNumbers))
                      }
                      left={() => <List.Icon icon={"account-circle-outline"} />}
                      title={getName(item)}
                      description={`${getNumber(item?.phoneNumbers) ?? ""}`}
                    />
                  </View>
                )}
              </View>
            )}
          />
        </View>
      </BottomSheet>
    </View>
  );
};

export default SelectNetworkComponent;
