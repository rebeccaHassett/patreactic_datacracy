import mysql.connector
from mysql.connector import Error
from mysql.connector import errorcode
import json
import incumbents
import math

from manual_neighbors import manual_neighbors

white = 0
black = 1
asian = 2
hispanic = 3
native_american = 4

presidential = 0
congressional = 1

Y2016 = 0
Y2018 = 1

democrat = 0
republican = 1
independent = 2


def get_connection():
    try:
        connection = mysql.connector.connect(host="mysql4.cs.stonybrook.edu",
                                             database="patreactic_datacracy",
                                             user="patreactic_datacracy",
                                             password="changeit")
        return connection
    except mysql.connector.Error as error:
        print("Failed to connect to patreactic datacracy database".format(error))

def get_state_laws(file_name):
    law_file = open("laws/" + file_name, "r+")
    return law_file.read()

def get_state_borders(file_name):
    borders_file = open("../original_data/state_geographical_boundaries_data/" + file_name, "r+")
    return borders_file.read()

def load_state_data(connection):

    state_insert_query = """INSERT INTO State (name, laws, boundaries) 
                           VALUES 
                           (%s, %s, %s) """

    rhode_island_laws = get_state_laws("rhode_island_laws.txt")
    michigan_laws = get_state_laws("michigan_laws.txt")
    north_carolina_laws = get_state_laws("north_carolina_laws.txt")

    rhode_island_borders = get_state_borders("Rhode_Island_State_Borders.json")
    michigan_borders = get_state_borders("Michigan_State_Borders.json")
    north_carolina_borders = get_state_borders("North_Carolina_State_Borders.json")

    rhode_island_tuple = ("RhodeIsland", rhode_island_laws, rhode_island_borders)
    michigan_tuple = ("Michigan", michigan_laws, michigan_borders)
    north_carolina_tuple = ("NorthCarolina", north_carolina_laws, north_carolina_borders)


    cursor = connection.cursor()
    cursor.execute(state_insert_query, rhode_island_tuple)
    cursor.execute(state_insert_query, michigan_tuple)
    cursor.execute(state_insert_query, north_carolina_tuple)

    connection.commit()
    return cursor


def read_geojson_file(file_name):
    with open('mapped_data/' + file_name) as f:
        features = json.load(f)["features"]
        return features

def chunks(lst, n):
    """Yield successive n-sized chunks from lst."""
    for i in range(0, len(lst), n):
        yield lst[i:i + n]

def load_precinct_values(connection, cursor, features, query, stateName):
    print(f"load_precinct_values for state {stateName}")
    rows = []
    for feature in features:
        precinctId = feature["properties"]["PRENAME"]
        geojson = json.dumps(feature)
        districtId = feature["properties"]["CD"]
        county = feature["properties"]["COUNTY"]
        rows.append((precinctId, county, geojson, districtId, stateName))
    for group in chunks(rows, 100):
        cursor.executemany(query, group)




def load_precinct_data(connection):
    cursor = connection.cursor()

    precinct_insert_query = """INSERT INTO Precinct (precinctId, county, geojson, districtId, stateName) 
                           VALUES 
                           (%s, %s, %s, %s, %s) """

    rhode_island_features = read_geojson_file('RI_Precincts_MAPPED_FINAL.geojson')
    michigan_features = read_geojson_file('MI_Precincts_MAPPED_FINAL.geojson')
    north_carolina_features = read_geojson_file('NC_VDT_FINAL_HOPEFULLY.json')

    load_precinct_values(connection, cursor, rhode_island_features, precinct_insert_query, "RhodeIsland")
    load_precinct_values(connection, cursor, michigan_features, precinct_insert_query, "Michigan")
    load_precinct_values(connection, cursor, north_carolina_features, precinct_insert_query, "NorthCarolina")

    load_precinct_population_data(connection, cursor, rhode_island_features, "RhodeIsland")
    load_precinct_population_data(connection, cursor, michigan_features, "Michigan")
    load_precinct_population_data(connection, cursor, north_carolina_features, "NorthCarolina")

    id = load_election_data(connection, rhode_island_features, 0, "RhodeIsland")
    id = load_election_data(connection, michigan_features, id, "Michigan")
    load_election_data(connection, north_carolina_features, id, "NorthCarolina")

    connection.commit()

    return cursor

