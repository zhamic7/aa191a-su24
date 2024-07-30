import { locations, response_colors } from "./constants.js";

export function createCard(place, content, color) {
    const card = document.createElement('div');
    card.className = "card " + locations[place].short; // Get first word only
    card.innerHTML = `<p>${content}</p>`;
    card.style.borderColor = color.border;
    card.style.backgroundColor = color.background;
    document.getElementById("cards").prepend(card);
}

export function filterCards(place) {
    let cards = document.getElementsByClassName("card");
    if (place !== "View") {
        let tag = locations[place].short;
        for (let i = 0; i < cards.length; i++) {
            cards[i].style.visibility = "hidden";
            cards[i].style.height = '0';
            cards[i].style.margin = '0';
            cards[i].style.padding = '0';
            cards[i].style.borderWidth = '0';
        }

        cards = document.getElementsByClassName("card " + tag);
        for (let i = 0; i < cards.length; i++) {
            cards[i].style.visibility = "visible";
            cards[i].style.height = "auto";
            cards[i].style.margin = "0rem 1rem 1rem 1rem";
            cards[i].style.padding = "1rem";
            cards[i].style.borderWidth = "5px";
        }
    }
    else {
        for (let i = 0; i < cards.length; i++) {
            cards[i].style.visibility = "visible";
            cards[i].style.height = "auto";
            cards[i].style.margin = "0rem 1rem 1rem 1rem";
            cards[i].style.padding = "1rem";
            cards[i].style.borderWidth = "5px";
        }
    }
    updatePanelInfo(place);
}

export function updatePanelInfo(place) {
    let info = document.getElementById("panel-info");
    if (place === "View") {
        info.innerHTML = `<h3>Currently viewing all responses</h3>
                            <p style="padding-top:10px;">Click on a polygon <span 
                                style="margin: 0px 5px; height:20px; width:20px; 
                                        background-color: #86CBED; border: solid 1.75px white; 
                                        transform: translateY(20%);" 
                                class="square">
                            </span> on the map to view responses from just that location.</p>`;
    }
    else {
        const btn = document.createElement('button');
        btn.innerHTML = 'Go Back to All';
        btn.id = "btn";
        btn.addEventListener('click', () => { filterCards("View"); });

        info.innerHTML = `<h3>Currently viewing responses from: ${place}</h3>`;
        info.appendChild(btn);
    }
}