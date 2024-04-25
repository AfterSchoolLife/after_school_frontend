'use client'
import { Stepper, Step, StepLabel, Card, CardContent, Button, TextField, InputLabel, FormControl, Snackbar, CircularProgress } from "@mui/material"
import { useContext, useLayoutEffect, useState } from "react";
import { lilita } from '@components/themeregistry';
import { useRouter } from "next/navigation";
import { UserContext } from "@components/root";
import axiosInstance from "@components/axiosInstance";

const steps = ['Parent/Guardian Information', 'Emergency Information', 'Create Password'];
const formData_inital = {
    0: {
        "email": {
            label: "Email ID",
            type: "email",
            value: "",
            required: true,
            error: false,
            dummy: true
        },
        "parent_1_name": {
            label: "Name",
            type: "text",
            value: "",
            required: true,
            heading: "Parent / Guardian 1",
            error: false
        },
        "parent_1_relation": {
            label: "Relationship",
            type: "text",
            value: "",
            required: true,
            error: false
        },
        "parent_1_phone_number": {
            label: "Phone Number",
            type: "text",
            value: "",
            dummy: true,
            required: true,
            inputProps: { pattern: "[0-9]{10}", minLength: 10, maxLength: 10 },
            error: false
        },
        "parent_2_name": {
            label: "Name",
            type: "text",
            value: "",
            heading: "Parent / Guardian 2",
            error: false
        },
        "parent_2_relation": {
            label: "Relationship",
            type: "text",
            value: "",
            error: false
        },
        "parent_2_phone_number": {
            label: "Phone Number",
            type: "text",
            value: "",
            error: false
        }
    },
    1: {
        "emergency_1_name":
        {
            label: "Name",
            heading: "Primary Contact",
            type: "text",
            value: "",
            required: true,
            error: false
        },
        "emergency_1_relation":
        {
            label: "Relationship to Child",
            type: "text",
            value: "",
            required: true,
            error: false
        },
        "emergency_1_phone_number":
        {
            label: "Phone Number",
            type: "text",
            value: "",
            required: true,
            dummy: true,
            error: false
        },
        "emergency_2_name":
        {
            label: "Name",
            heading: "Secondary Contact",
            type: "text",
            value: "",
            error: false
        },
        "emergency_2_relation":
        {
            label: "Relationship to Child",
            type: "text",
            value: "",
            error: false
        },
        "emergency_2_phone_number":
        {
            label: "Phone Number",
            type: "text",
            value: "",
            error: false
        },
    },
    2: {
        "password": {
            label: "Password",
            type: "password",
            value: "",
            required: true,
            error: false
        },
        "confirm_password": {
            label: "Confirm Password",
            type: "password",
            value: "",
            required: true,
            error: false
        }
    }
}
const Register = () => {
    const router = useRouter()
    const [snackBarData, setSnackBarData] = useState({ open: false, msg: '' })
    const [creating, setCreating] = useState(false)
    const closeSnackbar = () => {
        setSnackBarData({ open: false, msg: '' })
    }
    const [activeStep, setActiveStep] = useState(0);
    const [skipped, setSkipped] = useState(new Set());
    const [formData, setFormData] = useState(formData_inital)
    const formChange = (e) => {
        setFormData((prevFormData) => {
            const append_Data = {}
            prevFormData[activeStep][e.target.id].value = e.target.value
            return {
                ...prevFormData,
            }
        })
    }

    const checkFormValidity = (e) => {
        e.preventDefault()
        let formValid = true
        const setData = {
            ...formData
        }
        Object.keys(setData[activeStep]).forEach(ele => {
            if (setData[activeStep][ele].required) {
                if (!setData[activeStep][ele].value) {
                    setData[activeStep][ele].error = true
                    formValid = false
                }
                else {
                    setData[activeStep][ele].error = false
                }
            }
        })
        setFormData((prevFormData) => {
            return {
                ...prevFormData,
                ...setData
            }
        })
        if (formValid) {
            if (activeStep == 2) {
                setCreating(true)
                const post_data = {}
                let steps = [0, 1, 2]
                steps.forEach((step) => {
                    Object.keys(formData[step]).forEach(key => {
                        post_data[key] = formData[step][key].value
                    })
                })
                axiosInstance.post('/api/v1/auth/signup', { user: post_data }).then(() => {
                    setCreating(false)
                    router.push('/auth/login')
                }).catch((e) => {
                    setCreating(false)
                    setSnackBarData({ open: true, msg: e.response.data.status.message })
                })
            }
            else {
                setActiveStep((prevActiveStep) => prevActiveStep + 1)
            }
        }
        else {
            setSnackBarData({ open: true, msg: 'The form is invalid' })
        }
    }

    return <section className={`${lilita.variable}`}>
        <Snackbar
            open={snackBarData.open}
            autoHideDuration={3000}
            onClose={closeSnackbar}
            message={snackBarData.msg}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />
        <Card className="card auth-register-card">
            <CardContent>
                <div>
                    <Stepper activeStep={activeStep}>
                        {steps.map((label, index) => {
                            const stepProps = {};
                            return (<Step key={label}>
                                <StepLabel><h5>{label}</h5></StepLabel>
                            </Step>)
                        })}
                    </Stepper>
                    <div>
                        <form onSubmit={checkFormValidity} onChange={formChange}>
                            <div className="auth-register-form">
                                {Object.entries(formData[activeStep]).map((f_data) => {
                                    return (
                                        <div key={f_data[0]} className={`pb-2 ${f_data[1].dummy ? 'w-full' : 'form-div'}`}>
                                            {f_data[1].heading && <p className="text-xl font-bold pb-3">{f_data[1].heading}</p>}
                                            <p>
                                                <InputLabel required={f_data[1].required || false} className="pb-1" htmlFor={f_data[0]}>
                                                    {f_data[1].label}
                                                </InputLabel>
                                            </p>
                                            <TextField
                                                error={f_data[1].error}
                                                autoComplete="off"
                                                inputProps={f_data[1].inputProps ? f_data[1].inputProps : {}}
                                                id={f_data[0]}
                                                name={f_data[0]}
                                                type={f_data[1].type}
                                                value={f_data[1].value}
                                                className={f_data[1].dummy && 'form-div'}
                                                fullWidth={!f_data[1].dummy}
                                            />
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="flex justify-between pt-4">
                                {activeStep !== 0 ? <Button variant="outlined" disabled={creating} onClick={() => { setActiveStep((prevActiveStep) => prevActiveStep - 1) }} color="primary">
                                    Previous
                                </Button> : <div></div>}
                                <div className="flex items-center gap-3">
                                    {creating && <CircularProgress thickness={5} size={32} />}
                                    <Button disabled={creating} variant="contained" color="primary" type="submit">
                                        Next
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </CardContent>
        </Card>
    </section>
}
export default Register