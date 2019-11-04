import L from "leaflet";

    class Precinct {
    constructor() {
    }

    addPrecinctsToDistricts(url, map, district_bounds) {
        var layer;

        var district_style = {
            "color": "black"
        };

        var precinct = fetch(url).then(function(response) {
            if(response.status >= 400) {
                throw new Error("Precinct geographic data not loaded from server successfully");
            }
            return response.json();
        }).then(function(data){
            layer = new L.GeoJSON(data, {style: district_style, filter: function(feature, layer) {
                return (feature.properties.DISTRICT === "1")}}).addTo(map);
            layer.bringToFront()
            /*layer = new L.GeoJSON(state.responseJSON, {style: district_style, filter: function(feature, latlng) {
                var polygon = new L.Polygon(feature.geometry.coordinates);
                console.log("Precinct" + polygon.getBounds());
                console.log(district_bounds);
                console.log(district_bounds.contains(polygon.getBounds()));
                    return (district_bounds.contains(polygon.getBounds()));}}).addTo(map);*/
            //layer = L.geoJSON(data, {style: district_style}).addTo(map);

            map.on("zoomend", function(event) {
               if(this.getZoom() < 7) {
                   layer.remove();
               }
            });

            layer.bringToBack();
        });
    }



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