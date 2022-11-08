import {useCallback, useEffect, useState} from 'react';
import { Keyboard } from './Keyboard';
import {HangmanDrawing} from './HangmanDrawing';
import {HangmanWord} from './HangmanWord';
import words from "./wordList.json"

//Get a new word
function getWord() {
  return words[Math.floor(Math.random() * words.length)];
}

function App() {
  //Get and track a random word to guess
  const [wordToGuess, setWordToGuess] = useState(() => {
    return words[Math.floor(Math.random() * words.length)];
  });

  // Track guessed letters in an array 
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const incorrectLetters = guessedLetters.filter(letter => !wordToGuess.includes(letter));

  const isLoser = incorrectLetters.length >= 6;
  const isWinner = wordToGuess.split("").every((letter) => {
     guessedLetters.includes(letter);
  }) 
  
  const addGuessedLetter = useCallback((letter: string) => {
    //If the letter was already guessed - ignore 
    if(guessedLetters.includes(letter)|| isLoser || isWinner) return 
    // Else add the letter to the guessed letters array 
    setGuessedLetters(currentLetters => [...currentLetters, letter]);
  }, [guessedLetters, isWinner, isLoser]);

  // Connect keyboard to the game using useEffect hook
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
        const key = e.key

        //If the key does not match letters a-z - ignore it
        if(!key.match(/^[a-z]$/)) return 

        //Else prevent default and add guessed letter
        e.preventDefault()
        addGuessedLetter(key)
    }

    // Adding and removing the event listener 
    document.addEventListener("keypress", handler)
    return () => {
      document.removeEventListener("keypress", handler)
    }
  }, [guessedLetters])

    // Start a new game on Enter press
    useEffect(() => {
      const handler = (e: KeyboardEvent) => {
          const key = e.key
  
          //If the key is not "Enter" - ignore it
          if(key !== "Enter") return
  
          //Else restart the game and get a new word 
          e.preventDefault();
          setGuessedLetters([]);
          setWordToGuess(getWord());


      }
  
      // Adding and removing the event listener 
      document.addEventListener("keypress", handler)
      return () => {
        document.removeEventListener("keypress", handler)
      }
    }, [guessedLetters])

  return <div style={{
    maxWidth: "800px",
    display: "flex", 
    flexDirection: "column", 
    gap: "2rem", 
    margin: "0 auto", 
    alignItems: "center"
  }}>
    <div style= {{
      fontSize: "2rem", 
      textAlign: "center", 
    }}>
      {isLoser && "Nice try - Refresh to try again!"}
      {isWinner && "Winner - Refresh to play again!"}
    </div>
    <HangmanDrawing numberOfGuesses={incorrectLetters.length}/>
    <HangmanWord reveal={isLoser}
     guessedLetters={guessedLetters} wordToGuess={wordToGuess}/>
    <div style={{ alignSelf: 'stretch'}}> 
    <Keyboard disabled={isWinner || isLoser} activeLetters={guessedLetters.filter(letter => wordToGuess.includes(letter))} inactiveLetters={incorrectLetters}  addGuessedLetter
  ={addGuessedLetter}/>
    </div>
  </div>;
}

export default App;
