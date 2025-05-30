// Game state
const gameState = {
    playerScore: 0,
    computerScore: 0,
    currentRound: 1,
    maxRounds: 5,
    choices: ['rock', 'paper', 'scissors'],
    gameOver: false,
    soundEnabled: true // Sound control flag
};

// DOM Elements
const playerScoreElement = document.getElementById('player-score');
const computerScoreElement = document.getElementById('computer-score');
const playerChoiceElement = document.getElementById('player-choice');
const computerChoiceElement = document.getElementById('computer-choice');
const resultText = document.getElementById('result-text');
const currentRoundElement = document.getElementById('current-round');
const choiceButtons = document.querySelectorAll('.choice-btn');
const resetButton = document.getElementById('reset-btn');
const particlesContainer = document.getElementById('particles');
const soundToggle = document.getElementById('sound-toggle');
const soundIcon = document.getElementById('sound-icon');

// Sound Elements
const clickSound = document.getElementById('click-sound');
const winSound = document.getElementById('win-sound');
const loseSound = document.getElementById('lose-sound');
const tieSound = document.getElementById('tie-sound');
const gameWinSound = document.getElementById('game-win-sound');
const gameLoseSound = document.getElementById('game-lose-sound');
const resetSound = document.getElementById('reset-sound');

// Play sound utility function
function playSound(sound) {
    if (gameState.soundEnabled) {
        // Create a clone of the audio element to allow for overlapping sounds
        const soundClone = sound.cloneNode();
        soundClone.volume = 0.6; // Set a reasonable volume
        soundClone.play().catch(error => console.log('Error playing sound:', error));
        
        // Clean up after playback
        soundClone.addEventListener('ended', () => {
            soundClone.remove();
        });
    }
}

// Event Listeners
choiceButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (!gameState.gameOver) {
            // Play button click sound
            playSound(clickSound);
            
            // Add click animation
            button.classList.add('clicked');
            setTimeout(() => {
                button.classList.remove('clicked');
            }, 200);
            
            playRound(button.dataset.choice);
        }
    });
});

resetButton.addEventListener('click', () => {
    playSound(resetSound);
    resetGame();
});

// Sound toggle event listener
soundToggle.addEventListener('click', () => {
    gameState.soundEnabled = !gameState.soundEnabled;
    soundIcon.textContent = gameState.soundEnabled ? '🔊' : '🔇';
    
    // Play a test sound if enabled
    if (gameState.soundEnabled) {
        playSound(clickSound);
    }
});

// Generate computer's choice
function getComputerChoice() {
    const randomIndex = Math.floor(Math.random() * gameState.choices.length);
    return gameState.choices[randomIndex];
}

// Determine winner of a round
function determineWinner(playerChoice, computerChoice) {
    if (playerChoice === computerChoice) return 'tie';
    
    const winningCombos = {
        rock: 'scissors',
        paper: 'rock',
        scissors: 'paper'
    };
    
    return winningCombos[playerChoice] === computerChoice ? 'player' : 'computer';
}

// Play a round
function playRound(playerChoice) {
    const computerChoice = getComputerChoice();
    
    // Create shockwave effect on game area
    createShockwave();
    
    // Update display choices
    playerChoiceElement.textContent = getEmoji(playerChoice);
    computerChoiceElement.textContent = getEmoji(computerChoice);
    
    // Remove any previous animation classes
    playerChoiceElement.classList.remove('winner', 'shake');
    computerChoiceElement.classList.remove('winner', 'shake');
    
    const winner = determineWinner(playerChoice, computerChoice);
    
    // Update scores and display result with visual and sound effects
    if (winner === 'player') {
        gameState.playerScore++;
        resultText.textContent = 'You Win This Round! 🎉';
        playerChoiceElement.classList.add('winner');
        computerChoiceElement.classList.add('shake');
        playSound(winSound);
        createParticles('win');
    } else if (winner === 'computer') {
        gameState.computerScore++;
        resultText.textContent = 'Computer Wins This Round! 😢';
        computerChoiceElement.classList.add('winner');
        playerChoiceElement.classList.add('shake');
        playSound(loseSound);
    } else {
        resultText.textContent = "It's a Tie! 🤝";
        playSound(tieSound);
    }
    
    updateScoreDisplay();
    
    // Check if round is complete
    if (gameState.currentRound < gameState.maxRounds) {
        gameState.currentRound++;
        currentRoundElement.textContent = gameState.currentRound;
    } else {
        endGame();
    }
}

