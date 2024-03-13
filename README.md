Hello! This is a bot that hosts polls in a dedicated discord channel and based on the votes decides what action to do to the plauyer. You can make custom actions by adding to the actions.js file

MAKE SURE YOU HAVE NODE.js

To use this mod, you'll first need to setup a discord bot and put its token in the settings.json file. DO NOT SHARE THIS TOKEN WITH ANYONE ELSE!!!

You will also need to enter the channel id that the bot will host the polls in, make sure the bot has access to this channel and has permissions to: Send Messages, Add Reactions and View Messages. It does not need to see message content though.

Next you want to open server.js and use: 'npm install discord.js' 'npm install uuid' 'npm install ws' and then 'node server.js'

Then go to your minecraft world with the BP and RP applied and type into chat "/connect localhost:3000"
