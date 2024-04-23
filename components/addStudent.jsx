'use client'
import { Button, CircularProgress, Dialog, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, Slide, TextField } from "@mui/material";
import { forwardRef, useState } from "react";
import axiosInstance from "./axiosInstance";
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
    "age": {
        label: "Age",
        type: 'text',
        formType: 'number',
        value: '',
        error: false
    },
    "grade": {
        label: "Select Grade",
        type: "select",
        value: '',
        error: false,
        disabled: false,
        options: ["PreK", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"]
    },
    "pickup": {
        label: "Select Pickup Location",
        type: "select",
        value: '',
        error: false,
        disabled: false,
        options: ['Parent Will Pickup', 'XC - Extended Class Drop Off']
    },
    "address": {
        label: "Address",
        type: 'text',
        value: "",
        error: false
    },
    "city": {
        label: "City",
        type: 'text',
        value: "",
        error: false
    },
    "state": {
        label: "State",
        type: 'text',
        value: "",
        error: false
    },
    "zip": {
        label: "Zip",
        type: 'text',
        value: "",
        error: false
    },
}
const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const AddStudentComponent = ({handleOutput}) => {
    const [dialogDetails, setDialogDetails] = useState({
        open: false,
        loader: false,
        type: 'post'
    })
    const [formData, setFormData] = useState(formData_inital)
    const clearValues = () => {
        Object.keys(formData).forEach(key => {
            if (formData[key].value) {
                formData[key].value = ''
            }
        })
    }
    const openDialog = (type) => {
        setDialogDetails((prevData) => {
            return {
                ...prevData,
                open: true,
                type
            }
        })
    }
    const closeDialog = () => {
        clearValues()
        setDialogDetails({
            loader: false,
            open: false,
            type: ''
        })
    }
    const formChange = (e, id = null) => {
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
    const addStudent = (e) => {
        e.preventDefault()
        setDialogDetails((prevData) => {
            return {
                ...prevData,
                loader: true
            }
        })
        let data = {}
        Object.keys(formData).forEach(key => {
            data[key] = formData[key].value
        })
        axiosInstance.post('/api/v1/students', data).then(() => {
            handleOutput()
            closeDialog()
        }).catch(() => {
            closeDialog()
        })
    }
    return <div className="text-right">
        <Button onClick={() => { openDialog('post') }} variant="contained">Add Student</Button>
        <Dialog
            disableEscapeKeyDown
            fullWidth
            maxWidth='md'
            open={dialogDetails.open}
            TransitionComponent={Transition}
            onClose={closeDialog}
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle>Add Student</DialogTitle>
            <DialogContent>
                {dialogDetails.type == 'post' ? <div>
                    <form onSubmit={addStudent} onChange={formChange} className="student-form">
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
                                                formData[f].options.map((v) => {
                                                    return <MenuItem key={v} value={v}>{v}</MenuItem>
                                                })
                                            }
                                        </Select>
                                    </FormControl>}
                                </div>
                            })
                        }
                        <div className="flex gap-3 items-center w-full justify-end pr-4">
                            {dialogDetails.loader && <CircularProgress thickness={5} size={32} />}
                            <Button disabled={dialogDetails.loader} type="submit" variant="contained">Add Student</Button>
                            <Button disabled={dialogDetails.loader} variant="outlined" onClick={closeDialog}>Cancel</Button>
                        </div>
                    </form>
                </div> :
                    <div>
                        <p className="text-xl">{dialogDetails.type == 'delete' ? "Are you sure you want to delete this schedule ?" : `Are you sure you want to ${dialogDetails.type} this schedule ?`}</p>
                        <div className="pt-8 flex gap-3 items-center justify-end">
                            {dialogDetails.loader && <CircularProgress thickness={5} size={32} />}
                            <Button disabled={dialogDetails.loader} variant="contained">Yes</Button>
                            <Button disabled={dialogDetails.loader} variant="outlined" onClick={closeDialog}>Cancel</Button>
                        </div>
                    </div>
                }
            </DialogContent>
        </Dialog>
    </div>
}

export default AddStudentComponent;