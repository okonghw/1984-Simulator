// Player Class
class Player {
    constructor(container) {
        this.element = document.createElement('div');
        this.element.id = 'player';
        this.x = 50;
        this.y = 50;
        this.container = container;
        this.containerWidth = container.offsetWidth;
        this.containerHeight = container.offsetHeight;
        this.playerSize = 20;
        container.appendChild(this.element);
        this.updatePosition();
    }

    move(direction) {
        const speed = 20;
        switch (direction) {
            case 'ArrowUp':
                if (this.y - speed >= 0) this.y -= speed;
                break;
            case 'ArrowDown':
                if (this.y + this.playerSize + speed <= this.containerHeight) this.y += speed;
                break;
            case 'ArrowLeft':
                if (this.x - speed >= 0) this.x -= speed;
                break;
            case 'ArrowRight':
                if (this.x + this.playerSize + speed <= this.containerWidth) this.x += speed;
                break;
        }
        this.updatePosition();
    }        

    updatePosition() {
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }
}

// Room Class
class Room {
    constructor(id, label, container) {
        this.element = document.createElement('div');
        this.element.id = id;
        this.element.className = 'room';
        this.label = document.createElement('div');
        this.label.className = 'room-label';
        this.label.textContent = label;
        this.element.appendChild(this.label);
        container.appendChild(this.element);
    }

    addFurniture(furniture) {
        this.element.appendChild(furniture.element);
    }
}

// Furniture Class
class Furniture {
    constructor(name, width, height, top, left, interaction) {
        this.element = document.createElement('div');
        this.element.className = 'furniture';
        this.element.style.width = `${width}px`;
        this.element.style.height = `${height}px`;
        this.element.style.top = `${top}px`;
        this.element.style.left = `${left}px`;
        this.element.textContent = name;
        this.element.addEventListener('click', interaction);
    }
}

// Party Poster Furniture
class PartyPoster extends Furniture {
    constructor(name, width, height, top, left, interaction) {
        super(name, width, height, top, left, interaction);
        this.element.classList.add('party-poster');
    }
}

// Memory Hole Furniture
class MemoryHole extends Furniture {
    constructor(name, width, height, top, left, interaction) {
        super(name, width, height, top, left, interaction);
        this.element.classList.add('furniture', 'memory-hole');
    }
}

// Work Desk Furniture
class WorkDesk extends Furniture {
    constructor(name, width, height, top, left, interaction) {
        super(name, width, height, top, left, interaction);
        this.element.classList.add('furniture', 'work-desk');
    }
}

// Dialog Class
class Dialog {
    constructor(container) {
        this.element = document.createElement('div');
        this.element.id = 'dialog';
        this.textElement = document.createElement('p');
        this.textElement.id = 'dialogText';
        this.choicesElement = document.createElement('div');
        this.choicesElement.id = 'dialogChoices';
        this.element.append(this.textElement, this.choicesElement);
        this.element.style.display = 'none';
        container.appendChild(this.element);
    }

    show(text, choices) {
        this.textElement.textContent = text;
        this.choicesElement.innerHTML = '';
        choices.forEach(choice => {
            const button = document.createElement('button');
            button.textContent = choice.text;
            button.addEventListener('click', () => {
                choice.action();
                this.hide();
            });
            this.choicesElement.appendChild(button);
        });
        this.element.style.display = 'block';
    }

    hide() {
        this.element.style.display = 'none';
    }
}

