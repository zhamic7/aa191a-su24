import { locations, response_colors } from "./constants.js";

let card_visibility = new Set();

function cardExpansion(id_no) {
    let expand = document.getElementById("card_"+ + id_no);
    let control = document.getElementById("btn_"+ id_no);
    if (card_visibility.has(id_no)) {
        card_visibility.delete(id_no);
        expand.style.visibility = 'visible';
        expand.style.height = 'auto';
        expand.style.marginTop = "10px";
        control.innerHTML = `<p style="font-style:italic;">▲ Collapse</p>`;
    }
    else {
        card_visibility.add(id_no);
        expand.style.visibility = 'hidden'
        expand.style.height = '0';
        expand.style.marginTop = '0';
        control.innerHTML = `<p style="font-style:italic;">▼ Read more</p>`;
    }
}

export function createCard(response) {
    const card = document.createElement('div');
    card.className = "card " + locations[response.place].short; // Get first word only
    card.innerHTML = `${response.card}${response.more_info}`;
    card.style.borderColor = response.category_color.border;
    card.style.backgroundColor = response.category_color.background;
    document.getElementById("cards").prepend(card);

    let id_no = response.id_no;
    let control = document.getElementById("btn_"+ id_no);
    control.addEventListener('click', () => { cardExpansion(id_no); });
    card_visibility.add(id_no);
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