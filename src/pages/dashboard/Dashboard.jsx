import { useEffect, useState } from "react";

import api from "../../services/api";
import socket from "../../services/socket";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";

const Dashboard = () => {

    const [stats, setStats] = useState({
        summary: {
            totalVehicles: 0,
            totalDrivers: 0,
            totalShipments: 0,
            totalExpenses: 0,
        },

        recent: {
            vehicles: [],
            expenses: [],
        },
    });

    const [activity, setActivity] = useState([]);

    // FETCH DASHBOARD
    const fetchDashboard = async () => {

        try {

            const res = await api.get(
                "/dashboard/getdashboardstats"
            );

            setStats(res.data.data);

            setActivity((prev) => [

                {
                    msg: "Dashboard refreshed",
                    time: new Date().toLocaleTimeString(),
                },

                ...prev.slice(0, 4),

            ]);

        } catch (err) {

            console.log(err);

        }

    };

    // SOCKET EVENTS
    useEffect(() => {

        fetchDashboard();

        socket.on("driverUpdated", fetchDashboard);
        socket.on("shipmentUpdated", fetchDashboard);
        socket.on("vehicleUpdated", fetchDashboard);
        socket.on("expenseUpdated", fetchDashboard);

        return () => {

            socket.off("driverUpdated", fetchDashboard);
            socket.off("shipmentUpdated", fetchDashboard);
            socket.off("vehicleUpdated", fetchDashboard);
            socket.off("expenseUpdated", fetchDashboard);

        };

    }, []);

    const { summary, recent } = stats;

    // CHART DATA
    const expenseData =
        recent?.expenses?.map((item) => ({

            name: item.expense_type || "Expense",
            value: Number(item.amount) || 0,

        })) || [];

    return (

        <div className="p-6 bg-gray-100 min-h-screen">

            {/* HEADER */}
            <div className="mb-6">

                <h1 className="text-3xl font-bold text-gray-800">
                    ERP Dashboard
                </h1>

                <p className="text-gray-500">
                    Transport Management Overview
                </p>

            </div>

            {/* KPI CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">

                {/* VEHICLES */}
                <div className="bg-white p-5 rounded-2xl shadow">

                    <p className="text-gray-500 mb-2">
                        Total Vehicles
                    </p>

                    <h2 className="text-3xl font-bold">
                        {summary.totalVehicles || 0}
                    </h2>

                </div>

                {/* DRIVERS */}
                <div className="bg-white p-5 rounded-2xl shadow">

                    <p className="text-gray-500 mb-2">
                        Total Drivers
                    </p>

                    <h2 className="text-3xl font-bold">
                        {summary.totalDrivers || 0}
                    </h2>

                </div>

                {/* SHIPMENTS */}
                <div className="bg-white p-5 rounded-2xl shadow">

                    <p className="text-gray-500 mb-2">
                        Total Shipments
                    </p>

                    <h2 className="text-3xl font-bold">
                        {summary.totalShipments || 0}
                    </h2>

                </div>

                {/* EXPENSES */}
                <div className="bg-white p-5 rounded-2xl shadow">

                    <p className="text-gray-500 mb-2">
                        Total Expenses
                    </p>

                    <h2 className="text-3xl font-bold">
                        ₹ {summary.totalExpenses || 0}
                    </h2>

                </div>

            </div>

            {/* CHART + ACTIVITY */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

                {/* CHART */}
                <div className="bg-white p-5 rounded-2xl shadow">

                    <h2 className="text-xl font-bold mb-4">
                        Expense Overview
                    </h2>

                    <ResponsiveContainer
                        width="100%"
                        height={300}
                    >

                        <BarChart data={expenseData}>

                            <XAxis dataKey="name" />

                            <YAxis />

                            <Tooltip />

                            <Bar
                                dataKey="value"
                                fill="#111827"
                                radius={[6, 6, 0, 0]}
                            />

                        </BarChart>

                    </ResponsiveContainer>

                </div>

                {/* ACTIVITY */}
                <div className="bg-white p-5 rounded-2xl shadow">

                    <h2 className="text-xl font-bold mb-4">
                        Live Activity Feed
                    </h2>

                    <div className="space-y-3">

                        {activity.length > 0 ? (

                            activity.map((item, index) => (

                                <div
                                    key={index}
                                    className="border-b pb-2 text-sm"
                                >

                                    <span className="font-medium">
                                        {item.msg}
                                    </span>

                                    <span className="ml-2 text-gray-400">
                                        {item.time}
                                    </span>

                                </div>

                            ))

                        ) : (

                            <p className="text-gray-400">
                                No activity yet
                            </p>

                        )}

                    </div>

                </div>

            </div>

            {/* RECENT VEHICLES */}
            <div className="bg-white p-5 rounded-2xl shadow">

                <h2 className="text-xl font-bold mb-4">
                    Recent Vehicles
                </h2>

                <div className="overflow-x-auto">

                    <table className="w-full text-sm">

                        <thead>

                            <tr className="border-b text-left">

                                <th className="py-3">
                                    Vehicle Number
                                </th>

                                <th className="py-3">
                                    Type
                                </th>

                                <th className="py-3">
                                    Driver
                                </th>

                                <th className="py-3">
                                    Status
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {recent?.vehicles?.length > 0 ? (

                                recent.vehicles.map((vehicle) => (

                                    <tr
                                        key={vehicle.id}
                                        className="border-b hover:bg-gray-50"
                                    >

                                        <td className="py-3">
                                            {vehicle.vehicle_number}
                                        </td>

                                        <td className="py-3">
                                            {vehicle.vehicle_type}
                                        </td>

                                        <td className="py-3">
                                            {vehicle.driver_assigned}
                                        </td>

                                        <td className="py-3">
                                            {vehicle.status}
                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>

                                    <td
                                        colSpan="4"
                                        className="py-4 text-center text-gray-400"
                                    >

                                        No vehicles found

                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    );

};

export default Dashboard;