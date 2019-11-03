from shapely.geometry import shape, GeometryCollection
import json

def main():
    complete_precinct_features = []
    with open("Rhode_Island_U.S_Congressional_Districts_Geography.json") as f:
        features = json.load(f)["features"]

    with open("Voting_Precincts_Rhode_Island.geojson") as f:
        precinct_features = json.load(f)["features"]

    # NOTE: buffer(0) is a trick for fixing scenarios where polygons have overlapping coordinates
    collect = GeometryCollection([shape(feature["geometry"]).buffer(0) for feature in features])

    for district in features:
        print(district['properties'])
        district_polygon = shape(district['geometry'])
        for precinct in precinct_features:
            precinct_polygon = shape(precinct['geometry'])
            if district_polygon.contains(precinct_polygon.buffer(-1e-03)) or precinct_polygon.difference(district_polygon).area < 1e-6:
                entry = district['properties']['NAMELSAD'].replace('Congressional District ', '')
                precinct['properties']['DISTRICT'] = entry
                complete_precinct_features.append(precinct)

    print("Unmapped List Length: " + str(len(precinct_features)))
    print("Mapped List Length: " + str(len(complete_precinct_features)))

    for i in range(1, len(precinct_features)):
        val = False
        for precinct in complete_precinct_features:
            if int(precinct['properties']['OBJECTID']) == i:
                val = True
        if val == False:
            print("Missing: " + str(i))

    f = open("Voting_Precincts_Rhode_Island.geojson", "r")
    data = json.load(f)
    data["features"] = complete_precinct_features
    f.close()
    f = open("Voting_Precincts_Rhode_Island_New.geojson", "w")
    f.write(json.dumps(data))
    f.close()

if __name__ == '__main__':
    main()