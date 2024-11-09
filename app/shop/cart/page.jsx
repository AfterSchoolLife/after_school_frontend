'use client'


import axiosInstance from '@components/axiosInstance';
import { UserContext } from '@components/root';
import { lilita } from '@components/themeregistry';
import { Card, CardContent, CardMedia, Divider, IconButton, CardActions, Select, Chip, MenuItem, FormControl, InputLabel, Button, Snackbar } from '@mui/material';
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
    const router = useRouter();
    const [userDetails, setUserDetails] = useContext(UserContext);
    const [productDetails, setProductDetails] = useState({
        'Programs': [],
        'Products': []
    });
    const [disableDelete, setDisableDelete] = useState('');
    const [cartSummary, setCartSummary] = useState({});
    const [studentData, setStudentData] = useState({});
    const [disableCheckout, setCheckout] = useState(false);
    const [snackBarData, setSnackBarData] = useState({ open: false, msg: '' });
    
    const closeSnackbar = () => setSnackBarData({ open: false, msg: '' });

    useEffect(() => {
        fetchCartSummary();
        setProductDetails({
            'Programs': userDetails.cart.data.filter(c => c.cart_type === 'cart_schedule'),
            'Products': userDetails.cart.data.filter(c => c.cart_type === 'cart_product')
        });
        let dataTo = {};
        userDetails.student.forEach(c => {
            dataTo[c.id] = `${c.firstname} ${c.lastname}`;
        });
        setStudentData(dataTo);
    }, []);

    const fetchCartSummary = () => {
        axiosInstance.get('/api/v1/getCartSummary').then(response => {
            setCartSummary(response.data);
        }).catch(() => {});
    };

    const removeItem = id => {
        setDisableDelete(id);
        axiosInstance.delete(`/api/v1/carts/${id}`).then(() => {
            fetchCartSummary();
            setUserDetails(prevData => {
                prevData.cart.data = prevData.cart.data.filter(c => c.id !== id);
                return { ...prevData };
            });
            setDisableDelete('');
        }).catch(() => setDisableDelete(''));
    };

    const checkout = e => {
        e.preventDefault();
        setCheckout(true);
        const post_body = userDetails.cart.data.map(d => ({
            ...(d.cart_type === 'cart_schedule' ? { schedule_id: d.schedule_id } : { product_id: d.product_id }),
            student_id: d.student_id,
            purchase_uuid: 'checkout_check',
            status: 'successful'
        }));

        axiosInstance.post('/api/v1/checkout', { purchase_items: post_body }).then(() => {
            setCheckout(false);
            router.push('/shop/checkout');
        }).catch(error => {
            setCheckout(false);
            const errorMsg = error.response?.data?.errors?.find(err => err.includes('Student combination must be unique') || err.includes('fully booked')) || 'Error occurred';
            setSnackBarData({ open: true, msg: errorMsg });
        });
    };

    return (
        <section style={{ minHeight: 'calc(100vh - 136px)' }}>
            <Snackbar
                open={snackBarData.open}
                autoHideDuration={3000}
                onClose={closeSnackbar}
                message={snackBarData.msg}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            />
            {userDetails.cart.data.length ? (
                <form onSubmit={checkout} className={`flex flex-col md:flex-row gap-8 pt-8 ${lilita.variable}`}>
                    <div className="w-full md:w-3/5">
                        <h2 className="text-center text-2xl md:text-3xl">Shopping Cart</h2>
                        {['Programs', 'Products'].map((category, index) => (
                            productDetails[category].length > 0 && (
                                <div className="p-4" key={index}>
                                    <h5 className="pb-2">{category}</h5>
                                    <Divider />
                                    <div className="p-4 pt-8">
                                        {productDetails[category].map((item, idx) => (
                                            <Card key={idx} className="mb-4 w-full">
                                                <div className="p-4 flex flex-col sm:flex-row gap-4">
                                                    <CardMedia
                                                        sx={{
                                                            width: '100%',
                                                            height: 120,
                                                            maxWidth: 220,
                                                            borderRadius: 26,
                                                            backgroundColor: "var(--secondary-background)",
                                                            backgroundPosition: 'center',
                                                            backgroundSize: 'contain'
                                                        }}
                                                        image={item?.schedule?.program?.image_url || item?.product?.image_url}
                                                    />
                                                    <CardContent sx={{ width: 'full' }} className="flex-1">
                                                        <div className="flex justify-between items-center">
                                                            <p className="text-lg md:text-2xl text-color-primary-3">${item.schedule?.price || item.product?.price}</p>
                                                            <IconButton
                                                                disabled={disableDelete === item.id}
                                                                onClick={() => removeItem(item.id)}
                                                                color='primary5'>
                                                                <RemoveShoppingCartIcon />
                                                            </IconButton>
                                                        </div>
                                                        <div>
                                                            <p className="text-lg font-bold">{item.schedule?.program?.title || item.product?.title}</p>
                                                            {item.schedule?.program && <Chip size='small' className="program-chip" label={item.schedule.age_group} variant="outlined" />}
                                                        </div>
                                                        <p>{item.schedule?.school?.name || item.product?.description}</p>
                                                        <div className="text-color-primary-1">
                                                            <CalendarTodayIcon fontSize="small" className="pr-1" />{dayjs(item.schedule?.start_date).format('MMM D, YYYY')} - {dayjs(item.schedule?.end_date).format('MMM D, YYYY')}
                                                        </div>
                                                    </CardContent>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                    <div className="w-full md:w-2/5">
                        <div className="p-4">
                            <h2 className="text-center text-2xl md:text-3xl">Summary</h2>
                            <Divider />
                            <div className="p-8">
                                <div className="flex justify-between text-lg">
                                    <div>Subtotal ({productDetails['Products'].length} items)</div>
                                    <div className="text-color-primary-1">${cartSummary.product_sum}</div>
                                </div>
                                <div className="flex justify-between text-lg">
                                    <div>Subtotal ({productDetails['Programs'].length} items)</div>
                                    <div className="text-color-primary-1">${cartSummary.schedule_sum}</div>
                                </div>
                                <Divider />
                                <div className="flex justify-between text-xl font-bold pt-8">
                                    <div>Total</div>
                                    <div className="text-color-primary-1">${cartSummary.total}</div>
                                </div>
                            </div>
                            <div className="px-6">
                                <Button
                                    disabled={disableCheckout}
                                    sx={{ borderRadius: '26px' }}
                                    type="submit"
                                    color="primary3"
                                    className="w-full"
                                    variant="contained">
                                    Go to Checkout
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            ) : (
                <p className="text-center text-3xl pt-16">Your Shopping Cart is Empty</p>
            )}
        </section>
    );
};

export default ShoppingCart;
