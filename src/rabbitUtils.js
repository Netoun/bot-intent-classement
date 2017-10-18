const getEnv = () => {
    return {
        exchange: process.env.RABBIT_EXCHANGE,
        queue: process.env.RABBIT_INTENT_CLASSEMENT_QUEUE,
        binding: process.env.RABBIT_INTENT_CLASSEMENT_BINDING,
        apiKey: process.env.RABBIT_INTENT_API_BINDING
    }
}

export const assertQueue = (connexion, callback) => {

    const env = getEnv()
    connexion.then(conn => {
        conn.createChannel(function (err, ch) {
            ch.assertExchange(env.exchange, 'topic', { durable: true })
            ch.assertQueue(env.queue, { durable: false }, function (err, q) {
                console.log(' [*] Waiting for logs. To exit press CTRL+C')

                ch.bindQueue(q.queue, env.exchange, env.binding)
                ch.consume(q.queue, function (msg) {
                    callback(JSON.parse(msg.content.toString()))
                }, { noAck: true })
            })
        })
    })
}

export const sendTo = (connexion, message) => {

    const env = getEnv()
    connexion.then(conn => {
        conn.createChannel(function (err, ch) {
            ch.assertExchange(env.exchange, 'topic', { durable: true })
            ch.publish(env.exchange, env.apiKey, new Buffer(message))
            console.log(' [x] Sent %s:\'%s\'', env.apiKey, message)
        })
    })
}