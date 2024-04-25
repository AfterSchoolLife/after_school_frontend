'use client'
import { useCallback } from "react"
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';

import { loadStripe } from '@stripe/stripe-js';
import axiosInstance from "@components/axiosInstance";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const CheckoutComponent = () => {
    const fetchClientSecret = useCallback(() => {
        return axiosInstance.post('/checkout')
            .then((response) => response.data.clientSecret);
    }, []);
    const options = { fetchClientSecret };
    return <div id="checkout">
        <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
            <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
    </div>
}

export default CheckoutComponent

