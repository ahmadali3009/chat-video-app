import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";

let PeerContext = createContext(null);

export let usePeer = () => React.useContext(PeerContext);

export let PeerProvider = (props) => {
  let [remotestream, setremotestream] = useState(null);

  let peer = useMemo(
    () =>
      new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:global.stun.twilio.com:3478",

            ],
          },
        ],
      }),
    []
  );

  let createOffer = async () => {
    let offer = await peer.createOffer();
    await peer.setLocalDescription(new RTCSessionDescription(offer));
    return offer;
  };

  let createAnswer = async (offer) => {
    await peer.setRemoteDescription(offer);
    let ans = await peer.createAnswer();
    await peer.setLocalDescription(new RTCSessionDescription(ans));
    return ans;
  };

  let setremoteans = async (ans) => {
    if (peer.signalingState === "have-local-offer") {
      try {
        await peer.setRemoteDescription(new RTCSessionDescription(ans));
        console.log("Remote answer set successfully:", ans);
      } catch (error) {
        console.error("Failed to set remote answer:", error);
      }
    } else {
      console.warn(
        "Cannot set remote answer. Current signaling state:",
        peer.signalingState
      );
    }
  };

  let sendStream = async (stream) => {
    if (!stream) {
      console.error("No stream to send.");
      return;
    }
    stream.getTracks().forEach((track) => {
      peer.addTrack(track, stream);
      console.log("Track added:", track);
    });
  };

  let handletrackwithstream = useCallback((event) => {
    console.log("Track event:", event);
    let streams = event.streams;
    if (streams && streams.length > 0) {
      setremotestream(streams[0]);
    } else {
      console.warn("No streams received with the track.");
    }
  }, []);

  useEffect(() => {
    peer.addEventListener("track", handletrackwithstream);

    return () => {
      peer.removeEventListener("track", handletrackwithstream);
    };
  }, [peer, handletrackwithstream]);

  peer.onicecandidate = (event) => {
    if (event.candidate) {
      console.log("New ICE candidate:", event.candidate);
      // You need to emit this candidate to the signaling server
    } else {
      console.log("All ICE candidates sent.");
    }
  };

  peer.oniceconnectionstatechange = () => {
    console.log("ICE connection state:", peer.iceConnectionState);
  };

  peer.onconnectionstatechange = () => {
    console.log("Connection state changed:", peer.connectionState);
    if (peer.connectionState === "failed") {
      console.error("Connection failed. Restarting negotiation...");
    }
  };

  peer.onsignalingstatechange = () => {
    console.log("Signaling state changed:", peer.signalingState);
  };

  return (
    <PeerContext.Provider
      value={{
        peer,
        createOffer,
        createAnswer,
        setremoteans,
        sendStream,
        remotestream,
      }}
    >
      {props.children}
    </PeerContext.Provider>
  );
};
