const { glob } = require("glob");
//glob version 7.1.7
const { promisify } = require("util");
const { Client } = require("discord.js");


const globPromise = promisify(glob);

/**
 * @param {Client} client
 */
module.exports = async (client) => {
    // Commands
    
    const commandfiles = await globPromise(`${process.cwd()}/commands/**/*.js`);
    commandfiles.map((value) => {
        const file = require(value);
        const splitted = value.split("/");
        const directory = splitted[splitted.length - 2];

        if (file.name) {
            const properties = { directory, ...file };
            client.commands.set(file.name, properties)
        }
        if (file.aliases) {
            const properties = { directory, ...file };
            client.commands.set(file.aliases, properties)
        }
    });


    // Events
    const eventFiles = await globPromise(`${process.cwd()}/events/**/*.js`);
    eventFiles.map((value) => require(value));


  
};
