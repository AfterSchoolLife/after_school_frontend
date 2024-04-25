import axiosInstance from "./axiosInstance"

export const school_response = { data: [] }
export const fetchSchools = () => {
    return new Promise(async (resolve) => {
        if (school_response.data.length) {
            resolve(school_response)
        }
        else {
            let response = await axiosInstance.get('/api/v1/schools?isActive=true')
            school_response.data = response.data
            resolve(response)
        }
    })
}
