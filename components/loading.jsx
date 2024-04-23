"use client"
import { CircularProgress } from "@mui/material";

export default function Commonloading() {
    return (<section className='common-loader'>
        <div className='logo-txt logo-text-gradient'>Exibit.H</div>
        <CircularProgress
            className='spinner'
            thickness={0}
            size={100}
        />
    </section>)
}