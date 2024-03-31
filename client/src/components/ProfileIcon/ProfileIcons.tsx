import React from 'react'
import { socket } from '@/socket'
import icons from '@/components/AvatarPicture/AvatarPictures'

interface Props {
  roomID: string
}

const DivsForMapEntries: React.FC<{ map: Map<number, string>, roomID: string }> = ({ map , roomID }) => {


  function changeIcon(icon : number) {
    socket.emit('set-avatar', icon, roomID)
  }

  return (
      <div style={{display:'flex', justifyContent:'flex-start', flexWrap:'wrap'}}>
          {Array.from(map).map(([key, value]) => (
              <div key={key} style={{margin:'0.5em'}} >
                  <img src={value} alt="icon" onClick={() => changeIcon(key)} style={{width:'50px', height:'50px', cursor:'pointer'}} />
              </div>
          ))}
      </div>
  );
};

const ProfileIcons = ({roomID} : Props) => {
  let iconsInstance = icons()
    
  return (
    <div>
        <DivsForMapEntries map={iconsInstance} roomID={roomID}/>
    </div>
  )
}

export default ProfileIcons