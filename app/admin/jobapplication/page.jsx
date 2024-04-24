'use client'
import axiosInstance from "@components/axiosInstance";
import { lilita } from "@components/themeregistry";
import { Button, CircularProgress, Dialog, DialogContent, DialogTitle, Icon, IconButton, Paper, Slide, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Fragment, forwardRef, useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
const table_label = {
    "firstname": 'Firstname',
    "lastname": 'Lastname',
    "email": 'Email ID',
    "phonenumber": 'Phone Number'
}
const JobApplicationComponent = () => {
    const [candidateDetails, setCandidateDetails] = useState([])
    const [fetchStatus, setFetchStatus] = useState('loading')
    const [dialogDetails, setDialogDetails] = useState({
        open: false,
        loader: false,
        type: '',
        data: null
    })
    useEffect(() => {
        fetchCandidateDetails()
    }, [])
    const fetchCandidateDetails = () => {
        axiosInstance.get('/api/v1/candidates').then((response) => {
            setCandidateDetails(response.data)
            setFetchStatus('success')
        }).catch(() => {
            setFetchStatus('error')
        })
    }
    const deleteCandidate = () => {
        setDialogDetails((prevData) => {
            prevData.loader = true
            return {
                ...prevData
            }
        })
        axiosInstance.delete(`/api/v1/candidates/${dialogDetails.data.id}`).then(() => {
            setDialogDetails((prevData) => {
                return {
                    ...prevData,
                    loader: false,
                    open: false
                }
            })
            fetchCandidateDetails()
        }).catch(() => {
            setDialogDetails((prevData) => {
                return {
                    ...prevData,
                    loader: false,
                }
            })
        })
    }
    const openDialog = (type, data) => {
        setDialogDetails({
            open: true,
            loader: false,
            type,
            data
        })
    }
    const closeDialog = () => {
        setDialogDetails({
            open: false,
            loader: false,
            type: '',
            id: ''
        })
    }
    return <section className={lilita.variable}>

        <Dialog
            className={lilita.variable}
            disableEscapeKeyDown
            fullWidth
            maxWidth="md"
            open={dialogDetails.open}
            TransitionComponent={Transition}
            onClose={closeDialog}
            aria-describedby="alert-dialog-slide-description"
        >
            {dialogDetails.data && <DialogTitle>
                <div className="flex justify-between">
                    {dialogDetails.type == 'about' && <h4>{dialogDetails.data.firstname} {dialogDetails.data.lastname}</h4>}
                    {dialogDetails.type == 'delete' && <p className="text-xl">Are you sure you want to delete this product ?</p>}
                    {dialogDetails.type == 'about' && <IconButton onClick={closeDialog}>
                        <CloseIcon />
                    </IconButton>}
                </div>
            </DialogTitle>}
            {dialogDetails.data && <DialogContent>
                {dialogDetails.type == 'about' && <Fragment>
                    <p className="text-xl pb-2 font-bold">Skills</p>
                    <p className="pb-2 pl-3">{dialogDetails.data.skills}</p>
                    <p className="text-xl pb-2 font-bold">About the Candidate</p>
                    <p className="pb-2 pl-3">{dialogDetails.data.about}</p>
                </Fragment>}
                {dialogDetails.type == 'delete' && <div className="pt-8 flex gap-3 items-center justify-end">
                    {dialogDetails.loader && <CircularProgress thickness={5} size={32} />}
                    <Button disabled={dialogDetails.loader} onClick={deleteCandidate} variant="contained">Yes</Button>
                    <Button disabled={dialogDetails.loader} variant="outlined" onClick={closeDialog}>Cancel</Button>
                </div>}
            </DialogContent>}
        </Dialog>

        <h2 className="pb-8">Job Applications</h2>
        <div className="p-4">
            <TableContainer elevation={3} component={Paper}>
                <Table sx={{ background: 'var(--app-secondary)' }}>
                    <TableHead>
                        <TableRow
                            sx={{ 'td,th': { borderBottom: '1px solid var(--primary-color-1)' } }}>
                            {Object.values(table_label).map(h => {
                                return <TableCell key={h}><p>{h}</p></TableCell>
                            })}
                            <TableCell><p>Actions</p></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody sx={{ whiteSpace: 'nowrap' }}>
                        {candidateDetails.map((row) => (
                            <TableRow
                                key={row.id}
                                sx={{ 'td,th': { borderBottom: '1px solid var(--primary-color-1)' }, '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                {Object.keys(table_label).map(k => {
                                    return <TableCell key={k}>
                                        <span>{row[k]}</span>
                                    </TableCell>
                                })}
                                <TableCell>
                                    <Stack direction="row" spacing={1}>
                                        <Button variant="outlined" onClick={() => { openDialog('about', row) }}>About</Button>
                                        <IconButton onClick={() => { openDialog('delete', row, true) }} aria-label="delete">
                                            <DeleteOutlineOutlinedIcon />
                                        </IconButton>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    </section>
}

export default JobApplicationComponent;