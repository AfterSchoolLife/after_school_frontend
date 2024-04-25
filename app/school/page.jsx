'use client'
import SchoolAutoComplete from "@components/schoolAutocomplete"
import { lilita } from "@components/themeregistry"


const School = () => {
    return (<section className={`flex gap-8 flex-col ${lilita.variable}`}>
        <div className="flex">
            <img className="w-1/2 school-img" alt='home page banner' src="/school/banner.jpg"></img>
            <div className="w-1/2 p-8 pt-0 text-color-primary-1">
                <h2 className="pb-12">Discover learning and enjoyment after your school is done!!!</h2>
                <p className="text-color-primary-2 pb-8">Please select your child&apos;s school to checkout the programs we&apos;ve got waiting just for them.</p>
                <SchoolAutoComplete label="Find your School"></SchoolAutoComplete>
            </div>
        </div>
    </section>)
}
export default School