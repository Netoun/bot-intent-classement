const exchange = process.env.RABBIT_EXCHANGE s
const apiKey = process.env.RABBIT_INTENT_API_BINDING 
const queue = process.env.RABBIT_INTENT_CLASSEMENT_QUEUE 
const binding = process.env.RABBIT_INTENT_CLASSEMENT_BINDING 

export const assertQueue = (connexion, callback) => {
    connexion.then(conn => {
        conn.createChannel(function(err, ch) {
            ch.assertExchange(exchange, 'topic', { durable: true })
            ch.assertQueue(queue, { durable: false }, function(err, q) {
                console.log(' [*] Waiting for logs. To exit press CTRL+C')

                ch.bindQueue(q.queue, exchange, binding)
                ch.consume(q.queue, function(msg) {
                    callback(JSON.parse(msg.content.toString()))
                }, { noAck: true })
            })
        })
    })
}

export const sendTo = (connexion, message) => {
    connexion.then(conn => {
        conn.createChannel(function(err, ch) {
            ch.assertExchange(exchange, 'topic', { durable: true })
        
            ch.publish(exchange, apiKey, new Buffer(message))
            console.log(' [x] Sent %s:\'%s\'', apiKey, message)
        })
    })
}