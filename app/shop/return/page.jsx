'use client'

import axiosInstance from "@components/axiosInstance";
import { UserContext } from "@components/root";
import { useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";

const ReturnComponent = () => {
    const [userDetails, setUserDetails] = useContext(UserContext)
    const [sessionId, setSessionId] = useState(useSearchParams().get('session_id'))
    useEffect(() => {
        getSessionData()
    }, [])
    const getSessionData = () => {
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
                    axiosInstance.post('/api/v1/purchaseds', { "purchase_items": post_body }).then(() => {
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
                    }).catch(() => { })
                }
            }).catch(() => { })
    }

    return <h1>Please do not refresh this page</h1>
}

export default ReturnComponent;