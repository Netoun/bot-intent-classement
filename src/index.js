import { connexion } from './rabbitConnexion'
import { assertQueue, sendTo } from './rabbitUtils'
import { logic } from './logic'

const connexionEstablished = connexion()

assertQueue(connexionEstablished, ($message) => {
    logic($message).then(response => {
        sendTo(connexionEstablished, JSON.stringify(response))
    })
})