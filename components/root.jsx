"use client";

import { createContext, useState } from "react";
export const UserContext = createContext();
const RootComponent = ({ children }) => {
    const [userDetails, setUserDetails] = useState({
        user_id: 'anonymous',
        isLoggedin: false,
        role: 'anonymous_use',
        cart: {
            product_id: [],
            schedule_id: [],
            data:[]
        },
        student:[]
    })
    return <UserContext.Provider value={[userDetails, setUserDetails]}>
        {children}
    </UserContext.Provider>
}

export default RootComponent