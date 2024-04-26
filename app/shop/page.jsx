"use client"
import { lilita } from '@components/themeregistry';
import { Button, LinearProgress, FormControl, TextField, IconButton, Tooltip, InputLabel, Select, MenuItem, Snackbar } from '@mui/material';
import Link from "next/link";
import SearchIcon from '@mui/icons-material/Search';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserContext } from '@components/root';
import axiosInstance from '@components/axiosInstance';


const Shop = () => {
    const [userDetails, setUserDetails] = useContext(UserContext)
    const [productDetails, setProductDetails] = useState([])
    const [filteredDetails, setFilteredDetails] = useState([])
    const [fetchStatus, setFetchStatus] = useState('loading')
    const [searchText, setSearchText] = useState('')
    const [disableProduct, setDisableProduct] = useState('')
    const [studentSelectData, setStudentSelectData] = useState({})
    const [snackBarData, setSnackBarData] = useState({ open: false, msg: '' })
    const closeSnackbar = () => {
        setSnackBarData({ open: false, msg: '' })
    }
    useEffect(() => {
        fetchProductDetails()
    }, [])
    const fetchProductDetails = () => {
        axiosInstance.get('/api/v1/products?isActive=true').then((response) => {
            const set_data = {}
            response.data.forEach(v => {
                set_data[v.id] = ''
            })
            setStudentSelectData(set_data)
            setProductDetails(response.data)
            setFilteredDetails(response.data)
            setFetchStatus('success')
        })
    }
    const formChange = (e) => {
        setSearchText(() => {
            return e.target.value
        })
    }
    const searchProducts = (e) => {
        setFilteredDetails(productDetails.filter(prod => prod.title.toLowerCase().includes(searchText.toLowerCase()) || prod.description.toLowerCase().includes(searchText.toLowerCase())))
    }
    const addToCart = (e, id) => {
        e.preventDefault()
        setDisableProduct(id)
        axiosInstance.post('/api/v1/carts', {
            "product_id": id,
            "student_id": studentSelectData[id]
        }).then((response) => {
            setDisableProduct('')
            setUserDetails((prevData) => {
                prevData.cart.data.push(response.data)
                return {
                    ...prevData,
                }
            })
            setSnackBarData({ open: true, msg: "Added to Cart" })
        }).catch((e) => {
            setDisableProduct('')
            if (e.response.data.error && e.response.data.error == "Student combination must be unique") {
                setSnackBarData({ open: true, msg: 'Product Already Present in Cart' })
            }
            else {
                setSnackBarData({ open: true, msg: 'Error adding to Cart' })
            }
        })
    }
    const selectChange = (e, id) => {
        setStudentSelectData((prevData) => {
            prevData[id] = e.target.value
            return {
                ...prevData
            }
        })

    }
    return userDetails.isLoggedin && <section className={`flex gap-8 flex-col pb-8 ${lilita.variable}`}>
        <Snackbar
            open={snackBarData.open}
            autoHideDuration={3000}
            onClose={closeSnackbar}
            message={snackBarData.msg}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />
        <div>
            <div className='banner relative'>
                <div className='banner-text z-10'>
                    <h2 className='pb-2'>Embark on a Learning Adventure!</h2>
                    <p className='text-xl'>Unlock the magic of knowledge with our interactive educational resources - where every play session opens a door to new discoveries</p>
                </div>
                <img className='opacity-65' alt='shop page banner' src="/shop-banner.jpg"></img>
            </div>
            <div className='info-div paper-background text-color-primary-light mb-6'>
                <FormControl
                    sx={{
                        "& .MuiInputBase-root": {
                            padding: "0px"
                        }
                    }}
                    className="w-5/12">
                    <TextField
                        className='p-0 shop-input'
                        id="schools"
                        value={searchText}
                        onChange={formChange}
                        label={<p className='text-xl'>Search for Products</p>}
                        name="schools"
                        fullWidth
                        InputProps={{
                            endAdornment: (
                                <IconButton onClick={searchProducts} sx={{ borderRadius: "0px !important", borderLeft: "1px solid", background: 'var(--primary-background)' }} color='primary'>
                                    <SearchIcon fontSize="large" />
                                </IconButton>
                            ),
                        }}
                    />
                </FormControl>
            </div>
            {
                fetchStatus == 'loading' && <div className="linearprogress"><LinearProgress variant="indeterminate" /></div>
            }
            <div style={{ width: '90vw', margin: 'auto' }}>{
                fetchStatus == 'success' && <div className='p-8 flex flex-wrap gap-6'>
                    {
                        filteredDetails.map((product) => {
                            return <Card key={product.id} className='card shopping-card' sx={{ width: 300 }}>
                                <form onSubmit={(e) => { addToCart(e, product.id) }}>
                                    <div>
                                        {product.image_url ? <CardMedia
                                            sx={{ height: 180, backgroundColor: "var(--secondary-background)", backgroundPosition: 'center', backgroundSize: 'contain' }}
                                            image={product.image_url}
                                            title="green iguana"
                                        /> : <div style={{ height: 180, backgroundColor: "var(--secondary-background)" }}></div>}
                                        <CardContent className='card-content'>
                                            <h5>
                                                {product.title}
                                            </h5>
                                            <Tooltip title={<p>{product.description}</p>}>
                                                <p className='description'>
                                                    {product.description}
                                                </p></Tooltip>
                                        </CardContent>
                                        <FormControl sx={{ marginLeft: '8px', minWidth: 180, marginTop: '8px' }} required>
                                            <InputLabel id={String(product.id) + 'select'}>Select Student</InputLabel>
                                            <Select
                                                id={String(product.id)}
                                                value={studentSelectData[product.id]}
                                                labelId={String(product.id) + 'select'}
                                                label="Select Student"
                                                onChange={(e) => { selectChange(e, product.id) }}
                                            >
                                                <MenuItem>
                                                    <Link className='text-color-primary-1' href="/profile/">
                                                        Add Student...
                                                    </Link>
                                                </MenuItem>
                                                {
                                                    userDetails.student.map((student) => {
                                                        return <MenuItem key={student.id} value={student.id}>{student.firstname} {student.lastname}</MenuItem>
                                                    })
                                                }
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <CardActions>
                                        <div className='text-end w-full pb-2 p-2 flex justify-between items-center'>
                                            <p className='text-3xl text-color-primary-3'>${product.price}</p>
                                            <Button type='submit' disabled={disableProduct == product.id} color='primary' variant='contained'>Add to Cart</Button>
                                        </div>
                                    </CardActions>
                                </form>
                            </Card>
                        })
                    }
                </div>
            }</div>
        </div>
    </section>
}
export default Shop