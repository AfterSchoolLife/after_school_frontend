'use client'
import { Button, Card, CardContent, CircularProgress, Snackbar, TextField } from "@mui/material"
import Link from "next/link"
import { lilita } from '@components/themeregistry';
import axiosInstance from "@components/axiosInstance";
import { useContext, useLayoutEffect, useState } from "react";
import { UserContext } from "@components/root";
import { useRouter } from "next/navigation";

const CreateAdminComponent = () => {
    const router = useRouter()
    const [creating, setcreating] = useState(false)
    const [snackBarData, setSnackBarData] = useState({ open: false, msg: '' })
    const create_user = (e) => {
        e.preventDefault()
        setcreating(true)
        
        axiosInstance.post('/api/v1/auth/createAdmin',{
            user: {
                email: e.target['email'].value,
                password: e.target['password'].value
            }
        }).then((response) => {
            setcreating(false)
            setSnackBarData({ open: true, msg: 'Admin account created successfully'})
        }).catch((e) => {
            setcreating(false)
            setSnackBarData({ open: true, msg: 'Error Creating Admin account'})
        })
    }
    const closeSnackbar = () => {
        setSnackBarData({ open: false, msg: '' })
    }
    return <section className={lilita.variable}>
        <Snackbar
            open={snackBarData.open}
            autoHideDuration={3000}
            onClose={closeSnackbar}
            message={snackBarData.msg}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />
        <h2 className="pb-8">Create Admin</h2>
        <Card className="card auth-card">
            <CardContent>
                <form onSubmit={create_user} className="auth-form flex flex-col gap-2 p-2 pt-4">
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
                        type="text"
                        fullWidth
                        required
                    />
                    {/* <Link href="/register"><p className="pt-4 text-base underline">Forgot/Reset Password?</p></Link> */}
                    <div className="flex justify-end pt-2 items-center gap-2">
                        {creating && <CircularProgress thickness={5} size={32} />}
                        <Button disabled={creating} variant="contained" color="primary" type="submit">
                            Create Account
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    </section>
}

export default CreateAdminComponent;