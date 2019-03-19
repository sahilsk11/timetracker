#!/usr/bin/python

import bottle
from datetime import datetime
import shelve
import time

data = shelve.open("time_data.shelve", writeback=True)
data.clear()
if (not data.has_key("start_times")):
	data["start_times"] = [0,0,0,0]
if (not data.has_key("paused_times")):
	data["paused_times"] = [{"last_pressed":0, "time_delta":0, "paused":False}, 
	{"last_pressed":0, "time_delta":0, "paused":False},
	{"last_pressed":0, "time_delta":0, "paused":False},
	{"last_pressed":0, "time_delta":0, "paused":False}] #contains start times
'''
@bottle.route('/')
def index():
    return ""
'''
def start_pressed(i):
	if (data["start_times"][i] == 0):
		data["start_times"][i] = datetime.now()
		data["paused_times"][i]["paused"] = False
	elif (data["paused_times"][i]["paused"]):
		data["start_times"][i] += datetime.now() - data["paused_times"][0]["last_pressed"]
		print("Paused for " + str((datetime.now() - data["paused_times"][0]["last_pressed"]).seconds))
		data["paused_times"][i]["paused"] = False
	
def paused_pressed(i):
	data["paused_times"][i]["paused"] = True
	data["paused_times"][i]["last_pressed"] = datetime.now()

start_pressed(0)
time.sleep(1)
paused_pressed(0)
time.sleep(1)
start_pressed(0)
print(data)
print(datetime.now() - data["start_times"][0])
#bottle.run(host="", port="8080")
data.close()