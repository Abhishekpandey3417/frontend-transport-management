import AppRoutes from "./routes/AppRoutes";
import { Toaster, toast } from "sonner";
import socket from "./services/socket";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    socket.on("driverUpdated", (data) => {
      toast.info(`Driver status updated: ${data.status}`);
    });

    socket.on("shipmentUpdated", (data) => {
      toast.success(`Shipment updated: ${data.shipment_status}`);
    });

    return () => {
      socket.off("driverUpdated");
      socket.off("shipmentUpdated");
    };
  }, []);

  return (
    <>
      <Toaster position="top-right" />
      <AppRoutes />
    </>
  );
}

export default App;