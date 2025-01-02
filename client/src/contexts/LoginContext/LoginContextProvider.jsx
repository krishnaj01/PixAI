import LoginContext from "./LoginContext";
import { useState } from "react";

const LoginContextProvider = (props) => {
    const [showLogin, setShowLogin] = useState(false);

    return (
        <LoginContext.Provider value={{showLogin, setShowLogin}}>
            {props.children}
        </LoginContext.Provider>
    )
}

export default LoginContextProvider;