'use client'
import { lilita } from '@components/themeregistry';
import { Button } from '@mui/material';
import Link from 'next/link';

const Work = () => {
    return (<section className={`flex gap-8 flex-col pb-8 ${lilita.variable}`}>
        <div className='banner'>
            <img alt='home page banner' src="/work/banner_1.jpg"></img>
            <div className='info-div primary-background-4 text-color-primary-light'>
                <h3>Join Our Team and Make a Difference</h3>
            </div>
        </div>
        <div className='banner-2'>
            <img src='/work/banner_2.jpg'></img>
            <div className='banner2-description'>
                <div className='h-full flex flex-col justify-center'>
                    <div className='h-fit p-4 text-center primary-background'>
                        <p>
                            At After School Life, we believe in providing students with engaging and enriching afterschool programs that help them thrive. Join our team and help us make a difference in the lives of students in our community.
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div className='info-div primary-background-6 text-color-primary-light'>
            <h3>Explore Job Openings</h3>
            <Link href="/work/apply">
                <Button variant="contained" color="primary3">
                    <h5>Click here</h5>
                </Button>
            </Link>
        </div>
    </section>)
}

export default Work