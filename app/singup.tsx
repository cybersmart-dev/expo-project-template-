import AnimatedTransLogo from "@/components/Animations/AnimatedTransLogo";
import BottomLayout from "@/components/Containers/BottomLayout";
import CustomAppbar from "@/components/CustomAppbar";
import SingupPasswordSetup from "@/components/login/SingupPasswordSetup";
import { PaperSafeView, PaperView } from "@/components/PaperView";
import { Toast } from "@/constants/Toast";
import requests from "@/Network/HttpRequest";
import { CustomLightTheme } from "@/Themes/ThemeSchemes";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Color, router, useFocusEffect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Image,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  LayoutChangeEvent,
  Pressable,
  FlatList,
} from "react-native";
import { EaseView } from "react-native-ease";
import FlashMessage, { showMessage } from "react-native-flash-message";
import {
  Appbar,
  Button,
  Divider,
  List,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { isValid } from "phoneng";
import BottomSheet from "@/components/models/BottomSheet";
import * as Haptics from "expo-haptics";

const Singup = () => {
  const theme = useTheme();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [state, setState] = useState("");
  const [formHeight, setFormHeight] = useState(0);

  const [fullnameErrorShow, setFullNameErrorShow] = useState(false);
  const [emailErrorShow, setEmailErrorShow] = useState(false);
  const [phoneNumberErrorShow, setPhoneNumberErrorShow] = useState(false);
  const [stateErrorShow, setStateErrorShow] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState();
  const [step, setStep] = useState<"first" | "second">("first");
  const [refCode, setRefCode] = useState("");
  const [countrySelectBottomSheetVisible, setCountrySelectBottomSheetVisible] =
    useState(false);
  const [stateSelectBottomSheetVisible, setStateSelectBottomSheetVisible] =
    useState(false);

  const [loaded, setLoaded] = useState(false);

  const NigerianStates = [
    "Abia",
    "Adamawa",
    "Akwa Ibom",
    "Anambra",
    "Bauchi",
    "Bayelsa",
    "Benue",
    "Borno",
    "Cross River",
    "Delta",
    "Ebonyi",
    "Edo",
    "Ekiti",
    "Enugu",
    "Gombe",
    "Imo",
    "Jigawa",
    "Kaduna",
    "Kano",
    "Katsina",
    "Kebbi",
    "Kogi",
    "Kwara",
    "Lagos",
    "Nasarawa",
    "Niger",
    "Ogun",
    "Ondo",
    "Osun",
    "Oyo",
    "Plateau",
    "Rivers",
    "Sokoto",
    "Taraba",
    "Yobe",
    "Zamfara",
    "Federal Capital Territory",
  ];
  const Countries = ["Nigeria"];

  useFocusEffect(
    useCallback(() => {
      setLoaded(true);
      return () => {
        setLoaded(false);
      };
    }, []),
  );

  const singupNext = () => {
    Keyboard.dismiss();
    if (step == "first") {
      fistStepInputValidation();
      return;
    }
    if (step == "second") {
      secondStepInputValidation();
      return;
    }
  };

  const fistStepInputValidation = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const trimmedFullName = fullName.trim();
    const trimmedEmail = email.trim();
    const trimmedPhoneNumber = phoneNumber.trim();

    const hasFullNameError =
      trimmedFullName.length === 0 ||
      trimmedFullName.length < 5 ||
      trimmedFullName.split(" ").length < 2;
    const hasEmailError =
      trimmedEmail.length === 0 || !emailRegex.test(trimmedEmail);
    const hasPhoneNumberError =
      trimmedPhoneNumber.length === 0 || !isValid(trimmedPhoneNumber);

    setFullNameErrorShow(hasFullNameError);
    setEmailErrorShow(hasEmailError);
    setPhoneNumberErrorShow(hasPhoneNumberError);

    if (hasFullNameError || hasEmailError || hasPhoneNumberError) {
      const message = "Please fix invalid input";
      const description = hasFullNameError
        ? "Enter your full name."
        : hasEmailError
          ? "Enter a valid email address."
          : hasPhoneNumberError
            ? "Enter a valid phone number."
            : "Enter your state.";

      showMessage({
        message,
        description,
        type: "danger",
      });
      Toast.dangerHapticsAsync({ title: message, body: description });
      return;
    }
    setStep("second");
  };

  const secondStepInputValidation = () => {
    const trimmedState = state.trim();

    const hasStateError = trimmedState.length === 0;

    setStateErrorShow(hasStateError);

    if (hasStateError) {
      const message = "Please fix invalid input";
      const description = "Enter your state.";

      showMessage({
        message,
        description,
        type: "danger",
      });
      Toast.dangerHapticsAsync({ title: message, body: description });
      return;
    }
    validateInputs();
  };

  const validateInputs = async () => {
    router.push({
      pathname: "/logins/setupPassword",
      params: {
        fullName: fullName,
        email: email,
        phoneNumber: phoneNumber,
        state: state,
        ref: refCode,
      },
    });

    return;
  };

  const handleOnLayout = (event: LayoutChangeEvent): void => {
    const height = event.nativeEvent.layout.height;
    setFormHeight(height);
  };

  const StatesComponent = React.memo(({ item }) => {
    if (!item) return null;

    return (
      <View className="mt-2 pl-3 pr-1">
        <List.Item
          onPress={async () => {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            setStateSelectBottomSheetVisible(false);
            setState(item);
          }}
          title={item}
          titleStyle={{ fontWeight: "bold", fontSize: 20 }}
          right={({ color }) => (
            <MaterialIcons
              name="keyboard-arrow-right"
              color={color}
              size={24}
            />
          )}
          left={() => (
            <Image
              className="rounded-full"
              source={{
                uri: "https://flagcdn.com/w320/ng.png",
                height: 30,
                width: 30,
              }}
            />
          )}
        />
        <Divider />
      </View>
    );
  });

  const renderItem = useCallback(
    ({ item }) => <StatesComponent item={item} />,
    [NigerianStates],
  );

  return (
    <PaperSafeView>
      <CustomAppbar>
        <EaseView
          animate={{ translateX: loaded ? 0 : -200 }}
          transition={{ type: "timing", duration: 1000 }}
        >
          <Appbar.Action
            icon={({ color, size }) => (
              <MaterialIcons
                name="keyboard-arrow-left"
                size={size}
                color={color}
              />
            )}
            onPress={() => router.back()}
          />
        </EaseView>
        <Appbar.Content
          title={
            <View className="justify-center mt-5">
              <Text
                numberOfLines={1}
                style={{ fontWeight: "bold", fontSize: 18 }}
              >
                {step == "second" && email}
              </Text>
              <Text
                style={{
                  color: theme.colors.onBackground,
                  fontSize: 13,
                  marginBottom: 30,
                  opacity: 0.5,
                }}
              >
                {step == "second" && phoneNumber}
              </Text>
            </View>
          }
          mode="small"
          style={{ alignItems: "flex-start" }}
        />

        <EaseView
          animate={{ translateX: loaded ? 0 : 200 }}
          transition={{ type: "timing", duration: 1000 }}
        >
          <Button mode={"contained-tonal"} className="mr-2">
            Help
          </Button>
        </EaseView>
      </CustomAppbar>
      <View className="absolute top-[80px] space-y-1 w-full items-center justify-center">
        <EaseView
          animate={{
            opacity: loaded ? 1 : 0,
            translateY: loaded ? 0 : -20,
          }}
          transition={{ duration: 1000, type: "timing" }}
        >
          <AnimatedTransLogo />
        </EaseView>
        <View className="items-center">
          <EaseView
            animate={{
              opacity: loaded ? 1 : 0,
              translateY: loaded ? 0 : -20,
            }}
            transition={{ duration: 1000, type: "timing", delay: 200 }}
          >
            <Text
              style={{
                color: theme.colors.onBackground,
                fontSize: 20,
              }}
            >
              Welcome To Zaffy
            </Text>
          </EaseView>
          <EaseView
            animate={{
              opacity: loaded ? 1 : 0,
              translateY: loaded ? 0 : -20,
            }}
            transition={{ duration: 1000, type: "timing", delay: 400 }}
          >
            <Text
              style={{
                color: theme.colors.onBackground,
                fontSize: 13,
                marginBottom: 30,
                opacity: 0.5,
              }}
            >
              Register New Account
            </Text>
          </EaseView>
        </View>
      </View>

      <EaseView
        animate={{
          translateX: step == "second" ? -10 : 0,
          opacity: step == "second" ? 1 : 0,
        }}
        style={{
          marginBottom: formHeight,
          position: "absolute",
          bottom: 0,
          marginLeft: 3,
        }}
        className="absolute bottom-0 ml-3 p-2"
      >
        <Button
          onPress={() => {
            setStep("first");
          }}
          icon={"arrow-left"}
        >
          Back
        </Button>
      </EaseView>

      <BottomLayout onLayout={handleOnLayout}>
        <View className="px-5 gap-y-5 pt-10">
          {step == "first" && (
            <View className="gap-y-5">
              <TextInput
                placeholder="Full Name"
                keyboardType={"default"}
                value={fullName}
                style={{ backgroundColor: "transparent" }}
                error={fullnameErrorShow}
                onChangeText={(value) => {
                  setFullName(value);
                  setFullNameErrorShow(false);
                }}
                left={<TextInput.Icon size={20} icon="account" />}
                mode="outlined"
                outlineStyle={{ borderRadius: 15 }}
              />

              <TextInput
                placeholder="Email Address"
                value={email}
                keyboardType={"email-address"}
                style={{ backgroundColor: "transparent" }}
                error={emailErrorShow}
                onChangeText={(value) => {
                  setEmail(value);
                  setEmailErrorShow(false);
                }}
                left={<TextInput.Icon size={20} icon="email" />}
                mode="outlined"
                outlineStyle={{ borderRadius: 15 }}
              />
              <TextInput
                placeholder="Phone Number"
                keyboardType={"numeric"}
                value={phoneNumber}
                style={{ backgroundColor: "transparent" }}
                error={phoneNumberErrorShow}
                onChangeText={(value) => {
                  setPhoneNumber(value);
                  setPhoneNumberErrorShow(false);
                }}
                left={<TextInput.Icon size={20} icon="phone" />}
                mode="outlined"
                outlineStyle={{ borderRadius: 15 }}
              />
            </View>
          )}

          {step == "second" && (
            <View className="gap-y-5">
              <Pressable
                onPress={() => setCountrySelectBottomSheetVisible(true)}
              >
                <TextInput
                  placeholder="Select Country"
                  keyboardType={"default"}
                  style={{ backgroundColor: "transparent" }}
                  value={selectedCountry}
                  editable={false}
                  onChangeText={(value) => {
                    setState(value);
                    setStateErrorShow(false);
                  }}
                  left={
                    <TextInput.Icon
                      size={20}
                      icon={({ color, size }) => (
                        <View>
                          {selectedCountry && (
                            <Image
                              className="rounded-full"
                              source={{
                                uri: "https://flagcdn.com/w320/ng.png",
                                height: 30,
                                width: 30,
                              }}
                            />
                          )}
                          {!selectedCountry && (
                            <MaterialIcons
                              name="map"
                              color={color}
                              size={size}
                            />
                          )}
                        </View>
                      )}
                    />
                  }
                  mode="outlined"
                  outlineStyle={{ borderRadius: 15 }}
                  right={
                    <TextInput.Icon
                      size={24}
                      onPress={() => setCountrySelectBottomSheetVisible(true)}
                      icon={({ color, size }) => (
                        <MaterialIcons
                          name="keyboard-arrow-down"
                          color={color}
                          size={size}
                        />
                      )}
                    />
                  }
                />
              </Pressable>

              <Pressable onPress={() => setStateSelectBottomSheetVisible(true)}>
                <TextInput
                  placeholder="Select State"
                  keyboardType={"default"}
                  style={{ backgroundColor: "transparent" }}
                  error={stateErrorShow}
                  value={state}
                  editable={false}
                  onChangeText={(value) => {
                    setState(value);
                    setStateErrorShow(false);
                  }}
                  left={<TextInput.Icon size={20} icon="home" />}
                  mode="outlined"
                  outlineStyle={{ borderRadius: 15 }}
                  right={
                    <TextInput.Icon
                      size={24}
                      onPress={() => setStateSelectBottomSheetVisible(true)}
                      icon={({ color, size }) => (
                        <MaterialIcons
                          name="keyboard-arrow-down"
                          color={color}
                          size={size}
                        />
                      )}
                    />
                  }
                />
              </Pressable>

              <TextInput
                placeholder="Referral Code ( Optional )"
                style={{ backgroundColor: "transparent" }}
                onChangeText={(value) => {
                  setRefCode(value);
                }}
                left={<TextInput.Icon size={20} icon="account" />}
                mode="outlined"
                outlineStyle={{ borderRadius: 15 }}
              />
            </View>
          )}
          <View className="mb-0">
            <Button
              onPress={singupNext}
              mode="contained"
              className="text-lg py-1"
              style={{ borderRadius: 15 }}
              labelStyle={{ fontSize: 16 }}
            >
              Next
            </Button>
            <View className="flex-row items-center justify-center pt-1">
              <Text>I have an account</Text>
              <Button onPress={() => router.back()}>Sing in</Button>
            </View>
          </View>
        </View>
      </BottomLayout>

      <BottomSheet
        mode={"full-width"}
        height={"50%"}
        visible={stateSelectBottomSheetVisible}
        onDismiss={setStateSelectBottomSheetVisible}
      >
        <View>
          <View className="p-3">
            <Text className="text-lg">Select State</Text>
          </View>

          <View>
            <FlatList
              keyExtractor={(item) => `${item}`}
              data={NigerianStates}
              renderItem={renderItem}
              initialNumToRender={15}
              maxToRenderPerBatch={50}
              windowSize={5}
            />
          </View>
        </View>
      </BottomSheet>

      <BottomSheet
        mode={"full-width"}
        height={"50%"}
        visible={countrySelectBottomSheetVisible}
        onDismiss={setCountrySelectBottomSheetVisible}
      >
        <View>
          <View className="p-3">
            <Text className="text-lg">Select Country</Text>
          </View>

          <View>
            <FlatList
              keyExtractor={(item) => `${item}`}
              data={Countries}
              renderItem={({ item }) => (
                <View className="mt-2 px-3">
                  <List.Item
                    onPress={async () => {
                      await Haptics.impactAsync(
                        Haptics.ImpactFeedbackStyle.Heavy,
                      );
                      setSelectedCountry(item);
                      setCountrySelectBottomSheetVisible(false);
                    }}
                    titleStyle={{ fontWeight: "bold", fontSize: 20 }}
                    title={item}
                    right={({ color }) => (
                      <MaterialIcons
                        name="keyboard-arrow-right"
                        color={color}
                        size={24}
                      />
                    )}
                    left={() => (
                      <Image
                        className="rounded-full"
                        source={{
                          uri: "https://flagcdn.com/w320/ng.png",
                          height: 30,
                          width: 30,
                        }}
                      />
                    )}
                  />
                  <Divider />
                </View>
              )}
              initialNumToRender={15}
              maxToRenderPerBatch={50}
              windowSize={5}
            />
          </View>
        </View>
      </BottomSheet>

      <StatusBar style={theme.dark ? "light" : "dark"} />
    </PaperSafeView>
  );
};

export default Singup;
