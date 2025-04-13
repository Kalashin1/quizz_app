// Quiz questions data
const quizData = [
  {
    question:
      "What is the correct way to declare a variable in JavaScript that cannot be reassigned?",
    options: ["var x = 5;", "let x = 5;", "const x = 5;", "variable x = 5;"],
    correct: 2,
  },
  {
    question: "Which method adds one or more elements to the end of an array?",
    options: ["push()", "pop()", "shift()", "unshift()"],
    correct: 0,
  },
  {
    question: "What will typeof null return in JavaScript?",
    options: ["null", "undefined", "object", "number"],
    correct: 2,
  },
  {
    question: "Which of these is NOT a JavaScript framework?",
    options: ["React", "Angular", "Vue", "Flask"],
    correct: 3,
  },
  {
    question: "What does the '===' operator do?",
    options: [
      "Compares values only",
      "Compares values and types",
      "Assigns a value",
      "Checks for null or undefined",
    ],
    correct: 1,
  },
];

const quizContainer = document.querySelector(".quiz-container");
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const nextBtn = document.getElementById("next-btn");
const resultContainer = document.getElementById("result-container");
const resultIcon = document.getElementById("result-icon");
const scoreText = document.getElementById("score-text");
const feedbackEl = document.getElementById("feedback");
const restartBtn = document.getElementById("restart-btn");
const progressBar = document.getElementById("progress");
const questionCounter = document.getElementById("question-counter");

// quiz state
let currentQuestion = 0;
let score = 0;
let selectedOption = null;
let quizCompleted = false;

function loadQuestion() {
  const question = quizData[currentQuestion];
  questionEl.textContent = question.question;
  optionsEl.innerHTML = "";

  // Reset state
  selectedOption = null;
  nextBtn.disabled = true;

  // Update progress
  const progress = (currentQuestion / quizData.length) * 100;
  progressBar.style.width = `${progress}%`;
  questionCounter.textContent = `${currentQuestion + 1}/${quizData.length}`;

  // Create options
  question.options.forEach((option, index) => {
    const optionEl = document.createElement("div");
    optionEl.classList.add("option");
    optionEl.innerHTML = `
        <input type="radio" name="option" id="option${index}" value="${index}">
        <label for="option${index}">${option}</label>
      `;

    optionEl.addEventListener("click", () => selectOption(optionEl, index));
    optionsEl.appendChild(optionEl);
  });
}

function selectOption(optionEl, index) {
  if (quizCompleted) return;

  // Remove previous selection
  const options = document.querySelectorAll(".options");
  options.forEach((opt) => {
    opt.classList.remove("selected");
    opt.querySelector("input").checked = false;
  });

  // set new selection
  optionEl.classList.add("selected");
  optionEl.querySelector("input").checked = true;
  selectedOption = index;
  nextBtn.disabled = false;
}

// check answer and move to next question\

function nextQuestion() {
  if (selectedOption === null) return;

  // Check answer
  const correctIndex = quizData[currentQuestion].correct;
  const options = document.querySelectorAll(".option");

  // Mark correct and incorrect answers
  options.forEach((option, index) => {
    option.classList.remove("selected");
    if (index === correctIndex) option.classList.add("correct");
    else if (index === selectedOption && selectedOption !== correctIndex)
      option.classList.add("incorrect");
  });

  // Update score if correct
  if (selectedOption === correctIndex) score++;

  // Disable next button during feedback
  nextBtn.disabled = true;

  // Move to next question or show results
  setTimeout(() => {
    currentQuestion++;

    if (currentQuestion < quizData.length) loadQuestion();
    else if (currentQuestion >= quizData.length) showResults();
  }, 1000);
}

// show final results
function showResults() {
  quizCompleted = true;
  document.querySelector(".quiz-body").style.display = "none";
  questionEl.style.display = "none";
  resultContainer.style.display = "block";

  // Calculate percentage
  const percentage = Math.round((score / quizData.length) * 100);

  if (percentage >= 70) {
    resultIcon.innerHTML = "A";
    resultIcon.classList.add("success");
    resultIcon.textContent = "Great Job";
  } else if (percentage >= 40) {
    resultIcon.innerHTML = "B";
    resultIcon.classList.add("success");
    resultIcon.textContent = "Good Effort";
  } else {
    resultIcon.innerHTML = "C";
    resultIcon.classList.add("failure");
    resultIcon.textContent = "Keep Learning";
  }

  scoreText.textContent = `You scored ${score} out of ${quizData.length} (${percentage}%)`;

  // Completed progress bar
  progressBar.style.width = "100%";
}

function restartQuiz() {
  currentQuestion = 0;
  score = 0;
  quizCompleted = false;

  document.querySelector(".quiz-body").style.display = "block";
  questionEl.style.display = "block"
  resultContainer.style.display = "none";

  // Reset all options
  const options = document.querySelectorAll(".options");
  options.forEach((opt) => {
    opt.classList.remove("correct", "incorrect", "selected");
  });

  loadQuestion();
}

// Event listeners
nextBtn.addEventListener("click", nextQuestion);
restartBtn.addEventListener("click", restartQuiz);

// Start Quiz
loadQuestion();