def load_incumbent_data(connection):

    incumbent_insert_query = """INSERT INTO Incumbent (id, districtId, incumbent, party, stateName) 
                           VALUES 
                           (%s, %s, %s, %s, %s) """

    rhode_island_incumbent_data = incumbents.rhode_island_incumbents
    michigan_incumbent_data = incumbents.michigan_incumbents
    north_carolina_incumbent_data = incumbents.north_carolina_incumbents

    cursor = connection.cursor()

    id = 0
    for incumbent in rhode_island_incumbent_data:
        rhode_island_tuple = (id, incumbent[0], incumbent[1], incumbent[2], "RhodeIsland")
        cursor.execute(incumbent_insert_query, rhode_island_tuple)
        id = id + 1
    for incumbent in michigan_incumbent_data:
        michigan_tuple = (id, incumbent[0], incumbent[1], incumbent[2], "Michigan")
        cursor.execute(incumbent_insert_query, michigan_tuple)
        id = id + 1
    for incumbent in north_carolina_incumbent_data:
        north_carolina_tuple = (id, incumbent[0], incumbent[1], incumbent[2], "NorthCarolina")
        cursor.execute(incumbent_insert_query, north_carolina_tuple)
        id = id + 1

    connection.commit()
    return cursor

def load_precinct_population_data(connection, cursor, features, stateName):
    print(f"load_precinct_population_data for {stateName}")
    population_insert_query = """INSERT INTO PrecinctPopulations (precinctId, populationMap, populationMap_KEY)
                           VALUES 
                           (%s, %s, %s) """

    id = ""
    rows = []
    for feature in features:
        id = feature["properties"]["PRENAME"]
        white_population = feature["properties"]["WVAP"]
        black_population = feature["properties"]["BVAP"]
        asian_population = feature["properties"]["ASIANVAP"]
        hispanic_population = feature["properties"]["HVAP"]
        native_american_population = feature["properties"]["AMINVAP"]
        rows.append((id, white_population, white))
        rows.append((id, black_population, black))
        rows.append((id, asian_population, asian))
        rows.append((id, hispanic_population, hispanic))
        rows.append((id, native_american_population, native_american))
    cursor.executemany(population_insert_query, rows)
    connection.commit()

def load_election_data(connection, features, election_data_id, stateName):
    print(f"load_election_data for {stateName}")
    election_data_insert_query = """INSERT INTO ElectionData (id, electionType, year, precinctId) 
                           VALUES 
                           (%s, %s, %s, %s) """
    votes_insert_query = """INSERT INTO VotesByParty (electionDataId, votesByParty, votesByParty_KEY) 
                           VALUES 
                           (%s, %s, %s) """

    cursor = connection.cursor()

    precinctId = ""
    election_data_rows = []
    votes_rows = []
    for feature in features:
        precinctId = feature["properties"]["PRENAME"]
        election_data_rows.append((election_data_id, presidential, Y2016, precinctId))

        votes_rows.append((election_data_id, feature["properties"]["PRES16D"], democrat))
        votes_rows.append((election_data_id, feature["properties"]["PRES16R"], republican))

        election_data_id = election_data_id + 1
        election_data_rows.append((election_data_id, congressional, Y2016, precinctId))
        demFound = False
        repFound = False
        indFound = False
        for candidate in feature["properties"]["HOUSE_ELECTION_16"]:
            if candidate.endswith('D') and demFound is False:
                votes_rows.append((election_data_id, feature["properties"]["HOUSE_ELECTION_16"][candidate], democrat))
                demFound = True
            elif candidate.endswith('R') and repFound is False:
                votes_rows.append((election_data_id, feature["properties"]["HOUSE_ELECTION_16"][candidate], republican))
                repFound = True
            elif candidate.endswith('I') and indFound is False:
                votes_rows.append((election_data_id, feature["properties"]["HOUSE_ELECTION_16"][candidate], independent))
                indFound = True
        election_data_id = election_data_id + 1
        election_data_rows.append((election_data_id, congressional, Y2018, precinctId))
        demFound = False
        repFound = False
        indFound = False
        for candidate in feature["properties"]["HOUSE_ELECTION_18"]:
            if candidate.endswith('D') and demFound is False:
                votes_rows.append((election_data_id, feature["properties"]["HOUSE_ELECTION_18"][candidate], democrat))
                demFound = True
            elif candidate.endswith('R') and repFound is False:
                votes_rows.append((election_data_id, feature["properties"]["HOUSE_ELECTION_18"][candidate], republican))
                repFound = True
            elif candidate.endswith('I') and indFound is False:
                votes_rows.append((election_data_id, feature["properties"]["HOUSE_ELECTION_18"][candidate], independent))
                indFound = True
        election_data_id = election_data_id + 1
    cursor.executemany(election_data_insert_query, election_data_rows)
    cursor.executemany(votes_insert_query,  votes_rows)

    connection.commit()
    return election_data_id


