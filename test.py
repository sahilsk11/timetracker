import datetime
import time

a = datetime.timedelta(hours=1, minutes=10, seconds=3)
def get_time_elapsed(i):
	time_elapsed = datetime.now() - data["paused_times"][i]["last_pressed"])
	total_seconds = time_elapsed.seconds
	hours = int(total_seconds / 3600)
	minutes = int((total_seconds % 3600) / 60)
	seconds = int(total_seconds % 60)
	return (hours, minutes, seconds)
print(get_time_elapsed(0))