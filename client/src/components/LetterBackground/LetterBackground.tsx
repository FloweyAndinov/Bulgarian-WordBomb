import styles from "./LettersBackground.module.scss"

const LetterBackground = () => {

  const charArrayLength = 35;
  const stringLength = 200;

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
    <div style={{position:'fixed', transform : 'rotate(-55deg)'}}>
    {elements.map((key, index) => (
        
        <span style={{fontSize:'8rem' , opacity:'5%', position:'absolute', top:`${index*2}em`, animation:`${styles.moveLeft} 30s linear infinite alternate`, userSelect:'none'}}>
            {generateString()}
        </span>
      ))}
    </div>
  )
}

export default LetterBackground