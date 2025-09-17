// src/components/Dashboard.tsx
//mport React from 'react';
//import { useQuery } from '@tanstack/react-query';
//import axios from 'axios';

// const fetchReports = async () => {
//     const { data } = await axios.get('/api/dashboard');
//     return data;
// };

const Dashboard = () => {
    //const { data, isLoading, error } = useQuery('dashboard', fetchReports);

    //if (isLoading) return <div>Loading...</div>;
    //if (error) return <div>Error loading dashboard</div>;

    return (
        <div>
            <h2>Dashboard To Do..</h2>
            {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
        </div>
    );
};

export default Dashboard;
