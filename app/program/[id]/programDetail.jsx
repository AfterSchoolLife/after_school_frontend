'use client';

import { Card, CardContent, CardMedia, Divider } from '@mui/material';

const ProgramDetail = ({ program }) => {
    return (
        <div className="program-detail-container p-8">
            <h1 className="text-center py-4">{program.title}</h1>
            <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2">
                    <Card>
                        <CardMedia
                            component="img"
                            alt={`${program.title} image`}
                            height="400"
                            image={program.image_url || '/default-image.jpg'}
                        />
                    </Card>
                </div>
                
                <div className="md:w-1/2 p-4">
                    <Card>
                        <CardContent>
                            <h2 className="text-xl font-bold pb-2">Description</h2>
                            <p className="pb-4">{program.description}</p>
                            <Divider className="my-4" />
                            <h2 className="text-xl font-bold pb-2">Details</h2>
                            <p><strong>Location:</strong> {program.location}</p>
                            <p><strong>Age Group:</strong> {program.age_group}</p>
                            <p><strong>Dates:</strong> {program.dates}</p>
                            <p><strong>Price:</strong> ${program.price}</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default ProgramDetail;
