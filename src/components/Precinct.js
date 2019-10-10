import $ from "jquery";
import L from "leaflet";

var precinctsToClusters = {};
/*Id, [including numbers in between as well as the numbers themselves in the first and second position
3888,3889, 3890.....,3899,3900]*/
precinctsToClusters['12'] = [[3888, 3900], [3902, 3918],
    [3920, 3925], [3927, 3937]];
precinctsToClusters['01'] = [[2, 23], [70,103], [119,126],[201,213]];
precinctsToClusters['06'] = [[24, 69], [214,276], [361, 381]];
precinctsToClusters['07'] = [[277, 298]];
precinctsToClusters['05'] = [[104,118],[154, 200]];
precinctsToClusters['03'] = [[127,153], [299,360]];

    class Precinct {
    constructor(map, chosen_state) {
        this.map = map;
        this.chosen_state = chosen_state;
    }

    addPrecinctsToDistricts(url, map) {
        var layer;

        var district_style = {
            "color": "black"
        };

        var state = $.ajax({
            url: url,
            dataType: "json",
            success: console.log("PRECINCT ALERT LOADED SUCCESS!"),
            fail: function (xhr) {
                alert(xhr.statusText)
            }
        })

        /* Filtering Works */
        $.when(state).done(function () {
            var res = $(state.responseJSON.features)
                .filter(function (i,n){
                    return n.properties.CountyFips === "163";
                });
            res["type"] = "FeatureCollection";
            console.log(res);
            layer = new L.GeoJSON(state.responseJSON, {style: district_style, filter: function(feature, layer) {
                return (feature.properties.Id >= 361 && feature.properties.Id <= 381);}}).addTo(map);
            layer.bringToFront();
        });
    }



    //addPrecinctsToDistricts();
}
function countyFilter(feature) {
    return false;
    if(feature.properties.CountyFips === "163") {
        console.log("FOUND");
        return true;
    }
    else {
        console.log("NOT FOUND");
        return false;
    }
}

export default Precinct;