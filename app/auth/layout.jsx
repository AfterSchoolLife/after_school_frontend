'use client'

import { UserContext } from "@components/root";
import { useRouter } from "next/navigation";
import { useContext, useLayoutEffect } from "react";

const AuthLayout = ({children}) => {
    const [userDetails, setUserDetails] = useContext(UserContext)
    const router = useRouter()
    useLayoutEffect(() => {
        if (userDetails.isLoggedin) router.push('/')
    },[])
    return !userDetails.isLoggedin && <div>{children}</div>
}

export default AuthLayout;