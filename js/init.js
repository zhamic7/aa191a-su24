/*** Scripts for index.html ***/

///////////////////////// FUNCTIONS /////////////////////////
function filter(tag) {
    console.log(tag);
    let cards = document.getElementsByClassName("card");
    if (tag !== "View") {
        for (let i = 0; i < cards.length; i++) {
            cards[i].style.visibility = "hidden";
            cards[i].style.height = '0';
            cards[i].style.marginBottom = '0';
            cards[i].style.padding = '0';
        }

        cards = document.getElementsByClassName("card " + tag);
        for (let i = 0; i < cards.length; i++) {
            cards[i].style.visibility = "visible";
            cards[i].style.height = "auto";
            cards[i].style.marginBottom = "1vw";
            cards[i].style.padding = "1vw";
        }
    }
    else {
        for (let i = 0; i < cards.length; i++) {
            cards[i].style.visibility = "visible";
            cards[i].style.height = "auto";
            cards[i].style.marginBottom = "1vw";
            cards[i].style.padding = "1vw";
        }
    }
}

function createButtons(){
    const location_keys = Object.keys(locations); // Returns [ "Gym", "Tennis Court", "Pool", "Panther Stadium", "Soccer Field", "Borchard Community Park" ]
    location_keys.unshift("View All"); 
    location_keys.forEach( (key) => 
        {
            let lat = mapZoom.lat;
            let lon = mapZoom.lon;
            let zoom = mapZoom.zoom;
            if (key !== "View All") {
                lat = locations[key].lat;
                lon = locations[key].lon;
                zoom = 19;
            }
            
            const newButton = document.createElement("button"); 
            newButton.className = "zoom";
            newButton.innerHTML = `<p class="zoom-label">${key.toUpperCase()}</p>`; 
            newButton.setAttribute("lat", lat); 
            newButton.setAttribute("lon", lon); 
            newButton.addEventListener('click', function(){
                map.flyTo({
                    center: [lon, lat], 
                    zoom: zoom,
                }); 

                let tag = key.split(' ')[0]; // Get first word only of key
                filter(tag);
            });
            document.getElementById("filter").appendChild(newButton); 
        }
    ); 
}

function createCustomIcon (caption, latlng, color) {
    // Create a DOM element for the marker
    const el = document.createElement('div');
    // el.style.backgroundImage = 'url(images/my-icon.png)';
    el.style.backgroundSize = '50px';
    el.style.width = '50px'; // iconSize width
    el.style.height = '50px'; // iconSize height
    el.style.display = 'block';
    el.style.borderRadius = '50%'; // Optional: makes the icon circular
    el.style.border = "2px solid";
    el.style.borderColor = "black";
    el.style.backgroundColor = color;
    //el.style.boxShadow = '0px 0px 20px rgba(0, 0, 0, 0.5)'; // Optional: adds shadow effect
    
    return new maplibregl.Marker({element: el})
        .setLngLat(latlng)
        .setPopup(new maplibregl.Popup({ offset: 25 }) // Add popups
        .setHTML(`<div class="mapPopup">
                        <div class="popupTitle">${caption}</div>
                    </div>`));
}

function createCard(tag, content) {
    const card = document.createElement('div');
    card.className = "card " + tag.split(' ')[0]; // Get first word only
    card.innerHTML = `<p>${content}</p>`;
    document.getElementById("cards").prepend(card); 
}

function checkPlace(place) {
    if(structures.has(place)) {
        clusters[place] = clusters[place] + 1;
    }
    else {
        structures.add(place);
        clusters[place] = 0;
    }
}

