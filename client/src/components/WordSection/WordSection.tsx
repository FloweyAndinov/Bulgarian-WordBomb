import React, { useEffect, useState } from 'react'
import { Socket } from 'socket.io-client'
import styles from "../WordSection/WordSection.module.scss"

interface Props {
    socket : Socket
    enabled : boolean
    word : string
    playerword : string
    roomID? : string
}

interface EnabledProps {
    socket : Socket
    roomID? : string
}
function WordSection({socket, enabled, roomID}: Props) {
    const [typeable, setTypeable] = useState(false)
    const [roomId, setRoomID] = useState('')
    const [currentword, setCurrentWord] = useState("")
    useEffect(() => {
    setTypeable(enabled)
    // console.log(enabled)
    // console.log(typeable)
    },[enabled])
    
    useEffect(() => {
        if (roomID !=null) {
            setRoomID(roomID)
        }
        else {
            setRoomID(socket.id.slice(-6))
        }
    }, [roomID])

    // socket.on('recieve-player-word', (word : string) => {
    //     setPlayerWord(word)
    // })

    // socket.on ('recieve-word-to-play', (word : string) => {
    //     setCurrentWord(word)
    // })

   

   

  return (
    <>
    {typeable? <Enabled socket={socket} roomID={roomID}/> : <Disabled/>}
    </>
  )

  
}

function Enabled({socket, roomID}: EnabledProps) {

    const [playerWord, setPlayerWord] = useState("")
    const [roomId, setRoomID] = useState('')


    useEffect(() => {
        console.log(roomID? 'found' : 'not found')
        window.addEventListener('keydown', submitWordtoServer);

        return () => {
            window.removeEventListener('keydown', submitWordtoServer);
        };


    }, [playerWord])

    useEffect(() => {
            setRoomID(socket.id.slice(-6))
    }, [roomID])
    
    function changeText(e: React.FormEvent<HTMLInputElement>) {
        const text = e.currentTarget.value
        sendWordtoServer(text)
        
    }

    const sendWordtoServer = (word: string) => {
        setPlayerWord(word)
        console.log(word)
        //not implemented - socket.emit('send-player-word', word)
    };
  
    
    const submitWordtoServer = (event: KeyboardEvent) => {
        const wordToSend = playerWord
        if (event.key === 'Enter') {
            console.log(wordToSend , 'trying to send');
            // console.log(roomId)
                socket.emit('request-submit-word', wordToSend, roomId)
          }
    };
    

       
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