// Main Script
document.addEventListener('DOMContentLoaded', () => {

    let obedienceScore = 0;
    let rebellionScore = 0;
    let suspicion = 0;
    
    const updateScores = () => {
        document.getElementById('obedienceScore').textContent = `Obedience: ${obedienceScore}`;
        document.getElementById('rebellionScore').textContent = `Rebellion: ${rebellionScore}`;
        document.getElementById('suspicionDisplay').textContent = `Suspicion: ${suspicion}%`;
    };

    const increaseSuspicion = (amount) => {
        suspicion = Math.min(100, suspicion + amount);
        updateScores();
        if (suspicion >= 100) {
            showGameOver();
        }
    };    
    
    const decreaseSuspicion = (amount) => {
        suspicion = Math.max(0, suspicion - amount);
        updateScores();
    };

    const showGameOver = () => {
        const gameOverElement = document.getElementById('gameOver');
    
        document.getElementById('obedienceScoreDisplay').textContent = `Obedience: ${obedienceScore}`;
        document.getElementById('rebellionScoreDisplay').textContent = `Rebellion: ${rebellionScore}`;
    
        gameOverElement.style.display = 'block';
    
        const restartButton = document.getElementById('restartButton');
        restartButton.addEventListener('click', () => {
            obedienceScore = 0;
            rebellionScore = 0;
            suspicion = 0;
            updateScores();
    
            gameOverElement.style.display = 'none';
        }, { once: true });
    };            

    const container = document.getElementById('gameContainer');
    const player = new Player(container);

    const victoryMansions = new Room('victoryMansions', 'Victory Mansions', container);
    const ministryOfTruth = new Room('ministryOfTruth', 'Ministry of Truth', container);
    const room101 = new Room('room101', 'Room 101', container);
    const proleDistrict = new Room('proleDistrict', 'Prole District', container);

    const dialog = new Dialog(container);

    victoryMansions.addFurniture(new Furniture('Telescreen', 200, 20, 50, 100, () => {
        dialog.show('The telescreen blares Party propaganda. Do you listen or turn it off?', [
            {
                text: 'Listen',
                action: () => {
                    obedienceScore += 10;
                    decreaseSuspicion(5);
                    alert('You feel more loyal to the Party.');
                    updateScores();
                }
            },
            {
                text: 'Turn it off',
                action: () => {
                    rebellionScore += 50;
                    increaseSuspicion(20);
                    alert('A dangerous act of rebellion!');
                    updateScores();
                }
            }
        ]);
    }));

    victoryMansions.addFurniture(new PartyPoster('Party Poster', 20, 30, 210, 10, () => {
        dialog.show('You see a poster of Big Brother. Do you pay attention or ignore it?', [
            {
                text: 'Look at it',
                action: () => {
                    obedienceScore += 5;
                    decreaseSuspicion(5);
                    alert('You feel more loyal to the Party.');
                    updateScores();
                }
            },
            {
                text: 'Ignore it',
                action: () => {
                    rebellionScore += 10;
                    increaseSuspicion(10);
                    alert('You ignored the Party’s message.');
                    updateScores();
                }
            }
        ]);
    }));

    victoryMansions.addFurniture(new Furniture('Memory Hole', 100, 100, 165, 400, () => {
        dialog.show('You look at the Memory Hole, ready to destroy any evidence of thoughtcrime.', [
            {
                text: 'Throw away the evidence',
                action: () => {
                    obedienceScore += 10;
                    decreaseSuspicion(5);
                    alert('You have destroyed the evidence. The Party approves.');
                    updateScores();
                }
            },
            {
                text: 'Keep the evidence',
                action: () => {
                    rebellionScore += 20;
                    increaseSuspicion(15);
                    alert('Keeping evidence is an act of rebellion!');
                    updateScores();
                }
            }
        ]);
        this.element.classList.add('memory-hole');
    }));

    ministryOfTruth.addFurniture(new Furniture('Work Desk', 150, 100, 350, -280, () => {
        dialog.show('You sit at the Work Desk. Do you complete the work or delay it?', [
            {
                text: 'Complete the work',
                action: () => {
                    obedienceScore += 30;
                    decreaseSuspicion(10);
                    alert('You completed the task with precision.');
                    updateScores();
                }
            },
            {
                text: 'Delay the work',
                action: () => {
                    rebellionScore += 20;
                    increaseSuspicion(20);
                    alert('You intentionally delayed your work, defying the Party.');
                    updateScores();
                }
            }
        ]);
    }));

    document.addEventListener('keydown', event => {
        player.move(event.key);
    });
});
