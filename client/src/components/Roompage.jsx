import React, { useEffect } from 'react'
import {useSocket } from "../context/Socket"
import {usePeer} from "../context/Peer"
const Roompage = () => {

    let {socket} = useSocket()
    let { createOffer , peer } = usePeer()
    let handlenewuser = async (data) =>
        {
            let {emailID} = data
            console.log("incomming user", emailID)
            let offer = await createOffer()
            socket.emit("incomming-user" , {offer , emailID})
        }

        let handleincommingusercall = async (data) =>
          {
              let {From, offer} = data
              console.log("offer:" , offer )
          }

    useEffect(()=>
        {
          if (!socket) {
            console.error("Socket is not initialized");
            return;
        }
        socket.on("user-joined" , handlenewuser)
        socket.on("incomming-usercall" , handleincommingusercall)
        },[socket , handlenewuser , handleincommingusercall])


  return (
    <div>
      <h1> Video Audia and chat room </h1>
    </div>
  )
}

export default Roompage
