import { Routes, Route, Navigate } from "react-router-dom";
import { SingleCard } from "./layouts";
import { LoginForm } from "./components";
import { useTranslation } from "react-i18next";

export default function UnauthenticatedContent() {
  const { t } = useTranslation();
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <SingleCard title={t("COMMON.APP_NAME")} description={""}>
            <LoginForm />
          </SingleCard>
        }
      />
      <Route path="*" element={<Navigate to={"/login"} />}></Route>
    </Routes>
  );
}
