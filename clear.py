import shelve

f = shelve.open("time_data.shelve", writeback=True)
f.clear()
f.close()
