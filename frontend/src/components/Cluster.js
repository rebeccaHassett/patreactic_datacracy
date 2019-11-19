import L from "leaflet";


export default class Cluster {
    constructor(map, chosen_state) {
    }
    addClustersToState(url, map) {
        var layer;
        var selected;

        function cluster_style(feature) {
            return {
                fillColor: feature.properties.COLOR,
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.7
            };
        }

        var clusters = fetch(url).then(function(response) {
            if(response.status >= 400) {
                throw new Error("Failed to load cluster data from server");
            }
            return response.json();
        }).then(function(data) {
            layer = L.geoJSON(data, {style: cluster_style}).addTo(map);
            layer.on('click', function (e) {
                // Check for selected
                if (selected) {
                    // Reset selected to default style
                    e.target.resetStyle(selected)
                }
                // Assign new selected
                selected = e.layer
                // Bring selected to front
                selected.bringToFront()
                // Style selected
                selected.setStyle({
                    'color': 'red'
                })
                map.fitBounds(e.layer.getBounds());
                console.log(e.layer.feature.properties.NAME);
                //const precincts = new Precinct();
                //precincts.addPrecinctsToDistricts('http://127.0.0.1:8080/precinct_geographical%20data/Michigan/2016_Voting_Precincts.geojson', map, e.layer.getBounds());

            })
            layer.bringToFront();
            return layer;
        });
        return clusters;
    }
}