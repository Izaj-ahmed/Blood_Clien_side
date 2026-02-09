import { useQuery } from '@tanstack/react-query';
import React from 'react';
import UseAxiosSecure from '../../../Hooks/UseAxiosSecure';
import { PieChart, Pie, Tooltip, Legend } from 'recharts';

const AdminDashboard = () => {
    const axiosSecure = UseAxiosSecure();

    const { data: donationStats = [] } = useQuery({
        queryKey: ['donation-dashboard-stats'],
        queryFn: async () => {
            const res = await axiosSecure.get('/admin/dashboard-stats');
            return res.data;
        }
    });

    const pieData = donationStats.map(item => ({
        name: item.status,
        value: item.count
    }));

    return (
        <div className="p-6">
            <h2 className="text-4xl font-bold mb-6">Blood Donation Admin Dashboard</h2>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {
                    donationStats.map(stat => (
                        <div key={stat.status} className="stat shadow bg-base-100 rounded-xl">
                            <div className="stat-title text-xl capitalize">
                                {stat.status} Requests
                            </div>
                            <div className="stat-value text-primary">
                                {stat.count}
                            </div>
                            <div className="stat-desc">
                                Updated recently
                            </div>
                        </div>
                    ))
                }
            </div>

            {/* Pie Chart */}
            <div className="flex justify-center">
                <PieChart width={400} height={300}>
                    <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#e11d48"
                        label
                    />
                    <Tooltip />
                    <Legend />
                </PieChart>
            </div>
        </div>
    );
};

export default AdminDashboard;
