'use client'

import { lilita } from "@components/themeregistry"

const holiday_camp_details = [
    { time: '8:30 AM - 9:00 AM:', title: 'Check in Time', description: 'Campers arrive & are greeted with a magicians hot sticker as a warm welcome to a day filled with wonder' },
    { time: '1:00 PM - 2:30 PM:', title: 'Sports Camp', description: 'Teams form for a soccer match or a basketball game, focusing on teamwork and sportsmanship.' },
    { time: '9:00 AM - 10:30 AM:', title: 'Enchanting Magic Camp', description: 'Unlocking the secrets of magic with enchanting activities that include wand waving and learning slight of hand.' },
    { time: '2:30 PM - 3:30 PM:', title: 'Creative Writing Camp', description: 'Campers craft tales and compose essays, turning ideas into words.' },
    { time: '10:30 AM - 11:00 AM:', title: 'Art Camp Extravaganza', description: 'Snack & Sketch: A creative break with healthy snacks. Campers create their snack-time masterpieces.' },
    { time: '3:30 PM - 4:00 PM:', title: 'Sign Language Camp', description: 'Discovering the beauty of ASL with interactive learning and fun sign language games' },
    { time: '11:00 AM - 12:30 PM:', title: 'Drama Camp', description: 'Curtain rises for our young actors to engage in improvisation and script reading.' },
    { time: '4:00 PM - 5:00 PM:', title: "Camper's Choice", description: 'All Ages: An open period for campers to revisit their favorite activity or try something new.' },
    { time: '12:30 PM - 1:00 PM:', title: 'Lunch Intermission', description: "A communal time to refuel and share stories from the morning's adventures." },
    { time: '5:00 PM - 6:00 PM:', title: 'Showcase and Share', description: 'All Ages: End the day by sharing the magic tricks learned, artwork created, or a performance from drama practice' }
]

const HolidayCampComponent = () => {
    return (
        <section className={`holiday-camp-section ${lilita.variable}`}>
            <div className="flex flex-wrap -mx-2">
                {holiday_camp_details.map((d, index) => (
                    <div
                        key={d.title}
                        className="w-full sm:w-1/2 lg:w-1/3 p-4"
                    >
                        <div className="flex gap-4 items-start">
                            <img
                                style={{ height: 80, width: 80 }}
                                alt={d.title}
                                src={`/program/holidaycamp/${index}.jpeg`}
                                className="rounded-lg shadow-md"
                            />
                            <div>
                                <p className="text-sm sm:text-md lg:text-lg font-semibold">{d.time}</p>
                                <h4 className="text-base sm:text-lg font-bold">{d.title}</h4>
                                <p className="text-sm sm:text-md text-gray-600">{d.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default HolidayCampComponent
