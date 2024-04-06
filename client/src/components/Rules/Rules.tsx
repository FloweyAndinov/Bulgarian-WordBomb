import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"


const Rules = () => {
  return (
    <Dialog modal={true}>
  <DialogTrigger asChild>
  <Button className="hover:scale-105 transform transition duration-200" style={{margin:'2rem', minWidth:'fit-content', fontSize:'3rem', padding:'1em'}}>Rules</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Правила</DialogTitle>
      <DialogDescription>
        The player with the bomb is given a syllable. <br/>That player has to enter a word that contains the syllable.
      </DialogDescription>
      <DialogDescription></DialogDescription>
      <DialogDescription>
        Successfull submit of a word will pass the bomb to the next player.<br/> Failing to submit a word will take health from you.
      </DialogDescription>
      <DialogDescription>

      </DialogDescription>
      <DialogDescription>
        You cannot use a word that has already been used.
      </DialogDescription>
      
    </DialogHeader>
  </DialogContent>
</Dialog>
  )
}

export default Rules