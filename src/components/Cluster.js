import $ from "jquery";
import L from "leaflet";

export default class Cluster {
    constructor(map, chosen_state) {
    }
    addClustersToState(url, map) {
        var layer;
        var selected;

        var cluster_style = {
            "color": "green"
        };

        var clusters = $.ajax({
            url: url,
            dataType: "json",
            success: console.log("Cluster data successfully loaded."),
            fail: function (xhr) {
                alert(xhr.statusText)
            }
        })


        $.when(clusters).done(function () {
            layer = L.geoJSON(clusters.responseJSON, {style: cluster_style}).addTo(map);
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
            })
            layer.bringToFront();
        });
    }


}