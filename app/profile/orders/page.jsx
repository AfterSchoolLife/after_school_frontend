'use client'
import axiosInstance from "@components/axiosInstance"
import { lilita } from "@components/themeregistry"
import { useEffect } from "react"

const OrdersComponent = () => {
    useEffect(() => {
        axiosInstance.get('/api/v1/purchaseds').then((response) => {
            console.log(response.data)
        })
    }, [])
    return <section className={lilita.variable}>
        <h3>Order History</h3>
        
    </section>
}

export default OrdersComponent