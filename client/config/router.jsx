import React from 'react'
import {
    Route,
    Redirect,
    withRouter,
} from 'react-router-dom'

import {
    inject,
    observer,
} from 'mobx-react'
import PropTypes from 'prop-types'

import TopicList from '../views/top-list/index.jsx'
import TopicDetail from '../views/top-detail/index.jsx';
import Login from '../views/user/login'
import Info from '../views/user/info'
import TopicCreate from '../views/topic-create'

const PrivateRoute = ({isLogin, component:Component, ...rest}) => (
    <Route
        // rest 为一个对象，this.props 也是一个的对象，rest相当于this.props的一个子集
        {...rest}
        render = {
            (props) => (
                isLogin ?
                <Component {...props} /> :
                <Redirect 
                    to={{
                        pathname: '/user/login',
                        search: `?from=${rest.path}`
                    }}

                />
            )
        }
    />
)

const InjectedPrivateRoute = withRouter(inject((stores) => {
    return {
        isLogin: stores.appState.user.isLogin
    }
})(observer(PrivateRoute)))

PrivateRoute.propTypes = {
    isLogin: PropTypes.bool,
    component: PropTypes.element,
}
PrivateRoute.defaultProps = {
    isLogin: false,
}

export default () => [
    <Route path='/' render = {
        () => <Redirect to="/index"></Redirect>
    } key="first" exact />,
    <Route path="/index" component={TopicList} key="list" />, 
    <Route path="/detail/:id" component={TopicDetail} 
        key="detail"
    />,
    <Route path="/user/login" key="login" component={Login}/>,
    <InjectedPrivateRoute path="/user/info" key="info" component={Info} />,
    <InjectedPrivateRoute path="/topic/create" key="create" component={TopicCreate} />,
]