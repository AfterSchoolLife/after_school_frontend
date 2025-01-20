'use client'
import { UserContext } from "@components/root";
import { useContext, useState } from "react";
import { Button, TextField } from "@mui/material";
import axiosInstance from "@components/axiosInstance";

const DetailsComponent = () => {
  const [userDetails, setUserDetails] = useContext(UserContext);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    email: userDetails.email,
    parent_1_name: userDetails.parent_1_name,
    parent_1_relation: userDetails.parent_1_relation,
    parent_1_phone_number: userDetails.parent_1_phone_number,
    parent_2_name: userDetails.parent_2_name,
    parent_2_relation: userDetails.parent_2_relation,
    parent_2_phone_number: userDetails.parent_2_phone_number,
    emergency_1_name: userDetails.emergency_1_name,
    emergency_1_relation: userDetails.emergency_1_relation,
    emergency_1_phone_number: userDetails.emergency_1_phone_number,
    emergency_2_name: userDetails.emergency_2_name,
    emergency_2_relation: userDetails.emergency_2_relation,
    emergency_2_phone_number: userDetails.emergency_2_phone_number,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      // Replace with your backend API to update the user details
      const response = await axiosInstance.put('/api/v1/auth/current_user', formData);
      // Update the user details in context after successful update
      setUserDetails(prevState => ({ ...prevState, ...formData }));
      setEditMode(false);
    } catch (error) {
      console.error('Error updating user details:', error);
    }
  };

  return (
    <section>
      <div className="max-w-screen-md mx-auto px-4">
        <h4 className="pb-4 flex items-center justify-between">
            Parent/Guardian Information
            <Button
            variant="contained"
            size="small"
            onClick={editMode ? handleSubmit : () => setEditMode(true)}
            >
            {editMode ? 'Save Changes' : 'Edit Details'}
            </Button>
        </h4>
        <div className="pb-4">
          <p className="font-bold text-xl">Email Id</p>
          {editMode ? (
            <TextField
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              fullWidth
            />
          ) : (
            <p className="text-color-primary-1">{userDetails.email}</p>
          )}
        </div>

        <p className="text-2xl pb-2">Parent/Guardian 1</p>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4">
          <div>
            <p className="font-bold text-lg">Name</p>
            {editMode ? (
              <TextField
                name="parent_1_name"
                value={formData.parent_1_name}
                onChange={handleInputChange}
                fullWidth
              />
            ) : (
              <p className="text-color-primary-1">{userDetails.parent_1_name}</p>
            )}
          </div>
          <div>
            <p className="font-bold text-lg">Relationship</p>
            {editMode ? (
              <TextField
                name="parent_1_relation"
                value={formData.parent_1_relation}
                onChange={handleInputChange}
                fullWidth
              />
            ) : (
              <p className="text-color-primary-1">{userDetails.parent_1_relation}</p>
            )}
          </div>
        </div>

        <div className="w-full pb-4">
          <p className="font-bold text-lg">Phone Number</p>
          {editMode ? (
            <TextField
              name="parent_1_phone_number"
              value={formData.parent_1_phone_number}
              onChange={handleInputChange}
              fullWidth
            />
          ) : (
            <p className="text-color-primary-1">{userDetails.parent_1_phone_number}</p>
          )}
        </div>

        <p className="text-2xl pb-2">Parent/Guardian 2</p>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4">
          <div>
            <p className="font-bold text-lg">Name</p>
            {editMode ? (
              <TextField
                name="parent_2_name"
                value={formData.parent_2_name}
                onChange={handleInputChange}
                fullWidth
              />
            ) : (
              <p className="text-color-primary-1">{userDetails.parent_2_name}</p>
            )}
          </div>
          <div>
            <p className="font-bold text-lg">Relationship</p>
            {editMode ? (
              <TextField
                name="parent_2_relation"
                value={formData.parent_2_relation}
                onChange={handleInputChange}
                fullWidth
              />
            ) : (
              <p className="text-color-primary-1">{userDetails.parent_2_relation}</p>
            )}
          </div>
        </div>

        <div className="w-full pb-4">
          <p className="font-bold text-lg">Phone Number</p>
          {editMode ? (
            <TextField
              name="parent_2_phone_number"
              value={formData.parent_2_phone_number}
              onChange={handleInputChange}
              fullWidth
            />
          ) : (
            <p className="text-color-primary-1">{userDetails.parent_2_phone_number}</p>
          )}
        </div>

        <h4 className="pb-4">Emergency Information</h4>

        <p className="text-2xl pb-2">Primary Contact</p>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4">
          <div>
            <p className="font-bold text-lg">Name</p>
            {editMode ? (
              <TextField
                name="emergency_1_name"
                value={formData.emergency_1_name}
                onChange={handleInputChange}
                fullWidth
              />
            ) : (
              <p className="text-color-primary-1">{userDetails.emergency_1_name}</p>
            )}
          </div>
          <div>
            <p className="font-bold text-lg">Relationship to child</p>
            {editMode ? (
              <TextField
                name="emergency_1_relation"
                value={formData.emergency_1_relation}
                onChange={handleInputChange}
                fullWidth
              />
            ) : (
              <p className="text-color-primary-1">{userDetails.emergency_1_relation}</p>
            )}
          </div>
        </div>

        <div className="w-full pb-4">
          <p className="font-bold text-lg">Phone Number</p>
          {editMode ? (
            <TextField
              name="emergency_1_phone_number"
              value={formData.emergency_1_phone_number}
              onChange={handleInputChange}
              fullWidth
            />
          ) : (
            <p className="text-color-primary-1">{userDetails.emergency_1_phone_number}</p>
          )}
        </div>

        <p className="text-2xl pb-2">Secondary Contact</p>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4">
          <div>
            <p className="font-bold text-lg">Name</p>
            {editMode ? (
              <TextField
                name="emergency_2_name"
                value={formData.emergency_2_name}
                onChange={handleInputChange}
                fullWidth
              />
            ) : (
              <p className="text-color-primary-1">{userDetails.emergency_2_name}</p>
            )}
          </div>
          <div>
            <p className="font-bold text-lg">Relationship to child</p>
            {editMode ? (
              <TextField
                name="emergency_2_relation"
                value={formData.emergency_2_relation}
                onChange={handleInputChange}
                fullWidth
              />
            ) : (
              <p className="text-color-primary-1">{userDetails.emergency_2_relation}</p>
            )}
          </div>
        </div>

        <div className="w-full pb-4">
          <p className="font-bold text-lg">Phone Number</p>
          {editMode ? (
            <TextField
              name="emergency_2_phone_number"
              value={formData.emergency_2_phone_number}
              onChange={handleInputChange}
              fullWidth
            />
          ) : (
            <p className="text-color-primary-1">{userDetails.emergency_2_phone_number}</p>
          )}
        </div>


      </div>
    </section>
  );
};

export default DetailsComponent;
