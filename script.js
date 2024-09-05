class Hangman {
    constructor(MaxNumberOfMistakes = 6) {
        this.MaxNumberOfMistakes = MaxNumberOfMistakes;
        this.initialize();
        this.resetGame();
    }

    async resetGame() {
        this.word = await this.getRandomWord()
        this.guessedLetters = new Set();
        this.mistakes = 0;
        this.update();
        this.clearCanvas();
        this.drawRod();
        this.showMSG('', 'black')




    }

    initialize() {
        this.wordContainer = document.getElementById('word-container');
        this.charContainer = document.getElementById('chars-container');
        this.messageContainer = document.getElementById('message');
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.charContainer.innerHTML = '';

        const chars = 'ABCDEFGHIJKLMNOPQRSTUVVWXYZ'.split('');
        chars.forEach(char => {
            const charButton = document.createElement('div');
            charButton.className = 'char';
            charButton.textContent = char;
            charButton.addEventListener('click', () => {
                this.handleGuess(charButton)
            });
            this.charContainer.appendChild(charButton);

        });
        this.canvas.width = 200;
        this.canvas.height = 250;

    }

    update() {
        this.wordContainer.innerHTML = this.word.split('').map(letter => this.guessedLetters.has((letter)) ? letter : '-').join(' ');
    }

    handleGuess(charButton) {
        const letter = charButton.textContent;
        if (this.guessedLetters.has(letter) || this.mistakes >= this.MaxNumberOfMistakes) {
            return;
        }
        this.guessedLetters.add(letter);
        charButton.classList.add('disabled');
        if (this.word.includes(letter)) {
            this.update();
            if (this.checkWin()) {
                this.showMSG("You Win", 'green')

                //TODO: sidble keyboard
            }
        } else {
            this.mistakes++;
            this.animatedrawMan();
            if (this.mistakes === this.MaxNumberOfMistakes) {
                this.showMSG("You Lost", 'red')


                //the end

            }
        }

    }


    async getRandomWord() {
        try {
            const response = await fetch('https://random-word-api.herokuapp.com/word?number=1');
            const data = await response.json();
            return data[0].toUpperCase();
        } catch (error) {
            console.error('Error while fetching the word ', error);
            return 'DEFAULT';

        }
    }

    drawRod() {
        const ctx = this.ctx;
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'antiquewhite';
        ctx.beginPath();
        ctx.moveTo(50, 220)
        ctx.lineTo(150, 220);
        ctx.stroke();
        ctx.moveTo(75, 220);
        ctx.lineTo(75, 50);
        ctx.lineTo(120, 50)
        ctx.lineTo(120, 70);
        ctx.stroke();
    }

    animatedrawMan() {
        const ctx = this.ctx;
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'antiquewhite';

        switch (this.mistakes) {
            case 1: //head
                this.animateCircle(120, 90, 20);
                break;
            case 2://torso
                this.animateLine(120, 110, 120, 160);
                break;
            case 3://left arm
                this.animateLine(120, 120, 100, 140);
                break;
            case 4://right arm
                this.animateLine(120, 120, 140, 140);
                break;
            case 5: //left leg
                this.animateLine(120, 160, 100, 190);
                break;
            case 6://right leg
                this.animateLine(120, 160, 140, 190);
                break;

        }

    }

    animateCircle(x, y, rad) {
        const ctx = this.ctx;
        let currentRad = 0;
        const animate = () => {
            ctx.beginPath();
            ctx.arc(x, y, currentRad, 0, Math.PI * 2);
            ctx.stroke();
            if (currentRad < rad) {
                currentRad += 1;
                this.animationFrame = requestAnimationFrame(animate);
            }
        };
        animate();
    }

    animateLine(x1, y1, x2, y2) {
        const ctx = this.ctx;
        let progress = 0;
        const animate = () => {
            const currentX = x1 + (x1 - x2) * progress;
            const currentY = y1 + (y2 - y1) * progress;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(currentX, currentY);
            ctx.stroke();
            if (progress < 1) {
                progress += 0.05;
                this.animationFrame = requestAnimationFrame(animate);
            }
        };
        animate();
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    }

    checkWin() {
        return;
        this.word.split('').every(letter => this.guessedLetters.has(letter));
    }

    showMSG(message, color) {
        this.messageContainer.textContent = message;
        this.messageContainer.style.color = color;
    }



}

document.addEventListener('DOMContentLoaded', () => {
    let hangman = new Hangman();
    document.getElementById('newWord').addEventListener('click', () => hangman.resetGame());
});