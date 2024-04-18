import pandas as pd
import ast

# Read the credits CSV file
credits = pd.read_csv('credits.csv')

# Function to extract cast from the JSON string
def extract_cast(row):
    cast_list = ast.literal_eval(row['cast'])  # Convert string to list
    return [(int(cast['id']), cast['name']) for cast in cast_list]

# Apply the function to each row
expanded_cast = credits.apply(extract_cast, axis=1).explode()

# Convert the result to a DataFrame and rename columns
expanded_cast_df = pd.DataFrame(expanded_cast.tolist(), columns=['cast_id', 'cast_name'])

# Replace non-finite values in 'cast_id' column with a default value (0 in this case)
expanded_cast_df['cast_id'] = expanded_cast_df['cast_id'].fillna(0)

# Convert 'cast_id' column to integer
expanded_cast_df['cast_id'] = expanded_cast_df['cast_id'].astype(int)

# Write the result to a new CSV file containing unique cast IDs and names
unique_cast = expanded_cast_df[['cast_id', 'cast_name']].drop_duplicates()
unique_cast.to_csv('unique_cast.csv', index=False)
