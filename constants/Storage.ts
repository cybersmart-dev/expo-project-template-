import * as SecureStorge from "expo-secure-store";
import {} from "@/constants/Crypto";

export class Storage {
  constructor() {}

  static async SecureStore(key: string, value: string) {
    await SecureStorge.setItemAsync(key, value);
  }

  static async secureGet(key: string) {
    try {
      return await SecureStorge.getItemAsync(key);
    } catch (error) {
      return null;
    }
  }

  static async secureRemove(key: string) {
    try {
      await SecureStorge.deleteItemAsync(key);
    } catch (error) {
        throw new TypeError("Error")
    }
  }
}
