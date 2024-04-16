import csv

def remove_quotes_and_commas(input_file, output_file):
    with open(input_file, 'r', newline='', encoding='utf-8') as infile:
        with open(output_file, 'w', newline='', encoding='utf-8') as outfile:
            reader = csv.reader(infile)
            writer = csv.writer(outfile)
            for row in reader:
                modified_row = []
                for index, field in enumerate(row):
                    # Remove quotes and commas from the "overview" column (assuming it's the fourth column)
                    if index == 3:
                        field = field.strip('"').replace(',', '')
                    modified_row.append(field)
                writer.writerow(modified_row)

# Example usage:
input_file = 'movie_test.csv'
output_file = 'output.csv'
remove_quotes_and_commas(input_file, output_file)
print(f'Quotes and commas removed from the "overview" column in {input_file} and saved to {output_file}.')
