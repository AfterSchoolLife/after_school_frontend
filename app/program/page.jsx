'use client'
import { useEffect, useState } from 'react';
import SchoolAutoComplete from "@components/schoolAutocomplete";
import { lilita } from "@components/themeregistry";
import { Card, CardContent, Divider, CardMedia } from "@mui/material";
import Link from "next/link";
import axiosInstance from '@components/axiosInstance';

const ProgramComponent = () => {
    const [programs, setPrograms] = useState([]);

    useEffect(() => {
        // Fetch the program data from an API or data source
        axiosInstance.get('/api/v1/programs') // Example endpoint
            .then(response => {
                setPrograms(response.data); // Store the entire program data
            })
            .catch(error => {
                console.error('Error fetching program data:', error);
            });
    }, []);

    return (
        <section className={`${lilita.variable}`}>
            <div className="full-banner relative">
                <Card className="banner-card card">
                    <CardContent className="pt-0-important opacity-100">
                        <div className="px-4" style={{ width: 420 }}>
                            <div className="flex items-center justify-between pb-4">
                                <p style={{ borderBottom: '3px solid' }} className="p-4 text-bold text-color-primary-1">
                                    After school program
                                </p>
                                <Divider orientation="vertical" variant="middle" flexItem />
                                <Link href="/program/holidaycamps">
                                    <p className="p-4">Holiday Camp</p>
                                </Link>
                            </div>
                            <h4 className="pb-4 text-center">
                                Unlocking Adventure & Knowledge Beyond School Hours
                            </h4>
                            <p className="text-xl text-center pb-4">
                                Unleash Your Potential: After-School Thrills in STEM, Arts & Sports!
                            </p>
                            <p className="font-bold pl-2 pb-4">Find your school</p>
                            <div className="pb-8">
                                <SchoolAutoComplete label="Enter Your School Name"></SchoolAutoComplete>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <img alt="Program page banner" src="/program/banner/cover.jpeg" />
            </div>
            <div className="p-8">
                <h2 className="text-center pb-4">Get Ready for 2024 Summer Camp !!</h2>
                <p className="text-lg">
                    We&apos;re committed to enriching the lives of young minds through our exceptional after-school
                    program offerings. Our dedication to nurturing the next generation&apos;s potential drives us to provide
                    a diverse range of engaging and educational activities tailored to children of all ages. With our
                    age-specific programs, every child can explore their interests, learn at their own pace, and thrive
                    in an environment filled with excitement, knowledge, and new connections.
                    Led by experienced instructors and mentors, our programs inspire curiosity, ignite creativity, &amp;
                    instill a passion for lifelong learning.
                </p>
            </div>
            <div className="p-8">
                <h3 className="pb-4">Programs Offered</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {programs.map((program, index) => (
                        <Link href={`/program/${program.id}`} key={index} passHref>
                            <Card className="program-card cursor-pointer hover:opacity-75 transition-opacity duration-300">
                                <CardMedia
                                    component="img"
                                    alt={`${program.title} image`}
                                    height="140"
                                    image={program.image_url || '/default-image.jpg'} // Use a default image if none provided
                                />
                                <CardContent>
                                    <h4 className="text-center">{program.title}</h4>
                                    <h6 className="text-center">{program.description}</h6>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default ProgramComponent;
