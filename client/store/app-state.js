import {
    observable,
    computed,
    action
} from 'mobx'

import { post, get } from '../util/http'

export default class AppState {
    @observable user = {
        isLogin: false,
        info: {},
        detail: {
            recentTopics: [],
            recentReplies: [],
            syncing: false,
        },
        collections: {
            syncing: false,
            list: [],
        }
    }
    @action login(accessToken) {
        return new Promise((resolve, reject) => {
            post('/user/login', '', {
                accessToken,
            }).then(resp => {
                if(resp.success) {
                    this.user.isLogin = true
                    this.user.info = resp.data
                    resolve()
                } else {
                    reject(resp)
                }
            }).catch(reject)
        })
    }
    @action getUserDetail() {
        this.user.detail.syncing = true
        return new Promise((resolve, reject) => {
            get(`/user/${this.user.info.loginname}`)
                .then((resp) => {
                    if(resp.success) {
                        this.user.detail.recentReplies = resp.data.recent_replies
                        this.user.detail.recentTopics = resp.data.recent_topics
                        resolve()
                    } else {
                        reject()
                    }
                })
                .catch(e => {
                    console.log(e)
                    reject(e)
                })
                this.user.detail.syncing = false
        })
    }
    @action getUserCollection() {
        this.user.collections.syncing = true
        return new Promise((resolve, reject) => {
            get(`/topic_collect/${this.user.info.loginname}`)
                .then((resp) => {
                    if(resp.success) {
                        this.user.collections.list = resp.data
                        resolve()
                    } else {
                        reject()
                    }
                })
                .catch(e => {
                    console.log(e)
                    reject(e)
                })
                this.user.collections.syncing = false
        })
    }
    toJson() {
        // 这个方法用于服务端渲染的时候以json的形式来拿到state中的数据。
        // 后面我们要想办法把这个json数据放在一个客户端能够拿到的地方。让客户端//store init 的时候就能拿到这份json数据。
        return {
            user: this.user
        }
    }
}
