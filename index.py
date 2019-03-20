#!/usr/bin/python

import bottle
from datetime import datetime, timedelta
import shelve
import time
import json
import function

f = shelve.open("time_data.shelve", writeback=True)
#f.clear()
if (not "start_times" in f):
	f["start_times"] = [0,0,0,0]
if (not "paused_times" in f):
	f["paused_times"] = [{"last_pressed":0, "paused":0}, 
	{"last_pressed":0, "paused":0},
	{"last_pressed":0, "paused":0},
	{"last_pressed":0, "paused":0}] #contains start times
data = dict(f)
f.close()
	
def get_time_elapsed(i):
	if (data["paused_times"][i]["last_pressed"] != 0 and data["start_times"][i] != 0):
		time_elapsed = (datetime.now() - data["start_times"][i]) - (datetime.now() - data["paused_times"][i]["last_pressed"])
	elif (data["paused_times"][i]["last_pressed"] == 0 and data["start_times"][i] == 0):
		time_elapsed = timedelta(minutes=0)
	else:
		time_elapsed = datetime.now() - data["start_times"][i]
		print(time_elapsed)
	total_seconds = time_elapsed.seconds
	hours = int(total_seconds / 3600)
	minutes = int((total_seconds % 3600) / 60)
	seconds = int(total_seconds % 60)
	return {"hours":hours, "minutes":minutes, "seconds":seconds}

@bottle.route('/static/css/<file_name:path>')
def load_css(file_name):
	return bottle.static_file(file_name, root='/projects/timetracker/static/css')

@bottle.route('/static/js')
def load_js(file_name):
	return bottle.static_file(file_name, root='./js')

@bottle.route('/')
def index():
	load_css('bootstrap.css')
	load_css('organize.css')
	load_js('XHRequest.js')
	command = bottle.request.params.get("command")
	if (command != "paused"):
		d = {"times":{"seconds":[], "minutes":[], "hours":[]}, "paused":[]}
		for i in range(0, 4):
			i_timer = get_time_elapsed(i)
			d["times"]["seconds"].append(i_timer["seconds"])
			d["times"]["minutes"].append(i_timer["minutes"])
			d["times"]["hours"].append(i_timer["hours"])
		for paused in data["paused_times"]:
			status = paused["paused"]
			d["paused"].append(status)
		html = bottle.template("template.html", data=d)
		return html
#start_pressed(0)
#time.sleep(1)
bottle.run(server="cgi")

