const fs = require('fs')
module.exports = (pathname) => {
    return new Promise((resolve, reject) => {
        fs.readFile(pathname, (error, result) => {
            if (error) {
                reject(error)
            } else {
                resolve(result)
            }
        })
    })

}