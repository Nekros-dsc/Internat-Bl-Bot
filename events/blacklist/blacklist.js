const client = require("../../index")
const db = require("quick.db")

client.on("guildMemberAdd", async(member) => {
    let data = db.get(`blacklist_${client.user.id}`)
    if(data && data.find(x => x.user === member.id)) {
        member.ban({reason: "Blacklist"}).catch(e => {})
    }
})
