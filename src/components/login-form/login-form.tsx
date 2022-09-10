import React, { useState, useRef, useCallback } from "react";
import Form, {
  Item,
  Label,
  ButtonItem,
  ButtonOptions,
  RequiredRule,
} from "devextreme-react/form";
import LoadIndicator from "devextreme-react/load-indicator";
import { useAuth } from "../../contexts/auth.context";
import packageJson from "../../../package.json";

import "./login-form.scss";
import { useEffect } from "react";
import GetService from "../../services/get.service";
import ToastService from "../../services/toast.service";
import { useTranslation } from "react-i18next";

export default function LoginForm() {
  // const navigate = useNavigate();
  const { signIn } = useAuth();
  const [loading] = useState(false);
  const [serverVersion, setServerVersion] = useState("");
  const formData = useRef({ username: "", password: "" });
  const { t } = useTranslation();

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const { username, password } = formData.current;

      const signInRes = await signIn(username, password);
      if (!signInRes) {
        ToastService.showToast("error", t("LOGIN.WRNOG_LOGIN_CREDENTIALS"));
      }
    },
    [signIn]
  );

  useEffect(() => {
    GetService.getBackendVersion().then((version) => {
      setServerVersion(version.data);
    });
  }, []);
  // const onCreateAccountClick = useCallback(() => {
  //   navigate('/create-account');
  // }, [navigate]);

  return (
    <>
      <form className={"login-form"} onSubmit={onSubmit}>
        <Form formData={formData.current} disabled={loading}>
          <Item
            dataField={"username"}
            editorType={"dxTextBox"}
            editorOptions={userNameEditorOptions}
          >
            <RequiredRule message="User name is required" />
            <Label visible={false} />
          </Item>
          <Item
            dataField={"password"}
            editorType={"dxTextBox"}
            editorOptions={passwordEditorOptions}
          >
            <RequiredRule message="Password is required" />
            <Label visible={false} />
          </Item>
          {/* <Item
          dataField={'rememberMe'}
          editorType={'dxCheckBox'}
          editorOptions={rememberMeEditorOptions}
        >
          <Label visible={false} />
        </Item> */}
          <ButtonItem>
            <ButtonOptions
              width={"100%"}
              type={"default"}
              useSubmitBehavior={true}
            >
              <span className="dx-button-text">
                {loading ? (
                  <LoadIndicator
                    width={"24px"}
                    height={"24px"}
                    visible={true}
                  />
                ) : (
                  "Sign In"
                )}
              </span>
            </ButtonOptions>
            {/* </ButtonItem>
        <Item>
          <div className={'link'}>
            <Link to={'/reset-password'}>Forgot password?</Link>
          </div>
        </Item>
        <ButtonItem> 
          <ButtonOptions
            text={'Create an account'}
            width={'100%'}
            onClick={onCreateAccountClick}
          />*/}
          </ButtonItem>
        </Form>
      </form>
      <div>
        <div className="dx-field" style={{ margin: "0px" }}>
          <div className="dx-field-label">Client version</div>
          <div className="dx-field-value-static" style={{ padding: "0px" }}>
            {packageJson.version}
          </div>
        </div>
        <div className="dx-field">
          <div className="dx-field-label">Server version</div>
          <div className="dx-field-value-static" style={{ padding: "0px" }}>
            {serverVersion}
          </div>
        </div>
      </div>
    </>
  );
}

const userNameEditorOptions = {
  stylingMode: "filled",
  placeholder: "User name",
};
const passwordEditorOptions = {
  stylingMode: "filled",
  placeholder: "Password",
  mode: "password",
};
// const rememberMeEditorOptions = { text: 'Remember me', elementAttr: { class: 'form-text' } };
