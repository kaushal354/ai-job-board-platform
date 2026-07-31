from collections import Counter
text = 'kaushal prasad'
print(Counter(text))

#two pointer
arr = [1,2,3,5,7,10,11,15]
target = 15
left = 0
right = len(arr) - 1
while left < right:
    current_sum = arr[left] + arr[right]
    if current_sum == target:
        print(left, right)
        break
    elif current_sum < target:
        left += 1
    else:
        right -= 1