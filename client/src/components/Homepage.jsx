import React from 'react'
import {useSocket} from "../context/Socket"
const Homepage = () => {
  let {socket} = useSocket()
  socket.emit("join-room" , {roomID : "1" , emailID : "example@gmail.com"})
  return (
    <div className='home-container'>
    <input className='input' type="email" placeholder='enter the email'/>
    <input className='input' type="tel"  placeholder='enter the room number' />
    <button>create</button>
    </div>
  )
}

export default Homepage
