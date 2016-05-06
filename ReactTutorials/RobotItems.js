class RobotItems extends React.Component {
    render() {
        const topics = ["React", "JSX", "JavaScript", "Programming"];
        return (
            <div>
                <h3>Topics I am interested in</h3>
                <ul>
                    {topics.map(topic => <li>{topic}</li>)}
                </ul>
            </div>
        );
    }
}

ReactDOM.render(<RobotItems />, document.getElementById('robotItems'));
