import csv
import pandas as pd
import json

# Read the original CSV file into a DataFrame
df = pd.read_csv('genres.csv')

# Parse the JSON strings in the 'genres' column and extract 'id' and 'name'
df['genres'] = df['genres'].apply(lambda x: json.loads(x.replace("'", "\"")))

# Create sets to hold the unique genre IDs and names
unique_ids = set()

# Create lists to hold the separated data
new_rows = []

# Iterate over each row and split the genres into separate rows
for index, row in df.iterrows():
    genres = row['genres']
    for genre in genres:
        id_ = genre['id']
        if id_ not in unique_ids:
            unique_ids.add(id_)
            new_row = {'genre_ids': id_, 'genre_names': genre['name']}
            new_rows.append(new_row)

# Create a new DataFrame from the separated data
new_df = pd.DataFrame(new_rows)

# Save the new DataFrame to a new CSV file
new_df.to_csv('genres_output_2.csv', index=False, quoting=csv.QUOTE_NONE, escapechar=' ', 
              quotechar='"', columns=['genre_ids', 'genre_names'], 
              header=['genre_ids', 'genre_names'], 
              mode='w', 
              chunksize=None, date_format=None, 
              decimal='.', float_format=None, 
              encoding='utf-8', index_label=None)
