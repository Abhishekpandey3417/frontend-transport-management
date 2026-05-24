import { useState } from "react";
import api from "../../services/api";
import useTableQuery from "../../hooks/useTableQuery";

import TableControls from "../../components/ui/TableControls";
import PaginationBar from "../../components/ui/PaginationBar";
import VehicleForm from "./VehicleForm";

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

export default function Vehicles() {
    const [open, setOpen] = useState(false);
    const [editData, setEditData] = useState(null);

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [page, setPage] = useState(1);

    const { data = [], loading, pagination, refetch } = useTableQuery(
        () =>
            api.get("/vehicles/getallvehicles", {
                params: { search, status, page, limit: 5 },
            }),
        { search, status, page }
    );

    const deleteVehicle = async (id) => {
        try {
            await api.delete(`/vehicles/deletevehicle/${id}`);
            refetch();
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div>
            <TableControls
                title="Vehicle Management"
                search={search}
                setSearch={setSearch}
                status={status}
                setStatus={setStatus}
                onAdd={() => setOpen(true)}
            />

            <div className="border rounded-lg bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Vehicle Number</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Capacity</TableHead>
                            <TableHead>Fuel</TableHead>
                            <TableHead>Driver</TableHead>
                            <TableHead>Insurance Expiry</TableHead>
                            <TableHead>Maintenance Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={9} className="text-center">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={9} className="text-center">
                                    No vehicles found
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((v) => (
                                <TableRow key={v.id}>
                                    <TableCell>{v.vehicle_number}</TableCell>
                                    <TableCell>{v.vehicle_type}</TableCell>
                                    <TableCell>{v.capacity}</TableCell>
                                    <TableCell>{v.fuel_type}</TableCell>
                                    <TableCell>{v.driver_assigned}</TableCell>

                                    <TableCell>
                                        {v.insurance_expiry
                                            ? new Date(v.insurance_expiry).toLocaleDateString()
                                            : "-"}
                                    </TableCell>

                                    <TableCell>
                                        {v.maintenance_date
                                            ? new Date(v.maintenance_date).toLocaleDateString()
                                            : "-"}
                                    </TableCell>

                                    <TableCell>
                                        <Badge>{v.status}</Badge>
                                    </TableCell>

                                    <TableCell className="flex gap-2">
                                        <Button
                                            onClick={() => {
                                                setEditData(v);
                                                setOpen(true);
                                            }}
                                        >
                                            Edit
                                        </Button>

                                        <Button
                                            variant="destructive"
                                            onClick={() => deleteVehicle(v.id)}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <PaginationBar
                pagination={pagination}
                setPage={setPage}
            />

            <VehicleForm
                open={open}
                setOpen={setOpen}
                refresh={refetch}
                editData={editData}
                setEditData={setEditData}
            />
        </div>
    );
}