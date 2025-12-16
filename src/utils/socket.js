import { Server } from "socket.io";

const initialiseSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: [
                "http://localhost:5173",
                process.env.CLIENT_URL
            ]
        }
    });

    io.on("connection", (socket) => {
        socket.on("joinChat", ({ userId, targetUserId }) => {
            const roomId = [userId, targetUserId].join("_");

            console.log("Joining room: " + roomId);
            socket.join(roomId);
        });

        socket.on("sendMessage", () => {

        });

        socket.on("disconnect", () => {

        });
    });

    return io;
};

export default initialiseSocket;