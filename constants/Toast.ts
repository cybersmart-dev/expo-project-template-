import { showMessage } from "react-native-flash-message";

export class Toast {
  static danger({ title = "", body = "" }) {
    showMessage({
      message: title,
      description: body,
      type: "danger",
      icon: "danger",
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
