#!/bin/bash

# Input string of numbers
input_string=$1

# Initialize an empty output string
output_string=""

# Loop through each number in the input string
for number in $input_string
do
    # Round the number to the nearest integer
    rounded_number=$(printf "%.0f" "$number")

    # Append the rounded number to the output string
    output_string="$output_string $rounded_number"
done

# Output the result, removing the leading space
echo $output_string | sed 's/^ //'
