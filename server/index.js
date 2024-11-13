let express = require("express")
let {Server} = require("socket.io")
let cors = require('cors')


let io = new Server(
    {
        cors : true
    }
)
let server = express();
let port = 8080




let emitfromclient = new Map()
io.on("connection" , (socket)=>{
    console.log("connection is connected")
    socket.on("join-room" , (data)=>
        {
            let {roomID , emailID} = data
            console.log("emailid and roomid", roomID)
            emitfromclient.set(roomID, emailID)
            socket.join(roomID);
            socket.broadcast.to(roomID).emit("user-joined" , {emailID});
        })
       
    socket.on("disconnect" , ()=>{
        console.log("connection is not connect")
    });
})

server.listen(port, ()=>{
    console.log("server is running on port 8080")
})
io.listen(8001, ()=>{console.log("socket server is running on 8001")})