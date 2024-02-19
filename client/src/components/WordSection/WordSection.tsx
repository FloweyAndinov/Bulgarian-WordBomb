import React, { useEffect, useRef, useState } from 'react'
import { Socket } from 'socket.io-client'
import styles from "../WordSection/WordSection.module.scss"

interface Props {
    socket : Socket
    enabled : boolean
    word : string
    playerword : string
    roomIDProp : string
}

interface EnabledProps {
    socket : Socket
    roomIDProp : string
}
function WordSection({socket, enabled, roomIDProp}: Props) {
    const [typeable, setTypeable] = useState(false)
    const [roomId, setRoomID] = useState<string>("")
    const [currentword, setCurrentWord] = useState("")
    useEffect(() => {
    setTypeable(enabled)
    // console.log(enabled)
    // console.log(typeable)
    },[enabled])
    
    useEffect(() => {
        setRoomID(roomIDProp)
    }, [roomIDProp])

    // socket.on('recieve-player-word', (word : string) => {
    //     setPlayerWord(word)
    // })

    // socket.on ('recieve-word-to-play', (word : string) => {
    //     setCurrentWord(word)
    // })

   

   

  return (
    <>
    {typeable? <Enabled socket={socket} roomIDProp={roomId}/> : <Disabled/>}
    </>
  )

  
}

function Enabled({socket, roomIDProp}: EnabledProps) {

    const [playerWord, setPlayerWord] = useState("")
    const [roomId, setRoomID] = useState<string>("")
    const inputTextRef = useRef<HTMLInputElement | null>(null);
    useEffect(() => {
       
        console.log(roomIDProp? 'id found' : 'id not found')
        window.addEventListener('keydown', submitWordtoServer);

        return () => {
            window.removeEventListener('keydown', submitWordtoServer);
        };


    }, [playerWord])

    useEffect(() => {
            setRoomID(roomIDProp)
    }, [])
    
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
        // event.preventDefault();
        const wordToSend = playerWord
        if (event.key === 'Enter' && wordToSend.trim()) {
            // console.log(roomId)
                socket.emit('request-submit-word', wordToSend, roomId)
                if (inputTextRef.current) {
                    inputTextRef.current.value = '';
                    inputTextRef.current.focus()
                }
          }
        if (event.code === 'Space') {
            event.preventDefault();
        }
        
    };
    

       
    return (
        <>
        <div>
        <span className={styles.textInput} >Press Enter to send</span>
        <br/>
            <input ref={inputTextRef} onChange={changeText}/>
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
