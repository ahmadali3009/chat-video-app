import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useSocket } from "../context/Socket"
import { usePeer } from "../context/Peer"
import Reactplayer from "react-player"
const Roompage = () => {
  let [mystream, setmystream] = useState(null);
  let [remoteemailid , setremoteemailid] = useState();
  let { socket } = useSocket()
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
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
    let { ans } = data
    console.log("call got accecpte", ans)
    await setremoteans(ans)

  }, [socket, setremoteans])



  useEffect(() => {
    if (!socket) {
      console.error("Socket is not initialized");
      return;
    }
    socket.on("user-joined", handlenewuser)
    socket.on("incomming-usercall", handleincommingusercall)
    socket.on("call-accepte", handlecallaccepted)

    // Cleanup function
    return () => {
      socket.off("user-joined", handlenewuser);
      socket.off("incomming-usercall", handleincommingusercall);
      socket.off("call-accepte", handlecallaccepted);
    };
  }, [socket, handlenewuser, handleincommingusercall, handlecallaccepted])

  let handlemystearm = useCallback(async () => {
    try {
      // Log available devices
      const devices = await navigator.mediaDevices.enumerateDevices();
      console.log("Available devices:", devices);
  
      // Check camera permissions
      const permissionStatus = await navigator.permissions.query({ name: "camera" });
      console.log("Camera permission status:", permissionStatus.state);
  
      // Access media stream
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      console.log("Camera started");
      setmystream(stream);
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  }, []);

  useEffect(() => {
    handlemystearm()

  }, [handlemystearm])

  let handlenegotiation = useCallback(async () => {
    try {
      console.log("Negotiation needed");
      
      // Only negotiate if signaling state is stable
      if (peer.signalingState !== "stable") {
        console.warn("Signaling state not stable:", peer.signalingState);
        return; // Wait until stable to renegotiate
      }
  
      // Create a new offer
      const newOffer = await peer.createOffer();
      await peer.setLocalDescription(newOffer);
      console.log("Local offer created and set:", newOffer);
  
      // Send the offer to the remote peer
      socket.emit("incomming-user", { offer: newOffer, emailID: remoteemailid });
    } catch (error) {
      console.error("Error during negotiation:", error);
    }
  }, [peer, socket, remoteemailid]);
  

    useEffect(()=>
      {
          peer.addEventListener("negotiationneeded" , handlenegotiation)

          return ()=>
              {
                  peer.removeEventListener("negotiationneeded" , handlenegotiation)

              }
      },[peer , handlenegotiation])
      useEffect(() => {
        if (localVideoRef.current && mystream) {
          localVideoRef.current.srcObject = mystream;
        }
        if (remoteVideoRef.current && remotestream) {
          remoteVideoRef.current.srcObject = remotestream;
        }
      }, [mystream, remotestream]);

  return (
    <div>
      <h1> Video Audia and chat room </h1>
      <h1>the person email you are connected to {remoteemailid}</h1>
        {/* Local video */}
        <video
        ref={localVideoRef}
        autoPlay
        muted
        style={{ width: '300px', border: '1px solid black', margin: '10px' }}
      />

      {/* Remote video */}
      <video
        ref={remoteVideoRef}
        autoPlay
        style={{ width: '300px', border: '1px solid black', margin: '10px' }}
      />

      <button onClick={(e) => sendStream(mystream)} >Connected to user video</button>
    </div>
  )
}

export default Roompage
