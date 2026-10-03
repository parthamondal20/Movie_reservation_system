import { Server, Socket } from "socket.io";
export default function initSocket(httpServer: any) {
    const io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true
        }
    })
}