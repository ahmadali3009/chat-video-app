import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'

let PeerContext = createContext(null)

export let usePeer = ()=>{return React.useContext(PeerContext)} 

export let PeerProvider = (props) => {
    let [remotestream , setremotestream] = useState(null)

    let createOffer =async ()=>
        {
           let offer = await peer.createOffer()
           await peer.setLocalDescription(offer)
           return offer;
        }


    let createAnswer = async (offer)=>
        {
            await peer.setRemoteDescription(offer)
            let ans = peer.createAnswer()
            await peer.setLocalDescription(ans)
            return ans
        } 
    let setremoteans = async (ans)=>{
        await peer.setRemoteDescription(ans)
        console.log("what type of ans i am getting" , ans)

    }
    let sendStream = async (stream)=>
        {
            let tracks = stream.getTracks();
            for (let track of tracks)
                {
                    peer.addTrack(track , stream)
                }
        }
    let handletrackwithstream = useCallback((ev)=>
        {
            let streams = ev.streams;
            setremotestream(streams[0])
        },[])

 
    let peer = useMemo(() => new RTCPeerConnection({
        iceServers: [
            {
                urls: [
                    "stun:stun.l.google.com:19302", // Google public STUN server
                    "stun:stun1.l.google.com:19302",  // Another Google STUN server
                ],
            },
        ],
    }), [])


    useEffect(()=>
        {
            peer.addEventListener("track" , handletrackwithstream)

            return ()=>
                {
                    peer.removeEventListener("track" , handletrackwithstream)

                }
        },[peer , handletrackwithstream ])
    return (

        <PeerContext.Provider value={{peer , createOffer , createAnswer , setremoteans , sendStream , remotestream}}>
            {props.children}
        </PeerContext.Provider>
    )
}

