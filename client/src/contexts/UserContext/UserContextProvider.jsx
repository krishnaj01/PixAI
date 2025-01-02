import UserContext from "./UserContext.js";
import { useState } from "react";

const UserContextProvider = (props) => {
    const [user, setUser] = useState(null);

    return (
        <UserContext.Provider value={{user, setUser}}>
            {props.children}
        </UserContext.Provider>
    )
}

export default UserContextProvider;