function Place(time, place, water_src, water_src_desc, clean, clean_desc) {
    checkPlace(place);
    let offset = clusters[place];
    let lat = locations[place].lat + 0.00003 * offset * Math.sin(offset * Math.PI/4);
    let lon = locations[place].lon + 0.00003 * offset * Math.cos(offset * Math.PI/4);
    water_src = water_src.split(' ')[0];

    let stories = `<p style="font-weight:bold;">During sports practices, do you mostly rely on water sources off-campus, on-campus, or both? <\p>
                    <p>${water_src}</p>
                    <br>
                    <p style="font-weight:bold;">In regards to the previous question, what is the reason for your preference (or lack thereof)? </p>
                    <p>${water_src_desc}</p>
                    <br>
                    <p style="font-weight:bold;">Do you think there are enough clean and reliable water fountains at NPHS during sports practices? </p>
                    <p>${clean}</p>
                    <br>
                    <p style="font-weight:bold;">In regards to the previous question, why do you feel this way? </p>
                    <p>${clean_desc}</p>`;

    this.caption = `<div class="popupTitle">
                            <h2 style="font-size:16px;">Response from ${place}, (${time})</h2>
                    </div>
                    <p style="margin-top: 7px;">${stories}</p>`;
    this.coords = [lon, lat];
    this.category_color = legend_colors[water_src];

    createCard(place, this.caption);
}


function processData(data) {
    let places = [];
    for (let i = 0; i < data.length; i++) {
        let tmp = data[i];
        let show = tmp["Are you in Grades 9-12, and do you attend Newbury Park High School as a student athlete?"];        
        if (show === "Yes") {    
            let waterSource = tmp["During sports practices, do you mostly rely on water sources off-campus, on-campus, or both? "];
            let markerCategory;

            switch (waterSource) {
                case "Off-campus (e.g., water from home, local stores, etc.)":
                    markerCategory = 'off-campus';
                    break;
                case "On-campus (water fountains)":
                    markerCategory = 'on-campus';
                    break;
                case "Both":
                    markerCategory = 'both';
                    break;
            }

            places.push(new Place(tmp["Timestamp"],
                                        tmp["Which of the following places do you spend the most time at for your sport?"],
                                        waterSource,
                                        tmp["In regards to the previous question, what is the reason for your preference (or lack thereof)? "],
                                        tmp["Do you think there are enough clean and reliable water fountains at NPHS during sports practices? "],
                                        tmp["In regards to the previous question, why do you feel this way? "],
                ));
        }
    }
    places.forEach(place => createCustomIcon(place.caption, place.coords, place.category_color).addTo(map) );
}

///////////////////////// MAIN /////////////////////////

// Declare data structures
const structures = new Set();
let clusters = new Object();

const legend_colors = {
    "Select All" : "white",
    "Off-campus": "#F48BA9",
    "On-campus" : "#86CBED",
    "Both": "#936ED4",
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

const locations = {
    "Gym" : { lat: 34.185171, lon : -118.953065 }, 
    "Tennis Court" : { lat: 34.185868, lon : -118.952700 }, 
    "Pool" : { lat: 34.185143, lon : -118.952646 }, 
    "Panther Stadium" : { lat: 34.185868, lon : -118.951070 }, 
    "Soccer Field" : { lat: 34.184606, lon : -118.950419 }, 
    "Borchard Community Park" : { lat: 34.180785, lon : -118.950527 }
}

// Declare variables
let mapZoom = {
    "lat": 34.18274035884417, 
    "lon": -118.95138684698637,
    "zoom": 16
}

// Create map and add markers
const map = new maplibregl.Map({
    container: 'map', // container ID
    style: 'https://api.maptiler.com/maps/satellite/style.json?key=aRyJfnj25CKYN2noi9Wt', // Your style URL
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

createButtons();

let legend = `<form><div><p style="font-weight: bold; margin-bottom:10px;">Legend</p>`;
let i = 1;
for (const [key, value] of Object.entries(legend_colors)) {
    let id_name = "choice" + i;
    legend = legend.concat(`<div class="legend-item">
                                <input type="radio" id="${id_name}" name="layer" value="${key}" />
                                <label for="${id_name}">
                                    <span class="dot" style="background-color:${value}"></span>
                                    <p>${key}</p>
                                </label>    
                            </div>`);
    i++;
}
legend = legend.concat(`</div></form>`);
document.getElementById("legend").innerHTML = legend;
