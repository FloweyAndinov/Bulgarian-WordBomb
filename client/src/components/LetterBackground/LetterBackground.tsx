import React, { useEffect, useState } from "react";
import styles from "./LettersBackground.module.scss"

const LetterBackground = () => {


  const screenWidth = window.innerWidth;
  const [charArrayCount, setCharArrayCount] = React.useState(Math.floor(screenWidth / 200));
  const stringLength = 40;
  const [elements, setElements] = useState<string[]>([]);

  useEffect(() => {
    const handleResize = () => {
      setCharArrayCount(Math.floor(window.innerWidth / 200));
    }; 

    const generateString = () => {
      const characters = 'абвгдежзийклмнопрстуфхцчшщъьюя';
      let updatedElements = elements;
      for (let i = 0; i < charArrayCount + 1; i++) {
        let randomString = '';
      for (let i = 0; i < stringLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters.charAt(randomIndex);
      }
      updatedElements = [...updatedElements, randomString];
      }
      setElements(updatedElements);
      console.log("new string", updatedElements.length)
  }

    generateString()
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
 
  


  return (
    <div  style={{position:'fixed', transform : 'rotate(-55deg)', left:'-10vw'}}>
      <div className={styles.animatedLetters} style={{width:'50vh', height:'fit-content' , opacity:'5%'}}>
    {elements.map((key, index) => (
        
        <span  key={key} style={{fontSize:'8rem' , position:'absolute', top:`${index*2}em`, userSelect:'none'}}>
            {key}
        </span>
      ))}
      </div>
    </div>
  )
}

export default LetterBackground