import shelve

f = shelve.open("time_data.shelve")
print(f)
f.close()
