"use client"
import { useRouter, useSearchParams } from 'next/navigation'
import { Fragment, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { lilita } from '@components/themeregistry'
import { fetchSchools } from '@components/commonAPI'
import { Button, Card, CardContent, Chip, FormControl, IconButton, InputLabel, LinearProgress, MenuItem, Select } from '@mui/material'
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import dayjs from 'dayjs'
import { UserContext } from '@components/root'
import axiosInstance from '@components/axiosInstance'
dayjs.extend(utc);
dayjs.extend(timezone);

const week_days = [{ value: "Monday", display: 'M' }, { value: "Tuesday", display: 'T' }, { value: "Wednesday", display: 'W' }, { value: 'Thursday', display: 'T' }, { value: 'Friday', display: 'F' }]
const AfterSchoolPage = () => {
  const [school_id,setSchoolId] = useState(useSearchParams().get('id'))
  const [scheduleData, setScheduleData] = useState({})
  const [schoolDetail, setSchoolDetail] = useState(null)
  const [fetchingData, setFetchingData] = useState('loading')
  const [selectData, setSelectData] = useState([])
  const [userDetails, setUserDetails] = useContext(UserContext)

  useEffect(() => {
    fetchSchoolsData()
  }, [])
  const fetchSchedules = (id=null) => {
    const fetchId = id ? id :school_id
    if (fetchId)
    {
      setSchoolId(fetchId)
    }
    axios.get(`http://localhost:4000/api/v1/getSchedules?schoolId=${fetchId}`).then((response) => {
      setScheduleData(response.data)
      setFetchingData('success')
    }).catch(() => { })
  }
  const fetchSchoolsData = (id=null) => {
    fetchSchools().then(response => {
      setSelectData(response.data)
      const school_data = response.data.filter(r => r.id == school_id)
      if (school_data.length) {
        setSchoolDetail(school_data[0])
        fetchSchedules(id)
      }
    })
  }
  const addToCart = (id) => {
        axiosInstance.post('/api/v1/carts', {
            "quantity": 1,
            "schedule_id": id
        }).then((response) => {
            setUserDetails((prevData) => {
                prevData.cart.data.push(response.data)
                return {
                    ...prevData,
                }
            })
            console.log(response)
        }).catch(() => {
        })
    }
  return <section className={`p-12 ${lilita.variable}`}>
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
            onChange={(e) => {fetchSchoolsData(e.target.value)}}
          >
            {
              selectData.map((school) => {
                return <MenuItem key={school.id} value={school.id}>{school.name}</MenuItem>
              })
            }
          </Select>
        </FormControl>
        <div style={{ maxWidth: '1100px', margin: 'auto' }} className='pt-8'>
          {scheduleData.map(schedule => {
            return <Card sx={{ width: '100%', marginLeft: 'auto', marginRight: 'auto' }} className="card mb-6" key={schedule.id}>
              <div className='p-4'>
                <div className='flex gap-4'>
                  {schedule.image_url ? <CardMedia
                    sx={{ width: 220, height: 123.75, borderRadius: 26, backgroundColor: "var(--secondary-background)", backgroundPosition: 'center', backgroundSize: 'contain' }}
                    image={prod.product.image_url}
                    title="green iguana"
                  /> : <div style={{ borderRadius: 26, width: 220, height: 123.75, backgroundColor: "var(--secondary-background)" }}></div>}

                  <CardContent sx={{ width: 'calc(100% - 220px - 1rem)' }} className='program-card'>
                    <div className='flex justify-between items-center pb-2'>
                      <h4>{schedule.program_name}</h4>
                      <Chip className='program-chip' label={schedule.age_group} variant="outlined" />
                    </div>
                    <p>{schedule.program_description}</p>
                    <div className='flex items-center justify-between w-full pt-4'>
                      <div className='flex gap-2'>
                        {week_days.map(week => {
                          return <div style={{ borderRadius: 8, border: `${schedule.days == week.value ? '3px solid var(--primary-color-1)' : '1px solid'}` }} className='program-week' key={week.value}>{week.display}</div>
                        })}
                      </div>
                      <p className='text-color-primary-1'><CalendarTodayIcon fontSize='small' className='pr-1'></CalendarTodayIcon>{new Date(schedule.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - {new Date(schedule.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      <p className='text-color-primary-1'><AccessTimeIcon fontSize='small' className='pr-1'></AccessTimeIcon>{dayjs.tz(schedule.start_time, 'UTC').format('h:mm A')} - {dayjs.tz(schedule.end_time, 'UTC').format('h:mm A')}</p>
                    </div>
                    <div className='text-end pt-4 flex justify-end gap-4 items-center'>
                      <p className='text-3xl text-color-primary-3'>${schedule.price}</p>
                      <Button onClick={() => {addToCart(schedule.id)}} variant='contained'>Add to Cart</Button>
                    </div>
                  </CardContent>
                </div>
              </div>
            </Card>
          })}
        </div>
      </Fragment>
    }


  </section>
}

export default AfterSchoolPage