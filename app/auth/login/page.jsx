'use client'
import { Button, Card, CardContent, CircularProgress, Snackbar, TextField } from "@mui/material"
import Link from "next/link"
import { lilita } from '@components/themeregistry';
import axiosInstance from "@components/axiosInstance";
import { useContext, useLayoutEffect, useState } from "react";
import { UserContext } from "@components/root";
import { useRouter } from "next/navigation";

const Login = () => {
    const router = useRouter()
    const [logginIn, setLogginIn] = useState(false)
    const [snackBarData, setSnackBarData] = useState({ open: false, msg: '' })
    const authenticate_user = (e) => {
        e.preventDefault()
        setLogginIn(true)
        axiosInstance.post('/api/v1/auth/login', {
            user: {
                email: e.target['email'].value,
                password: e.target['password'].value
            }
        }).then((response) => {
            setLogginIn(false)
            localStorage.setItem('after_school_t', response.headers.authorization)
            router.push('/')
            location.reload()
        }).catch((e) => {
            if (e.response.status == 401) {
                setSnackBarData({ open: true, msg: e.response.data })
            }
            setLogginIn(false)
        })
    }
    const closeSnackbar = () => {
        setSnackBarData({ open: false, msg: '' })
    }
    return <section style={{minHeight: 'calc(100vh - 136px)'}} className={`${lilita.variable}`}>

        <Snackbar
            open={snackBarData.open}
            autoHideDuration={3000}
            onClose={closeSnackbar}
            message={snackBarData.msg}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} 
        />
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
                        {/* <Link href="/register"><p className="pt-4 text-base underline">Forgot/Reset Password?</p></Link> */}
                        <div className="flex justify-between pt-2 items-center">
                            <Link href="/auth/register">
                                <Button disabled={logginIn} color="primary">
                                    Create Account
                                </Button>
                            </Link>
                            <div className="flex gap-2 items-center">
                                {logginIn && <CircularProgress thickness={5} size={32} />}
                                <Button disabled={logginIn} variant="contained" color="primary" type="submit">
                                    Login
                                </Button>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    </section>
}
export default Login