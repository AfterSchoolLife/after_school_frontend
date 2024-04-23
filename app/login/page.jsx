'use client'
import { Button, Card, CardContent, TextField } from "@mui/material"
import Link from "next/link"
import { lilita } from '@components/themeregistry';
import axiosInstance from "@components/axiosInstance";
import { useContext, useLayoutEffect } from "react";
import { UserContext } from "@components/root";
import { useRouter } from "next/navigation";

const Login = () => {
    const router = useRouter()
    const [userDetails, setUserDetails] = useContext(UserContext)
    useLayoutEffect(() => {
        console.log(userDetails)
        if (userDetails.isLoggedin) router.push('/')
    },[])
    const authenticate_user = (e) => {
        e.preventDefault()
        axiosInstance.post('/api/v1/auth/login', {
            user: {
                email: e.target['email'].value,
                password: e.target['password'].value
            }
        }).then((response) => {
            localStorage.setItem('after_school_t',response.headers.authorization)
            router.push('/')
            location.reload()
        }).catch(() => { })
    }
    return (!userDetails.isLoggedin && <section className={`${lilita.variable}`}>
        <div>
            <Card className="card auth-card">
                <CardContent>
                    <h4 className="text-center">Login as Parent</h4>
                    <form onSubmit={authenticate_user} className="auth-form flex flex-col gap-2 p-2 pt-4">
                        <label htmlFor="email">
                            <p>Email Address</p>
                        </label>
                        <TextField
                            id="email"
                            fullWidth
                            required
                        />
                        <label htmlFor="password">
                            <p>Password</p>
                        </label>
                        <TextField
                            id="password"
                            type="password"
                            fullWidth
                            required
                        />
                        <Link href="/register"><p className="pt-4 text-base underline">Forgot/Reset Password?</p></Link>
                        <div className="flex justify-between pt-2">
                            <Link href="/register">
                                <Button color="primary">
                                    Create Account
                                </Button>
                            </Link>
                            <Button variant="contained" color="primary" type="submit">
                                Login
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    </section>)
}
export default Login