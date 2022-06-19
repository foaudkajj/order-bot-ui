import i18n from "i18next";
import notify from "devextreme/ui/notify";

const showToast = async (
  status: "success" | "error",
  text: string = i18n.t("MESSAGES.ERROR_TEXT"),
  timer: number = 3000
) => {
  notify(text, status, timer);
};

const ToastService = {
  showToast: showToast,
};

export default ToastService;
