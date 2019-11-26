import L from "leaflet";

export default class Cluster {
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

        return fetch(url).then(function (response) {
            if (response.status >= 400) {
                throw new Error("Failed to load cluster data from server");
            }
            return response.json();
        }).then(function (data) {
            layer = L.geoJSON(data, {style: cluster_style}).addTo(map);

            layer.on('click', function (e) {
                if (selected) {
                    e.target.resetStyle(selected)
                }
                selected = e.layer
                selected.bringToFront()
                selected.setStyle({
                    'color': 'red'
                })
                map.fitBounds(e.layer.getBounds());
                console.log(e.layer.feature.properties.NAME);
            })

            return layer;
        });
    }
}