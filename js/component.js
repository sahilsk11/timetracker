class App extends React.Component {
    render() {
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

        this.state = { seconds: 0, minutes: 0, hours: 0 };
        this.startTimer = this.startTimer.bind(this);
    }

    determineClasses() {
        let slot = "";
        if (this.props.timerID == 0 || this.props.timerID == 3) {
            slot = " grey";
        }
        return "col-md-6 timer-container" + slot;
    }

    startTimer() {
        this.setState({ startDate: new Date().getTime(), running: true });
        this.componentDidMount();
    }

    componentDidMount() {
        if (this.state.running) {
            alert();
            setInterval(() => this.tick(), 1000);
        } else {
            console.log(this.state.running);
        }
    }

    tick() {
        var difference = this.state.startDate - new Date().getTime();
        this.state.hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        this.state.seconds = Math.floor((difference % (1000 * 60)) / 1000);
    }

    printTime() {
        var hours = this.state.hours;
        var minutes = this.state.minutes;
        var seconds = this.state.seconds;

        var hoursStr, minutesStr, secondsStr;

        if (hours < 10) {
            hoursStr = "0" + hours;
        }
        if (minutes < 10) {
            minutesStr = "0" + minutes;
        }
        if (seconds < 10) {
            secondsStr = "0" + seconds;
        }
        return hoursStr + ":" + minutesStr + ":" + secondsStr;
    }

    render() {
        return (
            <div className={this.determineClasses()}>
                <div className="timer-content">
                    <h3>{this.props.title}</h3>
                    <h1 id="h1"><time>{this.printTime()}</time></h1>
                    <button className="btn btn-success" onClick={() => this.startTimer()}>start</button>
                    <button className="btn btn-danger" >stop</button>
                    <button className="btn btn-primary">clear</button>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById("content-container"));