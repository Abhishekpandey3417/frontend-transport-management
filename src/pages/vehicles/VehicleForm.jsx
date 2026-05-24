import { useState, useEffect } from "react";
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

export default function VehicleForm({
    open,
    setOpen,
    refresh,
    editData,
    setEditData,
}) {
    const [form, setForm] = useState({
        vehicle_name: "",
        vehicle_number: "",
        type: "",
        status: "Available",
    });

    useEffect(() => {
        if (editData) {
            setForm(editData);
        } else {
            setForm({
                vehicle_name: "",
                vehicle_number: "",
                type: "",
                status: "Available",
            });
        }
    }, [editData]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editData) {
                await api.put(`/vehicles/${editData.id}`, form);
                toast.success("Vehicle Updated");
            } else {
                await api.post("/vehicles", form);
                toast.success("Vehicle Added");
            }

            setOpen(false);
            setEditData(null);
            refresh();
        } catch (err) {
            toast.error("Something went wrong");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {editData ? "Edit Vehicle" : "Add Vehicle"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <Input
                        name="vehicle_name"
                        placeholder="Vehicle Name"
                        onChange={handleChange}
                        value={form.vehicle_name}
                    />

                    <Input
                        name="vehicle_number"
                        placeholder="Vehicle Number"
                        onChange={handleChange}
                        value={form.vehicle_number}
                    />

                    <Input
                        name="type"
                        placeholder="Type"
                        onChange={handleChange}
                        value={form.type}
                    />

                    <select
                        name="status"
                        className="w-full border p-2 rounded"
                        onChange={handleChange}
                        value={form.status}
                    >
                        <option>Available</option>
                        <option>In Transit</option>
                        <option>Maintenance</option>
                    </select>

                    <div className="flex gap-2">
                        <Button type="submit" className="w-full">
                            {editData ? "Update" : "Save"}
                        </Button>

                        <Button
                            type="button"
                            variant="secondary"
                            className="w-full"
                            onClick={() => {
                                setOpen(false);
                                setEditData(null);
                            }}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}