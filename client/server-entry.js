import React from 'react'
import { StaticRouter } from 'react-router-dom'
import { Provider, useStaticRendering } from 'mobx-react'
import { JssProvider } from 'react-jss'
import { MuiThemeProvider } from '@material-ui/core/styles'
import App from './views/App.jsx';
import { createStoreMap } from './store/store.js'

// 让 mobx 在服务端渲染的时候不会重复的数据变换
useStaticRendering(true)

export default ( stores, routerContext, SheetsRegistry,generateClassName,theme,sheetsManager,url ) => {
    return (
        <Provider {...stores}>
            <StaticRouter context = { routerContext } location={ url }>
                <JssProvider registry={ SheetsRegistry } generateClassName={ generateClassName } >
                    <MuiThemeProvider theme={theme} sheetsManager={sheetsManager} >
                        <App />
                    </MuiThemeProvider>
                </JssProvider>
            </StaticRouter>
        </Provider>
    )
}

export { createStoreMap }
