import { useState } from "react";

import UserContext from "./UserContext.js";

const UserContextProvider = (props) => {
    const [tempUserId, setTempUserId] = useState('');
    const [user, setUser] = useState(null);

    return (
        <UserContext.Provider value={{ tempUserId, setTempUserId, user, setUser }}>
            {props.children}
        </UserContext.Provider>
    )
}

export default UserContextProvider;