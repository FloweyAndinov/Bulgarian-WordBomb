import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"

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

interface props {
  roomID: string
}
  

const OwnerSettings = ({roomID}: props) => {
  const [visible, setVisible] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null);
  const [roomPublic , setRoomPublic] = useState<boolean>(true);
  const [roomLocked , setRoomLocked] = useState<boolean>(false);
  const [streamerMode, setStreamerMode] = useState<boolean>(false);
  let baseurl = window.location.href.split('?')[0];
  let invitelink = baseurl + '?id=' + roomID
  let copyMessage = "Copied to clipboard"

  const handleFocus = () => {
    if (inputRef.current) {
      if (streamerMode) {
        //copy link
        navigator.clipboard.writeText(invitelink)
        toast(copyMessage)
      }
    inputRef.current.select();
    }
  };
      
  return (
    <Sheet modal={false} onOpenChange={() => {setVisible(!visible)}}>
      

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
        <AccordionTrigger>Manage room</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-row justify-between my-3">
              {roomPublic ? <span>Currently room is public</span> : <span>Currently room is private</span>}
              <Switch checked={roomPublic} onClick={() => {setRoomPublic(!roomPublic)}}/>
              </div>
              <div className="flex flex-row justify-between my-3">
              {roomLocked ? <span>Currently room is locked</span> : <span>Currently room is unlocked</span>}
              <Switch checked={roomLocked} onClick={() => {setRoomLocked(!roomLocked)}}/>
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
          <AccordionTrigger>Invite players</AccordionTrigger>
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
          <AccordionTrigger>player icon</AccordionTrigger>
          <AccordionContent>
          <span>functionality coming soon</span>
          </AccordionContent>
     </AccordionItem>

    
     <AccordionItem value="item-3">
            <AccordionTrigger>players list</AccordionTrigger>
            <AccordionContent>
              <span>functionality coming soon</span>
            </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
            <AccordionTrigger>Streamer mode</AccordionTrigger>
            <AccordionContent>
            <div className="flex flex-row justify-between my-3">
              {streamerMode ? <span>You're in streamer mode</span> : <span>You're in casual mode</span>}
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

export default OwnerSettings