def load_district_borders(connection):
    query = "INSERT INTO OriginalDistrictBorders (stateName, districtId, borders) VALUES (%s, %s, %s);"

    states = [{
        "name": "RhodeIsland",
        "filename": "../original_data/district_geographical_data/Rhode_Island/Rhode_Island_U.S_Congressional_Districts_Geography.json",
        "district_id_key": "CD115FP"
    },{
        "name": "Michigan",
        "filename": "simplified/Michigan_Districts.json",
        "district_id_key": "NAME"
    },{
        "name": "NorthCarolina",
        "filename": "../original_data/district_geographical_data/North_Carolina/North_Carolina_U.S_Congressional_Districts_Geography.json",
        "district_id_key": "CD116FP"
    }]

    for state in states:
        with open(state["filename"], "r+") as f:
            state["features"] = json.load(f)["features"]
    for state in states:
        cursor = connection.cursor()
        for district in state["features"]:
            cursor.execute(query, (state["name"], district["properties"][state["district_id_key"]], json.dumps(district)))
    connection.commit()

"""
Reads neighbor json file, and returns a list of tuples (precinctId, neighbors string)

Load one precinct Id neighbor pair at a time instead of uploading the neighbor pairs directly as a list of strings
Notice PrecinctId is not a primary key in the PrecinctNeighbors table

@param String: precinct neighbors file name
@return: A list of tuples (precinctId, neighbors string)
"""
def read_neighbors_file(state):
    neighbor_list = []
    filename = f"precinct_neighbors_{state}.json"
    manual = manual_neighbors[state]

    with open(filename) as json_file:
        data = json.load(json_file)
        for precinctId, neighbors in manual.items():
            if data.get(precinctId, None) is None:
                data[precinctId] = []
            data[precinctId] = list(set(data[precinctId] + manual[precinctId]))
            for n in neighbors:
                if data.get(n, None) is None:
                    data[n] = []
                data[n] = list(set(data[n] + [precinctId]))
        for precinctId in data:
            for neighbor in data[precinctId]:
                neighbor_list.append((precinctId, neighbor))
    return neighbor_list

def load_precinct_neighbors(connection):

    neighbors_insert_query = """INSERT INTO PrecinctNeighbors (precinctId, neighborIDs) 
                           VALUES 
                           (%s, %s) """

    rhode_island_neighbors_data = read_neighbors_file("RI")
    michigan_neighbors_data = read_neighbors_file("MI")
    #north_carolina_neighbors_data = read_neighbors_file("precinct_neighbors_NC.json")

    state_neighbor_data = [rhode_island_neighbors_data, michigan_neighbors_data]

    cursor = connection.cursor()

    for state in state_neighbor_data:
        cursor.executemany(neighbors_insert_query, state)

    connection.commit()


def load_data():
    connection = get_connection()
    try:
    #     print("loading state data...")
    #     load_state_data(connection)
        print("loading precinct data...")
        load_precinct_data(connection)
    #     print("loading incumbent data...")
    #     load_incumbent_data(connection)
        print("loading precinct neighbor data...")
        load_precinct_neighbors(connection)
        #print("loading district data...")
        #load_district_borders(connection)
    finally:
        connection.close()


if __name__ == '__main__':
    load_data()