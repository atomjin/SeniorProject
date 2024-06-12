extends Node

# Path to the CSV file
const FILE_PATH := "res://donation_receive.csv"

func _ready():
	# Attempt to open the file
	var file = FileAccess.open(FILE_PATH, FileAccess.READ)
	if file:
		while !file.eof_reached():  # Loop until end of file is reached
			# Read a line of CSV formatted data
			var csv_line = file.get_csv_line(",")
			if csv_line.size() > 1:  # Check if there are at least two elements in the array
				var donor = csv_line[0]
				var amount = csv_line[1]  # Get the second element (index 1) which contains the amount
				print(donor)
				print(amount)
		file.close()
	else:
		print("Failed to open file:", FILE_PATH)
