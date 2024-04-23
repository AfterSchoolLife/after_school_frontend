"use client"
import { lilita } from '@components/themeregistry';
import Button from '@mui/material/Button';
import Link from "next/link";

var rendered = false;
const Home = () => {
  return (
    <section className={`flex gap-8 flex-col pb-8 ${lilita.variable}`}>
      <div>
        <div className='info-div primary-background-4 text-color-primary-light'>
          <h3>WANT TO REGISTER FOR AN AFTER SCHOOL PROGRAM?</h3>
          <Link href="/program">
            <Button variant="contained" color="primary3">
              <h5>Click here</h5>
            </Button>
          </Link>
        </div>
        <div className='banner'>
          <img alt='home page banner' src="/home/banner.jpg"></img>
        </div>
      </div>
      <h2 className='font-medium text-center'>Our Programs</h2>
      <div className='px-12 flex gap-4'>
        <div className='w-1/3'>
          <div className='flex'>
            <img className='w-1/2 program-img' src='/home/card_1.jpg'></img>
            <div style={{ backgroundColor: 'var(--primary-color-4)', color: 'var(--primary-text-color-light)' }} className='w-1/2 flex'>
              <div className=' flex flex-col gap-4 items-center justify-center p-4 text-center'>
                <h4>Summer Camps</h4>
                <p>Experience a summer of discovery and fun with our diverse programs, catering to every interest and age group.</p>
              </div>
            </div>
          </div>
        </div>
        <div className='w-1/3'>
          <div className='flex'>
            <img className='w-1/2 program-img' src='/home/card_2.jpeg'></img>
            <div style={{ backgroundColor: 'var(--primary-color-2)', color: 'var(--primary-text-color-light)' }} className='w-1/2 flex'>
              <div className=' flex flex-col gap-4 items-center justify-center p-4 text-center'>
                <h4>After School Activities</h4>
                <p>Discover enriching after-school activities for every interest, from arts and sports to academics and more.</p>
              </div>
            </div>
          </div>
        </div>
        <div className='w-1/3'>
          <div className='flex'>
            <img className='w-1/2 program-img' src='/home/card_3.jpeg'></img>
            <div style={{ backgroundColor: 'var(--primary-color-5)', color: 'var(--primary-text-color-light)' }} className='w-1/2 flex'>
              <div className=' flex flex-col gap-4 items-center justify-center p-4 text-center'>
                <h4>Holiday Programs</h4>
                <p>Elevate your holidays with our exciting programs, promising fun and learning for all!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='px-12'>
        <div className='flex'>
          <img className='w-1/2 program-img' src='/home/card_4.jpeg'></img>
          <div style={{ backgroundColor: 'var(--primary-color-6)', color: 'var(--primary-text-color-light)' }} className='w-1/2 flex'>
            <div className=' flex flex-col gap-4 items-center justify-center p-4 text-center'>
              <h4>Other Programs</h4>
              <p>Explore our wide range of programs, browse, and discover exciting opportunities beyond holidays, tailored to ignite curiosity and nurture skills year-round</p>
            </div>
          </div>
        </div>
      </div>
      <div className='banner-2'>
        <img src='/home/card_5.jpg'></img>
        <div className='banner2-description'>
          <div className='h-full flex flex-col justify-center'>
            <div className='h-fit p-4 text-center primary-background'>
              <h4 className='pb-4'>Encouraging Instructors, Teachers and Coaches</h4>
              <p>
                AfterSchoolLife exclusively engages with expertly-trained, seasoned educators renowned for their ability to motivate students. This approach offers your child an advantageous edge in their learning journey. We regard your child's education with utmost seriousness, ensuring our instructors dedicate themselves fully to fostering students' growth into their finest selves.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className='px-12'>
        <h2 className='font-medium text-center pb-4'>After School Life Partnerships</h2>
        <p>
          AfterSchoolLife is a dedicated facilitator of enriching after-school activities, as well as comprehensive summer and seasonal camps. We collaborate with premier institutions, community parks, and educational centers nationwide. If you're interested in aligning with our vision, we warmly invite you to connect with us and become part of our community-driven mission!
        </p>
      </div>
    </section>
  )
}

export default Home;