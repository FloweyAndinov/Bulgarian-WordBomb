import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import Lobby from "@/components/Lobby/Lobby";

interface props {
    socket : Socket
    callParentFunction : () => void
}

const CreateButton = ({socket, callParentFunction} : props) => {
    const [nameText, setNameText] = useState('');
    const [showCreate, setShowCreate] = useState(false);

    useEffect(() => {
        if (showCreate) {
            callParentFunction()
        }
    }, [showCreate])

    const handleInputChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        setNameText(e.target.value);
      };

    function SetName() {
        socket.emit('set-name' , nameText)
    }

  

    function HasLength() {
        if (nameText.length < 3) {
            return true
        }
        return false
    }
  return (
    <AlertDialog>
          <AlertDialogTrigger asChild>
          <Button style={{margin:'2rem', minWidth:'fit-content', fontSize:'1.5em', padding:'1em'}} className='text-green-500' >Create a lobby</Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle className="pl-1">Choose your name</AlertDialogTitle>
      <AlertDialogDescription className="pt-1">
        <Input type="text" placeholder="Write your name here" onChange={handleInputChange}/>
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction disabled={HasLength()} onClick={() => {SetName(); setShowCreate(true)}}>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
        </AlertDialog>
  )
}

export default CreateButton