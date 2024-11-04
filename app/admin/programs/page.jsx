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
    image: null 
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
        e.preventDefault();
        setDialogDetails({
            ...dialogDetails,
            loader: true,
        });
    
        const url = dialogDetails.type === 'post' ? '/api/v1/programs' : `/api/v1/programs/${formData.id}`;
        const formDataToSend = new FormData();
    
        formDataToSend.append('title', formData.title);
        formDataToSend.append('description', formData.description);
        if (formData.image) {
            formDataToSend.append('image', formData.image);
        }
    
        // Set `is_active` based on dialog type
        if (dialogDetails.type === 'disable') {
            formDataToSend.append('is_active', false);
        } else if (dialogDetails.type === 'enable') {
            formDataToSend.append('is_active', true);
        }
    
        axiosInstance({
            method: dialogDetails.type === 'disable' || dialogDetails.type === 'enable' ? 'put' : dialogDetails.type,
            url,
            data: formDataToSend,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .then((res) => {
            setSnackBarData({
                open: true,
                msg: dialogDetails.type === 'post' ? 'Program Added Successfully' : 'Program Updated Successfully',
            });
            setDialogDetails({
                ...dialogDetails,
                loader: false,
                open: false,
            });
            fetchProgramDetails(isActive);
            setFormData(formData_inital);
        })
        .catch(() => {
            setSnackBarData({
                open: true,
                msg: 'Some Error Occurred',
            });
            setDialogDetails({
                ...dialogDetails,
                loader: false,
                open: false,
            });
            setFormData(formData_inital);
        });
    };
    
    const formChange = (e) => {
        const { id, value, files } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [id]: files ? files[0] : value, // Handles file input for `image`
        }));
    };
    
    const openDialog = (type, data, status = false) => {
        setDialogDetails({
            ...dialogDetails,
            open: true,
            type
        })
        if (type != 'post') {
            setFormData({ title: data.title, description: data.description, id: data.id, image: data.image || null })
        }
    }
    const closeDialog = () => {
        setFormData({ title: '', description: '', image: null })
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
                    return (
                        <TableContainer elevation={3} component={Paper}>
                            <Table sx={{ minWidth: 650, background: 'var(--app-secondary)' }} aria-label="a dense table">
                                <TableHead>
                                    <TableRow sx={{ 'td,th': { borderBottom: '1px solid var(--primary-color-1)' } }}>
                                        <TableCell><p>Title</p></TableCell>
                                        <TableCell><p>Description</p></TableCell>
                                        <TableCell><p>Image</p></TableCell> {/* New Image column */}
                                        <TableCell><p className="text-end pr-4">Actions</p></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {programDetails.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            sx={{
                                                'td,th': { borderBottom: '1px solid var(--primary-color-1)' },
                                                '&:last-child td, &:last-child th': { border: 0 }
                                            }}
                                        >
                                            <TableCell className="min-w-4" component="th" scope="row">
                                                {row.title}
                                            </TableCell>
                                            <TableCell>{row.description}</TableCell>
                                            <TableCell>
                                                {row.image ? (
                                                    <>
                                                        <img src={row.image} alt="Program" style={{ width: '50px', height: '50px' }} />
                                                    </>
                                                ) : row.image_url ? (
                                                    <>
                                                        <img src={row.image_url} alt="Program" style={{ width: '50px', height: '50px' }} />
                                                    </>
                                                ) : (
                                                    <>
                                                       <p>No image</p>
                                                        {console.log('Image URL from row.image_url:', programDetails)} {/* Debugging log */}
                                                    </>
                                                )}
                                            </TableCell>

                                            <TableCell>
                                                <Stack className="justify-end" direction="row" spacing={1}>
                                                    {isActive ? (
                                                        <>
                                                            <Button variant="outlined" onClick={() => { openDialog('disable', row) }}>Disable</Button>
                                                            <IconButton onClick={() => { openDialog('put', row) }} aria-label="edit">
                                                                <EditOutlinedIcon />
                                                            </IconButton>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Button variant="outlined" onClick={() => { openDialog('enable', row) }}>Enable</Button>
                                                            {/* <IconButton onClick={() => { openDialog('delete', row, true) }} aria-label="delete">
                                                                <DeleteOutlineOutlinedIcon />
                                                            </IconButton> */}
                                                        </>
                                                    )}
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    );
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
                            <TextField
                                id="image"
                                type="file"
                                onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                                autoComplete="off"
                                // label="Upload Image"
                                variant="outlined"
                            />
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