import React, { useEffect, useRef, useState } from 'react'

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"

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

import { Button } from "@/components/ui/button";
import { socket } from '@/socket';
import Lobby from '@/components/Lobby/Lobby';
import { Input } from '../ui/input';

interface props {
    callParentFunction : () => void
}

const JoinButton = ({callParentFunction} : props) => {

    const [rooms, setRooms] = React.useState<Map<string, Set<string>>>(new Map());
    const counter = useRef(0);
    const [nameText, setNameText] = useState('');
  

    useEffect(() => {
        socket.emit('get-rooms');
        socket.on('rooms', (roomsMap) => {
          console.log(roomsMap);
          setRooms(roomsMap);
          });
        counter.current++;
        console.log(counter.current);
       
        }, []);

        function JoinRoom (roomID: string) {
            socket.emit('join-room-window', roomID);
         
        }

        const handleInputChange = (e : React.ChangeEvent<HTMLInputElement>) => {
            setNameText(e.target.value);
          };

        function HasLength() {
            if (nameText.length < 3) {
                return true
            }
            return false
        }

        function SetName() {
            socket.emit('set-name' , nameText)
        }

        
  return (
    <>
    <AlertDialog>
          <AlertDialogTrigger asChild>
          <Button className="hover:scale-105 transform transition duration-200" onClick={() => {socket.emit('get-rooms')}} style={{margin:'2rem', minWidth:'fit-content', fontSize:'3rem', padding:'1em'}} >Join a lobby</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
          <AlertDialogHeader>
      <AlertDialogTitle className="pl-1 mx-auto">Select your lobby</AlertDialogTitle>
      <AlertDialogDescription className="pt-1">
      </AlertDialogDescription>
    </AlertDialogHeader>
    
    <>
    {Array.from(rooms.entries()).filter(([roomId, roomSet]) => Array.from(roomSet)[0].length === 6)
            .map(([roomId, roomSet], index) => (
    <AlertDialog>


    <AlertDialogTrigger asChild>
        <Button key={roomId}>
        Join {Array.from(roomSet)[0]}
        </Button>
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
            <AlertDialogAction disabled={HasLength()} onClick={() => {SetName(); JoinRoom(Array.from(roomSet)[0])}}>Continue</AlertDialogAction>
    </AlertDialogFooter>


  </AlertDialogContent>    
</AlertDialog>
        ))}
    </>
        

<AlertDialogCancel>Cancel</AlertDialogCancel>
</AlertDialogContent>
</AlertDialog>
    </>
  )
}

export default JoinButton