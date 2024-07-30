import { locations, response_colors } from "./constants.js";

const dataUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQaYYp3qBhE2S8SJcR2U16WsMNcd-Ipxv9DDzgfRLkRVTYH8OGXXqX-vHreP9dLtdtq0Dp-UDh3eiaU/pub?output=csv";

function fetchData(url) {
    return fetch(url)
        .then(response => response.text())
        .then(csvText => Papa.parse(csvText, { header: true }));
}

function extractAdjectives(text) {
    const doc = nlp(text);
    return doc.adjectives().out('array');
}

function processSurveyData(data) {
    let adjectiveCounts = {};

    data.forEach(row => {
        const response = row['In regards to the previous question, why do you feel this way?'];
        if (response) {
            const adjectives = extractAdjectives(response);
            adjectives.forEach(adj => {
                adjectiveCounts[adj] = (adjectiveCounts[adj] || 0) + 1;
            });
        }
    });

    return adjectiveCounts;
}

// // Load the data, process it, and create the word cloud
// fetchData(dataUrl).then(result => {
//     const adjectiveCounts = processSurveyData(result.data);
//     generateWordCloud(adjectiveCounts);
// });

// // Process survey data to count adjectives
// function processSurveyData(data) {
//     let adjectiveCounts = {};

//     data.forEach(row => {
//         const response = row['In regards to the previous question, why do you feel this way?'];
//         if (response) {
//             const adjectives = extractAdjectives(response);
//             adjectives.forEach(adj => {
//                 adjectiveCounts[adj] = (adjectiveCounts[adj] || 0) + 1;
//             });
//         }
//     });

//     return adjectiveCounts;
// }

// // Generate the word cloud based on adjective counts
// function generateWordCloud(adjectiveCounts) {
//     const wordCloud = document.getElementById('wordCloud');
//     wordCloud.innerHTML = ''; // Clear any existing content

//     Object.keys(adjectiveCounts).forEach(adjective => {
//         const size = Math.min(Math.max(adjectiveCounts[adjective] * 10, 10), 100); // Adjust size scaling
//         const span = document.createElement('span');
//         span.className = 'word';
//         span.style.fontSize = `${size}px`;
//         span.style.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
//         span.style.position = 'absolute';
//         span.style.top = `${Math.random() * (wordCloud.clientHeight - size)}px`;
//         span.style.left = `${Math.random() * (wordCloud.clientWidth - size)}px`;
//         span.textContent = adjective;
//         wordCloud.appendChild(span);
//     });
// }


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
