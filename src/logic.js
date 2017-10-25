import request from 'request'
import { league } from './league'

export const logic = ($message) => {
    return new Promise((resolve, reject) => {

        const token = process.env.FOOT_TOKEN

        if (!token || $message.luis.entities.length === 0 && !$message.luis.entities[0].type) {
            const newMessage = Object.assign($message.message, { content: 'Je n\'ai pas réussi à trouver votre championnat' })
            resolve(Object.assign($message, { message: newMessage }))
            return
        }
        console.log($message.luis.entities[0].type)

        const idLeague = league.find(leagues => {
            return leagues.name === $message.luis.entities[0].type
        }).id


        var options = {
            method: 'GET',
            url: 'http://api.football-data.org/v1/competitions/' + idLeague + '/leagueTable',
            headers: { 'X-Auth-Token': token }
        }

        request(options, function(error, response, body) {
            if (error) {
                const newMessage = Object.assign($message.message, { content: "J'ai eu un problème quand j'ai voulu récupéré les résultats ..." })
                resolve(Object.assign($message, { message: newMessage }))
            }

            let jsonData = JSON.parse(body)
            let classement = 'Voici le classement de ' + jsonData.leagueCaption + ' :  \n\n'
            classement += jsonData.standing.reduce(function(tab, value) {
                return tab + value.position + ' : ' + value.teamName + '   ' + value.points + '\n'
            }, ' ')

            console.log(classement)

            const newMessage = Object.assign($message.message, { content: classement })
            resolve(Object.assign($message, { message: newMessage }))
        })
    })
}
