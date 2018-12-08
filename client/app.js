import ReactDOM from 'react-dom'
import React from 'react'
import { Provider } from 'mobx-react'
import { BrowserRouter as Router } from 'react-router-dom'
import { AppContainer } from 'react-hot-loader'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import { lightBlue, pink } from '@material-ui/core/colors'

import App from './views/App.jsx'
import { AppState, TopicStore} from './store/store'

const theme = createMuiTheme({
    palette: {
        primary: pink, 
        accent: lightBlue,
        type: 'light',
    },
    typography: {
        useNextVariants: true,
    },
})

const initialState = window.__INITIAL__STATE__ || {}

const root = document.getElementById('root')

const createApp = (TheApp) => {
    class Main extends React.Component {
        // Remove the server-side injected CSS.
        componentDidMount() {
          const jssStyles = document.getElementById('jss-server-side');
          if (jssStyles && jssStyles.parentNode) {
            jssStyles.parentNode.removeChild(jssStyles);
          }
        }
      
        render() {
          return <TheApp />
        }
    }
    return Main
}

const appState = new AppState(initialState.appState)
const topicStore = new TopicStore(initialState.topicStore)

const render = (Component) => {
    ReactDOM.render( 
        <AppContainer>
            <Provider appState={appState} topicStore={topicStore}>
                <Router>
                    <MuiThemeProvider theme={theme}>
                        <Component />
                    </MuiThemeProvider>
                </Router>
            </Provider>
        </AppContainer>,
        root
    )
}

render(createApp(App))

if(module.hot) {
    module.hot.accept('./views/App.jsx', () => {
        const NextApp = require('./views/App.jsx').default
        render(createApp(NextApp))
    })
}

