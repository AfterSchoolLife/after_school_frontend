'use client'
import { useState } from "react";
import { Card, CardContent, Button, TextField, Typography, Snackbar } from "@mui/material";
import { useSearchParams, useRouter } from "next/navigation";
import axiosInstance from "@components/axiosInstance";
import { lilita } from '@components/themeregistry';

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [snackBarData, setSnackBarData] = useState({ open: false, msg: '' });

    const searchParams = useSearchParams();
    const token = searchParams.get('reset_password_token');
    const router = useRouter();

    const handleResetPassword = (e) => {
        e.preventDefault();
        axiosInstance.post('/api/v1/auth/password/reset', {
            user: {
                reset_password_token: token,
                password: password,
                password_confirmation: passwordConfirmation
            }
        }).then(response => {
            setMessage("Your password has been reset successfully.");
            setSnackBarData({ open: true, msg: "Password reset successful. You can now log in." });
            setTimeout(() => router.push('/auth/login'), 3000); // Redirect after 3 seconds
        }).catch(err => {
            setError(err.response?.data?.error || "Failed to reset the password");
            setSnackBarData({ open: true, msg: "Failed to reset password." });
        });
    };

    const closeSnackbar = () => {
        setSnackBarData({ open: false, msg: '' });
    }

    return (
        <section style={{ minHeight: 'calc(100vh - 136px)' }} className={`${lilita.variable}`}>
            <Snackbar
                open={snackBarData.open}
                autoHideDuration={3000}
                onClose={closeSnackbar}
                message={snackBarData.msg}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            />
            <div>
                <Card className="card auth-reset-password-card" style={{ maxWidth: '400px', margin: 'auto' }}>
                    <CardContent>
                        <Typography variant="h5" component="h2">Reset Password</Typography>
                        {message && <Typography color="success">{message}</Typography>}
                        {error && <Typography color="error">{error}</Typography>}
                        <form onSubmit={handleResetPassword} className="auth-form flex flex-col gap-2 p-2 pt-4">
                            <TextField
                                label="New Password"
                                type="password"
                                fullWidth
                                margin="normal"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <TextField
                                label="Confirm Password"
                                type="password"
                                fullWidth
                                margin="normal"
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                required
                            />
                            <Button type="submit" variant="contained" color="primary" fullWidth>
                                Reset Password
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
};

export default ResetPassword;
