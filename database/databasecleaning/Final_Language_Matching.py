import pandas as pd

# Read the languages and unique_languages CSV files
languages = pd.read_csv('languages.csv')
unique_languages = pd.read_csv('unique_languages.csv')

# Merge the languages dataframe with unique_languages dataframe to get language_id
result_df = pd.merge(languages, unique_languages, left_on='spoken_language_iso', right_on='abbrev', how='left')

# Replace non-finite values in 'language_id' column with a default value (0 in this case)
result_df['language_id'] = result_df['language_id'].fillna(0).astype(int)

# Replace non-finite values in 'id' column with a default value (0 in this case)
result_df['id'] = result_df['id'].fillna(0).astype(int)

# Drop unnecessary columns and rearrange
result_df = result_df[['language_id', 'id', 'spoken_language_iso', 'spoken_language_name']]

# Write the result to a new CSV file
result_df.to_csv('result.csv', index=False)
