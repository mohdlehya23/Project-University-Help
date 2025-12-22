import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Universities
export const getUniversities = async () => {
    const response = await axios.get(`${API_URL}/universities`);
    return response.data;
};

export const createUniversity = async (data: any) => {
    const response = await axios.post(`${API_URL}/universities`, data);
    return response.data;
};

export const updateUniversity = async (id: string, data: any) => {
    const response = await axios.put(`${API_URL}/universities/${id}`, data);
    return response.data;
};

export const deleteUniversity = async (id: string) => {
    const response = await axios.delete(`${API_URL}/universities/${id}`);
    return response.data;
};

// Colleges
export const getColleges = async (universityKey: string) => {
    const response = await axios.get(`${API_URL}/universities/${universityKey}/colleges`);
    return response.data;
};

export const createCollege = async (data: any) => {
    const response = await axios.post(`${API_URL}/colleges`, data);
    return response.data;
};

export const updateCollege = async (id: string, data: any) => {
    const response = await axios.put(`${API_URL}/colleges/${id}`, data);
    return response.data;
};

export const deleteCollege = async (id: string) => {
    const response = await axios.delete(`${API_URL}/colleges/${id}`);
    return response.data;
};

// Majors
export const getMajors = async (universityKey: string, collegeKey: string) => {
    const response = await axios.get(`${API_URL}/universities/${universityKey}/colleges/${collegeKey}/majors`);
    return response.data;
};

export const createMajor = async (data: any) => {
    const response = await axios.post(`${API_URL}/majors`, data);
    return response.data;
};

export const updateMajor = async (id: string, data: any) => {
    const response = await axios.put(`${API_URL}/majors/${id}`, data);
    return response.data;
};

export const deleteMajor = async (id: string) => {
    const response = await axios.delete(`${API_URL}/majors/${id}`);
    return response.data;
};
