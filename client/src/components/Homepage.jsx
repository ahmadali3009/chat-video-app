import React, { useEffect, useState } from 'react'
import {useNavigate} from "react-router-dom"
import {useSocket} from "../context/Socket"
const Homepage = () => {
  let navigation = useNavigate()
  let {socket} = useSocket()
  let [input , setinput] = useState({
    emailID : "",
    roomID : ""
  })
  let handlejoinedroom = ({roomID})=>{
    navigation(`/room/${roomID}`)
  } 
  useEffect(()=>{
    socket.on("joined-room",handlejoinedroom)

  },[socket])
  let handleroom = ()=>
    {
      socket.emit("join-room" , {roomID : input.roomID , emailID : input.emailID})
    }

  let handleinput = (e)=>
    {
      let {name , value} = e.target
      console.log("name" , name ,"value" ,value)
      setinput({...input, [name]:value})
    }

  return (
    <div className='home-container'>
    <input className='input' type="email" placeholder='enter the email' onChange={handleinput} value={input.emailID} name='emailID'/>
    <input className='input' type="tel"  placeholder='enter the room number' onChange={handleinput} value={input.roomID} name='roomID'/>
    <button onClick={handleroom}>create</button>
    </div>
  )
}

export default Homepage
