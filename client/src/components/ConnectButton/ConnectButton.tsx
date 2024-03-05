import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import { UserPlus, Github, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button'

const ConnectButton = () => {
  return (
    <Popover>
    <PopoverTrigger asChild>



        <Button style={{margin:'2rem', minWidth:'fit-content', scale:'2'}} title="Connect with the creator" variant='secondary'>
        <UserPlus />
        </Button>



  
    </PopoverTrigger>
    <PopoverContent style={{width:'fit-content'}}>
      <div  style={{display:'flex', justifyContent:'space-evenly', flexDirection:'column'}}>
        <Button className="my-5 w-1/2 mx-auto w-auto" onClick={() => {window.open('https://github.com/FloweyAndinov/', '_blank')}}>
        <Github />
        </Button>
      



        <Button className="my-5 w-1/2 mx-auto w-auto" onClick={() => {window.open('https://www.linkedin.com/in/tsvetan-andinov/', '_blank')}}>
        <Linkedin/>
        </Button>



      </div>
    </PopoverContent>
   </Popover>
  )
}

export default ConnectButton