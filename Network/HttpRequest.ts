import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";
import { Storage } from "@/constants/Storage";
import * as Application from "expo-application";
import { Platform } from "react-native";
import { ErrorStatusCode } from "@/constants/StatusCodes";

interface requestProps {
  url: string;
  method: "GET" | "POST";
  data?: any;
  headers?: HeadersInit | undefined;
  add_header_token?: boolean;
}

interface responseProps {
  [x: string]: any;
  status: number | undefined;
  error_code?: number | undefined;
  message?: string;
  data?: any;
  token?: string;
}

interface requestGetProps {
  url: string;
  add_header_token?: boolean;
}

interface requestPostProps {
  url: string;
  data?: { tnxid: string } | Object;
  add_header_token?: boolean;
}

export default class requests {
  constructor() {}

  static async request({
    url,
    method,
    data,
    headers,
    add_header_token = true,
  }: requestProps): Promise<responseProps> {
    url = this.getUrl(url);
    if (data) {
      data.tnxid = this.generateUUID();
    }
    try {
      const response = await fetch(url, {
        method: method,
        body: JSON.stringify(data),
        headers: headers,
      });

      const responseData: responseProps = await response.json();
      
      if (
        responseData.status == 0 &&
        responseData.error_code == ErrorStatusCode.SESSION_EXPIRED
      ) {
        router.push("/logins/emailLogin");
        return {
          status: 0,
          message: "Session expired",
          error_code: ErrorStatusCode.SESSION_EXPIRED,
        };
      }

      return responseData;
    } catch (error) {
      return { status: undefined, message: `${error}` };
    }
  }

  static async get({ url, add_header_token = true }: requestGetProps) {
    const headers = await this.getheaders(add_header_token);
    const response = await this.request({
      url: url,
      method: "GET",
      headers: headers,
    });

    return response;
  }

  static async post({ url, data, add_header_token = true }: requestPostProps) {
    const headers = await this.getheaders(add_header_token);

    const response = await this.request({
      url: url,
      data: data,
      method: "POST",
      headers: headers,
    });
    return response;
  }

  static generateUUID() {
    const uuid = Crypto.randomUUID();
    return uuid;
  }

  static getUrl(path: string) {
    if (__DEV__) {
      // return "http://10.211.171.71:8000/api".concat(path)
      //return "http://10.34.222.29:8000/api" + path;
      //return "http://192.168.43.243:8000/api".concat(path);
      return "http://172.17.128.1:8000/api".concat(path);
    }
    return "https://zaffy-ng.vercel.app/api" + path;
  }

  static async getToken() {
    try {
      const auth = await Storage.secureGet("auth");

      if (auth) {
        const token = JSON.parse(auth)?.token;
        if (token) {
          return token;
        }
      }
    } catch (error) {}
  }

  static async clearToken() {
    try {
      await Storage.secureRemove("auth");
      await AsyncStorage.clear();
      router.push("/logins/emailLogin");
    } catch (error) {}
  }

  static async getheaders(add_header_token: boolean) {
    const token = await this.getToken();
    const device_id = await this.getDeviceID();
    const pushToken = await this.getPushToken();

    let headers: any = {
      "content-type": "application/json",
    };

    if (device_id) {
      headers["device-id"] = device_id;
    }

    if (pushToken) {
      headers["x-notification-token"] = pushToken;
    }
    if (add_header_token) {
      headers.Authorization = `Token ${token}`;
    }
    return headers;
  }

  static async getDeviceID() {
    if (Platform.OS == "android") {
      return Application.getAndroidId();
    } else {
      return await Application.getIosIdForVendorAsync();
    }
  }

  static async getPushToken() {
    try {
      const token = await Storage.secureGet("pushToken");
      return token;
    } catch (error) {}
  }
}
