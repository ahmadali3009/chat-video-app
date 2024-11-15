import React, { useEffect } from 'react'
import {useSocket} from "../context/Socket"
const Roompage = () => {
    let socket = useSocket()
    let handlenewuser = (data) =>
        {
            console.log("data", data)
            let {emailID} = data
            console.log("user" , emailID)
        }
    useEffect(()=>
        {
            socket.on("user-joined" , handlenewuser)
        },[socket])


  return (
    <div>
      <h1> Video Audia and chat room </h1>
    </div>
  )
}

export default Roompage
