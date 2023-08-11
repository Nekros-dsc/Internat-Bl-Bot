const { switchOwners } = require("../../functions/ownerWl")
const db = require("quick.db")
const discord = require('discord.js')


module.exports = {
    name : "blacklist",
    description : "blacklist un utilisateur",
    aliases : ["bl"],
    run : async(client, message, args) => {
        let ownerData = db.get(`owners_${client.user.id}`) || []
        let wlData = db.get(`whitelists_${client.user.id}`) || []
        if ((!ownerData || !ownerData.find(x => x.user === message.author.id)) && (!wlData || !wlData.find(x => x.user === message.author.id)) && (client.config.ownerID !== message.author.id)) {
            return;
        }
          
     
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
                let reason = args[2]
                if(!reason) reason = "sans raison"
                let data = db.get(`blacklist_${client.user.id}`)
                if(data && data.find(x => x.user === user.id)) {
                    let options = {
                        description : `${user} est déjà blacklist`,
                        noTimestamp : true
                    }
                    let isAlready = await  client.embed(options)
                    return message.channel.send({embeds: [isAlready]})
                }
         
                if(wlData && wlData.find(x => x.user === user.id)) {
                    let options = {
                        description : `${user} est dans la whitelist`,
                        noTimestamp : true
                    }
                    let isAlready = await  client.embed(options)
                    return message.channel.send({embeds: [isAlready]})
                }
                if(ownerData && ownerData.find(x => x.user === user.id)) {
                    let options = {
                        description : `${user} est dans owner`,
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
                db.set(`blacklist_${client.user.id}`, data)
                let guilds = client.guilds.cache.filter(x=> x.members.cache.get(user.id))
                guilds = [...guilds.values()]
                for (let i = 0; i < guilds.length; i++) {
                    let guild = await client.guilds.cache.get(guilds[i].id)
                    let member = await guild.members.cache.get(user.id)
                    if(!member) return;
                    member.ban({reason: "Blacklist"}).catch(e => {})
                }


                let options2 = {
                    description : `${user} est maintenant blacklist pour **${reason}**`,
                    noTimestamp : true
                }
                let embed = await  client.embed(options2)
                message.channel.send({embeds: [embed]})
                break;
            case "remove":
                await client.users.fetch(args[1]).catch(e=> (false)) 
                if(!user2) return message.channel.send("Veuillez mentionner un **utilisateur**").then(m => m.delete({timeout: 8000}).catch(e => {}))
                let data2 = db.get(`blacklist_${client.user.id}`)
                if(!data2 || !data2.find(x => x.user === user2.id)) {
                    let options = {
                        description : `${user2} n'est pas blacklist`,
                        noTimestamp : true
                    }
                    let embedAlready = await  client.embed(options)
                    return message.channel.send({embeds: [embedAlready]})

                }
                let newData = data2.filter(x => x.user !== user2.id)
                db.set(`blacklist_${client.user.id}`, newData)
                let options3 = {
                    description : `${user2} n'est plus blacklist`,
                    noTimestamp : true,
                }
                let embed2 = await  client.embed(options3)
                message.channel.send({embeds: [embed2]})
                break;
            case "list":
                let data3 = db.get(`blacklist_${client.user.id}`)
                if(!data3 || data3.length == 0) {
                    let options = {
                        description : `Il n'y a personne dans la blacklist`,
                        noTimestamp : true
                    }

                    let embedAlready = await  client.embed(options)
                    return message.channel.send({embeds: [embedAlready]})

                }
                if(data3.length > 10) {
                    let msg = await message.channel.send("Veuillez patienter...")
                    colB.on('collect', async (b) => {
                        if(b.customId == "next" + msg.id){
                            await b.deferUpdate()
                            let page = b.message.components[0].components[1].label.split("/")[0]
                            page ++
                            switchOwners(data3,msg,page,"blacklist")
                        }
                        if(b.customId == "previous" + msg.id){
                            await b.deferUpdate()
                            let page = b.message.components[0].components[1].label.split("/")[0]
                            page --
                            switchOwners(data3,msg,page,"blacklist")
                        }
    
                    })
                    return;
                } else {
                    let embed = new discord.MessageEmbed()
                    .setTitle("Utilisateur blacklist")
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
