import { useState } from "react";

import LoginContext from "./LoginContext";

const LoginContextProvider = (props) => {
    const [showLogin, setShowLogin] = useState(false);
    const [showVerifyEmail, setShowVerifyEmail] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);

    return (
        <LoginContext.Provider value={{ showLogin, setShowLogin, showVerifyEmail, setShowVerifyEmail, showForgotPassword, setShowForgotPassword }}>
            {props.children}
        </LoginContext.Provider>
    )
}

export default LoginContextProvider;