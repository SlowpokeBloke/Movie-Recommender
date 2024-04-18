import csv
import pandas as pd
import json

# Read the original CSV file into a DataFrame
df = pd.read_csv('genres.csv')

# Parse the JSON strings in the 'genres' column and extract 'id' and 'name'
df['genres'] = df['genres'].apply(lambda x: json.loads(x.replace("'", "\"")))

# Create lists to hold the separated data
new_rows = []

# Iterate over each row and split the genres into separate rows
for index, row in df.iterrows():
    id_ = row['id']
    genres = row['genres']
    for genre in genres:
        new_row = {'id': id_, 'genre_ids': genre['id'], 'genre_names': genre['name']}
        new_rows.append(new_row)

# Create a new DataFrame from the separated data
new_df = pd.DataFrame(new_rows)

# Save the new DataFrame to a new CSV file without quotes around id and genre_ids
new_df.to_csv('genres_output.csv', index=False, quoting=csv.QUOTE_NONE, escapechar=' ')
