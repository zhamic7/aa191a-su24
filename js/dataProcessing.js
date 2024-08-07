import { locations, response_colors } from "./constants.js";

const months = [ "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December" ];

const structures = new Set();
let clusters = new Object();

export function checkPlace(place) {
    if(structures.has(place)) {
        clusters[place] = clusters[place] + 1;
    }
    else {
        structures.add(place);
        clusters[place] = 0;
    }
}

export function Place(time, place, water_src, water_src_desc, clean, clean_desc) {
    let lat = locations[place].lat;
    let lon = locations[place].lon;
    let date = time.split(' ')[0].split('/');

    this.id_no = time.split(' ').join('').split('/').join('').split(':').join('');
    
    this.card = `<div class="popupTitle">
                    <p style="font-size:16px; font-weight:bolder;">
                        <span style="font-size: 20px; margin:2.5px;">${clean.toUpperCase()}</span> from ${place} (${months[date[0] - 1]} ${date[2]})
                    </p>
                </div>
                <div style="margin:5px;">
                    <p>
                        <span style="font-weight:bold;">Reason: </span>"${clean_desc}"
                    </p>
                </div>
                <div style="display: flex; justify-content: flex-end">
                    <button id="btn_${this.id_no}" class="expand-btn"><p style="font-style:italic;">▼ Read more</p></button>
                </div>`;

    this.more_info = `<div id="card_${this.id_no}" style="visibility:hidden;height:0;margin-top:0;">
                        <p>
                            <span style="font-weight:bold;">
                                Relies on water sources from ${water_src.split(' ')[0].toUpperCase()}: 
                            </span>"${water_src_desc}"
                        </p>

                    </div>`;

    this.place = place;
    this.coords = [lon, lat];
    this.category_color = response_colors[clean];
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