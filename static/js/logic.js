


//Route to access data from website - wuakes of intensity 2.5+
var jsonRoute = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson";

// Basic map, including starting coordinates
var baseMap = L.map("map", {
  center: [
    0, 120 // starting position: Australia and South East Asia
  ],
  zoom: 3,
});

//  Lightmap
var lightMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 15,
  id: "outdoors-v11",
  accessToken: API_KEY //config file not referred to on index.html, had to be added by hand!
});

lightMap.addTo(baseMap);



// get info using d3
d3.json(jsonRoute, function(data) {
      

    var dataQuakes = data.features;

    // one amrker per item in the dataQuakes array
    for (var i = 0; i < dataQuakes.length; i++) {
        // colour placeholder
        var colour = "";

        // no 1 becuase min is 2.5 as per data. Purple to identify the ones that don't meet criteria s they are errors/outliers.
        if (dataQuakes[i].properties.mag > 5) {
            colour = '#cd3200';
        }
        else if (dataQuakes[i].properties.mag > 4) {
            colour = '#cd5900';
        }
        else if (dataQuakes[i].properties.mag > 3) {
            colour = '#cd8000';
        }
        else if (dataQuakes[i].properties.mag > 2) {
            colour = '#cda632';
        }
        else {
            colour = '#FD33FF';
        }
        
        // cooridnates for each quake in the loop
        var locationQuakes = [dataQuakes[i].geometry.coordinates[1], dataQuakes[i].geometry.coordinates[0]] // 
        
        // markers for each quake
        var markerQuake = L.circle(locationQuakes, {
            fillOpacity: 0.90,
            color: colour,  // BEWARE OF AMERICAN SPELLING!!
            fillcolor: colour, // BEWARE OF AMERICAN SPELLING!!
            radius: dataQuakes[i].properties.mag * 2000 // variable radius
            }).bindPopup("<h3>" + dataQuakes[i].properties.place + "</h3><hr><p>" + 
            new Date(dataQuakes[i].properties.time) + "</p>" + "<br>" + "Magnitude: " 
            + dataQuakes[i].properties.mag);
            
        
      
        markerQuake.addTo(baseMap);
        
    };
    
    // legend taht will appear on the map
    var mapLegend = L.control({position: 'bottomright'});

    //function to add content to mapLegend
    mapLegend.onAdd = function() {

        
        var div = L.DomUtil.create('div', 'info mapLegend'),
            grades = [2, 3, 4, 5] // magnitudes to be used in the legend
           

        // scale of colours for intensity
        function getcolour(intensity) {
              return intensity > 5  ? '#cd3200' :
                     intensity > 4  ? '#cd5900' :
                     intensity > 3  ? '#cd8000' :
                     intensity > 2  ? '#cda632' :
                                      '#FD33FF' ;
          }
         
          // mapLegend.onAdd = "Earthquake Intensity";
    
        // loop to go through colours according to quake magnitude in legend - don't think it's working
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getcolour(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
        return div;
    };

    // adding legend into map
    mapLegend.addTo(baseMap);
});