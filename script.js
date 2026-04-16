// TEXT DATA
const texts = {
    easy: [
        "The sun rises in the east.",
        "I love coffee in the morning.",
        "Cats are playful and cute.",
        "She reads a book every day.",
        "We go for a walk daily.",
        "He likes to play football.",
        "The sky is clear and blue.",
        "Birds are flying in the sky.",
        "Water is essential for life.",
        "I enjoy listening to music.",
        "The dog barked loudly.",
        "This is a simple sentence.",
        "We are learning JavaScript.",
        "Typing is a useful skill.",
        "Practice makes a person better."
    ],

    medium: [
        "Typing improves with consistent practice and patience.",
        "JavaScript helps in building interactive web applications.",
        "Learning new skills requires dedication and focus.",
        "Technology is changing the world rapidly every day.",
        "Reading books enhances knowledge and imagination.",
        "Coding regularly improves problem solving skills.",
        "Web development includes HTML CSS and JavaScript.",
        "Time management is important for success.",
        "A healthy lifestyle keeps the mind and body active.",
        "Communication skills are essential in professional life.",
        "Debugging code helps you understand logic better.",
        "Consistency is the key to long term success.",
        "Working in teams improves productivity and learning.",
        "Building projects boosts confidence and experience.",
        "Practice typing daily to increase your speed."
    ],

    hard: [
        "Success comes from consistent effort discipline and dedication over a long period of time.",
        "Technology evolves rapidly requiring continuous learning and adaptation in modern environments.",
        "Artificial intelligence is transforming industries by automating complex decision making processes.",
        "Developers must write clean efficient and maintainable code for scalable applications.",
        "Understanding algorithms and data structures is crucial for solving complex problems.",
        "In the digital age cybersecurity plays a vital role in protecting sensitive information.",
        "Advanced programming concepts require logical thinking and deep understanding of systems.",
        "The ability to adapt to new technologies determines long term career growth.",
        "Software engineering involves designing testing and maintaining reliable systems.",
        "Efficient time management and focus are essential for achieving professional excellence.",
        "Innovation drives progress and creates new opportunities in every field.",
        "Critical thinking and analysis are necessary for solving real world challenges.",
        "Complex systems require careful planning testing and optimization.",
        "Mastering programming takes patience persistence and continuous effort.",
        "Modern applications rely on scalable and optimized backend systems."
    ]
};

// GLOBAL VARIABLES
let level = "easy";
let currentText = "";
let startTime;
let timer;
let timeLimit = 30;

// SET LEVEL
function setLevel(lvl) {
    level = lvl;

    if (lvl === "easy") timeLimit = 30;
    if (lvl === "medium") timeLimit = 60;
    if (lvl === "hard") timeLimit = 90;

    alert("Level: " + lvl.toUpperCase());
    resetTest();
}

// GENERATE TEXT (NO REPEAT)
function generateText() {
    let arr = [...texts[level]];
    arr.sort(() => 0.5 - Math.random());
    return arr.slice(0, 4).join(" ");
}

// LOAD TEXT
function loadText() {
    currentText = generateText();
    let html = "";

    currentText.split("").forEach(char => {
        html += `<span>${char}</span>`;
    });

    document.getElementById("text-display").innerHTML = html;
}

// START TEST
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

// TYPING EVENT
document.getElementById("input").addEventListener("input", function () {
    let typed = this.value;
    let spans = document.querySelectorAll("#text-display span");

    let correct = 0;

    spans.forEach((span, i) => {
        span.classList.remove("current");

        if (typed[i] == null) {
            span.classList.remove("correct", "wrong");
        } 
        else if (typed[i] === span.innerText) {
            span.classList.add("correct");
            correct++;
        } 
        else {
            span.classList.add("wrong");
        }

        if (i === typed.length) span.classList.add("current");
    });

    let mistakes = typed.length - correct;
    document.getElementById("mistakes").innerText = mistakes;

    let accuracy = typed.length > 0 
        ? Math.round((correct / typed.length) * 100) 
        : 100;

    document.getElementById("accuracy").innerText = accuracy;

    let time = (new Date().getTime() - startTime) / 1000;
    let words = typed.trim().split(/\s+/).length;

    let wpm = time > 0 
        ? Math.round((words / time) * 60) 
        : 0;

    document.getElementById("wpm").innerText = wpm;

    let progress = (typed.length / currentText.length) * 100;
    document.getElementById("progress").style.width = progress + "%";

    if (typed === currentText) finishTest();
});

// FINISH TEST
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

// RESET TEST
function resetTest() {
    clearInterval(timer);

    document.getElementById("input").value = "";
    document.getElementById("input").disabled = true;
    document.getElementById("text-display").innerHTML = "";
    document.getElementById("time").innerText = "0";
    document.getElementById("wpm").innerText = "0";
    document.getElementById("accuracy").innerText = "100";
    document.getElementById("mistakes").innerText = "0";
    document.getElementById("progress").style.width = "0%";
    document.getElementById("final-result").innerHTML = "";
}

// THEME TOGGLE
function toggleTheme() {
    document.body.classList.toggle("light");
}

// SAVE SCORE
function saveScore(wpm, acc) {
    let scores = JSON.parse(localStorage.getItem("scores")) || [];

    scores.push({
        wpm: Number(wpm),
        acc: Number(acc),
        date: new Date().toLocaleString()
    });

    localStorage.setItem("scores", JSON.stringify(scores));
    showScores();
}

// SHOW LEADERBOARD
function showScores() {
    let scores = JSON.parse(localStorage.getItem("scores")) || [];
    let list = document.getElementById("scores");

    list.innerHTML = "";

    scores.slice(-5).reverse().forEach(s => {
        list.innerHTML += `
            <li>
                ${s.wpm} WPM - ${s.acc}% 
                <small>(${s.date})</small>
            </li>`;
    });
}

// INIT
showScores();