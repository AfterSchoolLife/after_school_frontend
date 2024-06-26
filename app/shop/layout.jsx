'use client'

import { UserContext } from "@components/root";
import { useRouter } from "next/navigation";
import { useContext, useLayoutEffect } from "react";

const CartLayout = ({children}) => {
    const [userDetails, setUserDetails] = useContext(UserContext)
    const router = useRouter()
    useLayoutEffect(() => {
        if (!userDetails.isLoggedin) router.push('/auth/login')
    },[])
    return userDetails.isLoggedin && <div>{children}</div>
}

export default CartLayout;