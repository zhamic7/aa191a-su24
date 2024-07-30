const fill = "#86CBED";
const opacity = 0.4;
const line = "#FFFFFF";
const width = 1.5;

export const legend_colors = {
    "Water Fountains" : "#AFAFAF",
    "Sports Practice Locations:" : "#86cbed"
};

export const locations = {
    "Gym" : { short: "gym", lat: 34.185171, lon : -118.953065, 
                fill : {'fill-color': fill, 'fill-opacity': opacity },
                line : { 'line-color': line, 'line-width': width } 
            }, 
    "Tennis Court" : { short: "tennis", lat: 34.185868, lon : -118.952700, 
                fill : {'fill-color': fill, 'fill-opacity': opacity },
                line : { 'line-color': line, 'line-width': width }  
            }, 
    "Pool" : { short: "pool", lat: 34.185143, lon : -118.952646, 
                fill : {'fill-color': fill, 'fill-opacity': opacity },
                line : { 'line-color': line, 'line-width': width } 
            }, 
    "Panther Stadium" : { short: "panther", lat: 34.185868, lon : -118.951070, 
                fill : {'fill-color': fill, 'fill-opacity': opacity },
                line : { 'line-color': line, 'line-width': width } 
            }, 
    "Soccer Field" : { short: "soccer", lat: 34.184606, lon : -118.950419, 
                fill : {'fill-color': fill, 'fill-opacity': opacity },
                line : { 'line-color': line, 'line-width': width } 
            }, 
    "Borchard Community Park" : { short: "borchard", lat: 34.180785, lon : -118.950527, 
                fill : {'fill-color': fill, 'fill-opacity': opacity },
                line : { 'line-color': line, 'line-width': width } 
            }
}

export const response_colors = {
    "Yes": {border : '#228B22', background: '#cff5cf'},
    "No" : {border : "#ffa200", background: "#ffe7be"},
}