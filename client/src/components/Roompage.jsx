import React, { useCallback, useEffect } from 'react'
import { useSocket } from "../context/Socket"
import { usePeer } from "../context/Peer"
const Roompage = () => {

  let { socket } = useSocket()
  let { createOffer, peer, createAnswer, setremoteans } = usePeer()
  const handlenewuser = useCallback(
    async (data) => {
      let { emailID } = data;
      console.log("incomming user", emailID);
      let offer = await createOffer();
      console.log("inhandlenew user", offer);
      socket.emit("incomming-user", { offer, emailID });
    },
    [socket, createOffer] // Dependencies
  );
  let handleincommingusercall = useCallback( async (data) => {
    let { From, offer } = data
    console.log("offer:", offer)
    const ans = await createAnswer(offer)
    console.log("answer creating...", ans)
    socket.emit("call-accepted", { emailID: From, ans })
  },[socket , createAnswer ])

  let handlecallaccepted = useCallback (async (data) => {
    let { ans } = data
    console.log("call got accecpted", ans)
    await setremoteans(ans)

  },[setremoteans])

  useEffect(() => {
    if (!socket) {
      console.error("Socket is not initialized");
      return;
    }
    socket.on("user-joined", handlenewuser)
    socket.on("incomming-usercall", handleincommingusercall)
    socket.on("call-accepted", handlecallaccepted)

    // Cleanup function
    return () => {
      socket.off("user-joined", handlenewuser);
      socket.off("incomming-usercall", handleincommingusercall);
      socket.off("call-accepted", handlecallaccepted);
    };
  }, [socket, handlenewuser, handleincommingusercall, handlecallaccepted])


  return (
    <div>
      <h1> Video Audia and chat room </h1>
    </div>
  )
}

export default Roompage
