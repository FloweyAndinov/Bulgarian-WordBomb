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
import ProfileIcons from "../ProfileIcon/ProfileIcons";


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
    <SheetTitle style={{textAlign:'center', marginBottom:'1rem'}}>Настройки на създател</SheetTitle>
    
    <SheetDescription>
      <span>Настройки на стая</span>


    <Accordion type="single" collapsible>
       


     <AccordionItem value="item-1">
        <AccordionTrigger onClick={() => {play()}}>Настойки на стая</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-row justify-between my-3">
              {roomPublic ? <span>Стаята е публична</span> : <span>Стаята е скрита</span>}
              <Switch checked={roomPublic} onClick={() => {handleRoomPublic(!roomPublic); play()}}/>
              </div>
              <div className="flex flex-row justify-between my-3">
              {roomLocked ? <span>Стаята е заключена</span> : <span>Стаята е отключена</span>}
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
          <AccordionTrigger onClick={() => {play()}}>Покани приятели</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-row my-2 " style={{marginLeft:'-1rem'}}>
            <Input readOnly ref={inputRef} defaultValue={streamerMode? 'Натисни за копиране' :invitelink} style={{marginLeft:'1rem'}} onClick={handleFocus} />
              <Button variant='link' onClick={() => {navigator.clipboard.writeText(invitelink); toast(copyMessage); play()}}>
                
              <Copy style={{color:'white'}}/>
              </Button>
              
            </div>
          </AccordionContent>
     </AccordionItem>


        <AccordionItem value="item-2">
          <AccordionTrigger onClick={play}>Иконки</AccordionTrigger>
          <AccordionContent>
          <ProfileIcons roomID={roomID}/>
          </AccordionContent>
     </AccordionItem>

    
     <AccordionItem value="item-3">
            <AccordionTrigger onClick={() => {play()}}>Списък на играчи</AccordionTrigger>
            <AccordionContent>
              {playerList ? playerList.map((player, index) => 
              <div className="my-3 flex flex-row justify-between">
                <span className="my-auto ml-4">{player}</span>
                <Button disabled={index==0} onClick={() => {sendKick(player); play()}}>Изритай</Button>
              </div>) : null}
            </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
            <AccordionTrigger onClick={() => {play()}}>Streamer режим</AccordionTrigger>
            <AccordionContent>
            <div className="flex flex-row justify-between my-3">
              {streamerMode ? 
  <TooltipProvider>
    <Tooltip>
          <TooltipTrigger style={{borderBottom : '2px dotted grey'}}>Ти си в streamer режим</TooltipTrigger>
    <TooltipContent>
          <h3>Streamer режим ти позволява да скриеш важна информация</h3>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>

: 
<TooltipProvider>
<Tooltip>
      <TooltipTrigger style={{borderBottom : '2px dotted grey'}}>Ти си в нормарен режим</TooltipTrigger>
<TooltipContent>
      <h3>Streamer режим ти позволява да скриеш важна информация</h3>
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