'use client'
import { lilita } from "@components/themeregistry"
import { Button, Paper, Table, FormControl, TextField, TableBody, TableCell, TableContainer, TableHead, TableRow, LinearProgress, Slide, Dialog, DialogContent, Stack, DialogTitle, IconButton, CircularProgress, FormControlLabel, Switch } from "@mui/material"
import axios from 'axios'
import { forwardRef, useEffect, useState } from "react";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import axiosInstance from "@components/axiosInstance";

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
const formData_inital = {
    name: '',
    address: ''
}
const SchoolAdmin = () => {
    const [schoolDetails, setSchoolDetails] = useState([])
    const [fetchStatus, setFetchStatus] = useState('loading')
    const [dialogDetails, setDialogDetails] = useState({
        open: false,
        loader: false,
        type: 'post',
    })
    const [formData, setFormData] = useState(formData_inital)
    const [isActive, setIsActive] = useState(true)
    useEffect(() => {
        fetchSchoolDetails(isActive);
    }, [])
    const fetchSchoolDetails = (is_active) => {
        setIsActive(is_active)
        setFetchStatus('loading')
        setSchoolDetails([])
        axiosInstance.get(`http://127.0.0.1:4000/api/v1/schools?isActive=${is_active}`).then((response) => {
            setSchoolDetails(response.data)
            setFetchStatus('success')
        }).catch(() => {
            setFetchStatus('error')
        })
    }
    const manageSchoolDetails = (e) => {
        e.preventDefault()
        setDialogDetails({
            ...dialogDetails,
            loader: true
        })
        const url = dialogDetails.type == 'post' ? 'http://127.0.0.1:4000/api/v1/schools' : `http://127.0.0.1:4000/api/v1/schools/${formData.id}`
        let data = dialogDetails.type == 'delete' ? undefined : { name: formData.name, address: formData.address }
        if (dialogDetails.type == 'disable') {
            data.is_active = false
        }
        else if (dialogDetails.type == 'enable') {
            data.is_active = true
        }
        axios({
            method: dialogDetails.type == 'disable' || dialogDetails.type == 'enable' ? 'put' : dialogDetails.type,
            url,
            data
        }).then((res) => {
            setDialogDetails({
                ...dialogDetails,
                loader: false,
                open: false
            })
            fetchSchoolDetails(isActive)
            setFormData({ name: '', address: '' })
        }).catch(() => {
            setDialogDetails({
                ...dialogDetails,
                loader: false,
                open: false
            })
            setFormData({ name: '', address: '' })
        })
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
            setFormData({ name: data.name, address: data.address, id: data.id })
        }
    }
    const closeDialog = () => {
        setFormData({ name: '', address: '' })
        setDialogDetails({
            ...dialogDetails,
            open: false
        })
    }

    const handleSwitchChange = () => {
        fetchSchoolDetails(!isActive)
    }
    const schoolSection = (f) => {
        switch (f) {
            case 'loading':
                return <div className="linearprogress"><LinearProgress variant="indeterminate" /></div>
            case 'error':
                return <p className="text-center">Error occured while fetching data</p>
            case 'success':
                if (schoolDetails.length > 0) {
                    return <TableContainer elevation={3} component={Paper}>
                        <Table sx={{ minWidth: 650, background: 'var(--app-secondary)' }} aria-label="a dense table">
                            <TableHead>
                                <TableRow
                                    sx={{ 'td,th': { borderBottom: '1px solid var(--primary-color-1)' } }}>
                                    <TableCell><p>Name</p></TableCell>
                                    <TableCell><p>Address</p></TableCell>
                                    <TableCell><p className="text-end pr-4">Actions</p></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {schoolDetails.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        sx={{ 'td,th': { borderBottom: '1px solid var(--primary-color-1)' }, '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell className="min-w-4" component="th" scope="row">
                                            {row.name}
                                        </TableCell>
                                        <TableCell>{row.address}</TableCell>
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
                open={dialogDetails.open}
                TransitionComponent={Transition}
                onClose={closeDialog}
                aria-describedby="alert-dialog-slide-description"
            >
                {dialogDetails.type == 'post' && <DialogTitle>Add School</DialogTitle>}
                {dialogDetails.type == 'put' && <DialogTitle>Edit School</DialogTitle>}
                <DialogContent>
                    {dialogDetails.type == 'post' || dialogDetails.type == 'put' ? <div>
                        <form onSubmit={manageSchoolDetails} onChange={formChange} className="flex flex-col gap-4 pt-4 items-end">
                            <FormControl className="w-full">
                                <TextField id='name' value={formData.name} autoComplete="off" label="Name" required variant="outlined" />
                            </FormControl>
                            <FormControl className="w-full">
                                <TextField id='address' value={formData.address} autoComplete="off" rows={4} multiline label="Address" required variant="outlined" />
                            </FormControl>
                            <div className="flex gap-3 items-center">
                                {dialogDetails.loader && <CircularProgress thickness={5} size={32} />}
                                <Button disabled={dialogDetails.loader} type="submit" variant="contained">{dialogDetails.type == 'post' ? 'Add School' : 'Update'}</Button>
                                <Button disabled={dialogDetails.loader} variant="outlined" onClick={closeDialog}>Cancel</Button>
                            </div>
                        </form>
                    </div> :
                        <div>
                            <p className="text-xl">{dialogDetails.type == 'delete' ? "Are you sure you want to delete this school ?" : `Are you sure you want to ${dialogDetails.type} this school ?`}</p>
                            <div className="pt-8 flex gap-3 items-center justify-end">
                                {dialogDetails.loader && <CircularProgress thickness={5} size={32} />}
                                <Button disabled={dialogDetails.loader} onClick={manageSchoolDetails} variant="contained">Yes</Button>
                                <Button disabled={dialogDetails.loader} variant="outlined" onClick={closeDialog}>Cancel</Button>
                            </div>
                        </div>
                    }
                </DialogContent>
            </Dialog>
            <h2 className="pb-8">Schools</h2>
            <div className="p-4 pl-6">
                <div className="flex w-full justify-between items-center pb-4">
                    <h5>Available Schools</h5>
                    <Button onClick={() => { openDialog('post', {}) }} color="primary" variant="contained">Add School</Button>
                </div>
                <div className="text-end">
                    <FormControlLabel sx={{ display: "flex" }} className="justify-end" control={<Switch checked={isActive} onChange={handleSwitchChange} />} label="Active Schools" />
                </div>
                <div className="pt-4">
                    {schoolSection(fetchStatus)}
                </div>
            </div>
        </section>
    )
}

export default SchoolAdmin