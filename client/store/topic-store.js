import {
    observable,
    toJS,
    computed,
    action,
    extendObservable,
} from 'mobx'
import { topicSchema, replySchema } from '../util/variable-define'
import { get, post } from '../util/http'
import { appState } from './store'

const createTopic = (topic) => {
    return Object.assign({}, topicSchema, topic)
}
const createReply = (reply) => {
    return Object.assign({}, replySchema, reply)
}

class Topic {
    constructor(data) {
        // extendObservable 方法，把 data 上的所有属性都附加到this上。并且附加之后的方法还是响应式的。
        extendObservable(this, data)
    }
    @observable syncing = false
    @observable createdReplies = []
    @action doReply(content) {
        return new Promise((resolve, reject) => {
            post(`/topic/${this.id}/replies`, {
                needAccessToken: true,
            }, {
                content,
            }).then(resp => {
                if(resp.success) {
                    this.createdReplies.push(createReply({
                        id: resp.reply_id,
                        content,
                        create_at: Date.now(),
                    }))
                    resolve()
                } else {
                    reject(resp)
                }
            }).catch(reject)
        })
    }
}

class TopicStore {
    @observable topics
    @observable syncing
    @observable details
    @observable createdTopics = []

    constructor(
            {syncing = false, topics = [], details = [] } = {}
        ) {
        this.syncing = syncing
        this.topics = topics.map((topic) => 
            new Topic(createTopic(topic))
        )
        this.details = details.map(topic => new Topic(createTopic(topic)))
    }

    addTopic(topic) {
        this.topics.push(new Topic(createTopic(topic)))
    }
    @computed get detailsMap() {
        return this.details.reduce((result, detail) => {
            result[detail.id] = detail
            return result
        }, {})
    }

    @action fetchTopics(tab) {
        this.syncing = true
        this.topics = []
        return new Promise((resolve, reject) => {
            get('/topics', {
                mdrender: false,
                tab,
            }).then(response => {
                if(response.success) {
                    this.topics = response.data.map(topic => {
                        return new Topic(createTopic(topic))
                    })
                    resolve()
                } else {
                    reject()
                }
                this.syncing = false
            }).catch(err => {
                reject(err)
                this.syncing = false
            })
        })
    }
    @action getTopicDetail(id) {
        return new Promise((resolve, reject) => {
            if(this.detailsMap[id]) {
                resolve(this.detailsMap[id])
            } else {
                get(`/topic/${id}`, {
                    mdrender: false
                }).then(resp => {
                    if(resp.success) {
                        const topic = new Topic(createTopic(resp.data))
                        this.details.push(topic)
                        resolve(topic)
                    } else {
                        reject ()
                    }
                }).catch(reject)
            }
        })
    }
    @action createTopic(title, tab, content) {
        return new Promise((resolve, reject) => {
            post('/topics', {
                needAccessToken: true
            }, {
                title,
                tab,
                content
            }).then(resp => {
                if(resp.success) {
                    const topic = {
                        title,
                        tab, 
                        content,
                        id: resp.topic_id,
                        create_at: Date.now(),
                    }
                    this.createdTopics.push(
                        new Topic(createTopic(topic))
                    )
                    resolve()
                } else {
                    reject()
                }
            }).catch(reject)
        })
    }
    toJson() {
        return {
            topics: this.topics,
            syncing: this.syncing,
            details: this.details,
        }
    }
}

export default TopicStore