'use client'
import { useCallback, useEffect, useState } from "react"
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';

import { loadStripe } from '@stripe/stripe-js';
import axiosInstance from "@components/axiosInstance";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const CheckoutComponent = () => {
    const [stripeData, setStripeData] = useState(null)
    const fetchClientSecret = useCallback(() => {
        // Create a Checkout Session
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

