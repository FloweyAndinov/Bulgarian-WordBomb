import React, { useEffect, useState } from 'react'

interface Props {
    enabled : boolean
}
function WordSection({enabled}: Props) {

    const [typeable, setTypable] = useState(enabled)

   function sendWord() {
    //socket.emit('send-word', word)
   }


  return (
    <>
    {typeable? <Enabled/> : <Disabled/>}
    </>
  )
}

function Enabled() {
return (
    <>

    </>
)
}

function Disabled() {
    return (
        <>

        </>
    )
}

export default WordSection