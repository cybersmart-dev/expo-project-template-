import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface requestProps {
  url: string;
  method: "GET" | "POST";
  data?: any;
  headers?: HeadersInit | undefined;
  add_header_token?: boolean;
}

interface responseProps {
  status: number | undefined;
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
  data?: {tnxid: string} | Object;
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
      data.tnxid = this.generateUUID()
    }
    try {
      const response = await fetch(url, {
        method: method,
        body: JSON.stringify(data),
        headers: headers,
      });

      const responseData: responseProps = await response.json();

     if (responseData.message?.toLowerCase().match(/token/i) || responseData.message?.toLowerCase().includes("Authorization") && responseData.status == 0) {
       if (router.pathname != "/logins/emailLogin") {
         await this.clearToken();
         router.push("/logins/emailLogin");
         return { status: 0, message: "Session expired" };
       }
     }

      return responseData;
    } catch (error) {
      return { status: undefined, message: `${error}` };
    }
  }

  static async get({ url, add_header_token = true }: requestGetProps) {
    const headers = await this.getheaders(add_header_token);
    const response = await this.request({ url: url, method: "GET", headers: headers });

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
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          const r = (Math.random() * 16) | 0;
          const v = c === "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        },
      );
    }

  static getUrl(path: string) {
    return "http://192.168.43.69:8000/api" + path;
  }

  static async getToken() {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        return token;
      }
    } catch (error) {}
  }

  static async clearToken() {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("userInfo")

      router.push("/logins/emailLogin");
    } catch (error) {}
  }

  static async getheaders(add_header_token: boolean ) {
    const token = await this.getToken();

    let headers: any = {
      "content-type": "application/json",
    };
    if (add_header_token) {
     headers.Authorization = `Token ${token}`;
    }
    return headers;
  }
}
