class WordleGame {
    constructor() {
        this.solution = 'WORDS'; // Hard-coded solution
        this.currentRow = 0;
        this.currentTile = 0;
        this.gameOver = false;
        this.currentGuess = '';
        this.guesses = [];
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.focusGame();
    }
    
    setupEventListeners() {
        // Keyboard event listeners
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Virtual keyboard listeners
        document.querySelectorAll('.key').forEach(key => {
            key.addEventListener('click', () => {
                const keyValue = key.getAttribute('data-key');
                this.handleKeyInput(keyValue);
            });
        });
        
        // Play again button
        document.getElementById('play-again-btn').addEventListener('click', () => {
            this.resetGame();
        });
        
        // Close modal when clicking outside
        document.getElementById('game-modal').addEventListener('click', (e) => {
            if (e.target.id === 'game-modal') {
                this.closeModal();
            }
        });
    }
    
    handleKeyPress(e) {
        if (this.gameOver) return;
        
        const key = e.key.toUpperCase();
        
        if (key === 'ENTER') {
            this.handleKeyInput('ENTER');
        } else if (key === 'BACKSPACE') {
            this.handleKeyInput('BACKSPACE');
        } else if (this.isValidLetter(key)) {
            this.handleKeyInput(key);
        }
    }
    
    handleKeyInput(key) {
        if (this.gameOver) return;
        
        if (key === 'ENTER') {
            this.submitGuess();
        } else if (key === 'BACKSPACE') {
            this.deleteLetter();
        } else if (this.isValidLetter(key) && this.currentTile < 5) {
            this.addLetter(key);
        }
    }
    
    isValidLetter(letter) {
        return /^[A-Z]$/.test(letter);
    }
    
    addLetter(letter) {
        if (this.currentTile < 5) {
            const tile = this.getTile(this.currentRow, this.currentTile);
            tile.textContent = letter;
            tile.classList.add('filled');
            this.currentGuess += letter;
            this.currentTile++;
        }
    }
    
    deleteLetter() {
        if (this.currentTile > 0) {
            this.currentTile--;
            const tile = this.getTile(this.currentRow, this.currentTile);
            tile.textContent = '';
            tile.classList.remove('filled');
            this.currentGuess = this.currentGuess.slice(0, -1);
        }
    }
    
    submitGuess() {
        if (this.currentGuess.length < 5) {
            this.showMessage('Not enough letters');
            return;
        }
        
        if (!this.isValidWord(this.currentGuess)) {
            this.showMessage('Not in word list');
            return;
        }
        
        this.guesses.push(this.currentGuess);
        this.evaluateGuess();
        
        if (this.currentGuess === this.solution) {
            this.endGame(true);
        } else if (this.currentRow === 5) {
            this.endGame(false);
        } else {
            this.currentRow++;
            this.currentTile = 0;
            this.currentGuess = '';
        }
    }
    
    isValidWord(word) {
        // For simplicity, accept any 5-letter combination
        // In a real implementation, you'd check against a word list
        return word.length === 5 && /^[A-Z]+$/.test(word);
    }
    
    evaluateGuess() {
        const guess = this.currentGuess;
        const solution = this.solution;
        const result = [];
        const solutionLetters = solution.split('');
        const guessLetters = guess.split('');
        
        // First pass: mark correct letters
        for (let i = 0; i < 5; i++) {
            if (guessLetters[i] === solutionLetters[i]) {
                result[i] = 'correct';
                solutionLetters[i] = null; // Mark as used
            }
        }
        
        // Second pass: mark present letters
        for (let i = 0; i < 5; i++) {
            if (result[i]) continue; // Already marked as correct
            
            const letter = guessLetters[i];
            const solutionIndex = solutionLetters.indexOf(letter);
            
            if (solutionIndex !== -1) {
                result[i] = 'present';
                solutionLetters[solutionIndex] = null; // Mark as used
            } else {
                result[i] = 'absent';
            }
        }
        
        this.updateTiles(result);
        this.updateKeyboard(guess, result);
    }
    
    updateTiles(result) {
        for (let i = 0; i < 5; i++) {
            const tile = this.getTile(this.currentRow, i);
            const state = result[i];
            
            setTimeout(() => {
                tile.classList.add('reveal', state);
            }, i * 100);
        }
    }
    
    updateKeyboard(guess, result) {
        for (let i = 0; i < 5; i++) {
            const letter = guess[i];
            const state = result[i];
            const key = document.querySelector(`[data-key="${letter}"]`);
            
            if (key) {
                // Only update if the new state is "better" than the current state
                if (state === 'correct' || 
                   (state === 'present' && !key.classList.contains('correct')) ||
                   (state === 'absent' && !key.classList.contains('correct') && !key.classList.contains('present'))) {
                    key.classList.remove('correct', 'present', 'absent');
                    key.classList.add(state);
                }
            }
        }
    }
    
    getTile(row, col) {
        return document.querySelector(`[data-row="${row}"] [data-col="${col}"]`);
    }
    
    endGame(won) {
        this.gameOver = true;
        
        setTimeout(() => {
            const modal = document.getElementById('game-modal');
            const modalTitle = document.getElementById('modal-title');
            const modalMessage = document.getElementById('modal-message');
            const modalAnswer = document.getElementById('modal-answer');
            const modalImage = document.getElementById('modal-image');
            
            if (won) {
                modalTitle.textContent = 'Congratulations!';
                modalMessage.textContent = 'You guessed the word!';
                // Add a celebratory image placeholder
                modalImage.innerHTML = `
                    <div style="font-size: 48px; color: #538d4e;">🎉</div>
                    <p style="margin-top: 10px; color: #818384;">Add your celebration image here!</p>
                `;
            } else {
                modalTitle.textContent = 'Game Over';
                modalMessage.textContent = 'The answer was:';
                // Add a "better luck next time" image placeholder
                modalImage.innerHTML = `
                    <div style="font-size: 48px; color: #b59f3b;">📚</div>
                    <p style="margin-top: 10px; color: #818384;">Add an image related to the answer here!</p>
                `;
            }
            
            modalAnswer.textContent = this.solution;
            modal.style.display = 'block';
        }, 1500);
    }
    
    showMessage(message) {
        // Create a temporary message display
        const messageEl = document.createElement('div');
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #121213;
            color: #ffffff;
            padding: 10px 20px;
            border-radius: 4px;
            border: 1px solid #3a3a3c;
            z-index: 1000;
            font-weight: bold;
        `;
        
        document.body.appendChild(messageEl);
        
        setTimeout(() => {
            document.body.removeChild(messageEl);
        }, 1500);
    }
    
    resetGame() {
        this.currentRow = 0;
        this.currentTile = 0;
        this.gameOver = false;
        this.currentGuess = '';
        this.guesses = [];
        
        // Clear all tiles
        document.querySelectorAll('.tile').forEach(tile => {
            tile.textContent = '';
            tile.classList.remove('filled', 'correct', 'present', 'absent', 'reveal');
        });
        
        // Clear keyboard states
        document.querySelectorAll('.key').forEach(key => {
            key.classList.remove('correct', 'present', 'absent');
        });
        
        this.closeModal();
        this.focusGame();
    }
    
    closeModal() {
        document.getElementById('game-modal').style.display = 'none';
    }
    
    focusGame() {
        // Ensure the game can receive keyboard input
        document.body.focus();
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new WordleGame();
});

// Prevent default behavior for certain keys
document.addEventListener('keydown', (e) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
    }
});