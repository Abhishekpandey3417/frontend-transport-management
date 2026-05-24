import {
    LayoutDashboard,
    Truck,
    Users,
    Package,
    Wallet,
    LogOut,
    User
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";
import socket from "../../services/socket";

const Sidebar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    const [drivers, setDrivers] = useState([]);
    const [selectedDriver, setSelectedDriver] = useState(null);

    const fetchDrivers = async () => {
        try {
            const res = await api.get("/drivers/getalldrivers");
            setDrivers(res.data.data || []);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchDrivers();

        socket.on("driverUpdated", (data) => {
            setDrivers((prev) =>
                prev.map((d) =>
                    d.id === data.id
                        ? { ...d, status: data.status }
                        : d
                )
            );
        });

        return () => {
            socket.off("driverUpdated");
        };
    }, []);

    const logoutHandler = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const menu = [
        { title: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/", roles: ["admin", "manager", "driver"] },
        { title: "Vehicles", icon: <Truck size={18} />, path: "/vehicles", roles: ["admin", "manager"] },
        { title: "Drivers", icon: <Users size={18} />, path: "/drivers", roles: ["admin", "manager"] },
        { title: "Shipments", icon: <Package size={18} />, path: "/shipments", roles: ["admin", "manager", "driver"] },
        { title: "Expenses", icon: <Wallet size={18} />, path: "/expenses", roles: ["admin"] },
    ];

    const filteredMenu = menu.filter((item) =>
        item.roles.includes(user?.role)
    );

    const getStatusColor = (status) => {
        switch (status) {
            case "Available":
                return "text-green-400";
            case "On Leave":
                return "text-yellow-400";
            case "Busy":
                return "text-blue-400";
            default:
                return "text-gray-400";
        }
    };

    return (
        <div className="w-64 bg-black text-white p-5 flex flex-col h-screen">

            {/* HEADER */}
            <h1 className="text-2xl font-bold mb-5">
                Transport ERP
            </h1>

            {/* MENU */}
            <nav className="space-y-4 flex-1 overflow-y-auto">

                {filteredMenu.map((item) => (
                    <Link
                        key={item.title}
                        to={item.path}
                        className="flex items-center gap-2 hover:text-gray-300"
                    >
                        {item.icon}
                        {item.title}
                    </Link>
                ))}

                {/* DRIVER SECTION */}
                <div className="mt-6">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-sm text-gray-400">
                            Drivers
                        </h2>

                        <span className="text-xs bg-gray-700 px-2 py-1 rounded">
                            {drivers.length}
                        </span>
                    </div>

                    <div className="space-y-2">
                        {drivers.map((d) => (
                            <div
                                key={d.id}
                                onClick={() => setSelectedDriver(d)}
                                className="flex items-center justify-between gap-2 text-sm cursor-pointer hover:bg-gray-800 p-1 rounded"
                            >
                                <div className="flex items-center gap-2">
                                    <User size={14} />
                                    <span>{d.driver_name}</span>
                                </div>

                                <span className={`text-xs ${getStatusColor(d.status)}`}>
                                    ●
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </nav>

            {/* LOGOUT */}
            <button
                onClick={logoutHandler}
                className="flex items-center gap-2 text-red-400 mt-4"
            >
                <LogOut size={18} /> Logout
            </button>

            {/* DRIVER MODAL */}
            {selectedDriver && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
                    <div className="bg-white text-black p-4 rounded w-72">
                        <h2 className="font-bold text-lg mb-2">
                            {selectedDriver.driver_name}
                        </h2>

                        <p>Phone: {selectedDriver.phone}</p>
                        <p>License: {selectedDriver.license_number}</p>
                        <p>Status: {selectedDriver.status}</p>

                        <button
                            className="mt-3 bg-black text-white px-3 py-1 rounded"
                            onClick={() => setSelectedDriver(null)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sidebar;