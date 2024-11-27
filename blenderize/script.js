const Game = document.getElementById("game");
const HistoryElement = document.getElementById("history");
const MovesCountElement = document.getElementById("movesCount");

const GridSize = 5;

const Directions = ["⇦", "⇧", "⇨", "⇩"];

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

    randomizeBlock() {
        this.power = Math.floor(Math.random() * 5 + 1);
        this.color =
            this.colors[Math.floor(Math.random() * this.colors.length)];
    }

    onclick() {
        console.log(this);
    }

    updateElement() {
        if (this.completed === true) {
            this.element.innerText = "";
            this.element.style.background = "";
        } else {
            this.text = this.power;
            this.element.innerText = this.text;
            this.element.style.background =
                "radial-gradient(ellipse at center, var(--bg-color) 0,var(--color) 100%)";
            this.element.style.setProperty("--color", this.color);
        }
    }

    createElement() {
        this.element = document.createElement("div");
        this.element.className = "block foreground";
        this.element.onclick = () => this.onclick();
        Game.append(this.element);
        this.updateElement();
    }

    moveBlock(dir_x, dir_y) {
        let otherBlock = this.getBlock(this.x + dir_x, this.y + dir_y);
        if (!otherBlock) return;
        if (otherBlock.completed === true) {
            let x = (dir_x + 1) * dir_x;
            let y = (dir_y + 1) * dir_y;
            this.moveBlock(x, y);
            return;
        }
        this.checkMatch(otherBlock);
    }

    moveLeft() {
        let aboveBlock = this.getBlock(this.x - 1, this.y);
        if (!aboveBlock) return;
        this.checkMatch(aboveBlock, 0);
    }

    moveUp() {
        let aboveBlock = this.getBlock(this.x, this.y - 1);
        if (!aboveBlock) return;
        this.checkMatch(aboveBlock, 1);
    }

    moveRight() {
        let aboveBlock = this.getBlock(this.x + 1, this.y);
        if (!aboveBlock) return;
        this.checkMatch(aboveBlock, 2);
    }

    moveDown() {
        let aboveBlock = this.getBlock(this.x, this.y + 1);
        if (!aboveBlock) return;
        this.checkMatch(aboveBlock, 3);
    }

    checkMatch(block) {
        if (block.completed === true) {
            this.swapBlock(block);
            return;
        }

        if (block.color === this.color || this.power === 1) {
            this.completed = true;
            this.updateElement();
        } else {
            this.power -= 1;
            this.updateElement();
        }
    }

    swapBlock(block) {
        block.completed = false;
        this.completed = true;

        block.color = this.color;
        block.power = this.power;

        this.updateElement();
        block.updateElement();
    }

    getBlock(x, y) {
        if (x < 0 || x >= 5) return;
        if (y < 0 || y >= 5) return;
        return grid[y][x];
    }
}

function controls(direction) {
    if (direction === 4) {
        if (movesCount < 1) return;
        movesCount -= 1;

        let text = HistoryElement.innerText;
        HistoryElement.innerText = text.substring(0, text.length - 2);
        grid.forEach((grid_y) => {
            grid_y.forEach((block) => {
                let change = block.history.pop();

                if (change.completed === false || change.completed)
                    block.completed = change.completed;
                if (change.power) block.power = change.power;
                if (change.color) block.color = change.color;
                block.updateElement();
            });
        });
        
    } else {
        HistoryElement.innerText += " " + Directions[direction];

        grid.forEach((grid_y) => {
            grid_y.forEach((block) => {
                block.history.push({
                    completed: block.completed,
                    power: block.power,
                    color: block.color
                });

                if (block.completed) return;
                if (direction === 0) block.moveBlock(-1, 0);
                if (direction === 1) block.moveBlock(0, -1);
                if (direction === 2) block.moveBlock(1, 0);
                if (direction === 3) block.moveBlocl(0, 1);
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
    let darkmode =
        getComputedStyle(document.body).getPropertyValue("--dark-mode") ===
        "true";
    grid.forEach((grid_y) => {
        grid_y.forEach((block) => {
            if (darkmode === true) {
                block.element.style.setProperty("--bg-color", "#ffffff");
            } else {
                block.element.style.setProperty("--bg-color", "#e1e1e1");
            }
        });
    });
}
