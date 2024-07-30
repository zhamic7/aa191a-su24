import { locations, legend_colors } from "./constants.js";
import { createCard, filterCards } from "./panelRight.js";
import { Place, processData } from "./dataProcessing.js";
import { addMarker } from "./mapLayout.js";
import { createWordCloud } from "./panelLeft.js";

let surveyCoreQuestionArray = { "Yes" : 0, "No" : 0}; 
/* can put into processData function to edit 
    -- see lines "let responses = processData(results.data, surveyCoreQuestionArray); // Use a new function to handle CSV data
                    console.log(surveyCoreQuestionArray);" */

///////////////////////// FUNCTIONS /////////////////////////
function createCheckboxForCategory(category, filterGroup) {
    // Create a container for the checkbox, label, and markerLegend
    const container = document.createElement('div');
    container.style.display = 'grid';
    container.style.gridTemplateColumns = 'auto auto 1fr'; // Define the grid columns
    container.style.alignItems = 'center'; // Align items vertically in the center
    container.style.gap = '8px'; // Add some space between the items

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.id = category;
    input.checked = true;

    const label = document.createElement('label');
    label.setAttribute('for', category);
    label.textContent = category;

    const markerLegend = document.createElement('div');
    markerLegend.className = `marker marker-${category}`;

    // Append the elements to the container instead of directly to the filterGroup
    container.appendChild(input);
    container.appendChild(label);
    container.prepend(markerLegend);

    // Append the container to the filterGroup
    filterGroup.appendChild(container);

    input.addEventListener('change', function(event) {
        toggleMarkersVisibility(category, event.target.checked);
    });
}

function createFilterUI() {
    const categories = ['On-campus', 'Off-campus', 'Both'];
    const filterGroup = document.getElementById('filter-group') || document.createElement('div');
    filterGroup.setAttribute('id', 'filter-group');
    filterGroup.className = 'filter-group';
    document.getElementById("legend").appendChild(filterGroup);

    categories.forEach(category => {
        createCheckboxForCategory(category, filterGroup);
    });
}

function toggleMarkersVisibility(category, isVisible) {
    const markers = document.querySelectorAll(`.marker-${category}`);
    markers.forEach(marker => {
        marker.style.display = isVisible ? '' : 'none';
    });
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("legend").addEventListener('click', function(event) {
        if (event.target.classList.contains('legend-item')) {
            let category = event.target.getAttribute('data-category');
            toggleCheckbox(event.target);
            filterMarkers(category);
        }
    });
});

function toggleCheckbox(item) {
    let dot = item.querySelector('.dot');
    dot.classList.toggle('checked');
}

function filterMarkers(category) {
    map.eachLayer(function(layer) {
        if (layer instanceof maplibregl.Marker) {
            let markerCategory = layer.options.category;

            let showMarker = true;

            switch (category) {
                case 'Select All':
                    // show all markers
                    break;
                case 'Off-Campus':
                    showMarker = (markerCategory === 'off-campus');
                    break;
                case 'On-Campus':
                    showMarker = (markerCategory === 'on-campus');
                    break;
                case 'Both':
                    showMarker = (markerCategory === 'both');
                    break;
            }

            if (showMarker) {
                layer.addTo(map)
            } else {
                map.removeLayer(layer);
            }
        }
    });
}

///////////////////////// MAIN /////////////////////////

// Create word cloud
createWordCloud();

// Create map and add markers
const mapZoom = {
    "lat": 34.18274035884417, 
    "lon": -118.95138684698637,
    "zoom": 15.5
}
const map = new maplibregl.Map({
    container: 'map', // container ID
    style: 'https://api.maptiler.com/maps/satellite/style.json?key=aRyJfnj25CKYN2noi9Wt', // Your style URL
    center: [mapZoom.lon, mapZoom.lat], // Starting position [lng, lat]
    zoom: mapZoom.zoom // Starting zoom level
});
const dataUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQaYYp3qBhE2S8SJcR2U16WsMNcd-Ipxv9DDzgfRLkRVTYH8OGXXqX-vHreP9dLtdtq0Dp-UDh3eiaU/pub?output=csv"

// When the map is fully loaded, start adding GeoJSON data
map.on('load', function() {
    const waterftn_coords = [
        [34.18518367221783, -118.95283325589428],
        [34.18324442509275, -118.9525757638468],
        [34.18329323964055, -118.95214661043437]
    ];
    waterftn_coords.forEach(coord => addMarker(coord).addTo(map) );

    // Existing functionalities
    createFilterUI();

    // Create polygons
    fetch("../locations.geojson") // fetch geojson data
    .then(polygons => { return polygons.json(); }) // check data
    .then(polygons => { // process data
        polygons.features.forEach(poly => {
            let polygon_name = poly.properties.name;
            map.addSource(polygon_name, {
                'type': 'geojson',
                'data': poly
            });
            map.addLayer({
                'id': polygon_name,
                'type': 'fill',
                'source': polygon_name,
                'paint': locations[polygon_name].fill
            });
            map.addLayer({
                'id': polygon_name + " line",
                'type': 'line',
                'source': polygon_name,
                'paint': locations[polygon_name].line
            });
            map.on('click', polygon_name, (e) => {
                let tag = polygon_name.split(' ')[0]; // Get first word only of key
                filterCards(polygon_name);
            });
        });
     })
    .catch(function(error) {
        console.log("An error occurred: ", error);
    });
    
    // Use PapaParse to fetch and parse the CSV data from a Google Forms spreadsheet URL
    Papa.parse(dataUrl, {
        download: true, // Tells PapaParse to fetch the CSV data from the URL
        header: true, // Assumes the first row of your CSV are column headers
        complete: function(results) { // Process the parsed data
            let responses = processData(results.data, surveyCoreQuestionArray); // Use a new function to handle CSV data
            console.log(surveyCoreQuestionArray);
            responses.forEach(place => createCard(place.place, place.card, place.category_color));
        }
    });
});

// Create map legend
let legend = `<form><div><p style="font-weight: bold; margin-bottom:10px;">Legend</p>`;
for (const [key, value] of Object.entries(legend_colors)) {
    legend = legend.concat(`<div class="legend-item">
                                <span class="dot" style="background-color:${value}"></span>
                                <p>${key}</p>   
                            </div>`);
}
legend = legend.concat(`</div></form>`);
document.getElementById("legend").innerHTML = legend;
