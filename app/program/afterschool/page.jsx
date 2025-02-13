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

  // Helper function to add correct ordinal suffix (st, nd, rd, th)
  const getOrdinalSuffix = (number) => {
    const lastDigit = number % 10;
    const lastTwoDigits = number % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
      return `${number}th`; // Handle special cases for 11th, 12th, and 13th
    }

    switch (lastDigit) {
      case 1:
        return `${number}st`;
      case 2:
        return `${number}nd`;
      case 3:
        return `${number}rd`;
      default:
        return `${number}th`;
    }
  };

  // Helper function to format age group
  const formatAgeGroup = (ageGroup) => {
    // Split the age group into an array
    const ageRange = ageGroup.split('-');

    // Check if the age group is in the expected format
    if (ageRange.length === 2) {
      const startGrade = getOrdinalSuffix(parseInt(ageRange[0], 10));
      const endGrade = getOrdinalSuffix(parseInt(ageRange[1], 10));

      // Return the formatted age group
      return `Grade: ${startGrade}-${endGrade} grade`;
    }

    // Default to just returning the original age group if format is unexpected
    return ageGroup;
  };

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
            return <Card
            sx={{
              width: { xs: '100%', sm: '90%', md: '80%' },
              margin: 'auto',
              mb: 6,
            }}
            className="card"
            key={schedule.id}
          >
            <form onSubmit={(e) => addToCart(e, schedule.id)}>
              <div className="p-4">
                <div className="flex flex-wrap gap-4">
                  {schedule.program_image_url ? (
                    <CardMedia
                      sx={{
                        width: { xs: '100%', sm: 220 },
                        height: { xs: 'auto', sm: 123.75 },
                        minHeight: { xs: 120, sm: 123.75 }, // Ensures the image remains visible at small sizes
                        borderRadius: 2,
                        backgroundColor: 'var(--secondary-background)',
                        backgroundPosition: 'center',
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat', // Prevents tiling of the image
                      }}
                      image={schedule.program_image_url}
                      title="Program Image"
                    />
                  ) : (
                    <div
                      style={{
                        borderRadius: 26,
                        width: { xs: '100%', sm: 220 },
                        height: { xs: 'auto', sm: 123.75 },
                        backgroundColor: 'var(--secondary-background)',
                      }}
                    />
                  )}
          
                  <CardContent
                    sx={{
                      width: { xs: '100%', sm: 'calc(100% - 240px)' },
                      mt: { xs: 2, sm: 0 },
                    }}
                    className="program-card"
                  >
                    <div className="flex justify-between items-center pb-3 flex-wrap">
                      <div>
                        <h4 className="pb-1">{schedule.program_name}</h4>
                        <Chip
                          className="program-chip"
                          label={formatAgeGroup(schedule.age_group)}
                          variant="outlined"
                        />
                      </div>
                      {userDetails.isLoggedin && (
                        <FormControl sx={{ minWidth: 220, mt: { xs: 2, sm: 0 } }} required>
                          <InputLabel id={`${schedule.id}select`}>Select Student</InputLabel>
                          <Select
                            id={String(schedule.id)}
                            value={studentSelectData[schedule.id]}
                            labelId={`${schedule.id}select`}
                            label="Select Student"
                            onChange={(e) => formChange(e, schedule.id)}
                          >
                            <MenuItem className="text-color-primary-1" value="add_student">
                              Add Student...
                            </MenuItem>
                            {userDetails.student.map((student) => (
                              <MenuItem key={student.id} value={student.id}>
                                {student.firstname} {student.lastname}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    </div>
                    <p>{schedule.program_description}</p>
                    <div className="flex items-center justify-between w-full pt-4 flex-wrap gap-2">
                      <div className="flex gap-2">
                        {week_days.map((week) => {
                          const isIncluded = Array.isArray(schedule.days) && schedule.days.includes(week.value);
                          return (
                            <div
                              style={{
                                borderRadius: 8,
                                border: isIncluded ? '3px solid var(--primary-color-1)' : '1px solid',
                              }}
                              className="program-week"
                              key={week.value}
                            >
                              {week.display}
                            </div>
                          );
                        })}
                      </div>
                      <p className="text-color-primary-1 flex items-center">
                        <CalendarTodayIcon fontSize="small" className="pr-1" />
                        {new Date(schedule.start_date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                        {' - '}
                        {new Date(schedule.end_date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                      <p className="text-color-primary-1 flex items-center">
                        <AccessTimeIcon fontSize="small" className="pr-1" />
                        {dayjs.tz(schedule.start_time, 'UTC').format('h:mm A')} - {dayjs.tz(schedule.end_time, 'UTC').format('h:mm A')}
                      </p>
                    </div>
                    {schedule.no_class_dates.length > 0 && (
                      <div className="mt-3">
                        <p className="font-bold">No classes will be held on:</p>
                        <ul className="list-unstyled">
                          {schedule.no_class_dates.map((date) => (
                            <li key={date}>
                              <span className="text-sm text-danger">
                                {new Date(date).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="flex justify-between gap-4 items-center pt-4 flex-wrap">
                      <p className="font-bold">Available Slots: {schedule.currently_available}</p>
                      <div className="flex items-center gap-4">
                        <p className="text-3xl text-color-primary-3">${schedule.price}</p>
                        <Button type="submit" variant="contained">
                          {schedule.currently_available === 0 ? 'Add to Waitlist' : 'Add to Cart'}
                        </Button>
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