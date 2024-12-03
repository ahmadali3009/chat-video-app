let express = require("express")
let { Server } = require("socket.io")
let cors = require('cors')


let io = new Server(
    {
        cors: true
    }
)
let server = express();
let port = 8080



let emailtosocketid = new Map()
let socketidtoemail = new Map()
io.on("connection", (socket) => {

    socket.on("join-room", (data) => {
        let { roomID, emailID } = data
        console.log("emailid and roomid", roomID)

        emailtosocketid.set(emailID, socket.id)
        let socketidcheck = socketidtoemail.set(socket.id, emailID)
        console.log("id checking for room", socketidcheck)
        socket.join(roomID);
        socket.emit("joined-room", { roomID })
        setTimeout(() => {
            socket.broadcast.to(roomID).emit("user-joined", { emailID });
        }, 100);
    })

    socket.on("incomming-user", (data) => {
        let { offer, emailID } = data
        console.log("offer", offer, "user incomming", emailID)
        let fromEmail = socketidtoemail.get(socket.id)
        let socketid = emailtosocketid.get(emailID)
        console.log("socketid---", socketid, "fromEmail----", fromEmail)
        if (io.sockets.sockets.get(socketid)) {
            socket.to(socketid).emit("incomming-usercall", { From: fromEmail, offer });
            console.log(`Emitted 'incomming-usercall' to socketid: ${socketid}`);
        } else {
            console.error(`Socket ID ${socketid} is not connected.`);
        } console.log("Connected sockets:", io.sockets.sockets.keys());
    })

    socket.on("call-accepted", (data) => {
        let { emailID, ans } = data;
        let socketid = emailtosocketid.get(emailID)
        setTimeout(() => {
            socket.to(socketid).emit("call-accepte", { ans })
        }, 100)
    })


    console.log(`Socket connected: ${socket.id}`);
    socket.on("disconnect", (reason) => {
        console.log(`Socket disconnected: ${socket.id}, Reason: ${reason}`);
    });
})

server.listen(port, () => {
    console.log("server is running on port 8080")
})
io.listen(8001, () => { console.log("socket server is running on 8001") })
