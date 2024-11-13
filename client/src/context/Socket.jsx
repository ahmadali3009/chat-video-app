import React, { useMemo } from 'react'
import { io } from "socket.io-client"

let SocketContext = React.createContext(null);



export let useSocket = ()=>
    {
        return React.useContext(SocketContext)
    }
export const SocketProvider = (props) =>
    {
        let socket = useMemo(()=>io("http://localhost:8001"),[])
        return(
        <SocketContext.Provider value = {{socket}} >
            {props.children}
        </SocketContext.Provider>
        )
    }
