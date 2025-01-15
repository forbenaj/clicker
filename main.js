const button = document.getElementById("button");
const scoreText = document.getElementById("score");
const powerUpsDiv = document.getElementById("power-ups");
let audio = document.getElementsByTagName("audio")[0];
let score = 0;
let powerUps = []


button.addEventListener("click", (e) => {
    e.preventDefault();
    addToScore(1, 100);
    updatePowerUps();
    if (score % 10 == 0) {
        current_scale += 10;
        createNewPowerUp();
    }
    playPop();
});
button.addEventListener("mousedown", (e) => {
    e.preventDefault();
});
button.addEventListener("dblclick", (e) => {
    e.preventDefault();
});

function addToScore(value, bubbleSize) {
    score += value;
    scoreText.innerText = score;
    bubbleScore(bubbleSize);
}

function bubbleScore(size) {
    scoreText.style.fontSize = size + "px";
    setTimeout(() => {
        scoreText.style.fontSize = "50px";
    }, 5);
}

function playPop() {
    audio.pause();
    audio.currentTime = 0;
    audio.play();
}


class PowerUp {
    constructor(value, interval) {
        this.value = value;
        this.prize = Math.floor(value/3)+1;
        this.interval = interval;
        this.available = true;
        this.element = null;
    }
    buy() {
        score -= this.value;
        scoreText.innerText = score;
        powerUps.splice(powerUps.indexOf(this), 1);
        powerUpsDiv.removeChild(this.element);
        updatePowerUps();
        this.turnOn();
    }
    create() {
        this.element = document.createElement("div");
        let valueText = document.createElement("p");
        valueText.className = "value";
        valueText.innerText = this.value;
        let prizeText = document.createElement("p");
        prizeText.className = "prize";
        prizeText.innerText = this.prize + " every " + this.interval + "s";
        this.element.appendChild(valueText);
        this.element.appendChild(prizeText);
        this.element.className = "power-up";
        this.element.addEventListener("click", (e) => {
            e.preventDefault();
            if (this.available) {
                this.buy();
            }
        });
        return this.element;
    }
    turnOn() {
        setInterval(() => {
            addToScore(this.value, 60);
        }, this.interval*1000);
    }
}

let current_scale = 1;

function createNewPowerUp() {
    let random_value = Math.floor(Math.random() * 10)*current_scale;
    let random_interval = Math.floor(Math.random() * 60);
    let newPowerUp = new PowerUp(random_value, random_interval);
    let powerUpElement = newPowerUp.create();
    if (score < newPowerUp.value) {
        newPowerUp.available = false;
        powerUpElement.className = "power-up disabled";
    }
    powerUps.push(newPowerUp);
    powerUpsDiv.appendChild(powerUpElement);
}

function updatePowerUps() {
    powerUps.forEach((powerUp) => {
        if (score < powerUp.value) {
            powerUp.available = false;
            powerUp.element.className = "power-up disabled";
        } else {
            powerUp.available = true;
            powerUp.element.className = "power-up";
        }
    });
}