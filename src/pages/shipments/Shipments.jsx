import { useEffect, useState } from "react";
import api from "../../services/api";
import ShipmentForm from "./ShipmentForm";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import socket from "../../services/socket";

export default function Shipments() {
    const [shipments, setShipments] = useState([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchShipments = async () => {
        setLoading(true);
        try {
            const res = await api.get("/shipments");
            setShipments(res.data.data || []);
        } catch (err) {
            console.log("Shipment fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchShipments();

        socket.on("shipmentUpdated", (data) => {
            setShipments((prev) =>
                prev.map((s) =>
                    s.id === data.id
                        ? { ...s, shipment_status: data.shipment_status }
                        : s
                )
            );
        });

        return () => socket.off("shipmentUpdated");
    }, []);

    return (
        <div>
            <div className="flex justify-between mb-5">
                <h1 className="text-2xl font-bold">
                    Shipment Workflow
                </h1>

                <Button onClick={() => setOpen(true)}>
                    + Create Shipment
                </Button>
            </div>

            <div className="bg-white border rounded-lg p-4">
                {loading ? (
                    <p className="p-4 text-gray-500">Loading shipments...</p>
                ) : shipments.length === 0 ? (
                    <p className="p-4 text-gray-500">
                        No shipments found
                    </p>
                ) : (
                    shipments.map((s) => (
                        <div
                            key={s.id}
                            className="border-b p-3 flex justify-between items-center"
                        >
                            <div>
                                <p className="font-bold">
                                    {s.shipment_code}
                                </p>

                                <p className="text-sm text-gray-600">
                                    {s.source} → {s.destination}
                                </p>
                            </div>

                            <Badge>{s.shipment_status}</Badge>
                        </div>
                    ))
                )}
            </div>

            <ShipmentForm
                open={open}
                setOpen={setOpen}
                refresh={fetchShipments}
            />
        </div>
    );
}