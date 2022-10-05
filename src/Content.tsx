import { Routes, Route, Navigate } from "react-router-dom";
import appInfo from "./app-info";
import routes from "./app-routes";
import { SideNavInnerToolbar as SideNavBarLayout } from "./layouts";
import { Footer } from "./components";
import { useTranslation } from "react-i18next";

export default function Content() {
  const { t } = useTranslation();
  return (
    <SideNavBarLayout title={t(appInfo.title)}>
      <Routes>
        {routes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
      <Footer>
        Copyright © 2011-{new Date().getFullYear()} {appInfo.title} Inc.
        <br />
        All trademarks or registered trademarks are property of their respective
        owners.
      </Footer>
    </SideNavBarLayout>
  );
}
