import React, { useCallback, useEffect, useState } from 'react'
import { useSocket } from "../context/Socket"
import { usePeer } from "../context/Peer"
import Reactplayer from "react-player"
const Roompage = () => {
  let [mystream, setmystream] = useState(null);
  let [remoteemailid , setremoteemailid] = useState();
  let { socket } = useSocket()
  let { createOffer, peer, createAnswer, setremoteans, sendStream, remotestream } = usePeer()
  const handlenewuser = useCallback(
    async (data) => {
      let { emailID } = data;
      console.log("incomming user", emailID);
      let offer = await createOffer();
      console.log("inhandlenew user", offer);
      socket.emit("incomming-user", { offer, emailID });
      setremoteemailid(emailID)
    },
    [socket, createOffer] // Dependencies
  );
  let handleincommingusercall = useCallback(async (data) => {
    console.log("data incomming:", data)
    let { From, offer } = data
    console.log("sadasdadasdasmkfe333------" , From)
    const ans = await createAnswer(offer)
    console.log("answer creating...", ans)
    socket.emit("call-accepted", { emailID: From, ans })
    sendStream(mystream)
    setremoteemailid(From)
  }, [socket, createAnswer])

  let handlecallaccepted = useCallback(async (data) => {
    let { ans } = data
    console.log("call got accecpted", ans)
    await setremoteans(ans)

  }, [setremoteans])

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

  let handlemystearm = useCallback(async () => {
    navigator.mediaDevices.enumerateDevices().then(devices => {
      console.log("Available devices:", devices);
  });
    navigator.permissions.query({ name: "camera" }).then(permissionStatus => {
      console.log("Camera permission status:", permissionStatus.state);
    });
    let stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    })
    console.log("Camera started");
    setmystream(stream)
  }, [])

  useEffect(() => {
    handlemystearm()

  }, [handlemystearm])

  return (
    <div>
      <h1> Video Audia and chat room </h1>
      <h1>the person email you are connected to {remoteemailid}</h1>
      <Reactplayer url={mystream} playing muted />
      <Reactplayer url={remotestream} playing />
      <button onClick={e => sendStream(mystream)} >Connected to user video</button>
    </div>
  )
}

export default Roompage
