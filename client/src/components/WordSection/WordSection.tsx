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
    const [word, setWord] = useState("")
    const [playerWord, setPlayerWord] = useState("")

    useEffect(() => {
        setTypeable(enabled)
    }, [enabled])

    const sendWordtoServer = (word: string) => {
        setWord(word);
        socket.emit('send-player-word', word)
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
            <input onChange={changeText}/>
            <button>Send</button>
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
