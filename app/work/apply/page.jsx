'use client'
import axiosInstance from "@components/axiosInstance"
import { lilita } from "@components/themeregistry"
import { Button, Card, CardContent, InputLabel, Snackbar, TextField } from "@mui/material"
import { useState } from "react"

const formData_inital = {
    "firstname": {
        label: "Firstname",
        type: 'text',
        value: "",
        error: false
    },
    "lastname": {
        label: "Lastname",
        type: 'text',
        value: "",
        error: false
    },
    "email": {
        label: "Email ID",
        type: "email",
        value: "",
        error: false
    },
    "phonenumber": {
        label: "Phone Number",
        type: "text",
        value: "",
        inputProps: { pattern: "[0-9]{10}", minLength: 10, maxLength: 10 },
        error: false
    },
    "skills": {
        label: "Describe your Skills",
        type: 'textarea',
        rows: 2,
        value: "",
        error: false
    },
    "about": {
        label: "About Yourself",
        type: 'textarea',
        value: "",
        rows: 10,
        error: false
    }

}

const ApplyComponent = () => {
    const [formData, setFormData] = useState(formData_inital)
    const [submitDisabled, setDisabled] = useState(false)
    const [snackBarData, setSnackBarData] = useState({ open: false, msg: '' })
    const closeSnackbar = () => {
        setSnackBarData({ open: false, msg: '' })
    }
    const formChange = (e) => {
        setFormData((prevFormData) => {
            prevFormData[e.target.id].value = e.target.value
            return {
                ...prevFormData,
            }
        })
    }
    const applyJob = (e) => {
        e.preventDefault()
        setDisabled(true)
        const data = {}
        Object.keys(formData).forEach(key => {
            data[key] = formData[key].value
        })
        axiosInstance.post('/api/v1/candidates',data).then(() => {
            setSnackBarData({open: true, msg: 'Your Profile has been sent for review'})
            setDisabled(false)
            clearForm()
        }).catch(() => {
            setSnackBarData({open: true, msg: 'Some Error occured creating your profile'})
            setDisabled(false)
        })
    }
    const clearForm = () => {
        setFormData((prevFormData) => {
            Object.keys(prevFormData).forEach(key => {
                prevFormData[key].value = ''
            })
            return {
                ...prevFormData
            }
        })
    }
    return <section className={`${lilita.variable}`}>
        <Snackbar
            open={snackBarData.open}
            autoHideDuration={3000}
            onClose={closeSnackbar}
            message={snackBarData.msg}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />
        <Card className="card work-register-card">
            <CardContent>
                <h2 className="pb-4">Candidate Profile</h2>
                <form onSubmit={applyJob} onChange={formChange}>
                    {Object.keys(formData).map(f => {
                        return <div key={f} className="pb-4 w-full">
                            <p>
                                <InputLabel required sx={{ paddingBottom: '0.5rem', color: 'var(--primary-text-color)' }} htmlFor={f}>
                                    {formData[f].label}
                                </InputLabel>
                            </p>
                            {formData[f].type == 'textarea' ? <TextField
                                error={formData[f].error}
                                autoComplete="off"
                                inputProps={formData[f].inputProps ? formData[f].inputProps : {}}
                                id={f}
                                name={f}
                                multiline
                                rows={formData[f].rows}
                                type="text"
                                value={formData[f].value}
                                fullWidth
                            /> : <TextField
                                error={formData[f].error}
                                autoComplete="off"
                                inputProps={formData[f].inputProps ? formData[f].inputProps : {}}
                                id={f}
                                name={f}
                                type={formData[f].type}
                                value={formData[f].value}
                                fullWidth
                            />}
                        </div>
                    })}
                    <div className="text-center">
                        <Button disabled={submitDisabled} variant="contained" type="submit"><p className="text-xl">Submit</p></Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    </section>
}

export default ApplyComponent