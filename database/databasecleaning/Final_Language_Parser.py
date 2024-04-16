import pandas as pd
import json

# Read the original CSV file into a DataFrame
df = pd.read_csv('languages.csv')

def parse_spoken_languages(row):
    try:
        spoken_languages_data = json.loads(row['spoken_languages'].replace("'", '"'))
        for lang in spoken_languages_data:
            iso = lang['iso_639_1']
            name = lang['name']
            yield row['id'], iso, name
    except (json.JSONDecodeError, AttributeError):
        yield None, None, None

# Create lists to hold the separated data
new_rows = []
for _, row in df.iterrows():
    for id_, iso, name in parse_spoken_languages(row):
        new_row = {'id': id_, 'spoken_language_iso': iso, 'spoken_language_name': name}
        new_rows.append(new_row)

# Create a new DataFrame from the separated data
new_df = pd.DataFrame(new_rows)

# Save the new DataFrame to a new CSV file
new_df.to_csv('languages_output_2.csv', index=False)
