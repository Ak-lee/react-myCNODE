import axios from 'axios'

const baseUrl = process.env.API_BASE || ''

const parseUrl = (url, params) => {
    if(params) {
        const str = Object.keys(params).reduce((result, key) => {
            result += `${key}=${params[key]}&`
            return result
        }, '')
        return `${baseUrl}/api${url}?${str.substr(0, str.length - 1)}`
    } else {
        return `${baseUrl}/api${url}`
    }
}

export const get = (url, params) => {
    return new Promise((resolve, reject) => {
        axios.get(parseUrl(url, params))
            .then((response) => {
                const data = response.data
                if (data && data.success === true) {
                    resolve(data)
                } else {
                    reject(data)
                }
             }).catch(reject)
    })
}

export const post = (url, params, data) => {
    return new Promise((resolve, reject) => {
        axios.post(parseUrl(url, params), data)
            .then(response => {
                const data = response.data
                if(data && data.success === true ) {
                    resolve(data)
                } else {
                    reject(data)
                }
            }).catch(reject)
    })
}