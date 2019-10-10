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
    constructor() {
    }

    addPrecinctsToDistricts(url, map, district_bounds) {
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
        $.when(state, district_bounds).done(function () {
            console.log(district_bounds);
            layer = new L.GeoJSON(state.responseJSON, {style: district_style, filter: function(feature, layer) {
                return (feature.properties.Label === "Greenbush Township")}}).addTo(map);
            /*layer = new L.GeoJSON(state.responseJSON, {style: district_style, filter: function(feature, latlng) {
                var polygon = new L.Polygon(feature.geometry.coordinates);
                console.log("Precinct" + polygon.getBounds());
                console.log(district_bounds);
                console.log(district_bounds.contains(polygon.getBounds()));
                    return (district_bounds.contains(polygon.getBounds()));}}).addTo(map);*/
            /*map.getBounds();
            layer = new L.GeoJSON(state.responseJSON, {style: district_style}).addTo(map);*/
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