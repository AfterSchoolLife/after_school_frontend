'use client'

import AddStudentComponent from "@components/addStudent"
import axiosInstance from "@components/axiosInstance"
import { UserContext } from "@components/root"
import { Card, CardContent, LinearProgress } from "@mui/material"
import { Fragment, useContext, useEffect, useState } from "react"

const StudentComponent = () => {
    const [studentData, setStudentData] = useState([])
    const [fetchingStatus, setFetchingStatus] = useState('loading')
    const [userDetails, setUserDetails] = useContext(UserContext)

    useEffect(() => {
        fetchStudentDetails()
    }, [])

    const fetchStudentDetails = () => {
        axiosInstance.get("/api/v1/students?isActive=true").then((response) => {
            setStudentData(response.data)
            setUserDetails((prevData) => {
                return {
                    ...prevData,
                    student: response.data
                }
            })
            setFetchingStatus('success')
        })
    }

    return (
        <section className="p-4">
            <div className="flex flex-wrap w-full justify-between p-4">
                <h3 className="text-xl md:text-2xl font-semibold">Student Information</h3>
                <AddStudentComponent handleOutput={fetchStudentDetails} />
            </div>
            {fetchingStatus === 'loading' && (
                <div className="linearprogress">
                    <LinearProgress variant="indeterminate" />
                </div>
            )}
            {fetchingStatus === 'success' && (
                <div className="pt-4">
                    {studentData.length === 0 ? (
                        <p className="text-center text-xl">No records found</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {studentData.map((s) => {
                                return (
                                    <div key={s.id} className="w-full">
                                        <Card className="card mx-auto mb-6 p-4 w-full">
                                            <CardContent>
                                                <div className="pb-2 flex">
                                                    <h5 className="text-lg sm:text-xl font-bold">{s.firstname} {s.lastname}</h5>
                                                </div>
                                                <p><span className="font-bold">Age: </span>{s.age}</p>
                                                <p><span className="font-bold">Grade: </span>{s.grade}</p>
                                                <p><span className="font-bold">Pickup: </span>{s.pickup}</p>
                                                <p><span className="font-bold">Address: </span>{s.address}, {s.city}, {s.state}, {s.zip}</p>
                                            </CardContent>
                                        </Card>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            )}
        </section>
    )
}

export default StudentComponent;
