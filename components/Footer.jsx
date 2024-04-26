'use client'

import Link from "next/link";
import { lilita } from "./themeregistry";

const Footer = () => {
    return <section className={lilita.variable}>
        <div className="w-full footer flex justify-between p-8">
            <div className="w-1/3">
                <h4 className="pb-6">ABOUT AFTERSCHOOLLIFE</h4>
                <Link href="/"><h5 className="pb-2">About Us</h5></Link>
                <Link href="/work"><h5>Carrers</h5></Link>
            </div>
            <div className="w-1/3">
                <h4 className="pb-6">OUR PROGRAMS</h4>
                <Link href="/program"><h5 className="pb-2">After School Programs</h5></Link>
                <Link href="/program/holidaycamps"><h5>Holiday Camps</h5></Link>
            </div>
            <div className="w-1/3">
                <h4 className="pb-6">LOCATIONS</h4>
                <h4 className="pb-2">Canada</h4>
                <h5 className="pb-4 pl-4">British Columbia</h5>

                <h4 className="pb-2">USA</h4>
                <h5 className="pl-4 pb-2">Bay Area</h5>    
                <h5 className="pl-4">Seattle</h5>            
            </div>
        </div>
    </section>
}

export default Footer;