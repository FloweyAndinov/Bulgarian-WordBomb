import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import { UserPlus, Github, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button'
import styles from './ConnectButton.module.scss'

const ConnectButton = () => {
  return (
    <Popover>
    <PopoverTrigger asChild>



        <Button className={styles.mainBtn + " border-2 border-foreground"} style={{margin:'2rem', minWidth:'fit-content', scale:'2'}} title="Connect with the creator" variant='secondary'>
        <UserPlus />
        </Button>



  
    </PopoverTrigger>
    <PopoverContent style={{width:'fit-content', borderRadius:'1em'}}>
      <div  style={{display:'flex', justifyContent:'space-evenly', flexDirection:'column'}}>
        <Button className="my-5 w-1/2 mx-auto w-auto rounded-full" onClick={() => {window.open('https://github.com/FloweyAndinov/', '_blank')}}>
        <Github />
        </Button>
      



        <Button className="my-5 w-1/2 mx-auto w-auto rounded-full" onClick={() => {window.open('https://www.linkedin.com/in/tsvetan-andinov/', '_blank')}}>
        <Linkedin/>
        </Button>



      </div>
    </PopoverContent>
   </Popover>
  )
}

export default ConnectButton