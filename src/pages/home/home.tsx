import React from "react";
import { useTranslation } from "react-i18next";
import "./home.scss";

export default function Home() {
  const { t } = useTranslation();
  return (
    <React.Fragment>
      <h2 className={"content-block"}>{t('COMMON.APP_NAME')}</h2>
      <div className={"content-block"}>
        <div className={"dx-card responsive-paddings"}>Dashboard</div>
      </div>
    </React.Fragment>
  );
}
