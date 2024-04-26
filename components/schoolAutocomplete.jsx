"use client"
import { TextField, Autocomplete, FormControl } from "@mui/material"
import axios from 'axios'
import Link from 'next/link'
import { useContext, useEffect, useState } from "react";
import { fetchSchools } from "./commonAPI";
import axiosInstance from "./axiosInstance";
import { UserContext } from "./root";

const SchoolAutoComplete = ({label}) => {
    const [disabelAutoComplete, setDisable] = useState(true)
    const [activeSchools, setActiveSchools] = useState([])
    const [userDetails, setUserDetails] = useContext(UserContext)
    useEffect(() => {
        fetchSchoolnames()
    }, [])
    const fetchSchoolnames = () => {
        const url = userDetails.isLoggedin ? '/api/v1/schools/indexprivate':'/api/v1/schools'
        axiosInstance.get(url).then(response => {
            setActiveSchools(response.data)
            setDisable(false)
        }).catch(() =>{})
    }
    return <Autocomplete
        disabled={disabelAutoComplete}
        autoHighlight
        getOptionLabel={(option) => option.name}
        id="combo-box-demo"
        options={activeSchools}
        sx={{ width: '100%' }}
        renderOption={(props, option) => {
            delete props.key
            return <Link key={props.id} {...props} href={`program/afterschool?id=${option.id}`}>
                <div className="px-4">
                    <p className="text-color-primary-1">{option.name}</p>
                    <p className="text-sm">{option.address}</p>
                </div>
            </Link>
        }}
        renderInput={(params) => <TextField {...params} label={label} />}
    />
}

export default SchoolAutoComplete