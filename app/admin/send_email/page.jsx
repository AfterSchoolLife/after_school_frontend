'use client'
import axiosInstance from "@components/axiosInstance";
import { lilita } from "@components/themeregistry";
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useEffect, useState } from "react";

const SendEmailComponent = () => {
    const [disableSelect, setDisableSelect] = useState(true)
    const [scheduleDetails, setScheduleDetails] = useState([])
    const [schoolDetails, setSchoolDetails] = useState([])
    const [emailBody, setEmailBody] = useState('')
    const [formData, SetFormData] = useState({
        school_id: '',
        schedule_id: '',
    })
    const [emailIds, setStudentDetails] = useState([])
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
        if (type == 'schedule_id') {
            fetchPurchaseHistory()
        }
    }
    const fetchPurchaseHistory = () => {
        axiosInstance.get(`/api/v1/purchaseds/getStudentInfoSchedule/${formData.schedule_id}`).then((scheduleInfo) => {
            setStudentDetails(scheduleInfo.data.map(d => d.user.email))
        })
    }
    const sendEmail = (e) => {
        e.preventDefault()
        const post_body = {}
        post_body['body'] = emailBody
        post_body['emailids'] = ['shanephear.jc@gmail.com']
        axiosInstance.post('/api/v1/schedules/sendEmail',{email:post_body}).then((response) => {
            console.log(response.data)
        }).catch(() => {})
    }
    return <section className={lilita.variable}>
        <h2>Send Notification</h2>
        <div className="pt-4">
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
        </div>
        {emailIds.length ? <><div className="p-4">
            <p className="text-3xl pb-4">Emails will be sent to</p>
            <p>{emailIds.join(',')}</p>
        </div>
            <div className="p-4 pl-0">
                <form onSubmit={sendEmail}>
                    <TextField
                        required
                        onChange={(e) => {setEmailBody(e.target.value)}}
                        autoComplete="off"
                        id="email-body-id"
                        name="email-body"
                        multiline
                        rows={8}
                        type="text"
                        value={emailBody}
                        fullWidth
                    />
                    <div className="text-end pt-4">
                        <Button type="submit" variant="contained">Send Notification</Button>
                    </div>
                </form>
            </div>
        </> : <></>
        }

    </section >
}

export default SendEmailComponent;