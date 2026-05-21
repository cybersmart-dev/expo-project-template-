import { showMessage } from "react-native-flash-message";
import * as Haptics from "expo-haptics";

export class Toast {
  static danger({ title = "", body = "" }) {
    this.dangerHapticsAsync({title, body})
    // showMessage({
    //   message: title,
    //   description: body,
    //   type: "danger",
    //   icon: "danger",
    //   duration: 8000,
    // });
  }

  static async dangerHapticsAsync({ title = "", body = "" }) {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    showMessage({
      message: title,
      description: body,
      type: "danger",
      icon: "danger",
      duration: 8000,
    });
  }

  static success({ title = "", body = "" }) {
    showMessage({
      message: title,
      description: body,
      type: "success",
      icon: "success",
    });
  }
  static warning({ title = "", body = "" }) {
    showMessage({
      message: title,
      description: body,
      type: "warning",
      icon: "warning",
    });
  }
}
