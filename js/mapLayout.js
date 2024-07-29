import { locations, legend_colors } from "./constants.js";

// water fountain markers
const imagePath = 'images/water-fountain.png';

export function addMarker(latlng) {
    const el = document.createElement('div');
    el.style.width = '50px';
    el.style.height = '50px';
    el.style.backgroundImage = `url(${imagePath})`;
    el.style.backgroundSize = 'cover';
    el.style.backgroundColor = '#AFAFAF'; // dark grey
    el.style.backgroundPosition = 'center';
    //el.style.borderRadius = '50%';
    el.style.border = '2px solid black';

    const triangle = document.createElement('div');
    triangle.style.position = 'absolute';
    triangle.style.bottom = '-12px'; 
    triangle.style.left = '50%';
    triangle.style.width = '0';
    triangle.style.height = '0';
    triangle.style.borderLeft = '10px solid transparent'; 
    triangle.style.borderRight = '10px solid transparent';
    triangle.style.borderTop = '12px solid black'; 
    triangle.style.transform = 'translateX(-50%)'; 


    el.appendChild(triangle);

    return new maplibregl.Marker({ element: el })
        .setLngLat([latlng[1], latlng[0]]);
       
}

export function createCustomIcon (caption, latlng, color) { // delete later
    // Create a DOM element for the marker
    const el = document.createElement('div');

    const imageWidthPx = "50px"; 
    const imageHeightPx = 'auto'; // 'auto' to maintain aspect ratio

    el.style.backgroundImage = 'url(images/water-droplet.png)';
    el.style.backgroundPosition = 'center'; // Center the image within the icon    
    el.style.backgroundSize = `${imageWidthPx} ${imageHeightPx}`; // Set image width and height    
    el.style.width = '50px'; // iconSize width
    el.style.height = '50px'; // iconSize height
    el.style.display = 'block';
    el.style.borderRadius = '50%'; // Optional: makes the icon circular
    el.style.border = "2px solid";
    el.style.borderColor = "black";
    el.style.backgroundColor = color;
    //el.style.boxShadow = '0px 0px 20px rgba(255, 255, 255, 0.5)'; // White shadow effect

    return new maplibregl.Marker({element: el})
        .setLngLat(latlng)
        .setPopup(new maplibregl.Popup({ offset: 25 }) // Add popups
        .setHTML(`<div class="mapPopup">
                        <div class="popupTitle">${caption}</div>
                    </div>`).setMaxWidth("30vw"));
}