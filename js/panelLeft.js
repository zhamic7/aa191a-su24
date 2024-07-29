import { locations, legend_colors } from "./constants.js";

let surveyCoreQuestionArray = [];

// Step 2: Create an array of words with their count
const words = [
    {text: "Hello", size: 10},
    {text: "World", size: 5},
    {text: "JavaScript", size: 30},
    {text: "Word", size: 6},
    {text: "Cloud", size: 7}
];

// Step 3: Generate the word cloud
const wordCloud = document.getElementById('wordCloud');

export function createWordCloud() {
    words.forEach(word => {
        const span = document.createElement('span');
        span.className = 'word';
        span.style.fontSize = word.size + 'px';
        span.style.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        span.style.top = `${Math.random() * (wordCloud.clientHeight - word.size)}px`;
        span.style.left = `${Math.random() * (wordCloud.clientWidth - word.size)}px`;
        span.textContent = word.text;
        wordCloud.appendChild(span);
    });
}
