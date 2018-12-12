import React from 'react'
import PropTypes from 'prop-types'
import {
  inject,
  observer,
} from 'mobx-react'

import TextField from '@material-ui/core/TextField'
import Radio from '@material-ui/core/Radio'
import Button from '@material-ui/core/Button'
import IconReply from '@material-ui/icons/Reply'
import SnackBar from '@material-ui/core/Snackbar'
import { withStyles } from '@material-ui/core/styles'

import Container from '../layout/container'
import createStyles from './style'
import { tabs } from '../../util/variable-define'
import SimpleMDE from '../../components/simple-mde'

@inject ((stores) => {
  return {
    topicStore: stores.topicStore,
  }
}) @observer

class TopicCreate extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  }

  constructor() {
    super()
    this.state = {
      title: '',
      content: '',
      tab: 'dev',
      open: false,
      message: '',

    }
    this.handleTitleChange = this.handleTitleChange.bind(this)
    this.handleContentChange = this.handleContentChange.bind(this)
    this.handleChangeTab = this.handleChangeTab.bind(this)
    this.handleCreate = this.handleCreate.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.showMessage = this.showMessage.bind(this)
  }

  handleTitleChange(e) {
    this.setState({
      title: e.target.value.trim()
    })
  }
  handleContentChange(value) {
    this.setState({
      content: value,
    })
  }
  handleChangeTab(e) {
    this.setState({
      tab: e.currentTarget.value
    })
  }
  handleCreate() {
    // do create here
    const {tab, title, content} = this.state
    if(!title) {
      this.showMessage('title必须填写')
      return
    }
    if(!content) {
      this.showMessage('内容不能为空')
      return
    }
    return this.props.topicStore.createTopic(title, tab, content)
      .then(() => {
        this.context.router.history.push('/index')
      })
      .catch((err) => {
        this.showMessage(err.message)
      })
  }
  showMessage(message) {
    this.setState({
      open: true,
      message,
    })
  }
  handleClose() {
    this.setState = {
      open: false
    }
  }
  render() {
    const { classes } = this.props
    const { message, open } = this.state
    return (
      <Container>
        <SnackBar 
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          message={message}
          open={open}
          onClose={this.handleClose}
        />
        <div className={classes.root}>
          <div>
            <TextField
              className={classes.title}
              lable="标题"
              value={this.state.title}
              onChange={this.handleTitleChange}
              fullWidth
            />
            <SimpleMDE
              onChange={this.handleContentChange}
              value={this.state.content}
              options={{
                toolbar: false,
                spellChecker: false,
                placeholder: '发表一个新话题',
                autofocus: false,
              }}
            />
          </div>
          <div>
            {
              Object.keys(tabs).map((tab) => {
                if(tab !== 'all' && tab !== 'good') {
                  return (
                    <span 
                      className={classes.selectItem}
                      key={tab}
                    >
                      <Radio
                        value={tab}
                        checked={tab === this.state.tab}
                        onChange={this.handleChangeTab}
                      />
                      {tabs[tab]}
                    </span>
                  )
                }
                return null
              })
            }
          </div>
          <Button color="primary"
            onClick={this.handleCreate}
            className={classes.replyButton}
          >
            <IconReply />
          </Button>
        </div>
      </Container>
    )
  }
}

TopicCreate.wrappedComponent.propTypes = {
  topicStore: PropTypes.object.isRequired,
}

TopicCreate.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(createStyles)(TopicCreate)