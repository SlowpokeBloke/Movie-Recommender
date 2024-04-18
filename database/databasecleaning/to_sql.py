import csv

def csv_to_sql_insert(csv_filename, table_name, sql_filename):
    with open(csv_filename, 'r') as csv_file:
        csv_reader = csv.DictReader(csv_file)
        columns = csv_reader.fieldnames

        with open(sql_filename, 'w') as sql_file:
            for row in csv_reader:
                values = [f"'{row[col]}'" if isinstance(row[col], str) else str(row[col]) for col in columns]
                sql_insert = f"INSERT IGNORE INTO {table_name} ({', '.join(columns)}) VALUES ({', '.join(values)});\n"
                sql_file.write(sql_insert)

# Replace these values with your actual CSV file, desired table name, and SQL filename
csv_filename = 'actor_movie2.csv'
table_name = 'actor_movie'
sql_filename = 'insert_queries.sql'

csv_to_sql_insert(csv_filename, table_name, sql_filename)
