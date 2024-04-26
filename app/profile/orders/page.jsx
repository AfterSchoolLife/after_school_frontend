'use client'
import axiosInstance from "@components/axiosInstance"
import { lilita } from "@components/themeregistry"
import { useEffect, useState } from "react"

const OrdersComponent = () => {
    const [purchasedData,setPurchasedData] = useState([])
    useEffect(() => {
        axiosInstance.get('/api/v1/purchaseds').then((response) => {
            setPurchasedData(response.data)
        })
    }, [])
    return <section className={lilita.variable}>
        <h3>Order History</h3>
        <div className="p-4">
        {purchasedData.map(p => {
            return <div key={p.id} className="p-4 payment-div">
                <div className="flex justify-between">
                    <p className="font-bold">ID: {p.purchase_uuid.slice(p.purchase_uuid.length - 26)}</p>
                    <p><span className="font-bold">Purchased On </span>: <span>{new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span></p>
                </div>
                <div className="pt-2">
                    <p className="text-xl text-color-primary-1 pb-2">Student Name: {p.student.firstname} {p.student.lastname}</p>
                    {p.cart_type == 'cart_schedule' && <p>Purchased Program: {p.schedule.program.title} | {p.schedule.school.name}, {p.schedule.school.address}</p>}
                    {p.cart_type == 'cart_product' && <p>Purchased Product: {p.product.title}</p>}
                </div>
            </div>
        })}
        </div>
    </section>
}

export default OrdersComponent