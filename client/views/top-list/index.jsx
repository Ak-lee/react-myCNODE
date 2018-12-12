import React from 'react'
import {
    observer,
    inject
} from 'mobx-react'

import PropTypes from 'prop-types'
import AppState from '../../store/app-state'
import Helmet from 'react-helmet'
import queryString  from 'query-string'

import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab';
import List from '@material-ui/core/List'
import CircularProgress from '@material-ui/core/CircularProgress'

import Container from '../layout/container.jsx'
import TopicListItem from './list-item'
import { tabs } from '../../util/variable-define'

@inject(stores => {
    return {
        appState: stores.appState,
        topicStore: stores.topicStore
    }
}) @observer

class TopicList extends React.Component {
    static contextTypes = {
        router: PropTypes.object
    }
    constructor() {
        super()
        this.changeTab = this.changeTab.bind(this)
        this.listItemClick = this.listItemClick.bind(this)
        
    }
    componentDidMount() {
        const tab = this.getTab()
        this.props.topicStore.fetchTopics(tab)
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.location.search !== this.props.location.search) {
             this.props.topicStore.fetchTopics(this.getTab(nextProps.location.search))
        }
    }
    // bootstrap() {
    //     // 这个函数时用于后端的异步请求数据后渲染，对于前端页面没什么用。后端在渲染该组件前会执行这个函数。
    //     return new Promise((resolve) => {
    //         setTimeout(() => {
    //             this.props.appState.count = 3;
    //             resolve(true)
    //         })
    //     })
    // }
    render() {
        const { topicStore } = this.props
        const {createdTopics} = topicStore
        const topicList = topicStore.topics
        const syncingTopics = topicStore.syncing
        const { user } = this.props.appState
        const tab = this.getTab()

        return (
            <Container>
                <Helmet>
                    <title>This is topic list</title> 
                    <meta name="description" content="This is description" />
                </Helmet>
                
                <Tabs value={tab} onChange={this.changeTab}>
                    {
                        Object.keys(tabs).map((t) => (
                            <Tab label={tabs[t]} value={t} key = {t}
                            />
                        ))
                    }
                </Tabs>
            
                {
                    (createdTopics && createdTopics.length > 0) &&
                    <List style={{backgroundColor: '#dfdfdf' }}>
                    {
                        createdTopics.map((topic) => {
                            topic = Object.assign({}, topic, {
                                author: user.info,
                            })
                            return (
                                <TopicListItem 
                                key={topic.id}
                                onClick={() => {
                                    this.listItemClick(topic)
                                }} topic={topic} />
                            )
                        })
                    }
                    </List>
                }

                <List>
                    {
                        topicList.map((topic) => {
                            return (
                                <TopicListItem 
                                key={topic.id}
                                onClick={() => {
                                    this.listItemClick(topic)
                                }} topic={topic} />
                            )
                        })
                    }
                </List>
                {
                    syncingTopics ? 
                    (
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-around',
                            padding: '40px 0',
                        }}>
                            <CircularProgress 
                                color = "secondary"
                                size={100}
                            />
                        </div>
                    ) :
                    null
                }
            </Container>
        )
    }

    getTab(search) {
        search = search || this.props.location.search
        const query = queryString.parse(search)

        return query.tab || 'all'
    }

    changeTab(event, value) {
        this.context.router.history.push({
            pathname: '/index',
            search: `?tab=${value}`
        })
    }

    listItemClick(topic) {
        this.context.router.history.push(`/detail/${topic.id}`)
    }
}

TopicList.wrappedComponent.propTypes = {
    appState: PropTypes.instanceOf(AppState).isRequired,
    topicStore: PropTypes.object.isRequired
}
TopicList.propTypes = {
    location: PropTypes.object.isRequired
}

export default TopicList
// 上面的 propTypes 是一个AppState的实例，并且是必须传入的。