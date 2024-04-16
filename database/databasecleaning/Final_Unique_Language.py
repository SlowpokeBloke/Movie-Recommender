import pandas as pd

# Read the input CSV file
df = pd.read_csv('languages.csv')

# Select unique values of spoken_language_iso and spoken_language_name
unique_languages = df[['spoken_language_iso', 'spoken_language_name']].drop_duplicates()

# Write the unique languages to a new CSV file
unique_languages.to_csv('unique_languages.csv', index=False)
