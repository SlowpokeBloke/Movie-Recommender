import pandas as pd
import ast
import numpy as np

# Read the credits CSV file
credits = pd.read_csv('credits.csv')

# Function to extract cast from the JSON string
def extract_cast(row):
    cast_list = ast.literal_eval(row['cast'])  # Convert string to list
    movie_id = int(row['id'])
    return [(int(cast['id']), movie_id) for cast in cast_list]

# Apply the function to each row
expanded_cast = credits.apply(extract_cast, axis=1).explode()

# Convert the result to a DataFrame and rename columns
expanded_cast_df = pd.DataFrame(expanded_cast.tolist(), columns=['actor_id', 'movie_id'])

# Replace non-finite values in 'actor_id' column with a default value (0 in this case)
expanded_cast_df['actor_id'] = expanded_cast_df['actor_id'].fillna(0)

# Convert 'actor_id' column to integer
expanded_cast_df['actor_id'] = expanded_cast_df['actor_id'].astype(int)

# Convert 'movie_id' column to integer, handling non-finite values
expanded_cast_df['movie_id'] = pd.to_numeric(expanded_cast_df['movie_id'], errors='coerce')
expanded_cast_df['movie_id'] = expanded_cast_df['movie_id'].fillna(0).astype(int)

# Write the result to a new CSV file containing actor IDs and corresponding movie IDs
expanded_cast_df.to_csv('actor_movie_ids.csv', index=False)
