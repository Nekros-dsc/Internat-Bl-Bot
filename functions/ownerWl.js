const discord = require("discord.js");
const client = require("../index");


async function switchOwners(data, message,page,name) {
    if(!name){
        name = "owners"
    }
  
    let itemsPerPage = 10;
    let maxPage = Math.ceil(data.length / itemsPerPage);
  
    let startIndex = (page - 1) * itemsPerPage;
    let endIndex = Math.min(startIndex + itemsPerPage, data.length);
    let pageData = data.slice(startIndex, endIndex);
  
    let buttonNext = new discord.MessageButton()
      .setCustomId("next" + message.id)
      .setLabel("▶️")
      .setStyle("PRIMARY")
        .setDisabled(page === maxPage);
  
    let buttonPrevious = new discord.MessageButton()
      .setCustomId("previous" + message.id)
      .setLabel("◀️")
      .setStyle("PRIMARY")
      .setDisabled(page === 1)
  
    let pageButton = new discord.MessageButton()
      .setCustomId("page" + message.id)
      .setLabel( page + "/" + maxPage)
      .setStyle("SECONDARY")
      .setDisabled(true);
  
    let row = new discord.MessageActionRow()
      .addComponents(buttonPrevious, pageButton, buttonNext);
  
    let embed = new discord.MessageEmbed()
      .setTitle("Voici la liste des " + name)
      .setColor("#2F3136")
      .setFooter("Page " + page + "/" + maxPage);
  
     embed.setDescription(await
   Promise.all(    pageData.map(async (x, i) => {
            
            let user = await client.users.fetch(x.user);
            return `<@${user.id}>- \`${x.user}\` - *(${user.tag})*`;
        }) 

        ).then(x => x.join("\n"))
    );


   message.edit({content : null, embeds: [embed], components: [row] });

  }

  module.exports = {
   switchOwners,
    };  