a = 0
b = "apple"
c = {}
print(a, b, c)



a = 1 - 1
b = "app" + "le"
c = 3 * 4 / 5
print(a, b, c)



a = 1
a += 2
print(a)



b = 1
if b == 2:
    print("success")
else:
    print("fail")



c = ["a", "b", "c"]
print(c)



for i in range(5):
    print(i)



c = ["a", "b", "c"]
for i in c:
    print(i)



c = ["a", "b", "c"]
print(c[0])
print(c[1])
print(c[2])
print(c[3]) # this will fail



c = ["a", "b", "c"]
print(c[1:], c[:1])



cc = [1, 2, 3]
if not cc[1] == 2:
    print("success")
else:
    print("fail")



d = {
    "a": "a",
    "b": "b",
    "c": "c"
}
print(d)



d["a"] = "d"
print(d)



numbers = [1, 2, 3, 4, 5]
number_sum = 0
for number in numbers:
    number_sum += number
print(number_sum)



big_list = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]
for row in big_list:
    print(row)

big_list[1][1]
for row in big_list:
    print(row)



def add(a, b):
    number_sum = a + b
    return number_sum
print(add(2, 2))



---



