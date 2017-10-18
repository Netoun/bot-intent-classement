import { connexion } from './rabbitConnexion'
import { assertQueue, sendTo } from './rabbitUtils'
import { logic } from './logic'

const connexionEstablished = connexion()

assertQueue(connexionEstablished, ($message) => {
    sendTo(connexionEstablished, JSON.stringify(logic($message)))
})
