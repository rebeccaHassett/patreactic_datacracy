import json
import argparse

'''State Options: 1 = Rhode Island, 2 = Michigan, 3 = North Carolina'''

def main():
    parser = argparse.ArgumentParser(description='Clean Precinct Geographical Raw Data')
    parser.add_argument('state_number', metavar='N', type=int,
                        help='1 = Rhode Island, 2 = Michigan, 3 = North Carolina')

    args = parser.parse_args()

    features = {}

    # Choose state to clean raw data
    if(args.state_number == 1):
        print("Rhode Island")
        with open("original_data/RI_Precincts.json") as f:
            features = json.load(f)["features"]
        for feature in features:
            feature["properties"].pop("Shape__Are")
            feature["properties"].pop("Shape__Len")
            feature["properties"].pop("REGVOT16")
            feature["properties"].pop("REGVOT18")
            feature["properties"].pop("TOTVOT18")
            feature["properties"].pop("GOV18D")
            feature["properties"].pop("GOV18R")
            feature["properties"].pop("SEN18D")
            feature["properties"].pop("SEN18R")
            feature["properties"].pop("NH_2MORE")
            feature["properties"].pop("2MOREVAP")
            feature["properties"].pop("SENDIST")
            feature["properties"].pop("SENDIST")





    elif(args.state_number == 2):
        print("Michigan")
        with open("original_data/2016_Voting_Precincts.geojson") as f:
            features = json.load(f)["features"]
        curr_incremental_id = "OBJECTID"
        area = "ShapeSTArea"
        length = "ShapeSTLength"
        curr_precinct_id = "Id"
        convert_precinct_id_to_int = True
    elif(args.state_number == 3):
        print("North Carolina")
        with open("original_data/nc_precincts.json") as f:
            features = json.load(f)["features"]
        curr_incremental_id = "id"
        curr_precinct_id = "prec_id"
    else:
        print("Wrong Input")
        exit()



    if(args.state_number == 1):
        # write new precinct features to file
        f = open("original_data/Voting_Precincts_Rhode_Island.geojson", "r")
        data = json.load(f)
        data["features"] = features
        f.close()
        f = open("clean_data/Voting_Precincts_Rhode_Island_CLEAN.geojson", "w")
        f.write(json.dumps(data))
        f.close()
    elif(args.state_number == 2):
        # write new precinct features to file
        f = open("original_data/2016_Voting_Precincts.geojson", "r")
        data = json.load(f)
        data["features"] = features
        f.close()
        f = open("clean_data/2016_Voting_Precincts_CLEAN.geojson", "w")
        f.write(json.dumps(data))
        f.close()





if __name__ == '__main__':
    main()