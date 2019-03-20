#!/usr/bin/python

print "Content-type: application/json\n\n"

import cgi
import json
from datetime import datetime
import shelve

data = shelve.open("time_data.shelve", writeback=True)

def start_pressed(i):
    if (data["start_times"][i] == 0):
        data["start_times"][i] = datetime.now()
        data["paused_times"][i]["paused"] = False
    elif (data["paused_times"][i]["paused"]):
        data["start_times"][i] += datetime.now() - data["paused_times"][i]["last_pressed"]
        data["paused_times"][i]["paused"] = False
    
def paused_pressed(i):
    if (not data["paused_times"][i]["paused"]):
        data["paused_times"][i]["paused"] = True
        data["paused_times"][i]["last_pressed"] = datetime.now()


form = cgi.FieldStorage()
command = form.getfirst("command", "pageload")
index = form.getfirst("index", "")

if (command == "start"):
    start_pressed(int(index))
    d = {"success":True}
    #d = {"sucess":False}
    j = json.dumps(d)
    print(j)
    
elif (command == "pause"):
    try:
        paused_pressed(int(index))
        d = {"success":True}
    except:
        d = {"sucess":False}
    j = json.dumps(d)
    print(j)
else:
    d = {"error":"unknown request"}
    j = json.dumps(d)
    print(j)
    
data.close()