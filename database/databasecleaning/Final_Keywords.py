import pandas as pd
import ast

# Read the keywords CSV file
keywords = pd.read_csv('keywords.csv')

# Function to extract keywords from the JSON string
def extract_keywords(row):
    keywords_list = ast.literal_eval(row['keywords'])  # Convert string to list
    return [(int(row['id']), int(keyword['id']), keyword['name']) for keyword in keywords_list]

# Apply the function to each row
expanded_keywords = keywords.apply(extract_keywords, axis=1).explode()

# Convert the result to a DataFrame and rename columns
expanded_keywords_df = pd.DataFrame(expanded_keywords.tolist(), columns=['movie_id', 'keyword_id', 'keyword_name'])

# Replace non-finite values in 'movie_id' and 'keyword_id' columns with a default value (0 in this case)
expanded_keywords_df['movie_id'] = expanded_keywords_df['movie_id'].fillna(0)
expanded_keywords_df['keyword_id'] = expanded_keywords_df['keyword_id'].fillna(0)

# Convert 'movie_id' and 'keyword_id' columns to integer
expanded_keywords_df['movie_id'] = expanded_keywords_df['movie_id'].astype(int)
expanded_keywords_df['keyword_id'] = expanded_keywords_df['keyword_id'].astype(int)

# Write the result to a new CSV file
expanded_keywords_df.to_csv('expanded_keywords.csv', index=False)
