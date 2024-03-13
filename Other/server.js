const uuid = require('uuid') // each minecraft message needs a unique uuid 

let actions = require("./data/actions.json") 
const {token,channelId,waitTime,choiceCount} = require('./data/settings.json') // get settings and actions

const {Client, GatewayIntentBits, EmbedBuilder} = require('discord.js') // setup discord
const client = new Client({intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessages,GatewayIntentBits.GuildMessageReactions]})
const channel = client.channels.cache.get(channelId)

const numToEmoji = ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣']
const wait = waitTime * 1000 // convert the wait time to seconds instead of mili-seconds

const ws = require('ws')
const websocket = new ws.WebSocket.Server({
    port: 3000
})
console.log('/connect localhost:3000') // open the minecraft websocket

websocket.on('connection',function connection(socket) { // when minecraft connects run the first poll
    async function runPoll() {
        let Fields = []
        let ChosenActions = []

        for (let i = 0; i < choiceCount; i ++) {
            const actionIndex = Math.floor(Math.random() * actions.length)
            ChosenActions.push(actions[actionIndex])

            Fields.push(
                {
                    "name": numToEmoji[i]+actions[actionIndex].Name,
                    "value": actions[actionIndex].Description
                }
            )
            
            actions.splice(actionIndex,1)
        } // Chose all actions to be voted on

        const embed = new EmbedBuilder()
        .setTitle("Chaos Events")
        .setFields(Fields)
        .setColor(0x7289DA);

        const message = await channel.send({embeds: [embed]})

        ChosenActions.forEach(async action=> {
             actions.push(action) // allow action to be chosen again
             try {
                await message.react(numToEmoji[ChosenActions.indexOf(action)])
             } catch (error) {
                console.log(error)
             }
            }
        ) // add reactions


        setTimeout(async ()=> {
            var HighestVotes = 0
            var VotedAction
            ChosenActions.forEach(async action=> {
               const Votes = message.reactions.cache.get(numToEmoji[ChosenActions.indexOf(action)]).count
               if (Votes > HighestVotes) {
                HighestVotes = Votes
                VotedAction = action
               }
            }) // get the highest voted action

            VotedAction.Commands.forEach(cmd=>{
                const msg = {
                    "header": {
                        "version": 1,
                        "requestId": uuid.v4(),
                        "messagePurpose": "commandRequest",
                        "messageType": "commandRequest"
                    },
                    "body": {
                        "commandLine": cmd,
                        "origin": {
                            "type": "player"
                        }
                    }
                }
                socket.send(JSON.stringify(msg))
            }) // preform highest voted action

            runPoll() // do it all again
        },wait)
        }
    runPoll()
})

client.login(token) // this logs in the discord bot
