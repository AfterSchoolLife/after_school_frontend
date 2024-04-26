'use client'

import axiosInstance from '@components/axiosInstance';
import { UserContext } from '@components/root';
import { lilita } from '@components/themeregistry';
import { Card, CardContent, CardMedia, Divider, IconButton, CardActions, Select, Chip, MenuItem, FormControl, InputLabel, Button } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation';
dayjs.extend(utc);
dayjs.extend(timezone);
const ShoppingCart = () => {
    const router = useRouter()
    const [userDetails, setUserDetails] = useContext(UserContext)
    const [productDetails, setProductDetails] = useState({
        'Programs': [],
        'Products': []
    })
    const [disableDelete, setDisableDelete] = useState('')
    const [cartSummary, setCartSummary] = useState({})
    const [studentData, setStudentData] = useState({})
    const [selectCountry, setCountry] = useState('')
    const [disableCheckout, setCheckout] = useState(false)

    useEffect(() => {
        fetchCartSummary()
        setProductDetails({
            'Programs': userDetails.cart.data.filter(c => c.cart_type == 'cart_schedule'),
            'Products': userDetails.cart.data.filter(c => c.cart_type == 'cart_product')
        })
        let dataTo = {}
        userDetails.student.forEach(c => {
            dataTo[c.id] = `${c.firstname} ${c.lastname}`
        })
        setStudentData(dataTo)
    }, [])
    const fetchCartSummary = () => {
        axiosInstance.get('/api/v1/getCartSummary').then((response) => {
            setCartSummary(response.data)
        }).catch(() => {
        })
    }
    const removeItem = (id) => {
        setDisableDelete(id)
        axiosInstance.delete(`/api/v1/carts/${id}`).then(response => {
            fetchCartSummary()
            setUserDetails((prevData) => {
                prevData.cart.data = prevData.cart.data.filter(c => c.id != id)
                return {
                    ...prevData
                }
            })
            setProductDetails({
                'Programs': userDetails.cart.data.filter(c => c.id != id && c.cart_type == 'cart_schedule'),
                'Products': userDetails.cart.data.filter(c => c.id != id && c.cart_type == 'cart_product')
            })
            setDisableDelete('')
        }).catch(() => {
            setDisableDelete('')
        })
    }
    const checkout = (e) => {
        e.preventDefault()
        let post_body = []
        userDetails.cart.data.forEach(d => {
            if (d.cart_type == "cart_schedule") {
                post_body.push({
                    "schedule_id": d.schedule_id,
                    "student_id": d.student_id,
                    "purchase_uuid": 'checkout_check',
                    status: 'successful'
                })
            }
            else if (d.cart_type == "cart_product") {
                post_body.push({
                    "product_id": d.product_id,
                    "student_id": d.student_id,
                    "purchase_uuid": 'checkout_check',
                    status: 'successful'
                })
            }
        })
        axiosInstance.post('/api/v1/checkout',{ "purchase_items": post_body }).then(response => {
            router.push(`/shop/checkout?country=${selectCountry}`)
        }).catch((error) => {
            if (error.response.data.errors && error.response.data.errors.includes('Student combination must be unique')){
                console.log('The student is already registered to the program')
            }
            else if (error.response.data.errors && error.response.data.errors.includes('fully booked')) {
                console.log('The program is fully booked')
            }
        })
    }
    return <section>
        {userDetails.cart.data.length ? <form onSubmit={checkout} className={`flex gap-8 pt-8 ${lilita.variable}`}>
            <div className="w-3/5">
                <h2 className="text-center">Shopping Cart</h2>
                {
                    productDetails['Programs'].length ? <div className='p-4'>
                        <h5 className='pb-2'>Programs</h5>
                        <Divider />
                        <div className='p-4 pt-8'>
                            {productDetails['Programs'].map((pr, index) => {
                                return <Card key={index} className='mb-4 card'>
                                    <div className='p-4'>
                                        <div className='flex gap-4'>
                                            {pr.schedule.program.image_url ? <CardMedia
                                                sx={{ width: 220, height: 123.75, borderRadius: 26, backgroundColor: "var(--secondary-background)", backgroundPosition: 'center', backgroundSize: 'contain' }}
                                                image={pr.schedule.program.image_url}
                                                title="green iguana"
                                            /> : <div style={{ width: 220, height: 123.75, borderRadius: 26, backgroundColor: "var(--secondary-background)" }}></div>}
                                            <CardContent sx={{ width: 'calc(100% - 220px - 1rem)' }} className='program-card'>
                                                <div className='flex justify-between w-full items-center'>
                                                    <p className='text-2xl text-color-primary-3'>${pr.schedule.price}</p>
                                                    <IconButton disabled={disableDelete == pr.id} onClick={() => { removeItem(pr.id) }} color='primary5'>
                                                        <RemoveShoppingCartIcon></RemoveShoppingCartIcon>
                                                    </IconButton>
                                                </div>
                                                <div>
                                                    <div className='flex items-center pb-2'>
                                                        <p className='text-xl font-bold'>{pr.schedule.program.title}</p>
                                                        <Chip size='small' className='ml-2 program-chip' label={pr.schedule.age_group} variant="outlined" />
                                                    </div>
                                                    <p>{pr.schedule.school.name}</p>
                                                    <p>{pr.schedule.school.address}</p>
                                                </div>
                                                <div className='flex items-center justify-between w-full pt-4'>
                                                    <p className='text-color-primary-1'><CalendarTodayIcon fontSize='small' className='pr-1'></CalendarTodayIcon>{new Date(pr.schedule.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - {new Date(pr.schedule.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} , {pr.schedule.days}</p>
                                                    <p className='text-color-primary-1'><AccessTimeIcon fontSize='small' className='pr-1'></AccessTimeIcon>{dayjs.tz(pr.schedule.start_time, 'UTC').format('h:mm A')} - {dayjs.tz(pr.schedule.end_time, 'UTC').format('h:mm A')}</p>
                                                </div>
                                                <div className='pt-2'>
                                                    <p><span>Student Name: &nbsp;</span>
                                                        <span className='font-bold'> {studentData[pr.student_id]}</span></p>
                                                </div>
                                            </CardContent>
                                        </div>
                                    </div>
                                </Card>
                            })}
                        </div>
                    </div> : <></>
                }
                {
                    productDetails['Products'].length ? <div className='p-4'>
                        <h5 className='pb-2'>Products</h5>
                        <Divider />
                        <div className='p-4 pt-8'>
                            {productDetails['Products'].map(prod => {
                                return <Card key={prod.id} className='mb-4 card'>
                                    <div className='p-4'>
                                        <div className='flex gap-4'>
                                            {prod.product.image_url ? <CardMedia
                                                sx={{ width: 220, height: 123.75, borderRadius: '26px', backgroundColor: "var(--secondary-background)", backgroundPosition: 'center', backgroundSize: 'contain' }}
                                                image={prod.product.image_url}
                                                title="green iguana"
                                            /> : <div style={{ width: 200, height: 123.75, backgroundColor: "var(--secondary-background)" }}></div>}
                                            <CardContent sx={{ width: 'calc(100% - 220px - 1rem)' }} className='program-card'>
                                                <div className='flex justify-between w-full items-center'>
                                                    <p className='text-2xl text-color-primary-3'>${prod.product.price}</p>
                                                    <IconButton disabled={disableDelete == prod.id} onClick={() => { removeItem(prod.id) }} color='primary5'>
                                                        <RemoveShoppingCartIcon></RemoveShoppingCartIcon>
                                                    </IconButton>
                                                </div>
                                                <div>
                                                    <p className='text-xl font-bold'>{prod.product.title}</p>
                                                    <p className='description'>{prod.product.description}</p>
                                                </div>
                                                <div className='pt-2'>
                                                    <p><span>Student Name: &nbsp;</span>
                                                        <span className='font-bold'> {studentData[prod.student_id]}</span></p>
                                                </div>
                                            </CardContent>
                                        </div>
                                    </div>
                                </Card>
                            })}
                        </div>
                    </div> : <></>
                }
                <div>
                </div>
            </div>
            <div className="w-2/5">
                <div className='sticky top-0'>
                    <h2 className="text-center">Summary</h2>
                    <div className='p-4'>
                        <h5 className='pb-2 invisible'>Products</h5>
                        <Divider />
                        <div className='p-8'>
                            <div className='text-xl font-extrabold pb-1'>Product</div>
                            <div className='flex w-full justify-between pb-8 text-lg'><div>Subtotal ({`${productDetails['Products'].length}`} item)</div><div className='text-color-primary-1'>${cartSummary.product_sum}</div></div>
                            <div className='text-xl font-extrabold pb-1'>Program</div>
                            <div className='flex w-full justify-between pb-8 text-lg'><div>Subtotal ({`${productDetails['Programs'].length}`} item)</div><div className='text-color-primary-1'>${cartSummary.schedule_sum}</div></div>
                            <div className='flex w-full justify-between pb-8 text-lg'><div>TAX</div><div className='text-color-primary-1'>$0.00</div></div>
                            <Divider />
                            <div className='font-extrabold flex w-full justify-between pt-8 text-xl'><div>Total</div><div className='text-color-primary-1'>${cartSummary.total}</div></div>
                        </div>
                    </div>
                    <div className='px-6'>
                        <Button disabled={disableCheckout} sx={{ borderRadius: '26px' }} type='submit' color='primary3' className='w-full' variant='contained'><p className='text-xl'>Go to Checkout</p></Button>
                    </div>
                </div>
            </div>
        </form> : <p className='text-center text-3xl pt-16'>Your Shopping Cart is Empty</p>}
    </section>
}


export default ShoppingCart