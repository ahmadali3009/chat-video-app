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
    setremoteemailid(From)
  }, [socket, createAnswer])

  let handlecallaccepted = useCallback(async (data) => {
    let { ans } = data;
    console.log("Call got accepted", ans);
  
    // Check signaling state before setting remote description
    if (peer.signalingState !== "have-local-offer") {
      console.error("Cannot set remote answer. Current state:", peer.signalingState);
      return;
    }
  
    try {
      await peer.setRemoteDescription(new RTCSessionDescription(ans));
      console.log("Remote answer set successfully.");
    } catch (error) {
      console.error("Failed to set remote answer:", error);
    }
  }, [peer]);


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

  let handlenegotiation = useCallback(()=>
    {
      let localOffer =  peer.localDescription; 
      console.log("localoffer",localOffer)
      socket.emit("incomming-user", {offer:localOffer, emailID:remoteemailid})
    },[peer , socket , remoteemailid])

    useEffect(()=>
      {
          peer.addEventListener("negotiationneeded" , handlenegotiation)

          return ()=>
              {
                  peer.removeEventListener("negotiationneeded" , handlenegotiation)

              }
      },[peer , handlenegotiation])

  return (
    <div>
      <h1> Video Audia and chat room </h1>
      <h1>the person email you are connected to {remoteemailid}</h1>
      <Reactplayer url={mystream} playing muted />
      <Reactplayer url={remotestream} playing />
      <button onClick={(e) => sendStream(mystream)} >Connected to user video</button>
    </div>
  )
}

export default Roompage
