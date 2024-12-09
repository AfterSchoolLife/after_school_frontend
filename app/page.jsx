"use client"
import { lilita } from '@components/themeregistry';
import Button from '@mui/material/Button';
import Link from "next/link";

const Home = () => {
  return (
    <section className={`flex gap-8 flex-col pb-8 ${lilita.variable}`}>
      <div className="flex flex-col gap-4 md:gap-8">
        <div className="info-div primary-background-4 text-color-primary-light px-4 py-6 md:px-8 rounded-md">
          <h3 className="text-center md:text-left text-lg md:text-xl lg:text-2xl font-semibold leading-tight">
            WANT TO REGISTER FOR AN AFTER SCHOOL PROGRAM?
          </h3>
          <div className="flex justify-center md:justify-start mt-4">
            <Link href="/school">
              <Button variant="contained" color="primary3" className="text-sm md:text-base">
                <h5>Click here</h5>
              </Button>
            </Link>
          </div>
        </div>
        <div className="banner">
          <img alt="home page banner" src="/home/banner.jpg" className="w-full object-cover" />
        </div>
      </div>

      <h2 className="font-medium text-center">Our Programs</h2>

      <div className="px-4 md:px-12 flex flex-col md:flex-row gap-4">
        {/* Card 1 */}
        <div className="w-full md:w-1/3 flex flex-col items-center">
          <div className="flex flex-col md:flex-row w-full">
            <img className="w-full md:w-1/2 program-img" src="/home/card_1.jpg" />
            <div style={{ backgroundColor: 'var(--primary-color-4)', color: 'var(--primary-text-color-light)' }} className="flex items-center justify-center p-4 md:w-1/2 text-center">
              <div className="flex flex-col gap-4 items-center justify-center">
                <h4>Summer Camps</h4>
                <p>Experience a summer of discovery and fun with our diverse programs, catering to every interest and age group.</p>
              </div>
            </div>
          </div>
        </div>
        {/* Card 2 */}
        <div className="w-full md:w-1/3 flex flex-col items-center">
          <div className="flex flex-col md:flex-row w-full">
            <img className="w-full md:w-1/2 program-img" src="/home/card_2.jpeg" />
            <div style={{ backgroundColor: 'var(--primary-color-2)', color: 'var(--primary-text-color-light)' }} className="flex items-center justify-center p-4 md:w-1/2 text-center">
              <div className="flex flex-col gap-4 items-center justify-center">
                <h4>After School Activities</h4>
                <p>Discover enriching after-school activities for every interest, from arts and sports to academics and more.</p>
              </div>
            </div>
          </div>
        </div>
        {/* Card 3 */}
        <div className="w-full md:w-1/3 flex flex-col items-center">
          <div className="flex flex-col md:flex-row w-full">
            <img className="w-full md:w-1/2 program-img" src="/home/card_3.jpeg" />
            <div style={{ backgroundColor: 'var(--primary-color-5)', color: 'var(--primary-text-color-light)' }} className="flex items-center justify-center p-4 md:w-1/2 text-center">
              <div className="flex flex-col gap-4 items-center justify-center">
                <h4>Holiday Programs</h4>
                <p>Elevate your holidays with our exciting programs, promising fun and learning for all!</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-12 flex flex-col md:flex-row gap-4">
        <img className="w-full md:w-1/2 program-img" src="/home/card_4.jpeg" />
        <div style={{ backgroundColor: 'var(--primary-color-6)', color: 'var(--primary-text-color-light)' }} className="flex items-center justify-center p-4 md:w-1/2 text-center">
          <div className="flex flex-col gap-4 items-center justify-center">
            <h4>Other Programs</h4>
            <p>Explore our wide range of programs, browse, and discover exciting opportunities beyond holidays, tailored to ignite curiosity and nurture skills year-round.</p>
          </div>
        </div>
      </div>

      <div className="banner-2 flex flex-col md:flex-row items-center">
  <img className="w-full md:w-1/2 object-cover" src="/home/card_5.jpg" alt="banner image" />
  <div className="banner2-description w-full md:w-1/2 flex items-center justify-center">
    <div className="p-4 md:p-8 text-center primary-background">
      <h4 className="pb-4 text-lg md:text-xl lg:text-2xl">Encouraging Instructors, Teachers and Coaches</h4>
      <p className="text-sm md:text-base lg:text-lg">
        AfterSchoolLife exclusively engages with expertly-trained, seasoned educators renowned for their ability to motivate students. This approach offers your child an advantageous edge in their learning journey. We regard your child&apos;s education with utmost seriousness, ensuring our instructors dedicate themselves fully to fostering students growth into their finest selves.
      </p>
    </div>
  </div>
</div>


      <div className="px-4 md:px-12 text-center">
        <h2 className="font-medium pb-4">After School Life Partnerships</h2>
        <p>
          AfterSchoolLife is a dedicated facilitator of enriching after-school activities, as well as comprehensive summer and seasonal camps. We collaborate with premier institutions, community parks, and educational centers nationwide. If you&apos;re interested in aligning with our vision, we warmly invite you to connect with us and become part of our community-driven mission!
        </p>
      </div>
    </section>
  )
}

export default Home;
