import json
import argparse
import pandas as pd
import regex as re

'''State Options: 1 = Rhode Island, 2 = Michigan, 3 = North Carolina'''



def fix_wards_precincts(precinct):
    if precinct.find(" Ward ") != -1:
        first_part = precinct.split(" Ward ")[0]
        precinct_id = re.search(r'\d+', first_part).group()
        ward_id = precinct.split(" Ward ")[1]
        first_part_no_digit = first_part.split(precinct_id)[0]
        final_precinct = first_part_no_digit + "Ward " + ward_id + " Precinct " + precinct_id
        return final_precinct
    else:
        return precinct

def print_unmapped_features(features, year):
    for feature in features:
        if feature["properties"][year] == {}:
            f = open("unmapped.txt", "a")
            f.write("UNMAPPED PRECINCT: " + feature["properties"]["PRENAME"] + "\n")
            f.close()


# for each precinct
#   query election data by precinct name and update
#       when update year + _candidate + _party = key and total votes = value
def update_precinct_election_data(year, election_list, precinct_features, split_precinct_identifier):
    for precinct_index, precinct in enumerate(precinct_features):
        if precinct_index % 100 == 0:
            print("Precinct: " + str(precinct_index))
        if split_precinct_identifier:
            parent_jurisdiction = precinct["properties"]["PRENAME"].split(" ")[0]
            same_parent_jurisdiction = election_list[election_list.parent_jurisdiction == parent_jurisdiction]
            jurisdiction = precinct["properties"]["PRENAME"].split(" ")[1].lstrip("0")
            election_data = same_parent_jurisdiction[same_parent_jurisdiction.jurisdiction == jurisdiction]
        else:
            election_data = election_list[election_list.precinct == precinct["properties"]["PRENAME"].upper().replace('|', '')]
        election = {}
        for index, row in election_data.iterrows():
            candidate = row["candidate"]
            party = row["party"]
            election[str(candidate) + "_" + str(party)] = row["votes"]

        # Election Data Added As Dictionary Inside Properties Dictionary
        precinct["properties"][year] = election

    print_unmapped_features(precinct_features, year)

    return precinct_features



def main():
    parser = argparse.ArgumentParser(description='Map Demographic Data')
    parser.add_argument('state_number', metavar='N', type=int,
                        help='1 = Rhode Island, 2 = Michigan, 3 = North Carolina')

    args = parser.parse_args()

    original_precinct_file = None
    election_16_file = None
    election_18_file = None
    precinct_features = None
    split = None

    if args.state_number == 1:
        original_precinct_file = "clean_data/RI_precincts_CLEAN.json"
        election_16_file = "../original_data/precinct_election_data/Rhode_Island/2016.csv"
        election_18_file = "../original_data/precinct_election_data/Rhode_Island/2018.csv"
        updated_precinct_file = "mapped_data/RI_Precincts_MAPPED.geojson"

    elif args.state_number == 2:
        original_precinct_file = "clean_data/MI_precincts_CLEAN.json"
        election_16_file = "../original_data/precinct_election_data/Michigan/2016.csv"
        election_18_file = "../original_data/precinct_election_data/Michigan/2018.csv"
        updated_precinct_file = "mapped_data/MI_Precincts_MAPPED.geojson"
    elif args.state_number == 3:
        original_precinct_file = "clean_data/NC_VTD_CLEAN.json"
        election_16_file = "../original_data/precinct_election_data/North_Carolina/2016.csv"
        election_18_file = "../original_data/precinct_election_data/North_Carolina/2018.csv"
        updated_precinct_file = "mapped_data/NC_VDT_MAPPED.geojson"
    else:
        print("State Options: 1 = Rhode Island, 2 = Michigan, 3 = North Carolina")
        exit()

    with open(original_precinct_file) as f:
        precinct_features = json.load(f)["features"]
    election_16 = pd.read_csv(election_16_file, delimiter=',')
    house_16 = election_16[election_16.office == 'U.S. House']
    election_18 = pd.read_csv(election_18_file, delimiter=',')
    house_18 = election_18[election_18.office == 'U.S. House']

    #Column Joining     [gave wrong delimiter so redo with , after getting data fresh again
    # election_16['precinct'] = election_16['precinct'].map(fix_wards_precincts)
    # election_16.to_csv("2016.csv", sep=',')
    # exit()

    if args.state_number == 3:
        house_16['parent_jurisdiction'] = house_16['parent_jurisdiction'].str.upper()
        house_18['parent_jurisdiction'] = house_18['parent_jurisdiction'].str.upper()
        split = True
    else:
        house_16['precinct'] = house_16['precinct'].str.upper()
        house_18['precinct'] = house_18['precinct'].str.upper()
        split = False


    updated_features_16 = update_precinct_election_data("HOUSE_ELECTION_16", house_16, precinct_features, split)
    updated_features_both = update_precinct_election_data("HOUSE_ELECTION_18", house_18, updated_features_16, split)

    # write new precinct features to file
    f = open(original_precinct_file, "r")
    data = json.load(f)
    data["features"] = updated_features_both
    f.close()
    f = open(updated_precinct_file, "w")
    f.write(json.dumps(data))
    f.close()


if __name__ == '__main__':
    main()