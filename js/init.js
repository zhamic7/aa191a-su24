import { locations, legend_colors, response_colors } from "./constants.js";
import { createCard, filterCards } from "./panelRight.js";
import { Place, processData } from "./dataProcessing.js";
import { addMarker } from "./mapLayout.js";

let surveyCoreQuestionArray = { "Yes" : 0, "No" : 0}; 
/* can put into processData function to edit 
    -- see lines "let responses = processData(results.data, surveyCoreQuestionArray); // Use a new function to handle CSV data
                    console.log(surveyCoreQuestionArray);" */

///////////////////////// MAIN /////////////////////////

// Create map and add markers
const mapZoom = {
    "lat": 34.18334035884417, 
    "lon": -118.95258684698637,
    "zoom": 16
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

    // Create polygons
    fetch("js/locations.geojson") // fetch geojson data
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
    let image = `background-color: ${value};`;
    if (key === "Water Fountains") {
        image = `background-color: ${value}; background-image: url('images/water-fountain.png'); background-size: contain;`
    }
    legend = legend.concat(`<div class="legend-item">
                                <span style="${image}" class="square" ></span>
                                <p style="font-size: 14px;">${key}</p>   
                            </div>`);
}
legend = legend.concat(`<ul style="font-size:13px;display:inline-block; margin-left: 60px; margin-bottom: 10px;">
                            <li>Borchard Community Park</li>
                            <li>Gym</li>
                            <li>Tennis Court</li>
                            <li>Panther Stadium</li>
                            <li>Pool</li>
                            <li>Soccer Field</li>
                        </ol>
                    </div></form>`);
document.getElementById("legend").innerHTML = legend;
