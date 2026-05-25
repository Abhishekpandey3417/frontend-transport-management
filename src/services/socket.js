import { io } from "socket.io-client";

const socket = io("https://fearless-unity-production-362c.up.railway.app/", {
    withCredentials: true,
    transports: ["websocket", "polling"],
    autoConnect: true,
});

export default socket;