from shapely.geometry import shape, GeometryCollection
import json
import csv
import argparse

'''State Options: 1 = Rhode Island, 2 = Michigan, 3 = North Carolina'''

def update_populations(block, precinct):
    if "TOTALPOP" in precinct["properties"]:
        precinct["properties"]["TOTALPOP"] = block["properties"]["TOTALPOP"] + precinct["properties"]["TOTALPOP"]
        print(precinct["properties"]["TOTALPOP"])
    else:
        precinct["properties"]["TOTALPOP"] = block["properties"]["TOTALPOP"]
    if "HISPANICPOP" in precinct["properties"]:
        precinct["properties"]["HISPANICPOP"] = block["properties"]["HISPANICPOP"] + precinct["properties"]["HISPANICPOP"]
    else:
        precinct["properties"]["HISPANICPOP"] = block["properties"]["HISPANICPOP"]
    if "WHITEPOP" in precinct["properties"]:
        precinct["properties"]["WHITEPOP"] = block["properties"]["WHITEPOP"] + precinct["properties"]["WHITEPOP"]
    else:
        precinct["properties"]["WHITEPOP"] = block["properties"]["WHITEPOP"]
    if "AFRICANAMERICANPOP" in precinct["properties"]:
        precinct["properties"]["AFRICANAMERICANPOP"] = block["properties"]["AFRICANAMERICANPOP"] + precinct["properties"]["AFRICANAMERICANPOP"]
    else:
        precinct["properties"]["AFRICANAMERICANPOP"] = block["properties"]["AFRICANAMERICANPOP"]
    if "AMERICANINDIANPOP" in precinct["properties"]:
        precinct["properties"]["AMERICANINDIANPOP"] = block["properties"]["AMERICANINDIANPOP"] + precinct["properties"]["AMERICANINDIANPOP"]
    else:
        precinct["properties"]["AMERICANINDIANPOP"] = block["properties"]["AMERICANINDIANPOP"]
    if "ASIANPOP" in precinct["properties"]:
        precinct["properties"]["ASIANPOP"] = block["properties"]["ASIANPOP"] + precinct["properties"]["ASIANPOP"]
    else:
        precinct["properties"]["ASIANPOP"] = block["properties"]["ASIANPOP"]
    if "PACIFICISLANDERPOP" in precinct["properties"]:
        precinct["properties"]["PACIFICISLANDERPOP"] = block["properties"]["PACIFICISLANDERPOP"] + precinct["properties"]["PACIFICISLANDERPOP"]
    else:
        precinct["properties"]["PACIFICISLANDERPOP"] = block["properties"]["PACIFICISLANDERPOP"]
    if "OTHERPOP" in precinct["properties"]:
        precinct["properties"]["OTHERPOP"] = block["properties"]["OTHERPOP"] + precinct["properties"]["OTHERPOP"]
    else:
        precinct["properties"]["OTHERPOP"] = block["properties"]["OTHERPOP"]



# for each census block feature, get area difference with all precinct features
#   if only one precinct features gets zero difference, update population keys with entire population values of census block
#   else break up population based on area difference proportion [use intersection]
# https://gis.stackexchange.com/questions/251812/returning-percentage-of-area-of-polygon-intersecting-another-polygon-using-shape
def update_demographic_precinct_data(precinct_features, census_block_features):
    i = 0
    for block in census_block_features:
        block_polygon = shape(block['geometry'])
        diffs_by_dist = [None]*len(precinct_features)
        intersection_calc = [None]*len(precinct_features)
        for precinct_index, precinct in enumerate(precinct_features):
            precinct_polygon = shape(precinct['geometry'])
            # Make list of precinct/district area differences
            b_p_diff = block_polygon.difference(precinct_polygon).area
            diffs_by_dist[precinct_index] = b_p_diff
        #print(*diffs_by_dist)
        print("BLOCK " + str(i))
        if 0 in diffs_by_dist:
            index_containing = diffs_by_dist.index(0)
            print("PRECINCT: " + str(index_containing))
            update_populations(block, precinct_features[index_containing])
        else:
            print("Overlapping Precincts")
        print(" ")
        i = i+1



def main():
    parser = argparse.ArgumentParser(description='Map Demographic Data')
    parser.add_argument('state_number', metavar='N', type=int,
                        help='1 = Rhode Island, 2 = Michigan, 3 = North Carolina')

    args = parser.parse_args()

    if args.state_number == 1:
        original_precinct_file = "mapped_data/Voting_Precincts_Rhode_Island_NEW.geojson"
        demographic_precinct_file = "mapped_data/Voting_Precincts_Rhode_Island_DEMOGRAPHIC.geojson"
        with open(original_precinct_file) as f:
            precinct_features = json.load(f)["features"]
        with open("mapped_data/census_blocks_geographical_ri.json") as f:
            census_block_features = json.load(f)["features"]
    elif args.state_number == 2:
        print("2")
    elif args.state_number == 3:
        print("3")
    else:
        print("State Options: 1 = Rhode Island, 2 = Michigan, 3 = North Carolina")
        exit()

    update_demographic_precinct_data(precinct_features, census_block_features)




if __name__ == '__main__':
    main()