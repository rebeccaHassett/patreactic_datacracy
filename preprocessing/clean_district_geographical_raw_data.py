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
        with open("../original_data/Rhode_Island_U.S_Congressional_Districts_Geography.json") as f:
            features = json.load(f)["features"]
        for feature in features:
            print("feature")
            feature["properties"].pop("STATEFP")
            feature["properties"].pop("CD115FP")
            feature["properties"].pop("LSAD")
            feature["properties"].pop("CDSESSN")
            feature["properties"].pop("MTFCC")
            feature["properties"].pop("FUNCSTAT")
            feature["properties"].pop("Shape__Are")
            feature["properties"].pop("Shape__Len")
            feature["properties"]["ID"] = feature["properties"].pop("OBJECTID")
            feature["properties"]["DISTRICT"] = feature["properties"].pop("NAMELSAD").replace('Congressional District ', '')

    elif(args.state_number == 2):
        print("Michigan")
        with open("../original_data/Michigan_U.S._Congressional_Districts_v17a.geojson") as f:
            features = json.load(f)["features"]
        for feature in features:
            print("feature")
            feature["properties"].pop("LABEL")
            feature["properties"].pop("TYPE")
            feature["properties"].pop("SQKM")
            feature["properties"].pop("SQMILES")
            feature["properties"].pop("ACRES")
            feature["properties"].pop("VER")
            feature["properties"].pop("LAYOUT")
            feature["properties"].pop("PENINSULA")
            feature["properties"].pop("ShapeSTArea")
            feature["properties"].pop("ShapeSTLength")
            feature["properties"]["ID"] = feature["properties"].pop("OBJECTID")
            entry = feature['properties']['NAME']
            if entry[0] == "0":
                entry = entry[1:]
            feature["properties"].pop("NAME")
            feature['properties']['DISTRICT'] = entry

    elif(args.state_number == 3):
        print("North Carolina")
        with open("../original_data/North_Carolina_U.S_Congressional_Districts_Geography.json") as f:
            features = json.load(f)["features"]

        for feature_index, feature in enumerate(features):
            print("feature")
            feature["properties"].pop("STATEFP")
            feature["properties"].pop("CD116FP")
            feature["properties"].pop("LSAD")
            feature["properties"].pop("MTFCC")
            feature["properties"].pop("FUNCSTAT")
            feature["properties"].pop("ALAND")
            feature["properties"].pop("AWATER")
            feature["properties"].pop("INTPTLAT")
            feature["properties"].pop("INTPTLON")
            feature["properties"]["ID"] = feature_index + 1
            feature["properties"]["DISTRICT"] = feature["properties"].pop("NAMELSAD").replace('Congressional District ', '')

    else:
        print("Wrong Input")
        exit()

    if(args.state_number == 1):
        # write new precinct features to file
        f = open("../original_data/Rhode_Island_U.S_Congressional_Districts_Geography.json", "r")
        data = json.load(f)
        data["features"] = features
        f.close()
        f = open("clean_data/Rhode_Island_U.S_Congressional_Districts_Geography_CLEAN.json", "w")
        f.write(json.dumps(data))
        f.close()
    elif(args.state_number == 2):
        # write new precinct features to file
        f = open("../original_data/Michigan_U.S._Congressional_Districts_v17a.geojson", "r")
        data = json.load(f)
        data["features"] = features
        f.close()
        f = open("clean_data/Michigan_U.S._Congressional_Districts_v17a_CLEAN.geojson", "w")
        f.write(json.dumps(data))
        f.close()
    else:
        # write new precinct features to file
        f = open("../original_data/North_Carolina_U.S_Congressional_Districts_Geography.json", "r")
        data = json.load(f)
        data["features"] = features
        f.close()
        f = open("clean_data/North_Carolina_U.S_Congressional_Districts_Geography_CLEAN.json", "w")
        f.write(json.dumps(data))
        f.close()





if __name__ == '__main__':
    main()