import { io } from "socket.io-client";

const socket = io("https://backend-transport-management-production.up.railway.app", {
    withCredentials: true,
    transports: ["websocket", "polling"],
    autoConnect: true,
});

export default socket;