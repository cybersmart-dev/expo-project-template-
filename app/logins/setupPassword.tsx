import { View, Text } from "react-native";
import React, { useRef, useState } from "react";
import SingupPasswordSetup from "@/components/login/SingupPasswordSetup";
import FlashMessage, { showMessage } from "react-native-flash-message";
import { router, useLocalSearchParams } from "expo-router";
import Processing from "@/components/models/Processing";

const setupPassword = () => {
  const { fullName, email, phoneNumber, state } = useLocalSearchParams();
  const [processing, setProcessing] = useState(false);
  const processingRef = useRef<number>(null);

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
    singup();
  };

  const singup = () => {
    setProcessing(true);
    processingRef.current = setInterval(() => {
        router.push("/(tabs)");
        if (processingRef.current) {
            clearInterval(processingRef.current)
            processingRef.current = null
            setProcessing(false)
        }
    }, 3000);
  };
  return (
    <View className="flex-1">
      <SingupPasswordSetup onComfirm={handleConfirm} />
      <Processing visible={processing} />
    </View>
  );
};

export default setupPassword;
