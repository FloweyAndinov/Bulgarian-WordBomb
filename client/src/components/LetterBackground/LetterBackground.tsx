import React from "react";
import styles from "./LettersBackground.module.scss"

const LetterBackground = () => {


  const screenWidth = window.innerWidth;
  const [charArrayLength, setCharArrayLength] = React.useState(Math.floor(screenWidth / 200));
  React.useEffect(() => {
    const handleResize = () => {
      setCharArrayLength(Math.floor(window.innerWidth / 200));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const stringLength = 40;

    const elements = Array.from({length : charArrayLength}, (_, index) => index)

    function generateString() {
        const characters = 'абвгдежзийклмнопрстуфхцчшщъьюя';
        let randomString = '';
        for (let i = 0; i < stringLength; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          randomString += characters.charAt(randomIndex);
        }
        return randomString;
    }


  return (
    <div  style={{position:'fixed', transform : 'rotate(-55deg)', left:'-10vw'}}>
      <div className={styles.animatedLetters} style={{width:'50vh', height:'fit-content' , opacity:'5%'}}>
    {elements.map((key, index) => (
        
        <span  key={key} style={{fontSize:'8rem' , position:'absolute', top:`${index*2}em`, userSelect:'none'}}>
            {generateString()}
        </span>
      ))}
      </div>
    </div>
  )
}

export default LetterBackground