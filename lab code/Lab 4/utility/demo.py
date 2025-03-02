
# The code below only works with 
# Python 3.10 or later

from typing import List, Union

def mean(numbers: list[float | int]) -> float:
    return sum(numbers) / len(numbers)

myNumbers = [1,2,3,4,5]


if (n := len(myNumbers)) > 3:
    print(f'You have a total of {n} elements')

print(f'The mean of those elements is {mean(myNumbers)}')
