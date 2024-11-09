'use client'
import { UserContext } from "@components/root";
import { useContext } from "react";

const DetailsComponent = () => {
    const [userDetails, setUserDetails] = useContext(UserContext);

    return (
        <section>
            <div className="max-w-screen-md mx-auto px-4">
                <h4 className="pb-4">Parent/Guardian Information</h4>
                
                <div className="pb-4">
                    <p className="font-bold text-xl">Email Id</p>
                    <p className="text-color-primary-1">{userDetails.email}</p>
                </div>
                
                <p className="text-2xl pb-2">Parent/Guardian 1</p>
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4">
                    <div>
                        <p className="font-bold text-lg">Name</p>
                        <p className="text-color-primary-1">{userDetails.parent_1_name}</p>
                    </div>
                    <div>
                        <p className="font-bold text-lg">Relationship</p>
                        <p className="text-color-primary-1">{userDetails.parent_1_relation}</p>
                    </div>
                </div>
                
                <div className="w-full pb-4">
                    <p className="font-bold text-lg">Phone Number</p>
                    <p className="text-color-primary-1">{userDetails.parent_1_phone_number}</p>
                </div>
                
                <p className="text-2xl pb-2">Parent/Guardian 2</p>
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4">
                    <div>
                        <p className="font-bold text-lg">Name</p>
                        <p className="text-color-primary-1">{userDetails.parent_2_name}</p>
                    </div>
                    <div>
                        <p className="font-bold text-lg">Relationship</p>
                        <p className="text-color-primary-1">{userDetails.parent_2_relation}</p>
                    </div>
                </div>
                
                <div className="w-full pb-4">
                    <p className="font-bold text-lg">Phone Number</p>
                    <p className="text-color-primary-1">{userDetails.parent_2_phone_number}</p>
                </div>
                
                <h4 className="pb-4">Emergency Information</h4>
                
                <p className="text-2xl pb-2">Primary Contact</p>
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4">
                    <div>
                        <p className="font-bold text-lg">Name</p>
                        <p className="text-color-primary-1">{userDetails.emergency_1_name}</p>
                    </div>
                    <div>
                        <p className="font-bold text-lg">Relationship to child</p>
                        <p className="text-color-primary-1">{userDetails.emergency_1_relation}</p>
                    </div>
                </div>
                
                <div className="w-full pb-4">
                    <p className="font-bold text-lg">Phone Number</p>
                    <p className="text-color-primary-1">{userDetails.emergency_1_phone_number}</p>
                </div>
                
                <p className="text-2xl pb-2">Secondary Contact</p>
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4">
                    <div>
                        <p className="font-bold text-lg">Name</p>
                        <p className="text-color-primary-1">{userDetails.emergency_2_name}</p>
                    </div>
                    <div>
                        <p className="font-bold text-lg">Relationship to child</p>
                        <p className="text-color-primary-1">{userDetails.emergency_2_relation}</p>
                    </div>
                </div>
                
                <div className="w-full pb-4">
                    <p className="font-bold text-lg">Phone Number</p>
                    <p className="text-color-primary-1">{userDetails.emergency_2_phone_number}</p>
                </div>
            </div>
        </section>
    );
};

export default DetailsComponent;
