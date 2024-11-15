import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { SocketProvider } from './context/Socket.jsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Homepage from './components/Homepage.jsx';
import Roompage from './components/roompage.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage />,
  },  
  {
    path: "/room/:id",
    element: <Roompage/>,
  },
  
]);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SocketProvider>
    <RouterProvider router={router} />
    <App />
    </SocketProvider>
  </StrictMode>,
)
