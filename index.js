const { Client, Collection,MessageEmbed } = require("discord.js");
const config = require('./config.json')

const client = new Client({
	partials : ["MESSAGE","GUILD_MEMBER","CHANNEL","USER","GUILD_SCHEDULED_EVENT","REACTION"],
    intents: 32767,
});

const db = require("quick.db")
client.setMaxListeners(0)
module.exports = client;


// Global Variables
client.commands = new Collection();
client.guildInvites = new Map();
client.config = require("./config.json")
client.prefix = client.config.prefix
client.aliases = new Collection();


//Bot ping
client.embed =  (options) => {

    return new Promise((resolve, reject) => {
        let embed = new MessageEmbed()
        .setDescription(options.description)
        .setColor("#2F3136")
        if(!options.noTimestamp) embed.setTimestamp()
        if(options.title) embed.setTitle(options.title)
        resolve(embed)
    }
    )
}


client.on('messageCreate', async (message,args) => {
   
       let prefix = db.get(`prefix_${message.guild.id}`)
    if(!prefix) {
        prefix = config.prefix
    }
        const prefixMention = new RegExp(`^<@!?${client.user.id}>( |)$`);
        if(message.content.match(prefixMention)) {
            return message.reply(`*Mon prefix sur ce serveur est* ${prefix}`)
        }
})



// Initializing the project
require("./handler")(client);
require('./handler/anti-crash')(client);

client.login(client.config.token);


