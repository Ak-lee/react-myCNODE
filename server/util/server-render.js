const serialize = require('serialize-javascript')
const ejs = require('ejs')
const asyncBootstrap = require('react-async-bootstrapper')
const ReactDomServer = require('react-dom/server')
const Helmet = require('react-helmet').default
const SheetsRegistry = require('react-jss').SheetsRegistry
const createMuiTheme = require('@material-ui/core/styles').createMuiTheme
const createGenerateClassName = require('@material-ui/core/styles').createGenerateClassName
const lightBlue = require('@material-ui/core/colors/lightBlue').default
const pink = require('@material-ui/core/colors/pink').default


const getStoreState = (stores) => {
    return Object.keys(stores).reduce((result, storeName) => {
        result[storeName] = stores[storeName].toJson()
        return result
    }, {}) 
}

module.exports = (bundle, template, req, res) => {
    return new Promise((resolve, reject) => {
            const createStoreMap = bundle.createStoreMap
            const createApp = bundle.default
            const routerContext = {}
            const stores = createStoreMap()

            const Sheets= new SheetsRegistry()
            const generateClassName = createGenerateClassName();
            const sheetsManager = new Map();
            const theme = createMuiTheme({
                // 这一部分要保持和客户端一致
                palette: {
                  primary: pink,
                  accent: lightBlue,
                  type: 'light',
                },
                typography: {
                    useNextVariants: true,
                },
              });
            const app = createApp(stores, routerContext, Sheets, generateClassName, theme, sheetsManager,req.url)

            asyncBootstrap(app).then(() => {
                if (routerContext.url) {
                    res.status(302).setHeader('Location', routerContext.url)
                    res.end()
                    return ;
                }
                const helmet = Helmet.rewind() 
                const state = getStoreState(stores)
                const content = ReactDomServer.renderToString(app)
                const html = ejs.render(template, {
                    appString: content,
                    initialState: serialize(state),
                    meta: helmet.meta.toString(),
                    title: helmet.title.toString(),
                    style: helmet.style.toString(),
                    link: helmet.link.toString(),
                    materialCss: Sheets.toString()
                })
                res.send(html)
                resolve()
                
            }).catch(e => {
                reject(e)
            })
            
    })
} 