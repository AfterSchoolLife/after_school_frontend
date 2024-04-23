'use client'
import { Stepper, Step, StepLabel, Card, CardContent, Button, TextField, InputLabel, FormControl } from "@mui/material"
import { useContext, useLayoutEffect, useState } from "react";
import { lilita } from '@components/themeregistry';
import { useRouter } from "next/navigation";
import { UserContext } from "@components/root";

const steps = ['Parent/Guardian Information', 'Emergency Information', 'Create Password'];
const formData_inital = {
    0: {
        "email": {
            label: "Email ID",
            type: "email",
            value: "",
            // required: true,
            dummy: true,
            error: false
        },
        "parent_1_name": {
            label: "Name",
            type: "text",
            value: "",
            // required: true,
            heading: "Parent / Guardian 1",
            error: false
        },
        "parent_1_relation": {
            label: "Relationship",
            type: "text",
            value: "",
            // required: true,
            error: false
        },
        "parent_1_phone_number": {
            label: "Phone Number",
            type: "text",
            value: "",
            dummy: true,
            // required: true,
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
    const [userDetails, setUserDetails] = useContext(UserContext)
    useLayoutEffect(() => {
        if (userDetails.isLoggedin) router.push('/')
    },[])
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
        Object.keys(formData[activeStep]).forEach(ele => {
            console.log(formData[ele])
            if (formData[activeStep][ele].required) {
                setFormData((prevFormData) => {
                    if (!prevFormData[activeStep][ele].value)
                    {
                        prevFormData[activeStep][ele].error = true
                        formValid = false
                    }
                    else {
                        prevFormData[activeStep][ele].error = false
                    }
                    return {
                        ...prevFormData,
                    }
                })
            }
        })
        if (formValid) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1)
        }
    }

    return (!userDetails.isLoggedin && <section className={`${lilita.variable}`}>
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
                                {activeStep !== 0 ? <Button variant="outlined" onClick={() => { setActiveStep((prevActiveStep) => prevActiveStep - 1) }} color="primary">
                                    Previous
                                </Button> : <div></div>}
                                {/* <Button onClick={() => { setActiveStep((prevActiveStep) => prevActiveStep + 1) }} variant="contained" color="primary" type="submit">
                                    Next
                                </Button> */}
                                <Button variant="contained" color="primary" type="submit">
                                    Next
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </CardContent>
        </Card>
    </section>)
}
export default Register