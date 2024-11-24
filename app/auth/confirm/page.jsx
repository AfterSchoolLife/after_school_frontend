'use client'
import { useState } from "react";
import { Card, CardContent, Button, Typography, Snackbar } from "@mui/material";
import { useSearchParams, useRouter } from "next/navigation";
import axiosInstance from "@components/axiosInstance";
import { lilita } from '@components/themeregistry';

const ConfirmAccount = () => {
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [snackBarData, setSnackBarData] = useState({ open: false, msg: '' });

    const searchParams = useSearchParams();
    const token = searchParams.get('confirmation_token');
    const router = useRouter();

    const handleConfirmAccount = () => {
        axiosInstance.post('/api/v1/auth/confirmation/confirm', {
            confirmation_token: token
        }).then(response => {
            setMessage("Your account has been confirmed successfully.");
            setSnackBarData({ open: true, msg: "Account confirmation successful. Redirecting to login..." });
            setTimeout(() => router.push('/auth/login'), 3000); // Redirect after 3 seconds
        }).catch(err => {
            setError(err.response?.data?.error || "Failed to confirm the account.");
            setSnackBarData({ open: true, msg: "Failed to confirm account." });
        });
    };

    // Trigger account confirmation on page load
    useState(() => {
        handleConfirmAccount();
    }, []);

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
                <Card className="card auth-confirm-account-card" style={{ maxWidth: '400px', margin: 'auto' }}>
                    <CardContent>
                        <Typography variant="h5" component="h2">Confirm Account</Typography>
                        {message && <Typography color="success">{message}</Typography>}
                        {error && <Typography color="error">{error}</Typography>}
                        <Button onClick={handleConfirmAccount} variant="contained" color="primary" fullWidth>
                            Confirm Account
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
};

export default ConfirmAccount;
