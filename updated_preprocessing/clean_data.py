import json
import argparse
import math

'''State Options: 1 = Rhode Island, 2 = Michigan, 3 = North Carolina'''

def main():
    parser = argparse.ArgumentParser(description='Clean Precinct Geographical Raw Data')
    parser.add_argument('state_number', metavar='N', type=int,
                        help='1 = Rhode Island, 2 = Michigan, 3 = North Carolina')

    args = parser.parse_args()

    features = {}
    original_precinct_file = None
    clean_precinct_file = None
    remove_fields = None

    # Choose state to clean raw data
    if(args.state_number == 1):
        print("Rhode Island")
        original_precinct_file = "../original_data/precinct_geographical data/Rhode_Island/RI_Precincts.json"
        clean_precinct_file = "clean_data/RI_Precincts_CLEAN.json"

        remove_fields = ["Shape__Are", "Shape__Len", "REGVOT16", "REGVOT18", "TOTVOT18", "GOV18D", "GOV18R", "SEN18D",
                         "SEN18R", "NH_2MORE", "2MOREVAP", "SENDIST", "TOTPOP", "NH_WHITE", "NH_BLACK", "NH_AMIN",
                        "NH_ASIAN", "NH_NHPI", "NH_OTHER", "HISP"]

        with open(original_precinct_file) as f:
            features = json.load(f)["features"]

        # all precinct names should be capitalized
        for feature in features:
            prename = feature["properties"].pop("PRENAME")
            feature["properties"]["PRENAME"] = prename.upper()


    elif(args.state_number == 2):
        print("Michigan")
        original_precinct_file = "../original_data/precinct_geographical data/Michigan/MI_precincts.json"
        clean_precinct_file = "clean_data/MI_Precincts_CLEAN.json"

        with open(original_precinct_file) as f:
            features = json.load(f)["features"]

        remove_fields = ["ShapeSTLen", "ElectionYe", "county_lat", "county_lon", "TOTPOP", "NH_WHITE", "NH_BLACK",
            "NH_AMIN", "NH_ASIAN", "NH_NHPI", "NH_OTHER", "HISP", "H_WHITE", "H_BLACK", "H_AMIN",
            "H_ASIAN", "H_NHPI", "H_OTHER", "2MOREVAP", "SENDIST"]

        # reformatting precinct name information
        id = 1
        for feature in features:
            feature["properties"]["OBJECTID"] = id
            id = id + 1
            feature["properties"]["PRENAME"] = feature["properties"].pop("precinct").replace(';','')

    elif(args.state_number == 3):
        print("North Carolina")
        original_precinct_file = "mapped_data/NC_VDT_MAPPED_FINAL_NO_DUPLICATES.json" #"../original_data/precinct_geographical data/North_Carolina/NC_VTD.json"
        clean_precinct_file = "mapped_data/NC_VDT_MAPPED_FINAL_HOPEFULLY.json"

        with open(original_precinct_file) as f:
            features = json.load(f)["features"]

        # remove_fields = ["ALAND10", "AWATER10", "PL10AA_TOT", "EL08G_GV_D", "EL08G_GV_R", "EL08G_GV_L",
        #     "EL08G_GV_T", "EL08G_USS_", "EL08G_US_1", "EL08G_US_2", "EL08G_US_3", "EL08G_US_4", "EL10G_USS_",
        #     "EL08G_USS_", "EL10G_US_1", "EL10G_US_2", "EL10G_US_3", "EL10G_US_4", "EL12G_GV_D", "EL12G_GV_R",
        #     "EL12G_GV_L", "EL12G_GV_W", "EL12G_GV_1", "EL12G_GV_T", "EL14G_USS_", "EL14G_US_1",
        #     "EL14G_US_2", "EL14G_US_3", "EL14G_US_4", "Shape_Leng", "Shape_Area", "EL12G_PR_D", "EL12G_PR_R",
        #     "EL12G_PR_L", "EL12G_PR_W", "EL12G_PR_1", "EL12G_PR_T", "EL16G_USS_", "EL16G_US_1", "EL16G_US_2",
        #     "EL16G_US_3", "EL16G_GV_D", "EL16G_GV_R", "EL16G_GV_L", "EL16G_GV_T", "BPOP", "nBPOP", "TOTPOP",
        #     "NH_WHITE", "NH_BLACK", "NH_AMIN", "NH_ASIAN", "NH_NHPI", "NH_OTHER", "NH_2MORE", "HISP",
        #     "H_WHITE", "H_BLACK", "H_AMIN", "H_ASIAN", "H_NHPI", "H_OTHER", "HISP", "H_2MORE", "2MOREVAP"]
        #
        # county_info = pd.read_csv("../original_data/precinct_geographical data/North_Carolina/nc_county_fips.csv", delimiter=',')

        # Reformatting precinct name by converting county code to county name
        id = 1
        found_precinct = []
        for feature in features:
            # feature["properties"]["OBJECTID"] = id
            # id = id + 1
            # county = county_info[county_info.code == int(feature["properties"]["County"])]
            # prename = county.name.values[0] + " " + feature["properties"]["VTD_Name"]
            # feature["properties"]["PRENAME"] = prename.upper()
            if(feature["properties"]["PRENAME"] == "COLUMBUS P20"):
                feature["properties"]["PRES16D"] = 0
                feature["properties"]["PRES16R"] = 0
                feature["properties"]["HOUSE_ELECTION_16"]["CANDIDATE_D"] = 0
                feature["properties"]["HOUSE_ELECTION_16"]["CANDIDATE_R"] = 0
                feature["properties"]["HOUSE_ELECTION_18"]["David_Rouzer_R"] = 134
                feature["properties"]["HOUSE_ELECTION_18"]["Kyle_Horton_D"] = 250
            if(feature["properties"]["PRENAME"] == "COLUMBUS P22"):
                feature["properties"]["PRES16D"] = 0
                feature["properties"]["PRES16R"] = 0
                feature["properties"]["HOUSE_ELECTION_16"]["CANDIDATE_D"] = 0
                feature["properties"]["HOUSE_ELECTION_16"]["CANDIDATE_R"] = 0
                feature["properties"]["HOUSE_ELECTION_18"]["David Rouzer_R"] = 703
                feature["properties"]["HOUSE_ELECTION_18"]["Kyle Horton_D"] = 317

            for key, value in feature["properties"]["HOUSE_ELECTION_16"].items():
                if(math.isnan(value)):
                    feature["properties"]["HOUSE_ELECTION_16"][key] = 0

            for key, value in feature["properties"]["HOUSE_ELECTION_18"].items():
                if(math.isnan(value)):
                    feature["properties"]["HOUSE_ELECTION_18"][key] = 0
            # feature["properties"]["PRES16R"] = feature["properties"].pop("EL16G_PR_R")
            # feature["properties"]["PRES16D"] = feature["properties"].pop("EL16G_PR_D")
            # if("EL16G_PR_L" in feature["properties"]):
            #     feature["properties"].pop("EL16G_PR_L")
            #     feature["properties"].pop("EL16G_PR_W")
            #     feature["properties"].pop("EL16G_PR_T")
    else:
        print("Wrong Input")
        exit()

    # remove unnecessary fields
    # for feature in features:
    #     for field in remove_fields:
    #         if field in feature["properties"]:
    #             feature["properties"].pop(field)




    # write new precinct features to file
    f = open(original_precinct_file, "r")
    data = json.load(f)
    data["features"] = features
    f.close()
    f = open(clean_precinct_file, "w")
    f.write(json.dumps(data))
    f.close()


if __name__ == '__main__':
    main()