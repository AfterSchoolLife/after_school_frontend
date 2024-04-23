"use client"
import { TextField, Autocomplete, FormControl } from "@mui/material"
import axios from 'axios'
import Link from 'next/link'
import { useEffect, useState } from "react";
import { fetchSchools } from "./commonAPI";

const SchoolAutoComplete = ({label}) => {
    const [disabelAutoComplete, setDisable] = useState(true)
    const [activeSchools, setActiveSchools] = useState([])
    useEffect(() => {
        fetchSchoolnames()
    }, [])
    const fetchSchoolnames = () => {
        fetchSchools().then(response => {
            setActiveSchools(response.data)
            setDisable(false)
        })
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