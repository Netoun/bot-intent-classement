import amqp from 'amqplib/callback_api'
const user = process.env.RABBIT_USER
const host = process.env.RABBIT_HOST
const port = process.env.RABBIT_PORT 
const password = process.env.RABBIT_PASSWORD 

export const connexion = () => {
    return new Promise((resolve, reject) => {
        const URL = 'amqp://' + user + ':' + password + '@' + host + ':' + port
        amqp.connect(URL, function(err, conn) {
            if (err) {
                reject(new Error('Connection refusée'))
            }
            resolve(conn)
        })
    })
}