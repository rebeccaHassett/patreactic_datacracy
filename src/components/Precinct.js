import $ from "jquery";
import L from "leaflet";

class Precinct {
    constructor(map, chosen_state) {
        this.map = map;
        this.chosen_state = chosen_state;
    }

    addPrecinctsToDistricts(url, map) {
        var layer;

        var district_style = {
            "color": "red"
        };

        var state = $.ajax({
            url: url,
            dataType: "json",
            success: console.log("State data successfully loaded."),
            fail: function (xhr) {
                alert(xhr.statusText)
            }
        })


        $.when(state).done(function () {
            layer = L.geoJSON(state.responseJSON, {style: district_style}).addTo(map);
            layer.bringToFront();
        });
    }



    //addPrecinctsToDistricts();
}

export default Precinct;