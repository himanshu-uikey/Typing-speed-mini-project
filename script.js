
const texts = {
    easy: ["The sun rises in the east.", "I love coffee.", "Cats are playful."],
    medium: ["Typing improves with practice.", "JavaScript builds interactive apps."],
    hard: ["Success comes from consistent effort and dedication.", "Technology evolves rapidly requiring continuous learning."]
};

let level = "easy";
let currentText = "";
let startTime;
let timer;
let timeLimit = 60;

// LEVEL SETTINGS
function setLevel(lvl) {
    level = lvl;
    if (lvl === "easy") timeLimit = 30;
    if (lvl === "medium") timeLimit = 60;
    if (lvl === "hard") timeLimit = 90;
    alert("Level: " + lvl.toUpperCase());
}

// GENERATE TEXT
function generateText() {
    let arr = texts[level];
    let para = "";
    for (let i = 0; i < 3; i++) {
        para += arr[Math.floor(Math.random() * arr.length)] + " ";
    }
    return para.trim();
}

// LOAD TEXT
function loadText() {
    currentText = generateText();
    let html = "";
    currentText.split("").forEach((char, i) => {
        html += `<span>${char}</span>`;
    });
    document.getElementById("text-display").innerHTML = html;
}

// START
function startTest() {
    loadText();
    let input = document.getElementById("input");
    input.disabled = false;
    input.value = "";
    input.focus();

    startTime = new Date().getTime();

    timer = setInterval(() => {
        let t = Math.floor((new Date().getTime() - startTime) / 1000);
        document.getElementById("time").innerText = t;

        if (t >= timeLimit) finishTest();
    }, 1000);
}

// TYPING
document.getElementById("input").addEventListener("input", function () {
    let typed = this.value;
    let spans = document.querySelectorAll("#text-display span");

    let correct = 0;

    spans.forEach((span, i) => {
        span.classList.remove("current");

        if (typed[i] == null) {
            span.classList.remove("correct", "wrong");
        } else if (typed[i] === span.innerText) {
            span.classList.add("correct");
            correct++;
        } else {
            span.classList.add("wrong");
        }

        if (i === typed.length) span.classList.add("current");
    });

    let mistakes = typed.length - correct;
    document.getElementById("mistakes").innerText = mistakes;

    let accuracy = Math.round((correct / typed.length) * 100);
    document.getElementById("accuracy").innerText = accuracy || 100;

    let time = (new Date().getTime() - startTime) / 1000;
    let wpm = Math.round((typed.split(" ").length / time) * 60);
    document.getElementById("wpm").innerText = wpm || 0;

    let progress = (typed.length / currentText.length) * 100;
    document.getElementById("progress").style.width = progress + "%";

    if (typed === currentText) finishTest();
});

// FINISH
function finishTest() {
    clearInterval(timer);

    let wpm = document.getElementById("wpm").innerText;
    let acc = document.getElementById("accuracy").innerText;

    let msg = "";
    if (wpm > 60) msg = "🔥 Excellent!";
    else if (wpm > 40) msg = "👍 Good!";
    else msg = "💡 Keep practicing!";

    document.getElementById("final-result").innerHTML =
        `WPM: ${wpm} | Accuracy: ${acc}% <br>${msg}`;

    saveScore(wpm, acc);
    document.getElementById("input").disabled = true;
}

// RESET
function resetTest() {
    clearInterval(timer);
    document.getElementById("input").value = "";
    document.getElementById("input").disabled = true;
    document.getElementById("text-display").innerHTML = "";
    document.getElementById("progress").style.width = "0%";
}

// THEME
function toggleTheme() {
    document.body.classList.toggle("light");
}

// LEADERBOARD
function saveScore(wpm, acc) {
    let scores = JSON.parse(localStorage.getItem("scores")) || [];
    scores.push({ wpm, acc });
    localStorage.setItem("scores", JSON.stringify(scores));
    showScores();
}

function showScores() {
    let scores = JSON.parse(localStorage.getItem("scores")) || [];
    let list = document.getElementById("scores");
    list.innerHTML = "";

    scores.slice(-5).reverse().forEach(s => {
        list.innerHTML += `<li>${s.wpm} WPM - ${s.acc}%</li>`;
    });
}

showScores();
console.log("Typing Speed Project");

