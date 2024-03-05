import React, { useEffect, useRef } from 'react'

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

interface props {
    callParentFunction : () => void
}

const JoinButton = ({callParentFunction} : props) => {

    const [rooms, setRooms] = React.useState<Map<string, Set<string>>>(new Map());
    const counter = useRef(0);
  

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

        
  return (
    <>
    <AlertDialog>
          <AlertDialogTrigger asChild>
          <Button onClick={() => {socket.emit('get-rooms')}} style={{margin:'2rem', minWidth:'fit-content', fontSize:'1.5em', padding:'1em'}} className='text-green-500' >Join a lobby</Button>
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
              <Button key={roomId} onClick={() => {JoinRoom(Array.from(roomSet)[0]); console.log('sent join')}}>
                  Join {Array.from(roomSet)[0]}
              </Button>
        ))}
    </>
        

<AlertDialogCancel>Cancel</AlertDialogCancel>
</AlertDialogContent>
</AlertDialog>
    </>
  )
}

export default JoinButton