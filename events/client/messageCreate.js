const client = require("../../index");
const dbs = require('quick.db')
const  config = require("../../config.json");
const ms = require("ms")


client.on("messageCreate", async (message) => {
    
  
    let prefix = dbs.get(`prefix_${message.guild.id}`)
    if(!prefix) {
        prefix = config.prefix
    }
    if (
        message.author.bot ||
        !message.guild ||
        !message.content.toLowerCase().startsWith(prefix)
    )
        return;
      
                if (message.author.bot) return;
               

                if (message.content.includes("@here") || message.content.includes("@everyone") || message.type == "REPLY") return;
            
                if (message.mentions.has(`${message.guild.id}`) && !message.author.bot) {
                    message.channel.send(`Mon prefix sur ce serveur est ${prefix} `);
                }
            
            
                const [cmd, ...args] = message.content 
                    .slice(prefix.length)
                    .trim()
                    .split(/ +/g);
                const Discord = require('discord.js')
            const db = require("quick.db")
            
                const command = client.commands.get(cmd.toLowerCase()) || client.commands.find(c => c.aliases?.includes(cmd.toLowerCase()))
                if(!command) return;
               
          
                
            
            
                if (command) {
                
                    
                 
                    if(!message.guild.me.permissions.has(command.BotPerms  ||[])) return message.channel.send(`J'ai besoin de \`${command.BotPerms || []}\`permissions`)
                await command.run(client, message, args, Discord)
    
               
            
            
            }

            
           
})


