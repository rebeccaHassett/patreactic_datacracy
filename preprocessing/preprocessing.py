from shapely.geometry import shape, GeometryCollection
import json

def main():

    with open("Michigan_U.S._Congressional_Districts_v17a.geojson") as f:
        features = json.load(f)["features"]

    with open("2016_Voting_Precincts.geojson") as f:
        precinct_features = json.load(f)["features"]

    # NOTE: buffer(0) is a trick for fixing scenarios where polygons have overlapping coordinates
    collect = GeometryCollection([shape(feature["geometry"]).buffer(0) for feature in features])

    for district in features:
        district_polygon = shape(district['geometry'])
        for precinct in precinct_features:
            precinct_polygon = shape(precinct['geometry'])
            if district_polygon.contains(precinct_polygon):
                precinct['properties']['DISTRICT'] = district['properties']['NAME']

    f = open("2016_Voting_Precincts.geojson", "r")
    data = json.load(f)
    data["features"] = precinct_features
    f.close()
    f = open("2016_Voting_Precincts.geojson", "w")
    f.write(json.dumps(data))
    f.close()

if __name__ == '__main__':
    main()