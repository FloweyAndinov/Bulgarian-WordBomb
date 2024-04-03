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
    word: string
}
function WordSection({socket, enabled, roomIDProp, word, playerword}: Props) {
    const [typeable, setTypeable] = useState(false)
    const [roomId, setRoomID] = useState<string>("")    

   
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
    {typeable? <Enabled socket={socket} roomIDProp={roomId} word={word}/> : <Disabled otherPlayerWord={playerword} currentWord={word}/>}
    </>
  )

  
}

function Enabled({socket, roomIDProp, word}: EnabledProps) {

    const [playerWord, setPlayerWord] = useState("")
    const [roomId, setRoomID] = useState<string>("")
    const chars = useRef('')
    useEffect(() => {
       
        console.log(roomIDProp? 'id found' : 'id not found')
        window.addEventListener('keydown', submitWordtoServer);

        return () => {
            window.removeEventListener('keydown', submitWordtoServer);
        };


    }, [playerWord])

    useEffect(() => {
            setRoomID(roomIDProp)

            window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
          };
    }, [])
    
  
    function handleKeyDown( event : KeyboardEvent) {
        if (event.code == "Backspace") {
          chars.current = chars.current.slice(0, -1)
          setPlayerWord(chars.current)
           socket.emit('recieve-preview-word', chars.current, roomIDProp)
          return
        }
        if (event.code == "Space" || event.code == "Delete") {
          chars.current = "";
          setPlayerWord(chars.current)
         socket.emit('recieve-preview-word', chars.current, roomIDProp)
          return
        }
        if (event.key.length > 1)
          return
        chars.current = chars.current + event.key
        setPlayerWord(chars.current)
        socket.emit('recieve-preview-word', chars.current, roomIDProp)
        
      }

    
    const submitWordtoServer = (event: KeyboardEvent) => {
        console.log("send word " + playerWord)
        const wordToSend = playerWord;
        if (event.key === 'Enter' && wordToSend.trim()) {
            console.log("i pressed enter")
            socket.emit('request-submit-word', wordToSend, roomId)
          }
        
    };

    socket.on('word-submit-denied', () => {
     // shake the container div
    })
    

       
    return (
        <>
        <span className={styles.textInput} >Press Enter to send</span>
        <br/>

        <div style={{display:'flex', height : '1.5em', justifyContent:'center'}}>
        {playerWord.length < 1 ? 
        <div style={{borderRadius : '5px', fontSize:'2em', width:'1em', height : '1.5em', backgroundColor : 'brown', textAlign:'center', margin:'0.1em'}}></div> :
         playerWord.split('').map((char, index) => (
          
          word[0].includes(char) && word[1].includes(playerWord[index + 1]) ||  word[1].includes(char) && word[0].includes(playerWord[index - 1])? 
        <div style={{borderRadius : '5px', fontSize:'2em', width:'1em', height : '1.5em', backgroundColor : 'green', textAlign:'center', margin:'0.1em'}}> {char} </div>
          : 
        <div style={{borderRadius : '5px', fontSize:'2em', width:'1em', height : '1.5em', backgroundColor : 'brown', textAlign:'center', margin:'0.1em'}}> {char} </div>

        ))}
        </div>
            
        </>
    )
}

interface DisabledProps {
  currentWord : string
otherPlayerWord : string | "error"
}
const Disabled = ({otherPlayerWord, currentWord} : DisabledProps) => {


  useEffect(() => {
    console.log(otherPlayerWord, otherPlayerWord.length)
    }, [otherPlayerWord])


    return (
        <>
         <div style={{display:'flex', height : '1.5em', justifyContent:'center'}}>
        {otherPlayerWord.length < 1 ? 

        <div style={{borderRadius : '5px', fontSize:'2em', width:'1em', height : '1.5em', backgroundColor : 'brown', textAlign:'center', margin:'0.1em'}}></div>
        
        :


        otherPlayerWord.split('').map((char, index) => (
          
        currentWord[0].includes(char) && currentWord[1].includes(otherPlayerWord[index + 1]) ||  currentWord[1].includes(char) && currentWord[0].includes(otherPlayerWord[index - 1])
        ? 
        <div style={{borderRadius : '5px', fontSize:'2em', width:'1em', height : '1.5em', backgroundColor : 'green', textAlign:'center', margin:'0.1em'}}> {char} </div>
          : 
        <div style={{borderRadius : '5px', fontSize:'2em', width:'1em', height : '1.5em', backgroundColor : 'brown', textAlign:'center', margin:'0.1em'}}> {char} </div>

        ))}
        </div>
        </>
    )
}



export default WordSection
