'use client'

import AddStudentComponent from "@components/addStudent"
import axiosInstance from "@components/axiosInstance"
import { Card, CardContent, LinearProgress } from "@mui/material"
import { Fragment, useEffect, useState } from "react"

const StudentComponent = () => {
    const [studentData, setStudentData] = useState([])
    const [fetchingStatus, setFetchingStatus] = useState('loading')
    useEffect(() => {
        fetchStudentDetails()
    }, [])
    const fetchStudentDetails = () => {
        axiosInstance.get("/api/v1/students?isActive=true").then((response) => {
            setStudentData(response.data)
            setFetchingStatus('success')
        })
    }
    return <section>
        <div className="flex w-full justify-between p-4">
            <h3>Student Information</h3>
            <AddStudentComponent handleOutput={fetchStudentDetails}></AddStudentComponent>
        </div>
        {fetchingStatus == 'loading' && <div className="linearprogress"><LinearProgress variant="indeterminate" /></div>}
        {fetchingStatus == 'success' && <div className="pt-4">
            {studentData.length == 0 ? <p className="text-center text-xl">No records found</p> :
                <div className="flex flex-wrap">
                    {
                        studentData.map(s => {
                            return <div className="w-1/3">
                                <Card className="card mr-6 mt-6">
                                    <CardContent>
                                        <div className="pb-2 flex">
                                            <h5>{s.firstname} {s.lastname}</h5>
                                        </div>
                                        <p><span className="font-bold">Age: </span>{s.age}</p>
                                        <p><span className="font-bold">Grade: </span>{s.grade}</p>
                                        <p><span className="font-bold">Pickup: </span>{s.pickup}</p>
                                        <p><span className="font-bold">Address: </span>{s.address}, {s.city}, {s.state}, {s.zip}</p>
                                    </CardContent>
                                </Card>
                            </div>
                        })
                    }
                </div>
            }
        </div>}
    </section>
}

export default StudentComponent