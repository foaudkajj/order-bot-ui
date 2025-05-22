import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./home.scss";
import LoginService from "../../services/login.service";

export default function Home() {
  const { t } = useTranslation();

  useEffect(() => {
    LoginService.validateToken();
  }, []);

  return (
    <React.Fragment>
      <h2 className={"content-block"}>{t('COMMON.APP_NAME')}</h2>
      <div className={"content-block"}>
        <div className={"dx-card responsive-paddings"}>Dashboard</div>
      </div>
    </React.Fragment>
  );
}
