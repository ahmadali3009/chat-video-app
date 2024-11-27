import React, { createContext, useMemo } from 'react'

let PeerContext = createContext(null)

export let usePeer = ()=>{return React.useContext(PeerContext)} 

export let PeerProvider = (props) => {

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
    }
    let sendStream = async (stream)=>
        {
            let tracks = stream.getTracks();
            for (let track of tracks)
                {
                    peer.addTrack(track , stream)
                }
        }
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
    return (

        <PeerContext.Provider value={{peer , createOffer , createAnswer , setremoteans}}>
            {props.children}
        </PeerContext.Provider>
    )
}

