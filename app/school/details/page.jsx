"use client"
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import axios from 'axios'

const Details = () => {
  const school_id = (useSearchParams().get('id'))
  useEffect(() => {
    fetchSchedules()
  }, [])
  const fetchSchedules = () => {
    axios.get(`http://localhost:4000/api/v1/getSchedules?schoolId=${school_id}`).then((response) => {
      console.log(response.data)
    }).catch(() => {})
  }
  return <h1>Details page</h1>
}

export default Details