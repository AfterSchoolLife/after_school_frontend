'use client'
import axiosInstance from "@components/axiosInstance";
import { lilita } from "@components/themeregistry";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";

const SendEmailComponent = () => {
    const [disableSelect, setDisableSelect] = useState(true)
    const [scheduleDetails, setScheduleDetails] = useState([])
    const [schoolDetails, setSchoolDetails] = useState([])
    const [productDetails, setProductDetails] = useState([])
    const [fetchStatus, setFetchStatus] = useState('none')
    const [formData, SetFormData] = useState({
        school_id: '',
        schedule_id: '',
    })
    const [studentDetails, setStudentDetails] = useState([])
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
            // setFetchStatus('loading')
            // fetchPurchaseHistory(type)
        }
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
    </section>
}

export default SendEmailComponent;