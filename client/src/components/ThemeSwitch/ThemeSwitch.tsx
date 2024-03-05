import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"
import { useState } from "react"
import { Sun, Moon } from "lucide-react"

export default function ThemeSwitch() {
    const { setTheme } = useTheme()
    const [mode, setMode] = useState(true)
    let size = '3.5rem';
    let margin = '1rem'
  
    return (
      <>
      {mode ? 
          <Button style={{height:size, width:size, marginRight : margin}} variant='ghost' onClick={() => {setTheme("light"); setMode(false)}}>
              <Sun />
          </Button> 
      :
          <Button style={{height:size, width:size, marginRight : margin}} variant='ghost' size='icon' onClick={() => {setTheme("dark");  setMode(true)}}>
              <Moon/>
          </Button>}
      </>
    )
  }
  