const React = require('react')
import Routes from '../config/router.jsx'
import { Link } from 'react-router-dom'
import AppBar from './layout/app-bar'
export default class App extends React.Component {
    componentDidMount() {
        // do something here
    }
    render() {
        return [
            <AppBar key="appBar" />,
            <Routes key="routes" />
        ]
    }
}

