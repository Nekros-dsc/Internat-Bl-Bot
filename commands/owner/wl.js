
const db = require("quick.db")
const discord = require('discord.js')
const { switchOwners } = require('../../functions/ownerWl')
module.exports = {
    name: 'whitelist',
    description: 'whitelist',
    aliases: ['whitelist',"wl"],
    run : async(client, message, args) => {
       let dataOwners = db.get(`owners_${client.user.id}`) || []
         if((!dataOwners || !dataOwners.find(x => x.user === message.author.id) && (client.config.ownerID !== message.author.id))) return;
        let type = args[0]
        if(!type) {
            type = "list"

        }
         const filterForIt = i=> i.user.id == message.author.id
        const colB = await message.channel.createMessageComponentCollector({filter : filterForIt, time: 500000,componentType : `BUTTON` })
     
        switch(type){
            case "add": 
            let user = message.mentions.members.first() || message.guild.members.cache.get(args[1])
            if(!user) return message.channel.send("Veuillez mentionner un **utilisateur**").then(m => m.delete({timeout: 8000}).catch(e => {}))
            let data = db.get(`whitelists_${client.user.id}`)
            if(data && data.find(x => x.user === user.id)) {
                let options = {
                    description : `${user} est déjà whitelist`,
                    noTimestamp : true
                }
                let isAlready = await  client.embed(options)
                return message.channel.send({embeds: [isAlready]})
            }
    
            if(!data) data = []
            data.push({
                user: user.id,
                date: Date.now()
            })

            db.set(`whitelists_${client.user.id}`, data)
            let options2 = {
                description : `${user} est maintenant whitelist`,
                noTimestamp : true
            }
           let embed = await  client.embed(options2)
            message.channel.send({embeds: [embed]})
            
            break;
            case "remove":
            let user2 = message.mentions.members.first() || message.guild.members.cache.get(args[1])
            if(!user2) return message.channel.send("Veuillez mentionner un **utilisateur**").then(m => m.delete({timeout: 8000}).catch(e => {}))    
            let data2 = db.get(`whitelists_${client.user.id}`)
            if(!data2 || !data2.find(x => x.user === user2.id)) {
                let options = {
                    description : `${user2} n'est pas whitelist`,
                    noTimestamp : true
                }
               let embedAlready = await  client.embed(options)
                return message.channel.send({embeds: [embedAlready]})

            }
            
            let newData = data2.filter(x => x.user !== user2.id)
            db.set(`whitelists_${client.user.id}`, newData)
            let options = {
                description : `${user2} n'est plus whitelist`,
                noTimestamp : true
            }
            let embedIsNowNotwhitelist = await client.embed(options)
            message.channel.send({embeds: [embedIsNowNotwhitelist]})

            break;
            case "list":
            let data3 = db.get(`whitelists_${client.user.id}`)
            if(!data3 || data3.length === 0)  {
                let options = {
                    description : "*Il n'y a aucun whitelists*",
                    title : "Voici la liste des whitelists",
                }
                let nowhitelists = await client.embed(options)
                return message.channel.send({embeds: [nowhitelists]})
            }
            if(data3.length > 10){
               let msg =  await message.channel.send({content : "Chargement.."})
                switchOwners(data3, msg, 1,"wl")
                colB.on('collect', async (b) => {
                    if(b.customId == "next" + msg.id){
                        await b.deferUpdate()
                        let page = b.message.components[0].components[1].label.split("/")[0]
                        page ++
                        switchOwners(data3,msg,page,"wl")
                    }
                    if(b.customId == "previous" + msg.id){
                        await b.deferUpdate()
                        let page = b.message.components[0].components[1].label.split("/")[0]
                        page --
                        switchOwners(data3,msg,page,"wl")
                    }

                })
                return;
            } else {
                let embed = new discord.MessageEmbed()
                .setTitle("Voici la liste des whitelists")
                .setColor("#2F3136")
                .setFooter("Page 1/1")
                .setDescription(await
                Promise.all(    data3.map(async (x) => {
                    let user = await client.users.fetch(x.user)
                    return  `<@${user.id}>- \`${x.user}\` - *(${user.tag})*`;

                }))
                .then(x => x.join("\n"))
                )

                message.channel.send({embeds: [embed]})
            }

            

        }
    }




}


  