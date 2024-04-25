'use client'
import { lilita } from "@components/themeregistry"
import {
    Button, Paper, Table, FormControl, TextField, TableBody,
    TableCell, TableContainer, TableHead, TableRow,
    LinearProgress, Slide, Dialog, DialogContent, Stack,
    DialogTitle, IconButton, CircularProgress,
    FormControlLabel, Switch, InputLabel, Select, MenuItem
} from "@mui/material"
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { forwardRef, useEffect, useState } from "react";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import axiosInstance from "@components/axiosInstance";
import DescriptionIcon from '@mui/icons-material/Description';
import ExcelJS from 'exceljs';
dayjs.extend(utc);
dayjs.extend(timezone);
const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
const excelCellData = {
    'B1':'school_name',
    'B3': 'program_name',
    'B7' : 'start_date',
    'F7' : 'end_date',
    'F3' : 'day_time',
    'F1': 'school_address'
}
const getDayInt = {
    'Monday': 1,
    'Tuesday':2,
    'Wednesday': 3,
    'Thursday': 4,
    'Friday': 5
}
const table_headings = ['Program', 'School', 'Days', 'Start Date', 'End Date', 'Start Time', 'End Time', 'Age Group', 'Price']
const table_value = ['program_name', 'school_name', 'days', 'start_date', 'end_date', 'start_time', 'end_time', 'age_group', 'price']
const formData_inital = {
    "school_id": {
        label: "Select School",
        type: "select",
        value: '',
        error: false,
        disabled: true,
        options: []
    },
    "program_id": {
        label: "Select Program",
        type: "select",
        value: '',
        error: false,
        disabled: true,
        options: []
    },
    "age_group": {
        label: "Age Group",
        type: 'text',
        value: "",
        error: false
    },
    "days": {
        label: "Day",
        type: "select",
        value: "",
        error: false,
        options: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(v => { return { value: v, option: v } })
    },
    "start_date": {
        label: "Start Date",
        type: "datepicker",
        value: '',
        error: false,
    },
    "end_date": {
        label: "End Date",
        type: "datepicker",
        value: '',
        error: false,
    },
    "start_time": {
        label: "Start Time",
        type: "timepicker",
        value: '',
        error: false,
    },
    "end_time": {
        label: "End Time",
        type: "timepicker",
        value: '',
        error: false,
    },
    "price": {
        label: "Price",
        type: 'text',
        formType: 'number',
        value: '',
        error: false,
        inputProps: { step: 0.01 },
        InputProps: { startAdornment: '$' }
    },
    "teacher_name": {
        label: 'Name of the Teacher',
        type: 'text',
        value: "",
        error: false
    },
    "cost_of_teacher": {
        label: 'Cost of Teaching',
        type: 'text',
        formType: 'number',
        value: '',
        error: false,
        inputProps: { step: 0.01 },
        InputProps: { startAdornment: '$' }
    },
    "facility_rental": {
        label: 'Facility Rental',
        type: 'text',
        formType: 'number',
        value: '',
        error: false,
        inputProps: { step: 0.01 },
        InputProps: { startAdornment: '$' }
    },
    "total_available": {
        label: 'Number of Slots',
        type: 'text',
        formType: 'number',
        value: "",
        error: false
    },

}
const ScheduleAdmin = () => {
    const [scheduleDetails, setScheduleDetails] = useState([])
    const [fetchStatus, setFetchStatus] = useState('loading')
    const [dialogDetails, setDialogDetails] = useState({
        open: false,
        loader: false,
        type: 'post',
    })
    const [formData, setFormData] = useState(formData_inital)
    const [isActive, setIsActive] = useState(true)
    useEffect(() => {
        fetchScheduleDetails(isActive);
        fetchSelectDetails();
    }, [])
    const countSessions = (startDate, endDate,day) => {
        let count = 0;
        let currentDate = new Date(startDate);
        // Loop through each day between startDate and endDate
        while (currentDate <= endDate) {
          // Check if the current day is a Monday (day of the week is 1 for Monday)
          if (currentDate.getDay() === day) {
            count++;
          }
          currentDate.setDate(currentDate.getDate() + 1);
        }
        return count;
      }
    const setupRoster = (scheduleData) => {
        axiosInstance.get(`/api/v1/purchaseds/getStudentInfoSchedule/${scheduleData.id}`).then((studentInfo) => {
            fetch('/after_school_roster.xlsx')
                .then((response) => response.arrayBuffer())
                .then((buffer) => {
                    const workbook = new ExcelJS.Workbook();
                    return workbook.xlsx.load(buffer);
                })
                .then((workbook) => {
                    const worksheet = workbook.getWorksheet(1);
                    studentInfo.data.forEach((student,index) => {
                        worksheet.addRow([index + 1,student.firstname, 
                            student.lastname,student.grade,'','','','',student.user.parent_1_phone_number,student.pickup,''])
                    })
                    let getSessions = countSessions(scheduleData.start_date,scheduleData.end_date,getDayInt[scheduleData.days])
                    const cell = worksheet.getCell('F5'); // Example: cell A2
                    cell.value = getSessions
                    Object.keys(excelCellData).forEach(key => {
                        const cell = worksheet.getCell(key)
                        if (excelCellData[key].endsWith('date'))
                        {
                            const date_v = scheduleData[excelCellData[key]]   
                            cell.value = new Date(date_v).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        }
                        else if (excelCellData[key] == 'day_time') {
                            const start_time = dayjs.tz(scheduleData.start_time, 'UTC').format('h:mm A')
                            const end_time = dayjs.tz(scheduleData.end_time, 'UTC').format('h:mm A')
                            cell.value = `${scheduleData.days}, ${start_time} - ${end_time}`
                        }
                        else {
                            cell.value = scheduleData[excelCellData[key]]
                        }
                    })
                    // Generate the modified Excel file as a blob
                    return workbook.xlsx.writeBuffer();
                })
                .then((modifiedData) => {
                    // Create a Blob from the buffer
                    const blob = new Blob([modifiedData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

                    // Create a download link and trigger the download
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = 'modified_sample.xlsx';
                    link.click();
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }).catch(() => { })
    }
    const fetchSelectDetails = () => {
        axiosInstance.get(`/api/v1/schedules/getAdminAll`).then((response) => {
            setFormData((prevFormData) => {
                response.data.schools = response.data.schools.map(v => { return { value: v.id, option: v.name } })
                response.data.programs = response.data.programs.map(v => { return { value: v.id, option: v.title } })
                prevFormData.program_id.options = response.data.programs
                prevFormData.program_id.disabled = false
                prevFormData.school_id.options = response.data.schools
                prevFormData.school_id.disabled = false
                return {
                    ...prevFormData,
                }
            })
        }).catch(() => {

        })
    }
    const fetchScheduleDetails = (is_active) => {
        setIsActive(is_active)
        setFetchStatus('loading')
        setScheduleDetails([])
        axiosInstance.get(`/api/v1/schedules/adminIndex?isActive=${is_active}`).then((response) => {
            setScheduleDetails(response.data)
            setFetchStatus('success')
        }).catch(() => {
            setFetchStatus('error')
        })
    }
    const manageScheduleDetails = (e) => {
        e.preventDefault()
        console.log(formData)
        setDialogDetails({
            ...dialogDetails,
            loader: true
        })
        const url = dialogDetails.type == 'post' ? '/api/v1/schedules' : `/api/v1/schedules/${formData.id}`
        let data
        if (dialogDetails.type == 'delete') {
            data = undefined
        }
        else {
            data = {
                "school_id": formData.school_id.value,
                "program_id": formData.program_id.value,
                "days": formData.days.value,
                "start_time": formData.start_time.value,
                "end_time": formData.end_time.value,
                "start_date": formData.start_date.value,
                "end_date": formData.end_date.value,
                "age_group": formData.age_group.value,
                "price": parseFloat(formData.price.value).toFixed(2),
                "teacher_name": formData.teacher_name.value,
                "cost_of_teacher": formData.cost_of_teacher.value,
                "facility_rental": formData.facility_rental.value,
                "total_available": formData.total_available.value
            }
        }
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
            setDialogDetails({
                ...dialogDetails,
                loader: false,
                open: false
            })
            fetchScheduleDetails(isActive)
            clearValues()
        }).catch(() => {
            setDialogDetails({
                ...dialogDetails,
                loader: false,
                open: false
            })
            clearValues()
        })
    }
    const formChange = (e, id = null) => {
        console.log(e)
        setFormData((prevFormData) => {
            if (id) {
                prevFormData[id].value = e.target.value
            }
            else {
                prevFormData[e.target.id].value = e.target.value
            }
            return {
                ...prevFormData,
            }
        })
    }
    const clearValues = () => {
        Object.keys(formData).forEach(key => {
            if (formData[key].value) {
                formData[key].value = ''
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
            console.log(data)
            setFormData((prevFormData) => {
                Object.keys(formData).forEach(e => {
                    if (prevFormData[e].type) {
                        prevFormData[e].value = data[e]
                    }
                })
                prevFormData.id = data.id
                return {
                    ...prevFormData,
                }
            })
        }
    }
    const closeDialog = () => {
        clearValues()
        setDialogDetails({
            ...dialogDetails,
            open: false
        })
    }

    const handleSwitchChange = () => {
        fetchScheduleDetails(!isActive)
    }
    const get_time = (time) => {
        return dayjs.tz(newValue, 'UTC').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
    }
    const get_date = (date) => {
        return
    }
    const scheduleSection = (f) => {
        switch (f) {
            case 'loading':
                return <div className="linearprogress"><LinearProgress variant="indeterminate" /></div>
            case 'error':
                return <p className="text-center">Error occured while fetching data</p>
            case 'success':
                if (scheduleDetails.length > 0) {
                    return <div style={{ maxWidth: 'calc(100vw - 240px - 2rem)' }}>
                        <TableContainer sx={{ width: '95%' }} elevation={3} component={Paper}>
                            <Table sx={{ width: '95%', minWidth: 650, background: 'var(--app-secondary)' }} aria-label="a dense table">
                                <TableHead sx={{ whiteSpace: 'nowrap' }}>
                                    <TableRow
                                        sx={{ 'td,th': { borderBottom: '1px solid var(--primary-color-1)' } }}>
                                        {table_headings.map(h => {
                                            return <TableCell key={h}><p>{h}</p></TableCell>
                                        })}
                                        <TableCell><p>Actions</p></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody sx={{ whiteSpace: 'nowrap' }}>
                                    {scheduleDetails.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            sx={{ 'td,th': { borderBottom: '1px solid var(--primary-color-1)' }, '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            {table_value.map(v => {
                                                return <TableCell key={v}>
                                                    {(!v.endsWith('date') && !v.endsWith('time')) && <span>{formData[v]?.InputProps?.startAdornment && formData[v].InputProps.startAdornment}{row[v]}</span>}
                                                    {v.endsWith('date') && <span>{new Date(row[v]).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>}
                                                    {v.endsWith('time') && <span>{dayjs.tz(row[v], 'UTC').format('h:mm A')}</span>}
                                                </TableCell>
                                            })}
                                            <TableCell>
                                                <Stack className="justify-end" direction="row" spacing={1}>
                                                    {isActive ? <>
                                                        <Button variant="outlined" onClick={() => { openDialog('disable', row) }}>Disable</Button>
                                                        <IconButton onClick={() => { openDialog('put', row) }} aria-label="edit">
                                                            <EditOutlinedIcon />
                                                        </IconButton>
                                                        <IconButton onClick={() => { setupRoster(row) }}>
                                                            <DescriptionIcon />
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
                    </div>
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
                maxWidth='md'
                open={dialogDetails.open}
                TransitionComponent={Transition}
                onClose={closeDialog}
                aria-describedby="alert-dialog-slide-description"
            >
                {dialogDetails.type == 'post' && <DialogTitle>Add School</DialogTitle>}
                {dialogDetails.type == 'put' && <DialogTitle>Edit School</DialogTitle>}
                <DialogContent>
                    {dialogDetails.type == 'post' || dialogDetails.type == 'put' ? <div>
                        <form onSubmit={manageScheduleDetails} className="schedule-form" onChange={formChange}>
                            {
                                Object.keys(formData).map((f) => {
                                    return <div key={f} className="form-div">
                                        {formData[f].type == 'text' && <FormControl fullWidth>
                                            <TextField type={formData[f].formType || 'text'}
                                                id={f}
                                                value={formData[f].value}
                                                autoComplete="off"
                                                label={formData[f].label}
                                                required
                                                variant="outlined"
                                                inputProps={formData[f].inputProps || {}}
                                                InputProps={formData[f].InputProps || {}}
                                            />
                                        </FormControl>}
                                        {formData[f].type == 'select' && <FormControl required fullWidth>
                                            <InputLabel id={f + 'select'}>{formData[f].label}</InputLabel>
                                            <Select
                                                disabled={formData[f].disabled || false}
                                                labelId={f + 'select'}
                                                id={f}
                                                value={formData[f].value}
                                                label={formData[f].label}
                                                onChange={(e) => { formChange(e, f) }}
                                            >
                                                {
                                                    formData[f].options.map((school) => {
                                                        return <MenuItem key={school.value} value={school.value}>{school.option}</MenuItem>
                                                    })
                                                }
                                            </Select>
                                        </FormControl>}
                                        {formData[f].type == 'datepicker' && <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DemoContainer components={['DatePicker']}>
                                                <FormControl fullWidth>
                                                    <DatePicker
                                                        slotProps={{ textField: { required: true } }}
                                                        label={formData[f].label}
                                                        value={formData[f].value ? dayjs(formData[f].value) : null}
                                                        onChange={(newValue) => { formChange({ target: { value: dayjs(newValue).format('YYYY-MM-DD') } }, f) }}
                                                    />
                                                </FormControl>
                                            </DemoContainer>
                                        </LocalizationProvider>}
                                        {formData[f].type == 'timepicker' && <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DemoContainer components={['TimePicker']}>
                                                <FormControl fullWidth>
                                                    <TimePicker
                                                        viewRenderers={{
                                                            hours: renderTimeViewClock,
                                                            minutes: renderTimeViewClock,
                                                        }}
                                                        slotProps={{ textField: { required: true } }}
                                                        label={formData[f].label}
                                                        value={formData[f].value ? dayjs(formData[f].value) : null}
                                                        timezone="UTC"
                                                        onChange={(newValue) => { formChange({ target: { value: dayjs.tz(newValue, 'UTC').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]') } }, f) }}
                                                    />
                                                </FormControl>
                                            </DemoContainer>
                                        </LocalizationProvider>}
                                    </div>
                                })
                            }
                            <div className="flex gap-3 items-center w-full justify-end pr-4">
                                {dialogDetails.loader && <CircularProgress thickness={5} size={32} />}
                                <Button disabled={dialogDetails.loader} type="submit" variant="contained">{dialogDetails.type == 'post' ? 'Add Schedule' : 'Update'}</Button>
                                <Button disabled={dialogDetails.loader} variant="outlined" onClick={closeDialog}>Cancel</Button>
                            </div>
                        </form>
                    </div> :
                        <div>
                            <p className="text-xl">{dialogDetails.type == 'delete' ? "Are you sure you want to delete this schedule ?" : `Are you sure you want to ${dialogDetails.type} this schedule ?`}</p>
                            <div className="pt-8 flex gap-3 items-center justify-end">
                                {dialogDetails.loader && <CircularProgress thickness={5} size={32} />}
                                <Button disabled={dialogDetails.loader} onClick={manageScheduleDetails} variant="contained">Yes</Button>
                                <Button disabled={dialogDetails.loader} variant="outlined" onClick={closeDialog}>Cancel</Button>
                            </div>
                        </div>
                    }
                </DialogContent>
            </Dialog>
            <h2 className="pb-8">Schedules</h2>
            <div className="p-4 pl-6">
                <div className="flex w-full justify-between items-center pb-4">
                    <h5>Available Schedules</h5>
                    <Button onClick={() => { openDialog('post', {}) }} color="primary" variant="contained">Add Schedule</Button>
                </div>
                <div className="text-end">
                    <FormControlLabel sx={{ display: "flex" }} className="justify-end" control={<Switch checked={isActive} onChange={handleSwitchChange} />} label="Active Schedules" />
                </div>
            </div>
            <div className="pt-4">
                {scheduleSection(fetchStatus)}
            </div>
        </section>
    )
}

export default ScheduleAdmin