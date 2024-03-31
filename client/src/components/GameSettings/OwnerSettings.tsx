import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { Separator } from "@/components/ui/separator"
  
import { Button } from "@/components/ui/button"
import { Cog, Copy } from 'lucide-react';
import { useEffect, useRef, useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import { Switch } from "@/components/ui/switch"
import { socket } from "@/socket";

import settings_sound from '@/assets/sfx/Settings_Buttons.mp3'


interface props {
  roomID: string
}
  

const OwnerSettings = ({roomID}: props) => {
  const [visible, setVisible] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null);
  const [roomPublic , setRoomPublic] = useState<boolean>(true);
  const [roomLocked , setRoomLocked] = useState<boolean>(false);
  const [streamerMode, setStreamerMode] = useState<boolean>(false);
  const [playerList , setPlayerList] = useState<Array<string>>([]);
  let baseurl = window.location.href.split('?')[0];
  let invitelink = baseurl + '?id=' + roomID
  let copyMessage = "Copied to clipboard"

  function play() {
    new Audio(settings_sound).play()
  }

  useEffect(() => {
    socket.emit('request-players-names', roomID);
  },[])

  function handleFocus () {
    if (inputRef.current) {
      if (streamerMode) {
        //copy link
        navigator.clipboard.writeText(invitelink)
        toast(copyMessage)
      }
    inputRef.current.select();
    }
  };

  function handleRoomLock(pendingStatus : boolean) {
    setRoomLocked(pendingStatus)
    if (pendingStatus) {
      console.log('sent lock room')
      socket.emit('lock-room', roomID); // todo in server
    }
    else {
      console.log('sent unlock room')
      socket.emit('unlock-room', roomID); // todo in server
    }
  }

  function handleRoomPublic(pendingStatus : boolean) {
    setRoomPublic(pendingStatus)
    if (pendingStatus) {
      console.log('sent public room')
      socket.emit('change-public-room', roomID); // todo in server
    }
    else {
      console.log('sent private room')
      socket.emit('change-private-room', roomID); // todo in server
    }
  }

  socket.on('recieve-players-names', (recievedList : Array<string>) => {
    setPlayerList(recievedList)
    console.log('recieved players')
})

function sendKick (player : string) {
  socket.emit('kick-player', player, roomID);
}
      
  return (
    <Sheet modal={false} onOpenChange={() => {setVisible(!visible); play()}}>
      

    <SheetTrigger asChild style={{display: visible ? undefined : 'none'}}>
      <Button style={{width:'fit-content'}}>
      <Cog />
      </Button>
    </SheetTrigger>

  <SheetContent>
  <SheetHeader>
    <SheetTitle style={{textAlign:'center', marginBottom:'1rem'}}>Owner controls</SheetTitle>
    
    <SheetDescription>
      <span>Room settings</span>


    <Accordion type="single" collapsible>
       


     <AccordionItem value="item-1">
        <AccordionTrigger onClick={() => {play()}}>Manage room</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-row justify-between my-3">
              {roomPublic ? <span>Currently room is public</span> : <span>Currently room is private</span>}
              <Switch checked={roomPublic} onClick={() => {handleRoomPublic(!roomPublic); play()}}/>
              </div>
              <div className="flex flex-row justify-between my-3">
              {roomLocked ? <span>Currently room is locked</span> : <span>Currently room is unlocked</span>}
              <Switch checked={roomLocked} onClick={() => {handleRoomLock(!roomLocked); play()}}/>
              </div>
            </AccordionContent>
        </AccordionItem>

        


      </Accordion>
    </SheetDescription>
      <div style={{margin:'1rem'}}></div>
    <SheetDescription >
    <span>Player settings</span>
    <Accordion type="single" collapsible>

    <AccordionItem value="item-1">
          <AccordionTrigger onClick={() => {play()}}>Invite players</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-row my-2 " style={{marginLeft:'-1rem'}}>
            <Input readOnly ref={inputRef} defaultValue={streamerMode? 'click to copy' :invitelink} style={{marginLeft:'1rem'}} onClick={handleFocus} />
              <Button variant='link' onClick={() => {navigator.clipboard.writeText(invitelink); toast(copyMessage); play()}}>
                
              <Copy style={{color:'white'}}/>
              </Button>
              
            </div>
          </AccordionContent>
     </AccordionItem>


        <AccordionItem value="item-2">
          <AccordionTrigger onClick={play}>player icon</AccordionTrigger>
          <AccordionContent>
          <span>functionality coming soon</span>
          </AccordionContent>
     </AccordionItem>

    
     <AccordionItem value="item-3">
            <AccordionTrigger onClick={() => {play()}}>players list</AccordionTrigger>
            <AccordionContent>
              {playerList ? playerList.map((player, index) => 
              <div className="my-3 flex flex-row justify-between">
                <span className="my-auto ml-4">{player}</span>
                <Button disabled={index==0} onClick={() => {sendKick(player); play()}}>Kick</Button>
              </div>) : null}
            </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
            <AccordionTrigger onClick={() => {play()}}>Streamer mode</AccordionTrigger>
            <AccordionContent>
            <div className="flex flex-row justify-between my-3">
              {streamerMode ? 
  <TooltipProvider>
    <Tooltip>
          <TooltipTrigger>You're in streamer mode</TooltipTrigger>
    <TooltipContent>
          <p>Streamer mode allows you to hide sensitive information</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>

: 
<TooltipProvider>
<Tooltip>
      <TooltipTrigger>You're in casual mode</TooltipTrigger>
<TooltipContent>
      <p>Streamer mode allows you to hide sensitive information</p>
</TooltipContent>
</Tooltip>
</TooltipProvider>}

              <Switch checked={streamerMode} onClick={() => {setStreamerMode(!streamerMode); play()}}/>
              </div>
            </AccordionContent>
        </AccordionItem>


      </Accordion>
      
    </SheetDescription>
      </SheetHeader>
    </SheetContent>
    </Sheet>
  )
}

export default OwnerSettings