// End game and declare final winner
function endGame() {
    gameState.gameOver = true;
    const finalResult = determineFinalWinner();
    resultText.textContent = finalResult;
    
    // Play final game sound
    if (gameState.playerScore > gameState.computerScore) {
        playSound(gameWinSound);
        createParticles('win', 100); // More particles for game win
    } else if (gameState.computerScore > gameState.playerScore) {
        playSound(gameLoseSound);
    } else {
        playSound(tieSound);
    }
    
    // Disable choice buttons
    choiceButtons.forEach(button => {
        button.disabled = true;
        button.style.opacity = '0.5';
    });
    
    // Make reset button more prominent
    resetButton.classList.add('pulse-animation');
}

// Determine final winner
function determineFinalWinner() {
    if (gameState.playerScore > gameState.computerScore) {
        return '🏆 Congratulations! You Won The Game! 🎉';
    } else if (gameState.computerScore > gameState.playerScore) {
        return '😔 Game Over! Computer Wins The Game! 🤖';
    } else {
        return "📍 It's a Tie Game! Try Again! 🤝";
    }
}

// Update score display
function updateScoreDisplay() {
    playerScoreElement.textContent = gameState.playerScore;
    computerScoreElement.textContent = gameState.computerScore;
}

// Reset game
function resetGame() {
    gameState.playerScore = 0;
    gameState.computerScore = 0;
    gameState.currentRound = 1;
    gameState.gameOver = false;
    
    playerChoiceElement.textContent = '?';
    computerChoiceElement.textContent = '?';
    resultText.textContent = 'Make your choice!';
    currentRoundElement.textContent = '1';
    
    // Remove animation classes
    playerChoiceElement.classList.remove('winner', 'shake');
    computerChoiceElement.classList.remove('winner', 'shake');
    
    // Re-enable choice buttons
    choiceButtons.forEach(button => {
        button.disabled = false;
        button.style.opacity = '1';
    });
    
    // Remove reset button animation
    resetButton.classList.remove('pulse-animation');
    
    updateScoreDisplay();
}

// Helper function to get emoji for choices
function getEmoji(choice) {
    const emojis = {
        rock: '🪨',
        paper: '📄',
        scissors: '✂️'
    };
    return emojis[choice];
}

// Create particle effects
function createParticles(type, count = 30) {
    // Clear any existing particles
    particlesContainer.innerHTML = '';
    particlesContainer.style.display = 'block';
    
    const colors = type === 'win' 
        ? ['#ffdb58', '#ffa500', '#ff6347', '#87ceeb'] // Win colors (gold, orange, red, sky blue)
        : ['#a9a9a9', '#696969', '#808080']; // Lose colors (grays)
    
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Randomize particle properties
        const size = Math.random() * 8 + 5;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // Position randomly within the viewport
        const xPos = Math.random() * 100;
        const fallDelay = Math.random() * 3;
        
        // Set CSS properties
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.backgroundColor = color;
        particle.style.left = `${xPos}%`;
        particle.style.animationDelay = `${fallDelay}s`;
        
        particlesContainer.appendChild(particle);
    }
    
    // Remove particles after animation completes
    setTimeout(() => {
        particlesContainer.style.display = 'none';
    }, 4000);
}

// Create shockwave effect
function createShockwave() {
    const shockwave = document.createElement('div');
    shockwave.className = 'shockwave';
    document.querySelector('.game-area').appendChild(shockwave);
    
    // Remove the shockwave element after animation completes
    setTimeout(() => {
        shockwave.remove();
    }, 1000);
}

// Add visual feedback when hovering over buttons
choiceButtons.forEach(button => {
    // Add hover effect to choice icon
    const icon = button.querySelector('.choice-icon');
    
    button.addEventListener('mouseenter', () => {
        icon.style.transform = 'scale(1.2)';
    });
    
    button.addEventListener('mouseleave', () => {
        icon.style.transform = 'scale(1)';
    });
});

// Initialize game
resetGame();