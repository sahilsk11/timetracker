class App extends React.Component {
    constructor(props) {
        super(props);
        this.setCode();
    }

    setCode() {
        var url = window.location.href;
        var code = new URL(url).searchParams.get("id");
        console.log(code);
        this.code = code;
    }

    render() {
        this.setCode();
        return (<div className="container-fluid text-center">
            <div className="row">
                <Timer title="Working" timerID="0" />
                <Timer title="Productive" timerID="1" />
            </div>
            <div className="row">
                <Timer title="Commute" timerID="2" />
                <Timer title="Other" timerID="3" />
            </div>
        </div>);
    }
}

class Timer extends React.Component {
    constructor(props) {
        super(props);

        this.state = { startDate: null, time: "00:00:00", timerState: null };

        this.startTimer = this.startTimer.bind(this);
        this.pause = this.pause.bind(this);
        this.tick = this.tick.bind(this);

        this.pausedTime = 0;
        this.intervalID = null;
        this.lastPaused = null;
    }

    determineClasses() {
        let slot = "";
        if (this.props.timerID == 0 || this.props.timerID == 3) {
            slot = " grey";
        }
        return "col-md-6 timer-container" + slot;
    }

    startTimer() {
        if (this.state.startDate == null) {
            this.setState({ startDate: new Date().getTime() });
        }
        if (this.state.timerState == "paused") {
            this.pausedTime += new Date().getTime() - this.lastPaused;
        }
        if (this.state.timerState != "running") {
            this.intervalID = setInterval(() => this.tick(), 1000);
            this.setState({ timerState: "running" });
        }
    }

    tick() {
        var currentTime = new Date().getTime();
        var difference = currentTime - this.pausedTime - this.state.startDate;
        var hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((difference / 1000) % 60);
        this.updateTime(hours, minutes, seconds);
    }

    updateTime(hours, minutes, seconds) {
        var hoursStr = hours, minutesStr = minutes, secondsStr = seconds;
        if (hours < 10) {
            hoursStr = "0" + hours;
        }
        if (minutes < 10) {
            minutesStr = "0" + minutes;
        }
        if (seconds < 10) {
            secondsStr = "0" + seconds;
        }
        this.setState({ time: hoursStr + ":" + minutesStr + ":" + secondsStr });
    }

    pause() {
        if (this.state.timerState != "paused") {
            this.setState({ timerState: "paused" });
            this.lastPaused = new Date().getTime();
        }
        clearInterval(this.intervalID);
    }

    clear() {
        if (confirm("Are you sure you want to clear " + this.props.title + "?")) {
            this.pause();
            this.timerState = null;
            this.lastPaused = null;
            this.pausedTime = 0;
            this.setState({ time: "00:00:00", startDate: null });
            //console.log(this.state.time);
        } else {
            console.log("Clear cancelled");
        }
    }

    displayButtons() {
        var btnClass = "beautiful-btn";
        return (
            <button className={btnClass}>
                start
            </button>
        );
    }

    render() {
        return (
            <div className={this.determineClasses()}>
                <div className="timer-content">
                    <h3>{this.props.title}</h3>
                    <h1 id="h1"><time>{this.state.time}</time></h1>
                    <button className="btn btn-success" onClick={() => this.startTimer()}>start</button>
                    <button className="btn btn-danger" onClick={() => this.pause()}>stop</button>
                    <button className="btn btn-primary" onClick={() => this.clear()}>clear</button>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById("content-container"));