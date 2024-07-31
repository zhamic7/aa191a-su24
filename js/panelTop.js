// import { locations, response_colors } from "./constants.js";

// progress bar 
function createDivWithTooltip(className, id, tooltipText, widthPercentage) {
    let div = document.createElement('div');
    div.className = className;
    div.id = id;
    div.style.width = widthPercentage + '%';
    div.style.position = 'relative';

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
        header.textContent = 'Do NPHS student athletes think there are enough clean and reliable water fountains during sports practices?';
        header.style.lineHeight = '1.5';
        container.appendChild(header);

        // legend
        let legend = document.createElement('div');
        legend.className = 'legend';

        // Yes color box
        let yesBox = document.createElement('div');
        yesBox.className = 'legend-box';
        yesBox.style.backgroundColor = 'green'; // Green color for YES
        legend.appendChild(yesBox);
        legend.appendChild(document.createTextNode(' YES'));

        let spacer = document.createElement('span');
        spacer.style.display = 'inline-block';
        spacer.style.width = '20px'; // Adjust width as needed
        legend.appendChild(spacer);

        // No color box
        let noBox = document.createElement('div');
        noBox.className = 'legend-box';
        noBox.style.backgroundColor = 'orange'; // Orange color for NO
        legend.appendChild(noBox);
        legend.appendChild(document.createTextNode(' NO'));

        container.appendChild(legend);

        // progress bar

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

function fetchAndUpdateProgressBar(rows) {
    // let rows = data.split('\n').slice(1); // Skip header row
    let yesCount = 0;
    let noCount = 0;
    rows.forEach((row) => {
        if (row) {
            let response = row['Do you think there are enough clean and reliable water fountains at NPHS during sports practices? '];
            console.log('Response:', response); 
            if (response === "Yes") yesCount++;
            if (response === "No") noCount++;
        }
    });

    console.log('Yes Count:', yesCount); // Log final counts
    console.log('No Count:', noCount);

    createOrUpdateProgressBar('progressBarContainer', yesCount, noCount);
}

export { fetchAndUpdateProgressBar };

// fetchAndUpdateProgressBar();