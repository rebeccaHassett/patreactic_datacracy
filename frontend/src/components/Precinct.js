import L from "leaflet";

    class Precinct {

        addPrecinctsToDistricts(url, map, district_bounds) {
            var layer;

            var district_style = {
                "color": "black"
            };

            return fetch(url).then(function (response) {
                if (response.status >= 400) {
                    throw new Error("Precinct geographic data not loaded from server successfully");
                }
                return response.json();
            }).then(function (data) {
                /*layer = new L.GeoJSON(data, {style: district_style, filter: function(feature, layer) {
                    return (feature.properties.DISTRICT === "15")}}).addTo(map);*/

                layer = L.geoJSON(data, {style: district_style}).addTo(map);

                map.on("zoomend", function (event) {
                    if (this.getZoom() < 7) {
                        layer.remove();
                    }
                });

                layer.bringToFront();
                return layer
            });
        }
    }

export default Precinct;