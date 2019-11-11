import json
import argparse

'''State Options: 1 = Rhode Island, 2 = Michigan, 3 = North Carolina'''


def clean_incremental_id(feature, cur_incremental_id):
    feature["properties"]["ID"] = feature["properties"].pop(cur_incremental_id)

def remove_area_length(feature, area, length):
    if area is not None and length is not None:
        feature["properties"].pop(area)
        feature["properties"].pop(length)

def clean_precinct_id(feature, cur_precinct_id, convert):
    if convert is True:
        temp = feature["properties"].pop(cur_precinct_id)
        feature["properties"]["PRECINCT_ID"] = str(temp)
    else:
        feature["properties"]["PRECINCT_ID"] = feature["properties"].pop(cur_precinct_id)

def main():
    parser = argparse.ArgumentParser(description='Clean Precinct Geographical Raw Data')
    parser.add_argument('state_number', metavar='N', type=int,
                        help='1 = Rhode Island, 2 = Michigan, 3 = North Carolina')

    args = parser.parse_args()

    features = {}
    curr_incremental_id = "ID"
    curr_precinct_id = "Id"
    convert_precinct_id_to_int = False
    area = None
    length = None

    # Choose state to clean raw data
    if(args.state_number == 1):
        print("Rhode Island")
        with open("../original_data/Voting_Precincts_Rhode_Island.geojson") as f:
            features = json.load(f)["features"]
        curr_incremental_id = "OBJECTID"
        area = "Shape__Area"
        length = "Shape__Length"
        curr_precinct_id = "NAME"
    elif(args.state_number == 2):
        print("Michigan")
        with open("../original_data/2016_Voting_Precincts.geojson") as f:
            features = json.load(f)["features"]
        curr_incremental_id = "OBJECTID"
        area = "ShapeSTArea"
        length = "ShapeSTLength"
        curr_precinct_id = "Id"
        convert_precinct_id_to_int = True
    elif(args.state_number == 3):
        print("North Carolina")
        with open("../original_data/nc_precincts.json") as f:
            features = json.load(f)["features"]
        curr_incremental_id = "id"
        curr_precinct_id = "prec_id"
    else:
        print("Wrong Input")
        exit()


    for feature in features:
        print("feature")
        clean_incremental_id(feature, curr_incremental_id)
        remove_area_length(feature, area, length)
        clean_precinct_id(feature, curr_precinct_id, convert_precinct_id_to_int)

    if(args.state_number == 1):
        # write new precinct features to file
        f = open("../original_data/Voting_Precincts_Rhode_Island.geojson", "r")
        data = json.load(f)
        data["features"] = features
        f.close()
        f = open("clean_data/Voting_Precincts_Rhode_Island_CLEAN.geojson", "w")
        f.write(json.dumps(data))
        f.close()
    elif(args.state_number == 2):
        # write new precinct features to file
        f = open("../original_data/2016_Voting_Precincts.geojson", "r")
        data = json.load(f)
        data["features"] = features
        f.close()
        f = open("clean_data/2016_Voting_Precincts_CLEAN.geojson", "w")
        f.write(json.dumps(data))
        f.close()
    else:
        # write new precinct features to file
        f = open("../original_data/nc_precincts.json", "r")
        data = json.load(f)
        data["features"] = features
        f.close()
        f = open("clean_data/nc_precincts_CLEAN.json", "w")
        f.write(json.dumps(data))
        f.close()





if __name__ == '__main__':
    main()