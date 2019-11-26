import mysql.connector
from mysql.connector import Error
from mysql.connector import errorcode

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

def close_connection(connection, cursor):
    cursor.close()
    connection.close()


def load_data():
    connection = get_connection()
    cursor = load_state_data(connection)
    close_connection(connection, cursor)


if __name__ == '__main__':
    load_data()