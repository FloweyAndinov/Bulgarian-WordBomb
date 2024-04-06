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
import { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import Lobby from "@/components/Lobby/Lobby";
import { socket } from "@/socket";

interface props {
    socket : Socket
    callParentFunction : () => void
}

const CreateButton = ({socket, callParentFunction} : props) => {
    const [nameText, setNameText] = useState('');
    const [showCreate, setShowCreate] = useState(false);
    const textref = useRef<string>('')
    const inputref = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (showCreate) {
            callParentFunction()
        } 
    }, [showCreate])

   

    function defaultValue () {
      if (inputref.current) {
          console.log("success input value")
          textref.current = inputref.current.value,
          setNameText(textref.current)
      } else if (inputref.current == null) {
        console.log("failed input value")
        setTimeout(defaultValue, 5);
      }
    }

    const handleInputChange = (e : React.ChangeEvent<HTMLInputElement>) => {
      
      if (HasLength(e.target.value)) {
        textref.current = e.target.value;
        setNameText(textref.current);
        
      }
      };

    function SetName() {
        socket.emit('set-name' , textref.current)
    }

  

    function HasLength(name : string) {
        if (name.length >= 3) {
            return true
        }
        return false
    }

    function HasLengthButton() {
      if (inputref && inputref.current) {
         if (inputref.current.value.length < 3) {
          return true
         }
         return false
      }
      else {
        setTimeout(HasLengthButton,5);
      }
  }
  return (
    <AlertDialog onOpenChange={defaultValue}>
          <AlertDialogTrigger asChild>
          <Button className="hover:scale-105 transform transition duration-200" style={{margin:'2rem', minWidth:'fit-content', fontSize:'3rem', padding:'1em'}}>Създай игра</Button>
          

          </AlertDialogTrigger>

          <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle className="pl-1">Напиши име</AlertDialogTitle>
      <AlertDialogDescription className="pt-1">
        <Input 
          defaultValue='test'
          ref={inputref} 
          type="text" 
          placeholder="Напиши си името тук..." 
          onChange={handleInputChange}
          onFocus={defaultValue}/>
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Отказ</AlertDialogCancel>
      <AlertDialogAction 
      disabled={HasLengthButton()}
       onClick={() => {SetName(); setShowCreate(true)}}>Създай</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
        </AlertDialog>
  )
}

export default CreateButton