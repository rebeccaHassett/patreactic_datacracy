import json
import argparse
import pandas as pd

'''State Options: 1 = Rhode Island, 2 = Michigan, 3 = North Carolina'''


# for each precinct
#   query election data by precinct name and update
#       when update year + _candidate + _party = key and total votes = value
def update_precinct_election_data(year, election_list, precinct_features):
    for precinct_index, precinct in enumerate(precinct_features):
        print("Precinct: " + str(precinct_index))
        election_data = election_list[election_list.precinct == precinct["properties"]["PRENAME"]]
        election = {}
        for index, row in election_data.iterrows():
            candidate = row["candidate"]
            party = row["party"]
            election[str(candidate) + "_" + str(party)] = row["votes"]

        # Election Data Added As Dictionary Inside Properties Dictionary
        precinct["properties"][year] = election

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

    if args.state_number == 1:
        original_precinct_file = "clean_data/RI_precincts_CLEAN.json"
        election_16_file = "../original_data/precinct_election_data/Rhode_Island/2016.csv"
        election_18_file = "../original_data/precinct_election_data/Rhode_Island/2018.csv"
        updated_precinct_file = "mapped_data/RI_Precincts_MAPPED.geojson"

    elif args.state_number == 2:
        original_precinct_file = "clean_data/MI_precincts_CLEAN.json"
        election_16_file = "../original_data/precinct_election_data/Michigan/20161108__mi__general__precinct.csv"
        election_18_file = "../original_data/precinct_election_data/Michigan/20181106__mi__general__precinct.csv"
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


    house_16['precinct'] = house_16['precinct'].str.upper()
    house_18['precinct'] = house_18['precinct'].str.upper()

    updated_features_16 = update_precinct_election_data("HOUSE_ELECTION_16", house_16, precinct_features)
    updated_features_both = update_precinct_election_data("HOUSE_ELECTION_18", house_18, updated_features_16)

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