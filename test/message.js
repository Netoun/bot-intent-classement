import test from 'ava'
import { logic } from '../src/logic'
test(t => {
    const response = logic({ message: { content: 'test' }, luis: {} })
    t.deepEqual('Je n\'ai pas réussi à trouver votre championnat', response.message.content)
})

test(t => {
    logic({ message: { content: 'test' }, luis: { entities: { type: 'classementFr' } } })
    t.pass()
})