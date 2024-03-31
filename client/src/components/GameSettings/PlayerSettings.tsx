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
import { useRef, useState } from "react";

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

const PlayerSettings = ({roomID} : props) => {
    const [visible, setVisible] = useState(true)
    const [streamerMode, setStreamerMode] = useState<boolean>(false);
    const [playerList , setPlayerList] = useState<Array<string>>([]);
    
    let baseurl = window.location.href.split('?')[0];
    let invitelink = baseurl + '?id=' + roomID
    let copyMessage = "Copied to clipboard"
    const inputRef = useRef<HTMLInputElement>(null);

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

    socket.on('recieve-players-names', (recievedList : Array<string>) => {
      setPlayerList(recievedList)
      console.log('recieved players')
    })

    function play() {
      new Audio(settings_sound).play()
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
    <SheetTitle style={{textAlign:'center', marginBottom:'1rem'}}>Player controls</SheetTitle>
    <SheetDescription >
    <span>Player settings</span>
    <Accordion type="single" collapsible>

    <AccordionItem value="item-1">
          <AccordionTrigger onClick={play}>Invite players</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-row my-2 " style={{marginLeft:'-1rem'}}>
            <Input readOnly ref={inputRef} defaultValue={streamerMode? 'click to copy' :invitelink} style={{marginLeft:'1rem'}} onClick={handleFocus} />
              <Button variant='link' onClick={() => {navigator.clipboard.writeText(invitelink); toast(copyMessage)}}>
                
              <Copy style={{color:'white'}}/>
              </Button>
              
            </div>
          </AccordionContent>
     </AccordionItem>


        <AccordionItem value="item-2">
          <AccordionTrigger onClick={play}>player icon</AccordionTrigger>
          <AccordionContent>
          <ProfileIcons roomID={roomID}/>
          </AccordionContent>
     </AccordionItem>

    
     <AccordionItem value="item-3">
            <AccordionTrigger onClick={play}>players list</AccordionTrigger>
            <AccordionContent>
            {playerList ? playerList.map((player) => 
              <div className="my-3 flex flex-row justify-between">
                <span className="my-auto ml-4">{player}</span>
              </div>) : null}
            </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
            <AccordionTrigger onClick={play}>Streamer mode</AccordionTrigger>
            <AccordionContent>
            <div className="flex flex-row justify-between my-3">
              {streamerMode ? 
  <TooltipProvider>
    <Tooltip>
          <TooltipTrigger style={{borderBottom : '2px dotted grey'}}>You're in streamer mode</TooltipTrigger>
    <TooltipContent>
          <p>Streamer mode allows you to hide sensitive information</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>

: 
<TooltipProvider>
<Tooltip>
      <TooltipTrigger style={{borderBottom : '2px dotted grey'}}>You're in casual mode</TooltipTrigger>
<TooltipContent>
      <p>Streamer mode allows you to hide sensitive information</p>
</TooltipContent>
</Tooltip>
</TooltipProvider>}

              <Switch checked={streamerMode} onClick={() => {setStreamerMode(!streamerMode)}}/>
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

export default PlayerSettings