import React, { useEffect, useState } from 'react'
import { Socket } from 'socket.io-client'
import styles from "../WordSection/WordSection.module.scss"

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

    socket.on('recieve-player-word', (word : string) => {
        setPlayerWord(word)
    })

    socket.on ('recieve-word-to-play', (word : string) => {
        setCurrentWord(word)
    })

    useEffect(() => {
        setTypeable(enabled)
        if (enabled) {
            setPlayerWord("")
            window.addEventListener('keydown', submitWordtoServer);
        }
        else {
            setPlayerWord("")
            window.removeEventListener('keydown', submitWordtoServer);
        }
    }, [enabled])

    const sendWordtoServer = (word: string) => {
        setCurrentWord(word);
        //not implemented - socket.emit('send-player-word', word)
    };
  
    
    const submitWordtoServer = (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
            console.log('do validate');
             //not implemented - socket.emit('submit-player-word', playerWord)
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
        <div>
        <span className={styles.textInput}>Press Enter to send</span>
        <br/>
            <input onChange={changeText}/>
        </div>
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
