import psycopg2;

connection = psycopg2.connect(user="postgres", password="Tomcruise2022",
                              host="iso-db.ctyl0757wfse.us-east-1.rds.amazonaws.com", port="5432",
                              database="ISO_NE_DB")

cursor = connection.cursor()

postgres_insert_query = 'SELECT "SCENARIO_ID", "LMP" FROM "Node_Data" LIMIT 100'

cursor.execute(postgres_insert_query)
connection.commit()
print(cursor.fetchmany(5))