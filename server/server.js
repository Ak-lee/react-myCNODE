const express = require('express')
const path  = require('path')
const fs = require('fs')
const bodyParser = require('body-parser')
const session = require('express-session')

const serverRender = require('./util/server-render')

const isDev = process.env.NODE_ENV === 'development'
const app = express() 

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.use(session({
    cookie: {
        maxAge: 10*60*1000,
    },
    name: 'my_cnode',
    resave: false,
    saveUninitialized: false,
    secret: 'react cnode class'
}))
app.use('/api/user', require('./util/handle-login'))
app.use('/api', require('./util/proxy'))

if(!isDev) {
    const serverEntry = require('../dist/server-entry.js')
    const template = fs.readFileSync(path.join(__dirname, '../dist/server.ejs'), 'utf8')
    app.use('/public', express.static(path.join(__dirname, '../dist/')))
    app.get('*', (req, res, next) => {
        serverRender(serverEntry, template, req, res)
        .catch(next)
    })
} else {
    const devStatic = require('./util/dev-static')
    devStatic(app)
}

app.use(function(error, req, res, next) {
    console.log(error)
    res.status(500).send(error)
})

app.listen('3333', () => {
    console.log('server is listening on port 3333')
})