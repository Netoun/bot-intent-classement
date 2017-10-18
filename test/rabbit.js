import 'process'

import test from 'ava'
import proxyquire from 'proxyquire'
import { fakeConnexion } from 'rabbitmock'
import { assertQueue, sendTo } from '../src/rabbitUtils'

proxyquire.noPreserveCache()

test.beforeEach(() => {
    process.env.RABBIT_EXCHANGE = 'exchange'
    process.env.RABBIT_INTENT_API_BINDING = 'api.binding'
    process.env.RABBIT_INTENT_CLASSEMENT_QUEUE = 'none.queue'
    process.env.RABBIT_INTENT_CLASSEMENT_BINDING = 'none.binding'
})

test(t => {
    const message = 'test'
    assertQueue(fakeConnexion, (msg) => t.deepEqual(message, msg.content))
    return fakeConnexion.then((conn) => conn.sendToConsumer('none.queue', '{ "content" : "' + message + '"}'))
})

test(t => {
    const message = 'test'
    sendTo(fakeConnexion, message)
    return fakeConnexion.then((conn) => {
        t.deepEqual(new Buffer(message), conn.getPublished()[0].buffer)
    })
})

test(t => {
    const connexion = { connect: true }
    const amqplibMock = { 'amqplib/callback_api': { 'connect': (url, fn) => fn('', connexion) } }
    const rabbitConnexion = proxyquire('../src/rabbitConnexion', amqplibMock)
    return rabbitConnexion.connexion().then((conn) => {
        t.deepEqual(connexion.connect, conn.connect)
    })

})