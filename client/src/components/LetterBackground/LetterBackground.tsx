import styles from "./LettersBackground.module.scss"

const LetterBackground = () => {

    const elements = Array.from({length : 35}, (_, index) => index)

    function generateString(length : number) {
        const characters = 'абвгдежзийклмнопрстуфхцчшщъьюя';
        let randomString = '';
        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          randomString += characters.charAt(randomIndex);
        }
        return randomString;
    }


  return (
    <div style={{position:'fixed', transform : 'rotate(-55deg)'}}>
    {elements.map((key, index) => (
        
        <span style={{fontSize:'2rem' , opacity:'2.5%', position:'absolute', top:`${index*2}em`, animation:`${styles.moveLeft} 30s linear infinite alternate`, userSelect:'none'}}>
            {generateString(200)}
        </span>
      ))}
    </div>
  )
}

export default LetterBackground