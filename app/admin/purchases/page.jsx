'use client'
import axiosInstance from "@components/axiosInstance";
import { lilita } from "@components/themeregistry";
import { Button, Dialog, DialogContent, DialogTitle, FormControl, FormControlLabel, FormLabel, IconButton, InputLabel, LinearProgress, MenuItem, Paper, Radio, RadioGroup, Select, Slide, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Fragment, forwardRef, useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
const table_label = {
    "firstname": 'Firstname',
    "lastname": 'Lastname',
    "grade": 'Grade',
}
const PurchasesComponent = () => {
    const [radioGroupValue, setRadioGroupValue] = useState('program')
    const [disableSelect, setDisableSelect] = useState(true)
    const [scheduleDetails, setScheduleDetails] = useState([])
    const [schoolDetails, setSchoolDetails] = useState([])
    const [productDetails, setProductDetails] = useState([])
    const [fetchStatus, setFetchStatus] = useState('none')
    const [formData, SetFormData] = useState({
        school_id: '',
        schedule_id: '',
        product_id: ''
    })
    const [studentDetails, setStudentDetails] = useState([])
    const [openDialog, setOpenDialog] = useState(false)
    const [dialogData, setDialogData] = useState({})
    useEffect(() => {
        fetchSelectDetails()
    }, [])
    const fetchSelectDetails = () => {
        axiosInstance.get('/api/v1/schedules/adminIndex?isActive=true').then((response) => {
            setScheduleDetails(response.data)
            const schoolData = {}
            response.data.forEach((d) => {
                if (!schoolData[d.school_id]) {
                    schoolData[d.school_id] = {
                        school_id: d.school_id,
                        school_address: d.school_address,
                        school_name: d.school_name
                    }
                }
            })
            setSchoolDetails(Object.values(schoolData))
            setDisableSelect(false)
        })
        axiosInstance.get('/api/v1/products?isActive=true').then((response) => {
            setProductDetails(response.data)
        })
    }
    const radioValueChange = (e) => {
        setRadioGroupValue(e.target.value)
        SetFormData({
            school_id: '',
            schedule_id: '',
            product_id: ''
        })
    }
    const formChange = (e, type) => {
        SetFormData((prevData) => {
            prevData[type] = e.target.value
            if (type == 'school_id') {
                prevData.schedule_id = ''
            }
            return {
                ...prevData,
            }
        })
        if (type == 'schedule_id' || type == 'product_id') {
            setFetchStatus('loading')
            fetchPurchaseHistory(type)
        }
    }
    const fetchPurchaseHistory = (type) => {
        if (type == 'schedule_id') {
            axiosInstance.get(`/api/v1/purchaseds/getStudentInfoSchedule/${formData.schedule_id}`).then((scheduleInfo) => {
                setStudentDetails(scheduleInfo.data)
            })
            setFetchStatus('success')
        }
        else if (type == 'product_id') {
            axiosInstance.get(`/api/v1/purchaseds/getStudentInfoProduct/${formData.product_id}`).then((productInfo) => {
                setStudentDetails(productInfo.data)
            })
            setFetchStatus('success')
        }
    }
    const openParentInfo = (parentData) => {
        setDialogData(parentData)
        setOpenDialog(true)
    }
    const closeDialog = () => {
        setDialogData({})
        setOpenDialog(false)
    }
    return <section className={lilita.variable}>

        <Dialog
            className={lilita.variable}
            disableEscapeKeyDown
            fullWidth
            maxWidth="md"
            open={openDialog}
            TransitionComponent={Transition}
            onClose={closeDialog}
            aria-describedby="alert-dialog-slide-description">
            <DialogTitle>
                <div className="flex justify-between items-center">
                    <h4>{dialogData.firstname} {dialogData.lastname}</h4>
                    <IconButton onClick={closeDialog}>
                        <CloseIcon />
                    </IconButton>
                </div>
            </DialogTitle>
            {dialogData.id && <DialogContent>
                <h5 className="pb-4">Parent/Guardian Information</h5>
                <div className="pb-4">
                    <p className="font-bold text-xl">Email Id</p>
                    <p className="text-color-primary-1">{dialogData.user.email}</p>
                </div>
                <p className="text-2xl pb-2">Parent/Guardian 1</p>
                <div className="w-full flex gap-4 justify-between pb-4">
                    <div className="w-1/2">
                        <p className="font-bold text-lg">Name</p>
                        <p className="text-color-primary-1">{dialogData.user.parent_1_name}</p>
                    </div>
                    <div className="w-1/2">
                        <p className="font-bold text-lg">Relationship</p>
                        <p className="text-color-primary-1">{dialogData.user.parent_1_relation}</p>
                    </div>
                </div>
                <div className="w-full pb-4">
                    <div className="w-1/2">
                        <p className="font-bold text-lg">Phone Number</p>
                        <p className="text-color-primary-1">{dialogData.user.parent_1_phone_number}</p>
                    </div>
                </div>
                <p className="text-2xl pb-2">Parent/Guardian 2</p>
                <div className="w-full flex gap-4 justify-between pb-4">
                    <div className="w-1/2">
                        <p className="font-bold text-lg">Name</p>
                        <p className="text-color-primary-1">{dialogData.user.parent_2_name}</p>
                    </div>
                    <div className="w-1/2">
                        <p className="font-bold text-lg">Relationship</p>
                        <p className="text-color-primary-1">{dialogData.user.parent_2_relation}</p>
                    </div>
                </div>
                <div className="w-full pb-4">
                    <div className="w-1/2">
                        <p className="font-bold text-lg">Phone Number</p>
                        <p className="text-color-primary-1">{dialogData.user.parent_1_phone_number}</p>
                    </div>
                </div>
                <h5 className="pb-4">Emergency Information</h5>
                <p className="text-2xl pb-2">Primary Contact</p>
                <div className="w-full flex gap-4 justify-between pb-4">
                    <div className="w-1/2">
                        <p className="font-bold text-lg">Name</p>
                        <p className="text-color-primary-1">{dialogData.user.parent_1_name}</p>
                    </div>
                    <div className="w-1/2">
                        <p className="font-bold text-lg">Relationship to child</p>
                        <p className="text-color-primary-1">{dialogData.user.parent_1_relation}</p>
                    </div>
                </div>
                <div className="w-full pb-4">
                    <div className="w-1/2">
                        <p className="font-bold text-lg">Phone Number</p>
                        <p className="text-color-primary-1">{dialogData.user.parent_1_phone_number}</p>
                    </div>
                </div>
                <p className="text-2xl pb-2">Secondary Contact</p>
                <div className="w-full flex gap-4 justify-between pb-4">
                    <div className="w-1/2">
                        <p className="font-bold text-lg">Name</p>
                        <p className="text-color-primary-1">{dialogData.user.parent_2_name}</p>
                    </div>
                    <div className="w-1/2">
                        <p className="font-bold text-lg">Relationship to child</p>
                        <p className="text-color-primary-1">{dialogData.user.parent_2_relation}</p>
                    </div>
                </div>
                <div className="w-full pb-4">
                    <div className="w-1/2">
                        <p className="font-bold text-lg">Phone Number</p>
                        <p className="text-color-primary-1">{dialogData.user.parent_1_phone_number}</p>
                    </div>
                </div>
            </DialogContent>}
        </Dialog>

        <h2 className="pb-8">Purchase History</h2>
        <FormControl sx={{ width: '33.33%' }}>
            <FormLabel id="purchase-history-radio-label">
                <p className="text-color-primary text-xl">Select the required option</p>
            </FormLabel>
            <RadioGroup
                aria-labelledby="purchase-history-radio-label"
                value={radioGroupValue}
                onChange={radioValueChange}
                className="pt-4"
            >
                <FormControlLabel value="program" control={<Radio />} label="Programs" />
                <FormControlLabel value="product" control={<Radio />} label="Products" />
            </RadioGroup>
        </FormControl>
        {radioGroupValue == 'program' && <div className="pt-4">
            <FormControl sx={{ width: '33.33%' }} required>
                <InputLabel id='school-select'>Select School</InputLabel>
                <Select
                    disabled={disableSelect}
                    labelId="school-select"
                    id='school-select'
                    value={formData.school_id}
                    label="Select School"
                    onChange={(e) => { formChange(e, 'school_id') }}
                >
                    {
                        schoolDetails.map((school) => {
                            return <MenuItem key={school.school_id} value={school.school_id}>{school.school_name} | {school.school_address}</MenuItem>
                        })
                    }
                </Select>
            </FormControl>
            <FormControl sx={{ width: '33.33%', marginLeft: '1rem' }} required>
                <InputLabel id='program-select'>Select Program</InputLabel>
                <Select
                    disabled={disableSelect || !formData.school_id}
                    labelId="program-select"
                    id='program-select'
                    value={formData.schedule_id}
                    label="Select Program"
                    onChange={(e) => { formChange(e, 'schedule_id') }}
                >
                    {
                        scheduleDetails.filter((e) => e.school_id == formData.school_id).map((schedule) => {
                            return <MenuItem key={schedule.id} value={schedule.id}>{schedule.program_name}</MenuItem>
                        })
                    }
                </Select>
            </FormControl>
        </div>}
        {radioGroupValue == 'product' && <div className="pt-4">
            <FormControl sx={{ width: '33.33%', marginLeft: '1rem' }} required>
                <InputLabel id='program-select'>Select Product</InputLabel>
                <Select
                    disabled={disableSelect}
                    labelId="program-select"
                    id='program-select'
                    value={formData.product_id}
                    label="Select Select"
                    onChange={(e) => { formChange(e, 'product_id') }}
                >
                    {
                        productDetails.map((product) => {
                            return <MenuItem key={product.id} value={product.id}>{product.title}</MenuItem>
                        })
                    }
                </Select>
            </FormControl>
        </div>}
        <div className="pt-8">
            {fetchStatus == 'loading' && <div className="linearprogress"><LinearProgress></LinearProgress></div>}
            {fetchStatus == 'success' && <div>
                {studentDetails.length ? <TableContainer elevation={3} component={Paper}>
                    <Table sx={{ background: 'var(--app-secondary)' }}>
                        <TableHead>
                            <TableRow
                                sx={{ 'td,th': { borderBottom: '1px solid var(--primary-color-1)' } }}>
                                {Object.values(table_label).map(h => {
                                    return <TableCell key={h}><p>{h}</p></TableCell>
                                })}
                                <TableCell><p>Parent Email Id</p></TableCell>
                                <TableCell><p>Parent Phone Number</p></TableCell>
                                <TableCell><p>Actions</p></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody sx={{ whiteSpace: 'nowrap' }}>
                            {studentDetails.map((row) => (
                                <TableRow
                                    key={row.id}
                                    sx={{ 'td,th': { borderBottom: '1px solid var(--primary-color-1)' }, '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    {Object.keys(table_label).map(k => {
                                        return <TableCell key={k}>
                                            <span>{row[k]}</span>
                                        </TableCell>
                                    })}
                                    <TableCell>{row.user.email}</TableCell>
                                    <TableCell>{row.user.parent_1_phone_number}</TableCell>
                                    <TableCell>
                                        <Button onClick={() => { openParentInfo(row) }} variant="outlined">Parent Info</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer> :
                    !studentDetails.length && <p className="text-xl text-center">No students fround</p>}
            </div>}
        </div>
    </section>
}

export default PurchasesComponent;