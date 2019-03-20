def start_pressed(i, data):
	if (data["start_times"][i] == 0):
		data["start_times"][i] = datetime.now()
		data["paused_times"][i]["paused"] = False
	elif (data["paused_times"][i]["paused"]):
		data["start_times"][i] += datetime.now() - data["paused_times"][i]["last_pressed"]
		print("Paused for " + str((datetime.now() - data["paused_times"][i]["last_pressed"]).seconds))
		data["paused_times"][i]["paused"] = False
	
def paused_pressed(i):
	if (not data["paused_times"][i]["paused"]):
		data["paused_times"][i]["paused"] = True
		data["paused_times"][i]["last_pressed"] = datetime.now()