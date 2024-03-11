import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
  
import { Button } from "@/components/ui/button"
import { Cog } from 'lucide-react';
import { useState } from "react";
 

const PlayerSettings = () => {
    const [visible, setVisible] = useState(true)
  return (
    <Sheet modal={false} onOpenChange={() => {setVisible(!visible)}}>
    <SheetTrigger asChild style={{display: visible ? undefined : 'none'}}>
      <Button>
      <Cog />
      </Button>
    </SheetTrigger>

    <SheetContent>
    <SheetHeader>
    <SheetTitle style={{textAlign:'center'}}>Player controls</SheetTitle>
    <SheetDescription>
      Players settings
      <ul>
        <li>-player icon</li>
        <li>-players list</li>
      </ul>
    </SheetDescription>
      </SheetHeader>
    </SheetContent>
</Sheet>
  )
}

export default PlayerSettings