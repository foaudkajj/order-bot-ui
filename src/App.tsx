import "devextreme/dist/css/dx.common.css";
import "./themes/generated/theme.base.css";
import "./themes/generated/theme.additional.css";
import React from "react";
import { HashRouter as Router } from "react-router-dom";
import "./dx-styles.scss";
import LoadPanel from "devextreme-react/load-panel";
import { NavigationProvider } from "./contexts/navigation.context";
import { AuthProvider, useAuth } from "./contexts/auth.context";
import { useScreenSizeClass } from "./utils/media-query";
import Content from "./Content";
import UnauthenticatedContent from "./UnauthenticatedContent";
import "./i18n/i18n";
import config from "devextreme/core/config";
import trMessages from "devextreme/localization/messages/tr.json";
import { locale, loadMessages } from "devextreme/localization";

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadPanel visible={true} />;
  }

  if (user) {
    return <Content />;
  }

  return <UnauthenticatedContent />;       
}

export default function Root() {
  const screenSizeClass = useScreenSizeClass();

  config({
    defaultCurrency: "TRY",
  });

  loadMessages(trMessages);
  locale("tr-TR");

  return (
    <Router>
      <AuthProvider>
        <NavigationProvider>
          <div className={`app ${screenSizeClass}`}>
            <App />
          </div>
        </NavigationProvider>
      </AuthProvider>
    </Router>
  );
}
