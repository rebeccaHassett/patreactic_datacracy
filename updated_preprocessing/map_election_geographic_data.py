import json
import argparse
import pandas as pd

'''State Options: 1 = Rhode Island, 2 = Michigan, 3 = North Carolina'''


# for each precinct
#   query election data by precinct name and update
#       when update candidate + _party = key and total votes = value
def update_precinct_election_data(year, election_list, precinct_features):
    for precinct in precinct_features:
        #print(election_list.precinct)
        #print(precinct["properties"]["PRENAME"])
        election_data = election_list[election_list.precinct == precinct["properties"]["PRENAME"]]
        print(election_data)



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
        original_precinct_file = "../original_data/precinct_geographical data/Rhode_Island/RI_precincts.json"
        election_16_file = "../original_data/precinct_election_data/Rhode_Island/2016.csv"
        election_18_file = "../original_data/precinct_election_data/Rhode_Island/2018.csv"

    elif args.state_number == 2:
        print("2")
    elif args.state_number == 3:
        print("3")
    else:
        print("State Options: 1 = Rhode Island, 2 = Michigan, 3 = North Carolina")
        exit()

    with open(original_precinct_file) as f:
        precinct_features = json.load(f)["features"]
    election_16 = pd.read_csv(election_16_file, delimiter=',')
    house_16 = election_16[election_16.office == 'U.S. House']
    election_18 = pd.read_csv(election_18_file, delimiter=',')
    house_18 = election_18[election_18.office == 'U.S. House']

    update_precinct_election_data(2016, house_16, precinct_features)
    update_precinct_election_data(2018, house_18, precinct_features)




if __name__ == '__main__':
    main()