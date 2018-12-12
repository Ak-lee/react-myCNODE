import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import {
    inject,
    observer,
} from 'mobx-react'

// 使用下面这种书写方式，才不会把整个 material-ui 打包进去
// 我们项目中并不会用到 material-ui 的所有功能
import AppBar from '@material-ui/core/AppBar'
import ToolBar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import HomeIcon from '@material-ui/icons/home'

const styles = {
    root: {
        width: '100%',
    },
    flex: {
        flex: 1
    },
}

@inject((stores) => {
    return {
        appState: stores.appState
    }
}) @observer

class MainAppBar extends React.Component {
    static contextTypes = {
        router: PropTypes.object
    }
    constructor() {
        super()
        this.onHomeIconClick = this.onHomeIconClick.bind(this)
        this.createButtonClick = this.createButtonClick.bind(this)
        this.loginButtonClick = this.loginButtonClick.bind(this)
    }
    onHomeIconClick() {
        this.context.router.history.push('/index?tab=all')
    }
    createButtonClick() {
        this.context.router.history.push('/topic/create')
    }
    loginButtonClick() {
        if(this.props.appState.user.isLogin) {
            this.context.router.history.push('/user/info')
        } else {
            this.context.router.history.push('/user/login')
        }
    }

    render() {
        const classes = this.props.classes
        const {user} = this.props.appState
        return (
            <div className={classes.root}>
                <AppBar position="fixed" color="default">
                    <ToolBar>
                        <IconButton color="inherit" onClick={this.onHomeIconClick} >
                            <HomeIcon />
                        </IconButton >
                        <Typography type="title" 
                        className={classes.flex}
                        color="inherit" >
                            My CNODE
                        </Typography>
                        <Button color="primary" variant="contained" onClick={this.createButtonClick} >
                            新建话题
                        </Button>
                        <Button color="inherit" onClick={this.loginButtonClick} >
                            {
                                user.isLogin ? user.info.loginname : null
                            } 
                            {
                                !user.isLogin ? '登录' : null
                            }
                        </Button>
                    </ToolBar>
                </AppBar>
            </div>
        )
    }
}

MainAppBar.wrappedComponent.propTypes = {
    appState: PropTypes.object.isRequired,
}
MainAppBar.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(MainAppBar)