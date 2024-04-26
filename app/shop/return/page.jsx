'use client'

import axiosInstance from "@components/axiosInstance";
import { UserContext } from "@components/root";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

const ReturnComponent = () => {
    const router = useRouter()
    const [userDetails, setUserDetails] = useContext(UserContext)
    const [sessionId, setSessionId] = useState(useSearchParams().get('session_id'))
    const [errorMessage, setErrorMessage] = useState('')
    useEffect(() => {
        getSessionData()
    }, [])
    const getSessionData = () => {
        if (userDetails.cart.data.length) {
            axiosInstance.get(`/checkout-session-status?session_id=${sessionId}`)
                .then(response => response.data)
                .then(r => {
                    if (r.status == 'complete') {
                        let post_body = []
                        userDetails.cart.data.forEach(d => {
                            if (d.cart_type == "cart_schedule") {
                                post_body.push({
                                    "schedule_id": d.schedule_id,
                                    "student_id": d.student_id,
                                    "purchase_uuid": sessionId,
                                    status: 'successful'
                                })
                            }
                            else if (d.cart_type == "cart_product") {
                                post_body.push({
                                    "product_id": d.product_id,
                                    "student_id": d.student_id,
                                    "purchase_uuid": sessionId,
                                    status: 'successful'
                                })
                            }
                        })
                        axiosInstance.post('/api/v1/purchaseds', { "session_id": sessionId, "purchase_items": post_body }).then(() => {
                            setUserDetails((prevData) => {
                                return {
                                    ...prevData,
                                    cart: {
                                        product_id: [],
                                        schedule_id: [],
                                        data: []
                                    },
                                }
                            })
                            router.push('/profile/orders')
                        }).catch((e) => {
                            if (e.response.data.error == 'Session Id already present') {
                                setErrorMessage('Payment Already Exists')
                             }
                            else {
                                localStorage.setItem("refresh_purchase", {
                                    api: '/api/v1/purchaseds',
                                    body: { "purchase_items": post_body }
                                })
                            }
                        })
                    }
                }).catch(() => {
                    setErrorMessage('Error Occured Fetching Payment Status')
                })
        }
        else {
            router.push('/')
        }
    }

    return <div>
        <h1>Please do not refresh this page</h1>
        {errorMessage}
    </div>
}

export default ReturnComponent;