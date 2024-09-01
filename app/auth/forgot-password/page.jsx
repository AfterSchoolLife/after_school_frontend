'use client'
import { useState } from "react";
import { Card, CardContent, Button, TextField, Typography } from "@mui/material";
import axiosInstance from "@components/axiosInstance";
import { lilita } from '@components/themeregistry';

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleForgotPassword = (e) => {
        e.preventDefault();
        axiosInstance.post('/api/v1/auth/password/forgot', { email })
            .then(response => {
                setMessage("Password reset instructions have been sent to your email.");
                setEmail("");
            })
            .catch(err => {
                setError(err.response?.data?.message || "Failed to send password reset instructions");
            });
    };

    return (
        <section style={{minHeight: 'calc(100vh - 136px)'}} className={`${lilita.variable}`}>
            <div className="flex justify-center items-center">
                <Card className="card auth-card" style={{ maxWidth: 400, width: '100%' }}>
                    <CardContent>
                        <Typography variant="h5" component="h2" className="text-center">Forgot Password</Typography>
                        {message && <Typography color="success">{message}</Typography>}
                        {error && <Typography color="error">{error}</Typography>}
                        <form onSubmit={handleForgotPassword}>
                            <TextField
                                label="Email"
                                type="email"
                                fullWidth
                                margin="normal"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <Button type="submit" variant="contained" color="primary" fullWidth>
                                Send Reset Instructions
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
};

export default ForgotPassword;
