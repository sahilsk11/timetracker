#!/usr/bin/python

import bottle
from datetime import datetime
import shelve

data = shelve.open("time_data.shelve", writeback=True)

if (not data.has_key("start_times")):
	data["times"] = []

@bottle.route('/')
def index():
    return ""

def start_pressed(i):
	start_time[i] = datetime.now()

bottle.run(host="", port="8080")