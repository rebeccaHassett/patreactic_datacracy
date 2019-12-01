import mysql.connector
from mysql.connector import Error
from mysql.connector import errorcode
import json
import incumbents

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

def load_precinct_values(connection, cursor, features, query, stateName):
    for feature in features:
        precinctId = feature["properties"]["PRENAME"]
        geojson = json.dumps(feature)
        districtId = feature["properties"]["CD"]
        data_tuple = (precinctId, geojson, districtId, stateName)

        cursor.execute(query, data_tuple)




def load_precinct_data(connection):
    cursor = connection.cursor()

    precinct_insert_query = """INSERT INTO Precinct (precinctId, geojson, districtId, stateName) 
                           VALUES 
                           (%s, %s, %s, %s) """

    rhode_island_features = read_geojson_file('RI_Precincts_MAPPED.geojson')
    michigan_features = read_geojson_file('MI_Precincts_MAPPED.geojson')
    north_carolina_features = read_geojson_file('NC_VDT_MAPPED.geojson')

    load_precinct_values(connection, cursor, rhode_island_features, precinct_insert_query, "RhodeIsland")
    # load_precinct_values(connection, cursor, michigan_features, precinct_insert_query, "Michigan")
    # load_precinct_values(connection, cursor, north_carolina_features, precinct_insert_query, "NorthCarolina")

    load_precinct_population_data(connection, cursor, rhode_island_features)
    # load_precinct_population_data(connection, cursor, michigan_features)
    # load_precinct_population_data(connection, cursor, north_carolina_features)

    load_election_data(connection, rhode_island_features)
    # load_election_data(connection, michigan_features)
    # load_election_data(connection, north_carolina_features)

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

def load_precinct_population_data(connection, cursor, features):
    population_insert_query = """INSERT INTO PrecinctPopulations (precinctId, populationMap, populationMap_KEY)
                           VALUES 
                           (%s, %s, %s) """

    id = ""

    for feature in features:
        id = feature["properties"]["PRENAME"]
        white_population = feature["properties"]["WVAP"]
        black_population = feature["properties"]["BVAP"]
        asian_population = feature["properties"]["ASIANVAP"]
        hispanic_population = feature["properties"]["HVAP"]
        native_american_population = feature["properties"]["AMINVAP"]
        cursor.execute(population_insert_query, (id, white_population, white))
        cursor.execute(population_insert_query, (id, black_population, black))
        cursor.execute(population_insert_query, (id, asian_population, asian))
        cursor.execute(population_insert_query, (id, hispanic_population, hispanic))
        cursor.execute(population_insert_query, (id, native_american_population, native_american))

    connection.commit()

def load_election_data(connection, features):

    election_data_insert_query = """INSERT INTO ElectionData (id, electionType, year, precinctId) 
                           VALUES 
                           (%s, %s, %s, %s) """
    votes_insert_query = """INSERT INTO VotesByParty (electionDataId, votesByParty, votesByParty_KEY) 
                           VALUES 
                           (%s, %s, %s) """

    cursor = connection.cursor()

    id = 0
    precinctId = ""
    for feature in features:
        precinctId = feature["properties"]["PRENAME"]
        cursor.execute(election_data_insert_query, (id, presidential, Y2016, precinctId))
        cursor.execute(votes_insert_query, (id, feature["properties"]["PRES16D"], democrat))
        cursor.execute(votes_insert_query, (id, feature["properties"]["PRES16R"], republican))
        id = id + 1
        cursor.execute(election_data_insert_query, (id, congressional, Y2016, precinctId))
        demFound = False
        repFound = False
        indFound = False
        for candidate in feature["properties"]["HOUSE_ELECTION_16"]:
            if candidate.endswith('D') and demFound is False:
                cursor.execute(votes_insert_query, (id, feature["properties"]["HOUSE_ELECTION_16"][candidate], democrat))
                demFound = True
            elif candidate.endswith('R') and repFound is False:
                cursor.execute(votes_insert_query, (id, feature["properties"]["HOUSE_ELECTION_16"][candidate], republican))
                repFound = True
            elif candidate.endswith('I') and indFound is False:
                cursor.execute(votes_insert_query, (id, feature["properties"]["HOUSE_ELECTION_16"][candidate], independent))
                indFound = True
        id = id + 1
        cursor.execute(election_data_insert_query, (id, congressional, Y2018, precinctId))
        demFound = False
        repFound = False
        indFound = False
        for candidate in feature["properties"]["HOUSE_ELECTION_18"]:
            if candidate.endswith('D') and demFound is False:
                cursor.execute(votes_insert_query, (id, feature["properties"]["HOUSE_ELECTION_18"][candidate], democrat))
                demFound = True
            elif candidate.endswith('R') and repFound is False:
                cursor.execute(votes_insert_query, (id, feature["properties"]["HOUSE_ELECTION_18"][candidate], republican))
                repFound = True
            elif candidate.endswith('I') and indFound is False:
                cursor.execute(votes_insert_query, (id, feature["properties"]["HOUSE_ELECTION_18"][candidate], independent))
                indFound = True
        id = id + 1

    connection.commit()
    return cursor


def close_connection(connection, cursor):
    cursor.close()
    connection.close()


def load_data():
    connection = get_connection()
    cursor = load_state_data(connection)
    cursor = load_precinct_data(connection)
    cursor = load_incumbent_data(connection)
    close_connection(connection, cursor)


if __name__ == '__main__':
    load_data()