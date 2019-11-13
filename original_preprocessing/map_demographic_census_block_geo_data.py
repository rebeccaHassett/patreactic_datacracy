from shapely.geometry import shape, GeometryCollection
import json
import csv
import argparse

'''State Options: 1 = Rhode Island, 2 = Michigan, 3 = North Carolina'''

''' for each entry in demographic census block data, if the geoid matches the census block geographical
data geoid then add the demographic data as keys to the geographic data geojson file'''
def merge_demographic_geographic_data(geo, demographic):

    for entry in demographic:
        # get demographic data geoid after US string
        demo_geoid = entry[0].split("US", 1)[1]
        for block in geo:
            # Update geographical data with demographic data since there is a match
            if demo_geoid == block["properties"]["GEOID10"]:
                print("MATCHED: " + demo_geoid)
                block["properties"]["TOTALPOP"] = int(entry[3])
                block["properties"]["HISPANICPOP"] = int(entry[4])
                block["properties"]["WHITEPOP"] = int(entry[5])
                block["properties"]["AFRICANAMERICANPOP"] = int(entry[6])
                block["properties"]["AMERICANINDIANPOP"] = int(entry[7])
                block["properties"]["ASIANPOP"] = int(entry[8])
                block["properties"]["PACIFICISLANDERPOP"] = int(entry[9])
                block["properties"]["OTHERPOP"] = int(entry[10])
                break

    return geo



def main():
    parser = argparse.ArgumentParser(description='Map Demographic Data')
    parser.add_argument('state_number', metavar='N', type=int,
                        help='1 = Rhode Island, 2 = Michigan, 3 = North Carolina')

    args = parser.parse_args()

    original_census_geo_file = None
    new_census_geo_file = None

    if args.state_number == 1:
        original_census_geo_file = 'original_data/census_blocks_geographical_ri.json'
        new_census_geo_file = 'mapped_data/census_blocks_geographical_ri.json'
        with open('../original_data/demographic_census_data/Rhode_Island/DEC_10_SF1_P11_with_ann.csv', newline='') as csvfile:
            data = list(csv.reader(csvfile))
            data.pop(0)
            data.pop(0)
        with open("original_data/census_blocks_geographical_ri.json") as f:
            census_block_features = json.load(f)["features"]
    elif args.state_number == 2:
        print("Michigan")
    elif args.state_number == 3:
        print("North Carolina")
    else:
        print("State Options: 1 = Rhode Island, 2 = Michigan, 3 = North Carolina")

    geodata = merge_demographic_geographic_data(census_block_features, data)

    # update geographic data with demographic data
    f = open(original_census_geo_file, "r")
    data = json.load(f)
    data["features"] = geodata
    f.close()
    f = open(new_census_geo_file, "w")
    f.write(json.dumps(data))
    f.close()






if __name__ == '__main__':
    main()