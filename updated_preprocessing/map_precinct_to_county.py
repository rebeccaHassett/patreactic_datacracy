from shapely.geometry import shape, GeometryCollection
import json
import argparse

'''State Options: 1 = Rhode Island, 2 = Michigan, 3 = North Carolina'''

def map_precincts_to_districts(features, precinct_features):
    complete_precinct_features = []

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

        # Find minimum district from that list
        min_diff_area = min(diffs_by_dist)
        min_diff_dist = diffs_by_dist.index(min_diff_area)
        # Put precinct in that district
        district = features[min_diff_dist]
        print("PRECINCT " + precinct['properties']['PRENAME'] + "DISTRICT " + district["properties"]["COUNTY"])   #RI is COUNTY, NC is CO_NAME, MI is NAME
        precinct['properties']['COUNTY'] = district["properties"]["COUNTY"] # north carolina district id identifier
        complete_precinct_features.append(precinct)

    print("Unmapped List Length: " + str(len(precinct_features)))
    print("Mapped List Length: " + str(len(complete_precinct_features)))

    return complete_precinct_features




def main():
    parser = argparse.ArgumentParser(description='Clean Precinct Geographical Raw Data')
    parser.add_argument('state_number', metavar='N', type=int,
                        help='1 = Rhode Island, 2 = Michigan, 3 = North Carolina')

    args = parser.parse_args()
    district_features = {}
    precinct_features = {}
    original_precinct_file = None
    new_precinct_file = None

    # Choose state to clean raw data
    if(args.state_number == 1):
        print("Rhode Island")
        with open("../original_data/county_boundaries/Rhode_Island/Rhode_Island_Counties") as f:
            district_features = json.load(f)["features"]

        with open("mapped_data/RI_Precincts_MAPPED_ManualUpdates.geojson") as f:
            precinct_features = json.load(f)["features"]

        complete_precinct_features = map_precincts_to_districts(district_features, precinct_features)
        original_precinct_file = "mapped_data/RI_Precincts_MAPPED_ManualUpdates.geojson"
        new_precinct_file = "mapped_data/RI_Precincts_MAPPED_FINAL.geojson"

    elif(args.state_number == 2):
        print("Michigan")
        with open("../original_data/county_boundaries/Michigan/Michigan_Counties.json") as f:
            district_features = json.load(f)["features"]

        with open("mapped_data/MI_Precincts_MAPPED.geojson") as f:
            precinct_features = json.load(f)["features"]

        complete_precinct_features = map_precincts_to_districts(district_features, precinct_features)

        original_precinct_file = "mapped_data/MI_Precincts_MAPPED.geojson"
        new_precinct_file = "mapped_data/MI_Precincts_FINAL.geojson"

    elif(args.state_number == 3):
        print("North Carolina")
        with open("../original_data/county_boundaries/North_Carolina/NC_Counties.json") as f:
            district_features = json.load(f)["features"]

        with open("mapped_data/NC_VDT_FINAL_HOPEFULLY_HOPEFULLY.json") as f:
            precinct_features = json.load(f)["features"]

        complete_precinct_features = map_precincts_to_districts(district_features, precinct_features)

        original_precinct_file = "mapped_data/NC_VDT_FINAL_HOPEFULLY_HOPEFULLY.json"
        new_precinct_file = "mapped_data/NC_VDT_FINAL_HOPEFULLY.json"

    else:
        print("Wrong Input")
        exit()

    # write new precinct features to file
    f = open(original_precinct_file, "r")
    data = json.load(f)
    data["features"] = precinct_features
    f.close()
    f = open(new_precinct_file, "w")
    f.write(json.dumps(data))
    f.close()



if __name__ == '__main__':
    main()