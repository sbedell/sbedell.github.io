class RobotBox extends React.Component {
    render() {
        return (
            <div>
                <h3>McCircuit is my name.</h3>
                <p className="message">I am here to help.</p>
            </div>
        );
    }
}

ReactDOM.render(<RobotBox />, document.getElementById('robotBox'));
