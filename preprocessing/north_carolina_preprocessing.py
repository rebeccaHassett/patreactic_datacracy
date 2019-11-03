from shapely.geometry import shape, GeometryCollection
import json

def main():

    with open("North_Carolina_U.S_Congressional_Districts_Geography.json") as f:
        features = json.load(f)["features"]

    with open("nc_precincts.json") as f:
        precinct_features = json.load(f)["features"]

    # NOTE: buffer(0) is a trick for fixing scenarios where polygons have overlapping coordinates
    collect = GeometryCollection([shape(feature["geometry"]).buffer(0) for feature in features])

    for district in features:
        district_polygon = shape(district['geometry'])
        for precinct in precinct_features:
            precinct_polygon = shape(precinct['geometry'])
            if district_polygon.contains(precinct_polygon):
                entry = district['properties']['NAMELSAD'].replace('Congressional District ', '')
                precinct['properties']['DISTRICT'] = entry

    f = open("nc_precincts.json", "r")
    data = json.load(f)
    data["features"] = precinct_features
    f.close()
    f = open("nc_precincts.json", "w")
    f.write(json.dumps(data))
    f.close()

if __name__ == '__main__':
    main()