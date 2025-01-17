import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../App'; // Import AppContext

const JobList = () => {
    const { isLoggedIn } = useContext(AppContext); // Access isLoggedIn
    const [jobs, setJobs] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('/api/jobs', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setJobs(response.data);
            } catch (error) {
                console.error("Error fetching jobs:", error);
                if (error.response && error.response.status === 401) {
                    // Handle unauthorized access (e.g., redirect to login)
                    // For now, just log the error and clear the jobs
                    console.log("Unauthorized. Please log in.");
                    setJobs([]);
                } else {
                    setError("Failed to load jobs.");
                }
            }
        };

        if (isLoggedIn) {
            fetchJobs();
        } else {
            setJobs([]); // Clear jobs if not logged in
        }
    }, [isLoggedIn]); // isLoggedIn as dependency

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Available Jobs</h2>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            {jobs.length === 0 && !error && <p>No jobs available.</p>}
            <ul>
                {jobs.map(job => (
                    <li key={job.id} className="border rounded p-4 mb-4">
                        <h3 className="text-lg font-semibold">{job.title}</h3>
                        <p>{job.description}</p>
                        <p>Reward: {job.reward}</p>
                        <p>Category: {job.category}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default JobList;