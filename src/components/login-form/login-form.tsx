import React, { useState, useRef, useCallback } from "react";
// import { Link, useNavigate } from 'react-router-dom';
import Form, {
  Item,
  Label,
  ButtonItem,
  ButtonOptions,
  RequiredRule,
} from "devextreme-react/form";
import LoadIndicator from "devextreme-react/load-indicator";
import { useAuth } from "../../contexts/auth.context";

import "./login-form.scss";

export default function LoginForm() {
  // const navigate = useNavigate();
  const { signIn } = useAuth();
  const [loading] = useState(false);
  const formData = useRef({ username: "", password: "" });

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const { username, password } = formData.current;

      await signIn(username, password);
    },
    [signIn]
  );

  // const onCreateAccountClick = useCallback(() => {
  //   navigate('/create-account');
  // }, [navigate]);

  return (
    <>
    {process.env.REACT_APP_API_URL}
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
                <LoadIndicator width={"24px"} height={"24px"} visible={true} />
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
