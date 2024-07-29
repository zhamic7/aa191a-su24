import { locations, legend_colors } from "./constants.js";

const months = [ "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December" ];

const structures = new Set();
let clusters = new Object();

function checkPlace(place) {
    if(structures.has(place)) {
        clusters[place] = clusters[place] + 1;
    }
    else {
        structures.add(place);
        clusters[place] = 0;
    }
}

export function Place(time, place, water_src, water_src_desc, clean, clean_desc) {
    checkPlace(place);
    let offset = clusters[place];
    let lat = locations[place].lat + 0.00003 * offset * Math.sin(offset * Math.PI/4);
    let lon = locations[place].lon + 0.00003 * offset * Math.cos(offset * Math.PI/4);
    water_src = water_src.split(' ')[0];
    time = time.split(' ')[0].split('/');

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

    let stories_short = `<p>During sports practices, I mostly rely on
                            <span style="font-weight:bold;"> ${water_src.toLowerCase()} </span>
                        water sources. 
                        </p>
                        <p style="margin: 0.5vh 1vw;">Reasoning:
                            <span style="font-weight:bold;"> ${water_src_desc}</span>
                        </p>
                        <p>I think there 
                            <span style="font-weight:bold;"> are ${(clean === "Yes") ? "" : " not"}</span>
                            enough clean and reliable water fountains at NPHS during sports practices.
                        </p>
                        <p style="margin: 0.5vh 1vw;">Reasoning:
                            <span style="font-weight:bold;"> ${clean_desc}</span>
                        </p>`;
    let title = `<div class="popupTitle">
                            <p style="font-size:16px; font-weight:bold;">Response from ${place}, (${months[time[0]]} ${time[2]})</p>
                </div>`
    
    this.place = place;
    this.card = title + `<p style="margin-top: 7px;">${stories}</p>`;
    this.caption = title + `<p style="margin-top: 7px;">${stories_short}</p>`;
    this.coords = [lon, lat];
    this.category_color = legend_colors[water_src];
}

export function processData(data, surveyCoreQuestionArray) {
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

        if (true) { //change condition
            surveyCoreQuestionArray["Yes"] = surveyCoreQuestionArray["Yes"] + 1;
        }
    }
    return places;
}