import { locations, legend_colors } from "./constants.js";

export function createCard(tag, content) {
    const card = document.createElement('div');
    card.className = "card " + tag.split(' ')[0]; // Get first word only
    card.innerHTML = `<p>${content}</p>`;
    document.getElementById("cards").prepend(card); 
}

export function filterCards(tag) {
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

export function createButtons(){ // delete later
    const location_keys = Object.keys(locations); // Returns [ "Gym", "Tennis Court", "Pool", "Panther Stadium", "Soccer Field", "Borchard Community Park" ]
    location_keys.unshift("View All"); 
    location_keys.forEach( (key) => 
        {            
            const newButton = document.createElement("button"); 
            newButton.className = "zoom";
            newButton.innerHTML = `<p class="zoom-label">${key.toUpperCase()}</p>`; 
            newButton.addEventListener('click', function(){
                let tag = key.split(' ')[0]; // Get first word only of key
                filterCards(tag);
            });
            document.getElementById("filter").appendChild(newButton); 
        }
    ); 
}