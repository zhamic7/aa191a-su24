function processData(data) {
    console.log(data);
}

// Declare data structures
const buildings = new Set();
let clusters = new Object();

const legend_colors = {
    "Item 1" : "#bfd7ed",
    "Item 2": "#60a3d9",
    "Item 3" : "#0074b7",
    "Item 4": "#003b73",
}

const locations = {
    "Gym" : { lat: 0, lon : 0}, 
    "Tennis Court" : { lat: 0, lon : 0}, 
    "Pool" : { lat: 0, lon : 0}, 
    "Panther Stadium" : { lat: 0, lon : 0}, 
    "Soccer Field" : { lat: 5, lon : 0}, 
    "Borchard Community Park" : { lat: 0, lon : 0 }
}
console.log("The latitude of the field is " + locations["Soccer Field"].lat); // Test

// Declare variables
let mapZoom = {
    "lat": 34.18274035884417, 
    "lon": -118.95138684698637,
    "zoom": 16
}

// Create map and add markers
const map = new maplibregl.Map({
    container: 'map', // container ID
    style: 'https://api.maptiler.com/maps/dataviz/style.json?key=aRyJfnj25CKYN2noi9Wt', // Your style URL
    center: [mapZoom.lon, mapZoom.lat], // Starting position [lng, lat]
    zoom: mapZoom.zoom // Starting zoom level
});

const dataUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQaYYp3qBhE2S8SJcR2U16WsMNcd-Ipxv9DDzgfRLkRVTYH8OGXXqX-vHreP9dLtdtq0Dp-UDh3eiaU/pub?output=csv"

// When the map is fully loaded, start adding GeoJSON data
map.on('load', function() {
    // Use PapaParse to fetch and parse the CSV data from a Google Forms spreadsheet URL
    Papa.parse(dataUrl, {
        download: true, // Tells PapaParse to fetch the CSV data from the URL
        header: true, // Assumes the first row of your CSV are column headers
        complete: function(results) {
            // Process the parsed data
            processData(results.data); // Use a new function to handle CSV data
        }
    });
});

let legend = `<div><p style="font-weight: bold; margin-bottom:10px;">Legend</p></div>`;
for (const [key, value] of Object.entries(legend_colors)) {
    legend = legend.concat(`<div class="legend-item">
                                <span class="dot" style="background-color:${value}"></span>
                                <p>${key}</p>
                            </div>`);
}
document.getElementById("legend").innerHTML = legend;