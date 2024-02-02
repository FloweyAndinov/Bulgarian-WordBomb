import React, { useEffect, useState } from 'react'
import { Socket } from 'socket.io-client'

interface Props {
    socket : Socket
    enabled : boolean
    word : string
    playerword : string
}
function WordSection({socket, enabled}: Props) {

    const [typeable, setTypeable] = useState(false)
    const [currentword, setCurrentWord] = useState("")
    const [playerWord, setPlayerWord] = useState("")

    useEffect(() => {
        setTypeable(enabled)
        if (enabled) {
            window.addEventListener('keydown', submitWordtoServer);
        }
        else {
            window.removeEventListener('keydown', submitWordtoServer);
        }
    }, [enabled])

    const sendWordtoServer = (word: string) => {
        setCurrentWord(word);
        socket.emit('send-player-word', word)
    };
  
    
    const submitWordtoServer = (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
            console.log('do validate');
            socket.emit('submit-player-word', currentword)
          }
    };

  return (
    <>
    {typeable? <Enabled sendWord={sendWordtoServer}/> : <Disabled/>}
    </>
  )

  
}

const Enabled = ({ sendWord }: { sendWord: (word: string) => void }) => {

    function changeText(e: React.FormEvent<HTMLInputElement>) {
        const text = e.currentTarget.value
        sendWord(text)
    }

       
    return (
        <>
        <span>Press Enter to send</span>
        <br/>
            <input onChange={changeText}/>
        </>
    )
}

const Disabled = () => {
    return (
        <>
        <span>Disabled</span>
        </>
    )
}



export default WordSection
