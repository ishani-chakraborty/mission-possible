import csv
import json

parsed_data = {}

def parse (file):
    with open(file, 'r') as csv_file:
        read_file = csv.reader(csv_file)

        column_flag = False
        column_names = []

        for line in read_file: 

            # skip the details
            if line[0][0] != "#":

                # populate the dictionary with values
                if column_flag:
            
                    for i in range(len(line)): parsed_data.get(column_names[i]).append(line[i])

                # initialize dictionary keys with column names
                else: 
                    column_flag = True
                    column_names = line
                    parsed_data = { key : [] for key in column_names }

    return parsed_data


# write data to jsons
with open("mission-possible/parser/json_output/dummy-groups.json", "w") as outfile:
    json.dump(parse('mission-possible/parser/csv/dummy-groups.csv'), outfile)

with open("mission-possible/parser/json_output/dummy-node-data.json", "w") as outfile:
    json.dump(parse('mission-possible/parser/csv/dummy-node-data.csv'), outfile)

with open("mission-possible/parser/json_output/dummy-scenarios.json", "w") as outfile:
    json.dump(parse('mission-possible/parser/csv/dummy-scenarios.csv'), outfile)