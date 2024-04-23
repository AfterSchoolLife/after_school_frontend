'use client'
import { lilita } from "@components/themeregistry"
import { Button, Paper, Table, FormControl, TextField, TableBody, TableCell, TableContainer, TableHead, TableRow, LinearProgress, Slide, Dialog, DialogContent, Stack, DialogTitle, IconButton, CircularProgress, FormControlLabel, Switch } from "@mui/material"
import axios from 'axios'
import { forwardRef, useEffect, useState } from "react";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
const formData_inital = {
    title: '',
    description: '',
    image_url: '',
    price: ''
}
const ProductAdmin = () => {
    const [productDetails, setProductDetails] = useState([])
    const [fetchStatus, setFetchStatus] = useState('loading')
    const [dialogDetails, setDialogDetails] = useState({
        open: false,
        loader: false,
        type: 'post',
    })
    const [formData, setFormData] = useState(formData_inital)
    const [isActive, setIsActive] = useState(true)
    useEffect(() => {
        fetchProductDetails(isActive);
    }, [])
    const fetchProductDetails = (is_active) => {
        setIsActive(is_active)
        setFetchStatus('loading')
        setProductDetails([])
        axios.get(`http://127.0.0.1:4000/api/v1/products?isActive=${is_active}`).then((response) => {
            setProductDetails(response.data)
            setFetchStatus('success')
        }).catch(() => {
            setFetchStatus('error')
        })
    }
    const manageProductDetails = (e) => {
        e.preventDefault()
        setDialogDetails({
            ...dialogDetails,
            loader: true
        })
        const url = dialogDetails.type == 'post' ? 'http://127.0.0.1:4000/api/v1/products' : `http://127.0.0.1:4000/api/v1/products/${formData.id}`
        let data = dialogDetails.type == 'delete' ? undefined : { title: formData.title, description: formData.description, price: formData.price, image_url: formData.image_url || ''  }
        console.log(data)
        if (dialogDetails.type == 'disable') {
            data.is_active = false
        }
        else if (dialogDetails.type == 'enable') {
            data.is_active = true
        }
        axios({
            method: (dialogDetails.type == 'disable') || (dialogDetails.type == 'enable') ? 'put' : dialogDetails.type,
            url,
            data
        }).then((res) => {
            setDialogDetails({
                ...dialogDetails,
                loader: false,
                open: false
            })
            fetchProductDetails(isActive)
            clearForm()
        }).catch(() => {
            setDialogDetails({
                ...dialogDetails,
                loader: false,
                open: false
            })
            clearForm()
        })
    }
    const clearForm = () => {
        setFormData({ title: '', description: '', image_url: '', price: '' })
    }
    const formChange = (e) => {
        setFormData((prevFormData) => {
            prevFormData[e.target.id] = e.target.value
            return {
                ...prevFormData,
            }
        })
    }
    const openDialog = (type, data, status = false) => {
        setDialogDetails({
            ...dialogDetails,
            open: true,
            type
        })
        if (type != 'post') {
            setFormData({ title: data.title, description: data.description, id: data.id, price: data.price, image_url: data.image_url || '' })
        }
    }
    const closeDialog = () => {
        clearForm()
        setDialogDetails({
            ...dialogDetails,
            open: false
        })
    }

    const handleSwitchChange = () => {
        fetchProductDetails(!isActive)
    }
    const productSection = (f) => {
        switch (f) {
            case 'loading':
                return <div className="linearprogress"><LinearProgress variant="indeterminate" /></div>
            case 'error':
                return <p className="text-center">Error occured while fetching data</p>
            case 'success':
                if (productDetails.length > 0) {
                    return <TableContainer elevation={3} component={Paper}>
                        <Table sx={{ minWidth: 650, background: 'var(--app-secondary)' }} aria-label="a dense table">
                            <TableHead>
                                <TableRow
                                    sx={{ 'td,th': { borderBottom: '1px solid var(--primary-color-1)' } }}>
                                    <TableCell><p>Title</p></TableCell>
                                    <TableCell><p>Description</p></TableCell>
                                    <TableCell><p>Price</p></TableCell>
                                    <TableCell><p className="text-end pr-4">Actions</p></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {productDetails.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        sx={{ 'td,th': { borderBottom: '1px solid var(--primary-color-1)' }, '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell className="min-w-4" component="th" scope="row">
                                            {row.title}
                                        </TableCell>
                                        <TableCell>{row.description}</TableCell>
                                        <TableCell>$ {row.price}</TableCell>
                                        <TableCell>
                                            <Stack className="justify-end" direction="row" spacing={1}>
                                                {isActive ? <>
                                                    <Button variant="outlined" onClick={() => { openDialog('disable', row) }}>Disable</Button>
                                                    <IconButton onClick={() => { openDialog('put', row) }} aria-label="edit">
                                                        <EditOutlinedIcon />
                                                    </IconButton>
                                                </> :
                                                    <>
                                                        <Button variant="outlined" onClick={() => { openDialog('enable', row) }}>Enable</Button>
                                                        <IconButton onClick={() => { openDialog('delete', row, true) }} aria-label="delete">
                                                            <DeleteOutlineOutlinedIcon />
                                                        </IconButton>
                                                    </>
                                                }
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                }
                else {
                    return <p className="text-center">No record found</p>
                }
        }
        return <></>
    }
    return (
        <section className={lilita.variable}>
            <Dialog
                // sx={{
                //     "& .MuiDialog-container": {
                //         "& .MuiPaper-root": {
                //             width: "100%",
                //             maxWidth: "900px",  // Set your width here
                //         },
                //     },
                // }}
                disableEscapeKeyDown
                fullWidth
                maxWidth="md"
                open={dialogDetails.open}
                TransitionComponent={Transition}
                onClose={closeDialog}
                aria-describedby="alert-dialog-slide-description"
            >
                {dialogDetails.type == 'post' && <DialogTitle>Add Product</DialogTitle>}
                {dialogDetails.type == 'put' && <DialogTitle>Edit Product</DialogTitle>}
                <DialogContent>
                    {dialogDetails.type == 'post' || dialogDetails.type == 'put' ? <div>
                        <form onSubmit={manageProductDetails} onChange={formChange} className="flex flex-col gap-4 pt-4 items-end">
                            <FormControl className="w-full">
                                <TextField id='title' value={formData.title} autoComplete="off" label="Title" required variant="outlined" />
                            </FormControl>
                            <FormControl className="w-full">
                                <TextField id='description' value={formData.description} autoComplete="off" rows={4} multiline label="Description" required variant="outlined" />
                            </FormControl>
                            <div className="flex gap-4 w-full">
                                <FormControl className="w-2/3">
                                    <TextField id='image_url' value={formData.image_url} autoComplete="off" label="Image Url" variant="outlined" />
                                </FormControl>
                                <FormControl className="w-1/3">
                                    <TextField inputProps={{ step: 0.01 }}
                                        InputProps={{ startAdornment: '$' }} 
                                        id='price' 
                                        value={formData.price}
                                        autoComplete="off" 
                                        label="Price" 
                                        required 
                                        variant="outlined" />
                                </FormControl>
                            </div>
                            <div className="flex gap-3 items-center">
                                {dialogDetails.loader && <CircularProgress thickness={5} size={32} />}
                                <Button disabled={dialogDetails.loader} type="submit" variant="contained">{dialogDetails.type == 'post' ? 'Add Product' : 'Update'}</Button>
                                <Button disabled={dialogDetails.loader} variant="outlined" onClick={closeDialog}>Cancel</Button>
                            </div>
                        </form>
                    </div> :
                        <div>
                            <p className="text-xl">{dialogDetails.type == 'delete' ? "Are you sure you want to delete this product ?" : `Are you sure you want to ${dialogDetails.type} this product ?`}</p>
                            <div className="pt-8 flex gap-3 items-center justify-end">
                                {dialogDetails.loader && <CircularProgress thickness={5} size={32} />}
                                <Button disabled={dialogDetails.loader} onClick={manageProductDetails} variant="contained">Yes</Button>
                                <Button disabled={dialogDetails.loader} variant="outlined" onClick={closeDialog}>Cancel</Button>
                            </div>
                        </div>
                    }
                </DialogContent>
            </Dialog>
            <h2 className="pb-8">Products</h2>
            <div className="p-4">
                <form>


                </form>
                <div className="flex w-full justify-between items-center pb-4">
                    <h5>Available Products</h5>
                    <Button onClick={() => { openDialog('post', {}) }} color="primary" variant="contained">Add Product</Button>
                </div>
                <div className="text-end">
                    <FormControlLabel control={<Switch checked={isActive} onChange={handleSwitchChange} />} label="Active Products" />
                </div>
                <div className="pt-4">
                    {productSection(fetchStatus)}
                </div>
            </div>
        </section>
    )
}

export default ProductAdmin