import shelve
import pprint
f = shelve.open("time_data.shelve", writeback=True)
print(f["start_times"])
f.close()
