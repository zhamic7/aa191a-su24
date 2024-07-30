// import { locations, response_colors } from "./constants.js";

// progress bar 
function createDivWithTooltip(className, id, tooltipText, widthPercentage) {
    let div = document.createElement('div');
    div.className = className;
    div.id = id;
    div.style.width = widthPercentage + '%';

    let tooltip = document.createElement('span');
    tooltip.className = 'tooltip';
    tooltip.textContent = tooltipText;
    div.appendChild(tooltip);

    return div;
}

function createOrUpdateProgressBar(elementId, yesCount, noCount) {
    let container = document.getElementById(elementId);

    if (!container) {
        container = document.createElement('div');
        container.className = 'progress-bar-container';
        container.id = elementId;

        let header = document.createElement('h3');
        header.textContent = 'Do student athletes think there are enough clean and reliable water fountains at NPHS during sports practices?';
        container.appendChild(header);

        let progressBarWrapper = document.createElement('div');
        progressBarWrapper.className = 'progress-bar';

        progressBarWrapper.appendChild(createDivWithTooltip('yes', 'yesBar', `Yes: ${yesCount}`, (yesCount / (yesCount + noCount)) * 100));
        progressBarWrapper.appendChild(createDivWithTooltip('no', 'noBar', `No: ${noCount}`, (noCount / (yesCount + noCount)) * 100));

        container.appendChild(progressBarWrapper);

        let chart = document.getElementById('chart');
        if (chart) {
            chart.appendChild(container);
        } else {
            console.error('Element with ID "chart" not found.');
        }
    } else {
        let yesDiv = container.querySelector('#yesBar');
        let noDiv = container.querySelector('#noBar');

        if (yesDiv && noDiv) {
            yesDiv.style.width = (yesCount / (yesCount + noCount)) * 100 + '%';
            yesDiv.querySelector('.tooltip').textContent = `Yes: ${yesCount}`;
            noDiv.style.width = (noCount / (yesCount + noCount)) * 100 + '%';
            noDiv.querySelector('.tooltip').textContent = `No: ${noCount}`;
        }
    }
}

function fetchAndUpdateProgressBar() {
    const dataUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQaYYp3qBhE2S8SJcR2U16WsMNcd-Ipxv9DDzgfRLkRVTYH8OGXXqX-vHreP9dLtdtq0Dp-UDh3eiaU/pub?output=csv";

    fetch(dataUrl)
        .then(response => response.text())
        .then(csvText => {
            let rows = csvText.trim().split('\n').slice(1);
            let yesCount = 0;
            let noCount = 0;

            console.log('CSV Rows:', rows); // Log rows to check CSV data

            rows.forEach(row => {
                if (row.trim()) {
                    let columns = row.split(',');

                    if (columns.length > 6) {
                        let response = columns[6].trim();
                        if (response === "Yes") yesCount++;
                        if (response === "No") noCount++;
                    }
                }
            });

            createOrUpdateProgressBar('progressBarContainer', yesCount, noCount);
        })
        .catch(error => console.error('Error fetching the CSV data:', error));
}

// Initial call
fetchAndUpdateProgressBar();