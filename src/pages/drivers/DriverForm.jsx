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

export default function DriverForm({
    open,
    setOpen,
    refresh,
    editData,
    setEditData,
}) {
    const [form, setForm] = useState({
        driver_name: "",
        phone: "",
        license_number: "",
        license_expiry: "",
        address: "",
        status: "Active",
    });

    useEffect(() => {
        if (editData) {
            setForm(editData);
        } else {
            setForm({
                driver_name: "",
                phone: "",
                license_number: "",
                license_expiry: "",
                address: "",
                status: "Active",
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
                await api.put(`/drivers/${editData.id}`, form);
                toast.success("Driver Updated");
            } else {
                await api.post("/drivers", form);
                toast.success("Driver Added");
            }

            setOpen(false);
            setEditData(null);
            refresh();
        } catch (err) {
            toast.error("Operation failed");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {editData ? "Edit Driver" : "Add Driver"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-3">

                    <Input name="driver_name" placeholder="Name" onChange={handleChange} value={form.driver_name} />
                    <Input name="phone" placeholder="Phone" onChange={handleChange} value={form.phone} />
                    <Input name="license_number" placeholder="License No" onChange={handleChange} value={form.license_number} />
                    <Input name="license_expiry" type="date" onChange={handleChange} value={form.license_expiry} />
                    <Input name="address" placeholder="Address" onChange={handleChange} value={form.address} />

                    <select name="status" className="w-full border p-2 rounded" onChange={handleChange} value={form.status}>
                        <option>Active</option>
                        <option>Inactive</option>
                        <option>On Leave</option>
                        <option>Unavailable</option>
                    </select>

                    <Button className="w-full">
                        {editData ? "Update" : "Save"}
                    </Button>

                </form>
            </DialogContent>
        </Dialog>
    );
}