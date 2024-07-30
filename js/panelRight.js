import { locations, legend_colors } from "./constants.js";

export function createCard(place, content, color) {
    const card = document.createElement('div');
    card.className = "card " + locations[place].short; // Get first word only
    card.innerHTML = `<p>${content}</p>`;
    card.style.borderColor = color;
    document.getElementById("cards").prepend(card); 
}

export function filterCards(place) {
    let cards = document.getElementsByClassName("card");
    if (place !== "View") {
        let tag = locations[place].short;
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
    updatePanelInfo(place);
}

export function updatePanelInfo(place) {
    let info = document.getElementById("panel-info");
    if (place === "View") {
        info.innerHTML =`<h3>Currently viewing responses from: All</h3>`;
    }
    else {
        info.innerHTML =`<h3>Currently viewing responses from: ${place}</h3>
                            <p style="padding-top:10px;"><a href="" onclick="filterCards("View"); return false;">Go Back to All</a></p>`;
    }
}