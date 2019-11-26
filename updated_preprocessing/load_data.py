import mysql.connector
from mysql.connector import Error
from mysql.connector import errorcode

def get_connection():
    try:
        connection = mysql.connector.connect(host="jdbc:mysql://mysql4.cs.stonybrook.edu:3306/patreactic_datacracy",
                                             database="patreactic_datacracy",
                                             user="patreactic_datacracy",
                                             password="changeit")
        return connection
    except mysql.connector.Error as error:
        print("Failed to connect to patreactic datacracy database".format(error))


def load_state_data(connection):
    mySql_insert_query = """INSERT INTO  (Id, Name, Price, Purchase_date) 
                           VALUES 
                           (10, 'Lenovo ThinkPad P71', 6459, '2019-08-14') """


def load_data():
    connection = get_connection()
    load_state_data(connection)






if __name__ == '__main__':
    load_data()