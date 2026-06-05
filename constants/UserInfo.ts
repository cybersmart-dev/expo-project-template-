import AsyncStorage from "@react-native-async-storage/async-storage";

export const getUserInfo = async () => {
  try {
    const userInfoString = await AsyncStorage.getItem("userInfo");
    if (userInfoString) {
      const info = JSON.parse(userInfoString);
      return info;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error loading user info:", error);
  }
};
