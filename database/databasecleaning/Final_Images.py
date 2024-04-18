import pandas as pd
import json

# Read the original CSV file into a DataFrame
df = pd.read_csv('images.csv', names=['belongs_to_collection', 'id', 'original_poster_path'])

# Define a function to parse the JSON strings in the 'belongs_to_collection' column and extract 'id', 'name', 'poster_path', and 'backdrop_path'
def parse_collection(collection):
    if pd.isna(collection):
        return None, None, None, None
    try:
        collection_data = json.loads(collection.replace("'", "\""))
        id_ = collection_data.get('id')
        name = collection_data.get('name')
        poster_path = collection_data.get('poster_path')
        backdrop_path = collection_data.get('backdrop_path')
        return id_, name, poster_path, backdrop_path
    except (json.JSONDecodeError, AttributeError):
        return None, None, None, None

# Apply the parsing function to the 'belongs_to_collection' column
df['collection_id'], df['collection_name'], df['poster_path'], df['backdrop_path'] = zip(*df['belongs_to_collection'].map(parse_collection))

# Save the updated DataFrame to a new CSV file
df.to_csv('images_output.csv', index=False)

# Replace the values in the 'original_poster_path' column where 'poster_path' is not null
df.loc[df['poster_path'].notnull(), 'original_poster_path'] = df['poster_path']

# Save the DataFrame with the updated 'original_poster_path' column to the same CSV file
df.to_csv('images_output.csv', index=False)
