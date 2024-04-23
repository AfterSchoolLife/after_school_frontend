"use client"
import { redirect, usePathname } from "next/navigation"
import { createContext, useContext, useEffect, useLayoutEffect, useState } from "react"
import axiosInstance from "./axiosInstance"
import { useRouter } from "next/navigation"
import { UserContext } from "./root"
import Navbar from "./Navbar"

const AuthComponent = ({ children }) => {
    const router = useRouter()
    const [userDetails, setUserDetails] = useContext(UserContext)
    const pathName = usePathname()
    const [userInitialized, setUserInitialized] = useState(false)
    useEffect(() => {
        if (localStorage.getItem('after_school_t')) {
            axiosInstance.get('/api/v1/auth/current_user').then((user_response) => {
                setUserDetails((prevData) => {
                    return {
                        ...prevData,
                        ...user_response.data.user,
                        isLoggedin: true,
                        cart: {
                            data: user_response.data.cart,
                            product_id: user_response.data.cart.filter(d => d.cart_type == 'cart_product').map(r => r.product_id),
                            schedule_id: user_response.data.cart.filter(d => d.cart_type == 'cart_schedule').map(r => r.schedule_id),
                        },
                        student: user_response.data.student
                    }
                })
                setUserInitialized(true)
            }).catch(() => {
                localStorage.removeItem('after_school_t')
                setUserInitialized(true)
                setUserDetails((prevData) => {
                    return {
                        ...prevData,
                    }
                })
            })
        }
        else {
            setUserInitialized(true)
        }
    }, [])




    return userInitialized ? <><Navbar />
        <main className='root'>
            <div className="app-container">
                {children}
            </div>
        </main>
    </> : <></>
}

export default AuthComponent