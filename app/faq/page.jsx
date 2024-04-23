'use client'
import { lilita } from "@components/themeregistry"
import { Card, CardContent } from "@mui/material"

const faqs = [{
    title:"How do I sign up for AfterSchoolLife and access the parent dashboard?",
    description:"Create your AfterSchoolLife account through our website by clicking 'Sign Up.' Once registered, you can log in to the parent dashboard with your email and password to manage your child's activities and view schedules."
},
{
    title:"Are discounts available for siblings or multiple programs?",
    description:"Yes, we offer discounts for families enrolling more than one child and participating in multiple programs. Details are available during the registration process or by contacting our support team."
},
{
    title:"How can I apply for financial assistance or scholarships?",
    description:"We believe in accessible learning for all. For information on scholarships or financial assistance, please visit our financial aid section or contact our support team directly."
},
{
    title:"What should my child bring to their AfterSchoolLife program?",
    description:"Participants should bring any specific items listed for their registered program, such as sports equipment for physical activities or a laptop for coding classes. A general list includes comfortable clothing, water, and snacks."
},
{
    title:"What is the policy for inclement weather or emergencies?",
    description:"Safety is our top priority. In case of inclement weather or emergencies, programs may be rescheduled or moved online. Please refer to our inclement weather policy or contact us for specific details."
},
{
    title:"What is the cancellation and refund policy?",
    description:"We understand plans change. For details on our cancellation and refund policy, including deadlines for changes or cancellations, please visit our policy section on the website."
},
{
    title:"How are participants grouped in programs, and can friends be together?",
    description:"We aim to create an engaging and comfortable environment for all participants. Grouping is typically based on age and skill level. Requests to group friends together are accommodated when possible; please contact us with any requests."
},
{
    title:"What are the safety measures and COVID-19 policies?",
    description:"The health and safety of our participants and staff are paramount. We follow all local health guidelines and have implemented reduced group sizes, enhanced cleaning, and health screenings. For the latest policies, please visit our COVID-19 information page."
},
{
    title:"How do I provide feedback or communicate concerns?",
    description:"Your feedback is important to us. Please contact our support team directly to share any feedback or concerns. We're committed to ensuring a positive experience for all participants."
},
{
    title:"What are the online program options, and how do they work?",
    description:"AfterSchoolLife offers a variety of online programs. These are conducted via a secure platform designed to offer the same high-quality learning experience as our in-person programs. Details on how to join and the technical requirements are available on our online programs page."
},
{
    title:"How can I find the right program for my child?",
    description:"Explore our wide range of programs by age, interest, and location through our 'Programs' section. Detailed descriptions, including objectives and prerequisites, can help you select the perfect match for your child's interests and needs."
},
{
    title:"Can I change my child's program after enrollment?",
    description:"We offer the flexibility to switch programs before they start, subject to availability. For more information on program changes, please visit our change policy or contact our support team."
}]
const Faq = () => {
    return (<section className={`flex gap-8 flex-col pb-8 pt-8 ${lilita.variable}`}>
        <h4 className="text-center text-color-primary-6">FREQUENTLY ASKED QUESTIONS</h4>
        <h1 className="text-center text-color-primary-1">Discover Answers to Your Curiosity</h1>
        <h4 className="text-center text-color-primary-3">"Every great solution was once a simple question. Unearth the knowledge you seek with us."</h4>
        <div className="mx-16">
            {faqs.map((faq,index) => {
                return(<Card key={index} className="mb-8">
                    <CardContent>
                        <p className="pb-6">{faq.title}</p>
                        <p>{faq.description}</p>
                    </CardContent>
                </Card>)
            })}
        </div>
    </section>)
}

export default Faq