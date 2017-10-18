import request from 'request'
import fs from 'fs'

export const logic = ($message) => {

    const token = process.env.FOTBALL_TOKEN

    if (!$message.luis.entities || !$message.luis.entities.type) {
        const newMessage = Object.assign($message.message, { content: 'Je n\'ai pas réussi à trouver votre championnat' })
        return Object.assign($message, { message: newMessage })

    }

    var obj = JSON.parse(fs.readFileSync('league.json', 'utf8'))

    function checkNameforId(element) {
        return element.name === $message.luis.entities.type
    }

    let idLeague = obj.league.find(checkNameforId)

    var options = {
        method: 'GET',
        url: 'http://api.football-data.org/v1/competitions/' + idLeague.id + '/leagueTable',
        headers: { 'X-Auth-Token': token }
    }

    request(options, function (error, response, body) {
        if (error) throw new Error(error)
        let jsonData = JSON.parse(body)
        let classement = 'Voici le classement de ' + jsonData.leagueCaption + ' :  \n\n'
        classement += jsonData.standing.reduce(function (tab, value) {
            return tab + value.position + ' : ' + value.teamName + '   ' + value.points + '\n'
        }, ' ')


        const newMessage = Object.assign($message.message, { content: classement })
        return Object.assign($message, { message: newMessage })

    })
}