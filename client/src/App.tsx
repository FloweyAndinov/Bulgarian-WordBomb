import { BrowserRouter } from 'react-router-dom';
import './App.css'
import Home from './components/Home/Home';
import {socket} from './socket'
function App() {

  return (
    <BrowserRouter>
    {socket ? <Home socket={socket}/> : null}
    </BrowserRouter>
  )
}

export default App
