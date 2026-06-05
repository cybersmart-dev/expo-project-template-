import { View, Text, BackHandler, Alert } from "react-native";
import React, { useCallback, useRef, useState } from "react";
import SingupPasswordSetup from "@/components/login/SingupPasswordSetup";
import FlashMessage, { showMessage } from "react-native-flash-message";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import Processing from "@/components/models/Processing";
import { Timer } from "@/constants/Utils";
import requests from "@/Network/HttpRequest";
import { Toast } from "@/constants/Toast";

const setupPassword = () => {
  const { fullName, email, phoneNumber, state } = useLocalSearchParams();
  const [processing, setProcessing] = useState(false);
  const processingRef = useRef<number>(null);

  useFocusEffect(
    useCallback(() => {
      const back = BackHandler.addEventListener("hardwareBackPress", () => {
        Alert.alert("Go Back", "Are you sure do you want to go back?", [
          { text: "Yes", onPress: () => router.back() },
          { text: "No", onPress: () => null },
          
        ], {"cancelable": true});

        return true;
      });
      return () => back.remove();
    }, []),
  );

  const handleConfirm = (data: { pass1: string; pass2: string }) => {
    const { pass1, pass2 } = data;
    if (pass1 != pass2) {
      showMessage({
        message: "Passwords miss match",
        type: "danger",
        icon: "danger",
      });

      return;
    }

    registerUser(pass1);
  };

  const registerUser = async (password: string) => {
    console.log({ fullName, email, phoneNumber, state, password });
    setProcessing(true);
    const response = await requests.post({
      url: "/register/",
      add_header_token: false,
      data: {
        full_name: fullName,
        email: email,
        phone_number: phoneNumber,
        state: state,
        password: password,
      },
    });

    //console.log(response);

    setProcessing(false);

    if (response.status == 1) {
      showMessage({
        message: "Registered",
        description: "Account registered successfuly",
        type: "success",
        icon: "success",
        duration: 5000,
      });
      router.push("/logins/emailLogin");
    }
    if (response.status == 0) {
      showMessage({
        message: "Registration Failed",
        description: response.message,
        type: "danger",
        icon: "danger",
      });
    }
    if (response.status == undefined) {
      Toast.dangerHapticsAsync({
        title: "Registration Failed",
        body: "Network Disconnected",
      });
    }
  };
  return (
    <View className="flex-1">
      <SingupPasswordSetup
        onComfirm={handleConfirm}
        email={email}
        phoneNumber={phoneNumber}
      />
      <Processing visible={processing} />
    </View>
  );
};

export default setupPassword;
