"use client"
import { useRouter, useSearchParams } from 'next/navigation'
import { Fragment, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { lilita } from '@components/themeregistry'
import { fetchSchools } from '@components/commonAPI'
import { Button, Card, CardContent, CardMedia, Chip, FormControl, IconButton, InputLabel, LinearProgress, MenuItem, Select, Snackbar } from '@mui/material'
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import dayjs from 'dayjs'
import { UserContext } from '@components/root'
import axiosInstance from '@components/axiosInstance'
import Link from 'next/link'
dayjs.extend(utc);
dayjs.extend(timezone);

const week_days = [{ value: "Monday", display: 'M' }, { value: "Tuesday", display: 'T' }, { value: "Wednesday", display: 'W' }, { value: 'Thursday', display: 'T' }, { value: 'Friday', display: 'F' }]
const AfterSchoolPage = () => {
  const router = useRouter()
  const [school_id, setSchoolId] = useState(useSearchParams().get('id'))
  const [scheduleData, setScheduleData] = useState([])
  const [schoolDetail, setSchoolDetail] = useState(null)
  const [fetchingData, setFetchingData] = useState('loading')
  const [selectData, setSelectData] = useState([])
  const [studentSelectData, setStudentSelectData] = useState({})
  const [userDetails, setUserDetails] = useContext(UserContext)
  const [snackBarData, setSnackBarData] = useState({ open: false, msg: '' })
  const closeSnackbar = () => {
    setSnackBarData({ open: false, msg: '' })
  }

  useEffect(() => {
    fetchSchoolsData()
  }, [])
  const fetchSchedules = (id = null) => {
    const fetchId = id ? id : school_id
    if (fetchId) {
      setSchoolId(fetchId)
    }
    const url = userDetails.isLoggedin ? '/api/v1/schedules/indexprivate' : '/api/v1/schedules'
    axiosInstance.get(`${url}?schoolId=${fetchId}`).then((response) => {
      const set_data = {}
      response.data.forEach(v => {
        set_data[v.id] = ''
      })
      setStudentSelectData(set_data)
      setScheduleData(response.data)
      setFetchingData('success')
    }).catch(() => { })
  }
  const fetchSchoolsData = (id = null) => {
    fetchSchools().then(response => {
      setSelectData(response.data)
      const school_data = response.data.filter(r => r.id == (id || school_id))
      if (school_data.length) {
        setSchoolDetail(school_data[0])
        fetchSchedules(id)
      }
    })
  }
  const addToCart = (e, id) => {
    e.preventDefault()
    if (!userDetails.isLoggedin) {
      router.push('/auth/login')
    }
    else {
      const sc = scheduleData.filter(schedule => schedule.id == id)
      if (sc[0].currently_available == 0) {
        axiosInstance.post('/api/v1/waitlists', {
          "schedule_id": id,
          student_id: studentSelectData[id]
        }).then(() => {
          setSnackBarData({ open: true, msg: 'Added to Waitlist' })
        }).catch((e) => {
          if (e.response.data.errors &&e.response.data.errors.length && 
            e.response.data.errors[0] == "Schedule User is already on the waitlist for this schedule") {
              setSnackBarData({ open: true, msg: "Student already present in waitlist" })
          }
          else {
            setSnackBarData({ open: true, msg: e.response.data.errors[0] })
          }
        })
      }
      else {
        axiosInstance.post('/api/v1/carts', {
          "schedule_id": id,
          "student_id": studentSelectData[id]
        }).then((response) => {
          setUserDetails((prevData) => {
            prevData.cart.data.push(response.data)
            return {
              ...prevData,
            }
          })
          setSnackBarData({ open: true, msg: 'Added to Cart' })
        }).catch((e) => {
          if (e.response.data.error && e.response.data.error == "Student combination must be unique") {
            setSnackBarData({ open: true, msg: 'Program Already Present in Cart' })
          }
          else {
            setSnackBarData({ open: true, msg: 'Error adding to Cart' })
          }
        })
      }
    }
  }
  const formChange = (e, id) => {
    if (e.target.value == 'add_student') {
      router.push('/profile/students')
    }
    else {
      setStudentSelectData((prevData) => {
        prevData[id] = e.target.value
        return {
          ...prevData
        }
      })
    }
  }
  return <section className={`p-12 ${lilita.variable}`}>
    <Snackbar
      open={snackBarData.open}
      autoHideDuration={3000}
      onClose={closeSnackbar}
      message={snackBarData.msg}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    />
    {
      fetchingData == 'loading' ? <div className="linearprogress"><LinearProgress variant="indeterminate" /></div> : <Fragment>
        <h1 className='pb-2 text-center'>{schoolDetail.name}</h1>
        <p className='pb-4 text-xl text-center'>{schoolDetail.address}</p>
        <FormControl>
          <InputLabel id="school-label">Select School</InputLabel>
          <Select
            labelId="school-label"
            id="school-select"
            value={school_id}
            label="Select School"
            onChange={(e) => { fetchSchoolsData(e.target.value) }}
          >
            {
              selectData.map((school) => {
                return <MenuItem key={school.id} value={school.id}>{school.name}</MenuItem>
              })
            }
          </Select>
        </FormControl>
        <div style={{ maxWidth: '1100px', margin: 'auto' }} className='pt-8'>
          {scheduleData.length ? <>{scheduleData.map(schedule => {
            return <Card sx={{ width: '100%', marginLeft: 'auto', marginRight: 'auto' }} className="card mb-6" key={schedule.id}>
              <form onSubmit={(e) => { addToCart(e, schedule.id) }}>
                <div className='p-4'>
                  <div className='flex gap-4'>
                    {schedule.program_image_url ? <CardMedia
                      sx={{ width: 220, height: 123.75, borderRadius: 26, backgroundColor: "var(--secondary-background)", backgroundPosition: 'center', backgroundSize: 'contain' }}
                      image={schedule.program_image_url}
                      title="green iguana"
                    /> : <div style={{ borderRadius: 26, width: 220, height: 123.75, backgroundColor: "var(--secondary-background)" }}></div>}

                    <CardContent sx={{ width: 'calc(100% - 220px - 1rem)' }} className='program-card'>
                      <div className='flex justify-between items-center pb-3'>
                        <div>
                          <h4 className='pb-1'>{schedule.program_name}</h4>
                          <Chip className='program-chip' label={schedule.age_group} variant="outlined" />
                        </div>
                        {userDetails.isLoggedin && <FormControl sx={{ minWidth: 220 }} required>
                          <InputLabel id={String(schedule.id) + 'select'}>Select Student</InputLabel>
                          <Select
                            id={String(schedule.id)}
                            value={studentSelectData[schedule.id]}
                            labelId={String(schedule.id) + 'select'}
                            label="Select Student"
                            onChange={(e) => { formChange(e, schedule.id) }}
                          >
                            <MenuItem className='text-color-primary-1' value='add_student'>
                              Add Student...
                            </MenuItem>
                            {
                              userDetails.student.map((student) => {
                                return <MenuItem key={student.id} value={student.id}>{student.firstname} {student.lastname}</MenuItem>
                              })
                            }
                          </Select>
                        </FormControl>}
                      </div>
                      <p>{schedule.program_description}</p>
                      <div className='flex items-center justify-between w-full pt-4'>
                      <div className="flex gap-2">
                        {console.log(schedule.days)}
                        {week_days.map((week) => {
                          // Check if the current week.value is included in the schedule.days array
                          const isIncluded = Array.isArray(schedule.days) && schedule.days.includes(week.value);

                          return (
                            <div
                              style={{
                                borderRadius: 8,
                                border: `${isIncluded ? '3px solid var(--primary-color-1)' : '1px solid'}`,
                              }}
                              className="program-week"
                              key={week.value}
                            >
                              {week.display}
                            </div>
                          );
                        })}
                      </div>
                        <p className='text-color-primary-1'><CalendarTodayIcon fontSize='small' className='pr-1'></CalendarTodayIcon>{new Date(schedule.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - {new Date(schedule.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                        <p className='text-color-primary-1'><AccessTimeIcon fontSize='small' className='pr-1'></AccessTimeIcon>{dayjs.tz(schedule.start_time, 'UTC').format('h:mm A')} - {dayjs.tz(schedule.end_time, 'UTC').format('h:mm A')}</p>
                      </div>
                      <div className='text-end pt-4 flex justify-between gap-4 items-center'>
                        <p className='font-bold'>Available Slots: {schedule.currently_available}</p>
                        <div className='flex items-center gap-4'>
                          <p className='text-3xl text-color-primary-3'>${schedule.price}</p>
                          <Button type='submit' variant='contained'>{schedule.currently_available == 0 ? 'Add to Waitlist' : 'Add to Cart'}</Button>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </div>
              </form>
            </Card>
          })}</> : <p className='text-2xl text-center pt-4'>No Active Programs found for this school</p>}
        </div>
      </Fragment>
    }

  </section>
}

export default AfterSchoolPage