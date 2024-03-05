import { BrowserRouter } from 'react-router-dom';
import Home from './components/Home/Home';
import {socket} from './socket'
import { ThemeProvider } from './components/theme-provider';

function App() {

  return (
    <BrowserRouter>
     <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    {socket ? <Home socket={socket}/> : null}
    </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
