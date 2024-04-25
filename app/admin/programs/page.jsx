'use client'
import { lilita } from "@components/themeregistry"
import { Button, Paper, Table, FormControl, TextField, TableBody, TableCell, TableContainer, TableHead, TableRow, LinearProgress, Slide, Dialog, DialogContent, Stack, DialogTitle, IconButton, CircularProgress, FormControlLabel, Switch, Snackbar } from "@mui/material"
import { forwardRef, useEffect, useState } from "react";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import axiosInstance from "@components/axiosInstance";

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
const formData_inital = {
    title: '',
    description: '',
    image_url: '',
}
const ProgramAdmin = () => {
    const [programDetails, setProgramDetails] = useState([])
    const [fetchStatus, setFetchStatus] = useState('loading')
    const [dialogDetails, setDialogDetails] = useState({
        open: false,
        loader: false,
        type: 'post',
    })
    const [formData, setFormData] = useState(formData_inital)
    const [isActive, setIsActive] = useState(true)
    const [snackBarData, setSnackBarData] = useState({ open: false, msg: '' })
    const closeSnackbar = () => {
        setSnackBarData({ open: false, msg: '' })
    }
    useEffect(() => {
        fetchProgramDetails(isActive);
    }, [])
    const fetchProgramDetails = (is_active) => {
        setIsActive(is_active)
        setFetchStatus('loading')
        setProgramDetails([])
        axiosInstance.get(`/api/v1/programs/adminIndex?isActive=${is_active}`).then((response) => {
            setProgramDetails(response.data)
            setFetchStatus('success')
        }).catch(() => {
            setFetchStatus('error')
        })
    }
    const manageProgramDetails = (e) => {
        e.preventDefault()
        setDialogDetails({
            ...dialogDetails,
            loader: true
        })
        const url = dialogDetails.type == 'post' ? '/api/v1/programs' : `/api/v1/programs/${formData.id}`
        let data = dialogDetails.type == 'delete' ? undefined : { title: formData.title, description: formData.description, image_url: formData.image_url || '' }
        if (dialogDetails.type == 'disable') {
            data.is_active = false
        }
        else if (dialogDetails.type == 'enable') {
            data.is_active = true
        }
        axiosInstance({
            method: dialogDetails.type == 'disable' || dialogDetails.type == 'enable' ? 'put' : dialogDetails.type,
            url,
            data
        }).then((res) => {
            if (dialogDetails.type == 'post') setSnackBarData({open: true, msg: 'Program Added Successfully'})
            else if (dialogDetails.type == 'put') setSnackBarData({open: true, msg: 'Program Updated Successfully'})
            else if (dialogDetails.type == 'enable') setSnackBarData({open: true, msg: 'Program Enabled Successfully'})
            else if (dialogDetails.type == 'disable') setSnackBarData({open: true, msg: 'Program Disabled Successfully'})
            setDialogDetails({
                ...dialogDetails,
                loader: false,
                open: false
            })
            fetchProgramDetails(isActive)
            setFormData({ title: '', description: '', image_url: '' })
        }).catch(() => {
            setSnackBarData({open: true, msg: 'Some Error Ocurred'})
            setDialogDetails({
                ...dialogDetails,
                loader: false,
                open: false
            })
            setFormData({ title: '', description: '', image_url: '' })
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
            setFormData({ title: data.title, description: data.description, id: data.id, image_url: data.image_url || '' })
        }
    }
    const closeDialog = () => {
        setFormData({ title: '', description: '', image_url: '' })
        setDialogDetails({
            ...dialogDetails,
            open: false
        })
    }

    const handleSwitchChange = () => {
        fetchProgramDetails(!isActive)
    }
    const programSection = (f) => {
        switch (f) {
            case 'loading':
                return <div className="linearprogress"><LinearProgress variant="indeterminate" /></div>
            case 'error':
                return <p className="text-center">Error occured while fetching data</p>
            case 'success':
                if (programDetails.length > 0) {
                    return <TableContainer elevation={3} component={Paper}>
                        <Table sx={{ minWidth: 650, background: 'var(--app-secondary)' }} aria-label="a dense table">
                            <TableHead>
                                <TableRow
                                    sx={{ 'td,th': { borderBottom: '1px solid var(--primary-color-1)' } }}>
                                    <TableCell><p>Title</p></TableCell>
                                    <TableCell><p>Description</p></TableCell>
                                    <TableCell><p className="text-end pr-4">Actions</p></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {programDetails.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        sx={{ 'td,th': { borderBottom: '1px solid var(--primary-color-1)' }, '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell className="min-w-4" component="th" scope="row">
                                            {row.title}
                                        </TableCell>
                                        <TableCell>{row.description}</TableCell>
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
                                                        {/* <IconButton onClick={() => { openDialog('delete', row, true) }} aria-label="delete">
                                                            <DeleteOutlineOutlinedIcon />
                                                        </IconButton> */}
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
            <Snackbar
                open={snackBarData.open}
                autoHideDuration={3000}
                onClose={closeSnackbar}
                message={snackBarData.msg}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            />
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
                {dialogDetails.type == 'post' && <DialogTitle>Add Program</DialogTitle>}
                {dialogDetails.type == 'put' && <DialogTitle>Edit Program</DialogTitle>}
                <DialogContent>
                    {dialogDetails.type == 'post' || dialogDetails.type == 'put' ? <div>
                        <form onSubmit={manageProgramDetails} onChange={formChange} className="flex flex-col gap-4 pt-4 items-end">
                            <FormControl className="w-full">
                                <TextField id='title' value={formData.title} autoComplete="off" label="Title" required variant="outlined" />
                            </FormControl>
                            <FormControl className="w-full">
                                <TextField id='image_url' value={formData.image_url} autoComplete="off" label="Image Url" variant="outlined" />
                            </FormControl>
                            <FormControl className="w-full">
                                <TextField id='description' value={formData.description} autoComplete="off" rows={4} multiline label="Description" required variant="outlined" />
                            </FormControl>
                            <div className="flex gap-3 items-center">
                                {dialogDetails.loader && <CircularProgress thickness={5} size={32} />}
                                <Button disabled={dialogDetails.loader} type="submit" variant="contained">{dialogDetails.type == 'post' ? 'Add Program' : 'Update'}</Button>
                                <Button disabled={dialogDetails.loader} variant="outlined" onClick={closeDialog}>Cancel</Button>
                            </div>
                        </form>
                    </div> :
                        <div>
                            <p className="text-xl">{dialogDetails.type == 'delete' ? "Are you sure you want to delete this program ?" : `Are you sure you want to ${dialogDetails.type} this program ?`}</p>
                            <div className="pt-8 flex gap-3 items-center justify-end">
                                {dialogDetails.loader && <CircularProgress thickness={5} size={32} />}
                                <Button disabled={dialogDetails.loader} onClick={manageProgramDetails} variant="contained">Yes</Button>
                                <Button disabled={dialogDetails.loader} variant="outlined" onClick={closeDialog}>Cancel</Button>
                            </div>
                        </div>
                    }
                </DialogContent>
            </Dialog>
            <h2 className="pb-8">Programs</h2>
            <div className="p-4">
                <div className="flex w-full justify-between items-center pb-4">
                    <h5>Available Programs</h5>
                    <Button onClick={() => { openDialog('post', {}) }} color="primary" variant="contained">Add Program</Button>
                </div>
                <div className="text-end">
                    <FormControlLabel control={<Switch checked={isActive} onChange={handleSwitchChange} />} label="Active Programs" />
                </div>
                <div className="pt-4">
                    {programSection(fetchStatus)}
                </div>
            </div>
        </section>
    )
}

export default ProgramAdmin