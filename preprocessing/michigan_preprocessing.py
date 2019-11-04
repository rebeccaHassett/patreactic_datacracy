from shapely.geometry import shape, GeometryCollection
import json

def main():
    complete_precinct_features = []

    with open("Michigan_U.S._Congressional_Districts_v17a.geojson") as f:
        features = json.load(f)["features"]

    with open("2016_Voting_Precincts.geojson") as f:
        precinct_features = json.load(f)["features"]

    # NOTE: buffer(0) is a trick for fixing scenarios where polygons have overlapping coordinates
    collect = GeometryCollection([shape(feature["geometry"]).buffer(0) for feature in features])

    # For each precinct, get all differences between precinct and district areas and put the precinct into the
    # minimum difference district.
    for precinct_index, precinct in enumerate(precinct_features):
        precinct_polygon = shape(precinct['geometry'])
        diffs_by_dist = [None]*len(features)
        for district_index, district in enumerate(features):
            district_polygon = shape(district['geometry'])
            # Make list of precinct/district area differences
            p_d_diff = precinct_polygon.difference(district_polygon).area
            diffs_by_dist[district_index] = p_d_diff
            print("Precinct: " + str(precinct_index) + ", District: " + str(district_index))

        # Find minimum district from that list
        min_diff_area = min(diffs_by_dist)
        min_diff_dist = diffs_by_dist.index(min_diff_area)
        # Put precinct in that district
        district = features[min_diff_dist]
        entry = district['properties']['NAME']
        if entry[0] == "0":
            entry = entry[1:]
        precinct['properties']['DISTRICT'] = entry
        complete_precinct_features.append(precinct)

    print("Unmapped List Length: " + str(len(precinct_features)))
    print("Mapped List Length: " + str(len(complete_precinct_features)))

    # write new precinct features to file
    f = open("2016_Voting_Precincts.geojson", "r")
    data = json.load(f)
    data["features"] = precinct_features
    f.close()
    f = open("2016_Voting_Precincts_NEW.geojson", "w")
    f.write(json.dumps(data))
    f.close()

if __name__ == '__main__':
    main()