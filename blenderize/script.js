const Game = document.getElementById('game');
const HistoryElement = document.getElementById('history');
const MovesCountElement = document.getElementById('movesCount');

const GridSize = 5;

const Directions = ['⇦', '⇧', '⇨', '⇩']

var movesCount = 0;

var grid = [];

class Block {
    constructor(x, y) {
        this.completed = false;
        this.history = [];
        this.x = x;
        this.y = y;
        this.randomizeBlock();
        this.createElement();
    }

    colors = ["red", "green", "yellow", "blue"];
    directionIcons = ["←", "↑", "→", "↓"];

    randomizeBlock() {
        this.power = Math.floor(Math.random()*5+1)
        this.direction = Math.floor(Math.random()*3+1)
        this.color = this.colors[Math.floor(Math.random()*this.colors.length)];
    }

    onclick() {
        this.moveUp();
        this.updateElement();
    }

    updateElement() {
        if (this.completed === true) {
            this.element.innerText = "";
            this.element.style.background = "";

        } else {
            this.text = this.directionIcons[this.direction] + this.power;
            this.element.innerText = this.text;
            this.element.style.background = "radial-gradient(ellipse at center, var(--bg-color) 0,var(--color) 100%)";
            this.element.style.setProperty("--color", this.color);
        }
    }

    createElement() {
        this.element = document.createElement('div');
        this.element.className = "block foreground";
        this.element.onclick = (() => this.onclick());
        Game.append(this.element);
        this.updateElement();
    }

    moveLeft() {
        let aboveBlock = this.getBlock(this.x - 1, this.y);
        if (!aboveBlock) return
        this.checkMatch(aboveBlock, 0);
    }

    moveUp() {
        let aboveBlock = this.getBlock(this.x, this.y - 1);
        if (!aboveBlock) return
        this.checkMatch(aboveBlock, 1);
    }

    moveRight() {
        let aboveBlock = this.getBlock(this.x + 1, this.y);
        if (!aboveBlock) return
        this.checkMatch(aboveBlock, 2);
    }

    moveDown() {
        let aboveBlock = this.getBlock(this.x, this.y + 1);
        if (!aboveBlock) return
        this.checkMatch(aboveBlock, 3);
    }

    checkMatch(block, direction) {
        if (block.completed === true) {
            this.swapBlock(block);
            return;
        }

        if (block.color === this.color) {
            if (this.direction === direction || this.power === 1) {
                this.completed = true;
                this.updateElement();
            } else {
                this.power -= 1;
                this.updateElement();
            }
        }
    }

    swapBlock(block) {
        block.completed = false;
        this.completed = true;

        block.color = this.color;
        block.direction = this.direction;
        block.power = this.power;

        this.updateElement();
        block.updateElement();
    }

    getBlock(x, y) {
        if (x < 0 || x >= 5) return
        if (y < 0 || y >= 5) return
        return grid[y][x];
    }
}

function controls(direction) {
    if (direction === 4) {
        if (movesCount < 1) return;
        movesCount -= 1;

        let text = HistoryElement.innerText;
        HistoryElement.innerText = text.substring(0, text.length - 2);
        grid.forEach(grid_y => {
            grid_y.forEach(block => {
                let change = block.history.pop();

                if (change.completed === false || change.completed)  block.completed = change.completed;
                if (change.power) block.power = change.power;
                if (change.color) block.color = change.color;
                if (change.direction) block.direction = change.direction;
            });
        });

        grid.forEach(grid_y => {
            grid_y.forEach(block => {
                block.updateElement();
            });
        });
    } else {

        HistoryElement.innerText += " " + Directions[direction];
    
        grid.forEach(grid_y => {
            grid_y.forEach(block => {
                block.history.push({
                    completed: block.completed,
                    power: block.power,
                    color: block.color,
                    direction: block.direction
                });

                if (block.completed) return
                if (direction === 0) block.moveLeft();
                if (direction === 1) block.moveUp();
                if (direction === 2) block.moveRight();
                if (direction === 3) block.moveDown();
            });
        });
    
        movesCount += 1;
    }
    MovesCountElement.innerText = movesCount;
}

function setupGame() {
    changeDarkmode();

    for (let y = 0; y < GridSize; y++) {
        let grid_y = [];
        for (let x = 0; x < GridSize; x++) {
            let block = new Block(x, y);
            grid_y.push(block);
        }
        grid.push(grid_y);
    }
}
setupGame();

function changeDarkmode() {
   let darkmode = (getComputedStyle(document.body).getPropertyValue('--dark-mode') === "true");
    grid.forEach(grid_y => {
        grid_y.forEach(block => {
            if (darkmode === true) {
                block.element.style.setProperty("--bg-color", "#ffffff");
            } else {
                block.element.style.setProperty("--bg-color", "#e1e1e1");
            }
        });
    });
}