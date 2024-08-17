#!/bin/bash

# Input string of numbers
input_string=$1

# Initialize arrays for odd and even indexed numbers
odd_numbers=()
even_numbers=()

# Convert the input string to an array of numbers
numbers=($input_string)

# Round each number to the nearest integer and populate arrays
for i in "${!numbers[@]}"
do
    rounded_number=$(printf "%.0f" "${numbers[i]}")

    if (( i % 2 == 0 )); then
        even_numbers+=("$rounded_number")
    else
        odd_numbers+=("$rounded_number")
    fi
done

# Find the minimum values for odd and even indexed numbers
min_even=$(printf "%s\n" "${even_numbers[@]}" | sort -n | head -n 1)
min_odd=$(printf "%s\n" "${odd_numbers[@]}" | sort -n | head -n 1)

# Initialize an empty output string
output_string=""

# Compute results for each position
for i in "${!numbers[@]}"
do
    rounded_number=$(printf "%.0f" "${numbers[i]}")
    
    if (( i % 2 == 0 )); then
        # Even index
        result=$(( rounded_number - min_even ))
    else
        # Odd index
        result=$(( rounded_number - min_odd ))
    fi

    # Ensure the result is not negative
    if (( result < 0 )); then
        result=0
    fi

    output_string="$output_string $result"
done

# Output the result, removing the leading space
echo $output_string | sed 's/^ //'

# Print the minimum values for odd and even indexed numbers
echo "$min_even $min_odd"
