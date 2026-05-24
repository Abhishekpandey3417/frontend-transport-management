import { useEffect, useState } from "react";
import api from "../../services/api";
import DriverForm from "./DriverForm";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function Drivers() {
    const [drivers, setDrivers] = useState([]);
    const [open, setOpen] = useState(false);
    const [editData, setEditData] = useState(null);

    const fetchDrivers = async () => {
        const res = await api.get("/drivers");
        setDrivers(res.data.data);
    };

    useEffect(() => {
        fetchDrivers();
    }, []);

    const deleteDriver = async (id) => {
        await api.delete(`/drivers/${id}`);
        toast.success("Driver Deleted");
        fetchDrivers();
    };

    return (
        <div>
            <div className="flex justify-between mb-5">
                <h1 className="text-2xl font-bold">Driver Management</h1>

                <Button onClick={() => setOpen(true)}>
                    + Add Driver
                </Button>
            </div>

            <div className="bg-white border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>License</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {drivers.map((d) => (
                            <TableRow key={d.id}>
                                <TableCell>{d.driver_name}</TableCell>
                                <TableCell>{d.phone}</TableCell>
                                <TableCell>{d.license_number}</TableCell>

                                <TableCell>
                                    <Badge>{d.status}</Badge>
                                </TableCell>

                                <TableCell className="flex gap-2">
                                    <Button size="sm" onClick={() => { setEditData(d); setOpen(true); }}>
                                        Edit
                                    </Button>

                                    <Button size="sm" variant="destructive" onClick={() => deleteDriver(d.id)}>
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <DriverForm
                open={open}
                setOpen={setOpen}
                refresh={fetchDrivers}
                editData={editData}
                setEditData={setEditData}
            />
        </div>
    );
}