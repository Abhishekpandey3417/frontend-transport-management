import { useEffect, useState } from "react";
import api from "../../services/api";
import { toast } from "sonner";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ShipmentForm({
    open,
    setOpen,
    refresh,
}) {
    const [vehicles, setVehicles] = useState([]);
    const [drivers, setDrivers] = useState([]);

    const [form, setForm] = useState({
        shipment_code: "",
        vehicle_id: "",
        driver_id: "",
        source: "",
        destination: "",
        shipment_status: "Pending",
    });

    useEffect(() => {
        api.get("/vehicles").then(res => setVehicles(res.data.data));
        api.get("/drivers").then(res => setDrivers(res.data.data));
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const submit = async (e) => {
        e.preventDefault();

        try {
            await api.post("/shipments", form);
            toast.success("Shipment Created");

            setOpen(false);
            refresh();
        } catch (err) {
            toast.error("Failed to create shipment");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Shipment</DialogTitle>
                </DialogHeader>

                <form onSubmit={submit} className="space-y-3">

                    <Input name="shipment_code" placeholder="Shipment Code" onChange={handleChange} />

                    <select name="vehicle_id" className="w-full border p-2 rounded" onChange={handleChange}>
                        <option>Select Vehicle</option>
                        {vehicles.map(v => (
                            <option value={v.id}>{v.vehicle_name}</option>
                        ))}
                    </select>

                    <select name="driver_id" className="w-full border p-2 rounded" onChange={handleChange}>
                        <option>Select Driver</option>
                        {drivers.map(d => (
                            <option value={d.id}>{d.driver_name}</option>
                        ))}
                    </select>

                    <Input name="source" placeholder="Source" onChange={handleChange} />
                    <Input name="destination" placeholder="Destination" onChange={handleChange} />

                    <select name="shipment_status" className="w-full border p-2 rounded" onChange={handleChange}>
                        <option>Pending</option>
                        <option>In Transit</option>
                        <option>Delivered</option>
                        <option>Cancelled</option>
                    </select>

                    <Button className="w-full">
                        Create Shipment
                    </Button>

                </form>
            </DialogContent>
        </Dialog>
    );
}