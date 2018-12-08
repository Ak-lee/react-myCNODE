const router = require('express').Router()
const axios = require('axios')

const baseUrl = 'https://cnodejs.org/api/v1'

router.post('/login', function(req, res, next) {
    // 验证 accesstoken的正确性
    axios.post(`${baseUrl}/accesstoken`, {
        accesstoken: req.body.accessToken
    }).then(response => {
            if(response.status === 200 && response.data.success) {
                req.session.user = {
                    accessToken: req.body.accessToken,
                    loginName: response.data.loginname,
                    id: response.data.id,
                    avatarUrl: response.data.avatar_url
                }
                res.json({
                    success: true,
                    data: response.data
                })
            }
        })
        .catch(err => {
            if(err.response) {
                res.json({
                    success: false, 
                    data: err.response.data
                })
            } else {
                console.err(err)
            }
        })
})

module.exports = router