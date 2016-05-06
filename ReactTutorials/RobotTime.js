class RobotTime extends React.Component {
    render() {
        const pi = Math.PI;
        const time = new Date();
        return (
            <div className="is-tasty-pie">
                The value of PI is approximately {pi}
                <p>The time is {time.toLocaleTimeString()}</p>
            </div>
            
        );
    }
}

ReactDOM.render(<RobotTime />, document.getElementById('robotTime'));
