# Name Game - Wordle Clone

A Wordle-style word guessing game that runs on GitHub Pages. 

## How to Play

- Guess the 5-letter word in 6 tries or less
- Each guess must be a valid 5-letter word
- After each guess, the color of the tiles will change to show how close your guess was:
  - 🟩 **Green**: Letter is in the word and in the correct position
  - 🟨 **Yellow**: Letter is in the word but in the wrong position  
  - ⬜ **Gray**: Letter is not in the word

## Features

- **Exact Wordle UI**: Matches the original Wordle design and experience
- **Hard-coded solution**: The answer is "WORDS" 
- **Game completion**: Shows the solution after 6 guesses regardless of outcome
- **Result modal**: Displays congratulations or game over message with space for images
- **Responsive design**: Works on desktop and mobile devices
- **Keyboard support**: Use your physical keyboard or the on-screen keyboard

## GitHub Pages Deployment

This game is automatically deployed to GitHub Pages when changes are pushed to the main branch.

## Technical Details

- Pure HTML, CSS, and JavaScript - no frameworks required
- Responsive design using CSS Grid and Flexbox
- Keyboard event handling for both physical and virtual keyboards
- CSS animations for tile reveals and interactions