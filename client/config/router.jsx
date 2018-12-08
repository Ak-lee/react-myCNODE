import React from 'react'
import {
    Route,
    Redirect
} from 'react-router-dom'

import TopicList from '../views/top-list/index.jsx'
import TopicDetail from '../views/top-detail/index.jsx';
import Login from '../views/user/login'
import Info from '../views/user/info'
import TestApi from '../views/test/api-test'
import TopicCreate from '../views/topic-create'

export default () => [
    <Route path='/' render = {
        () => <Redirect to="/index"></Redirect>
    } key="first" exact />,
    <Route path="/index" component={TopicList} key="list" />, 
    <Route path="/detail/:id" component={TopicDetail} 
        key="detail"
    />,
    <Route path="/user/login" key="login" component={Login}/>,
    <Route path="/user/info" key="info" component={Info} />,
    <Route path="/topic/create" key="create" component={TopicCreate} />,
    <Route path="/test" component={TestApi}
        key="test"
    />
]