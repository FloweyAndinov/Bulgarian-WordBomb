import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import {Socket, io} from 'socket.io-client'
import Home from './components/Home/Home';
import {socket} from './socket'
function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);


 


  return (
    <>
    {socket ? <Home socket={socket}/> : null}
    </>
  )
}

export default App
