import i18n from "i18next";
import notify from "devextreme/ui/notify";

const showToast = async (
  status: "success" | "error",
  text: string = undefined,
  timer: number = 3000
) => {
  if (!text) {
    if (status === "error") {
      text = i18n.t("MESSAGES.UNSUCESSFUL");
    } else {
      text = i18n.t("MESSAGES.SUCESSFUL");
    }
  }
  notify(text, status, timer);
};

const ToastService = {
  showToast: showToast,
};

export default ToastService;
