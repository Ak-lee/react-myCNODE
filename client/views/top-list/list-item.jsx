import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import cx from 'classnames'
import dateFormat from "dateformat";

import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'

import {
    topicPrimaryStyle,
    topicSecondaryStyles,
} from './styles'
import { tabs } from '../../util/variable-define'

const Primary = ({ classes, topic, ...rest }) => {
    // 这里的 classes.top 中top是一个样式名。
    const classNames = cx({
        [classes.tab]: true,
        [classes.top]: topic.top
    })
    return (
        <div className= {classes.root}>
            <span className={classNames}>
                {
                    topic.top ? '置顶' : tabs[topic.tab]
                }
            </span>
            <span className={classes.title}>{topic.title}</span>
        </div>
    )
}

const Secondary = ({ classes, topic, ...rest }) => (
    <span className={classes.root}>
        <span className={classes.userName}>{topic.author.loginname}</span>
        <span className={classes.count}>
            <span className={classes.accentColor}>{topic.reply_count}</span>
            <span>/</span>
            <span>{topic.visit_count}</span>
        </span>
        <span>创建时间: {dateFormat(topic.create_at, 'yy年mm月dd日')}</span>
    </span>
)

const StyledPrimary = withStyles(topicPrimaryStyle)(Primary)
const StyledSecondary = withStyles(topicSecondaryStyles)(Secondary)

const TopicListItem = ({ onClick, topic }) => (
    <ListItem  dense={true} button={true} onClick={onClick}>
        <ListItemAvatar>
            <Avatar src = {topic.author.avatar_url} />
        </ListItemAvatar>
        <ListItemText 
            primary={ <StyledPrimary topic={topic} /> }
            secondary={ <StyledSecondary topic={topic} /> }
        />
    </ListItem>
)

Primary.propTypes = {
    topic: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired
}
Secondary.propTypes = {
    topic: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired
}

TopicListItem.propTypes = {
    onClick: PropTypes.func.isRequired,
    topic: PropTypes.object.isRequired,
}

export default TopicListItem
