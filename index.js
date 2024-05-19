const config = require('./config.json');
const Discord = require('discord.js');
var os = require('os-utils');
var osu = require('node-os-utils')
const { readdirSync } = require('fs');
const { Client, Collection, Intents, MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const fetch = import(`node-fetch`);
const axios = require('axios'); // Import axios library
const fs = require('fs');


const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Intents.FLAGS.GUILD_INTEGRATIONS,
        Intents.FLAGS.GUILD_WEBHOOKS,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MESSAGE_TYPING,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        Intents.FLAGS.DIRECT_MESSAGE_TYPING
    ],
    partials: ['USER', 'CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'REACTION']
});

const firebase = require('firebase');
const firebaseConfig = {
    databaseURL: `${config.firebaseURL}`,
};
firebase.initializeApp(firebaseConfig);

client.commands = new Collection();
const commands = readdirSync("./commands/").filter(file => file.endsWith(".js"));

for (const file of commands) {
    try {
        const props = require(`./commands/${file}`);
        client.commands.set(props.name, props);
    } catch (e) {
        console.error(`Unable to load command ${file}: ${e}`);
    }
}

client.once('ready', () => {
    client.user.setActivity('for /help!', { type: 'WATCHING' });

    let slashCommands;

    slashCommands = client.application?.commands;

    slashCommands?.create({
        name: 'help',
        description: 'Shows command list.'
    });

    slashCommands?.create({
        name: 'botinfo',
        description: 'Debug Information'
    });

    slashCommands?.create({
        name: 'link',
        description: 'Links a user with their Roblox account.',
    });

    slashCommands?.create({
        name: 'unlink',
        description: 'Unlinks a user with their Roblox account.',
    });
    slashCommands?.create({
        name: 'role',
        description: 'Unlinks a user with their Roblox account.',
    });

    slashCommands?.create({
        name: 'modules',
        description: 'Shows you a list of all available Modules',
    });

    slashCommands?.create({
        name: 'quota',
        description: 'View your Quota Completion.',
    });

    slashCommands?.create({
        name: 'update',
        description: 'Updates a users roles and nickname.',
        options: [
            {
                name: 'user',
                description: 'The Discord user to update.',
                required: false,
                type: 'USER'
            }
        ]
    });

    slashCommands?.create({
        name: 'view',
        description: 'View a members account information.',
        options: [
            {
                name: 'user',
                description: 'The Discord user to view.',
                required: false,
                type: 'USER'
            }
        ]
    });

    slashCommands?.create({
        name: 'xp',
        description: 'View the XP of a member.',
        options: [
            {
                name: 'user',
                description: 'The Discord user to view.',
                required: false,
                type: 'USER'
            }
        ]
    });

    slashCommands?.create({
            name: 'setup',
            description: 'Sets up the bot for the Server.',
            
    });

    slashCommands?.create({
        name: 'xpadd',
        description: 'Add XP To a user',
        options: [
            {
                name: 'users',
                description: 'The Discord users to manage.',
                required: true,
                type: 'STRING', 
            },
            {
                name: 'amount',
                description: 'The XP amount to add.',
                required: true,
                type: 'NUMBER'
            }
        ]
    });
    
    
    slashCommands?.create({
        name: 'xpremove',
        description: 'Remove xp from a User.',
        options: [
            {
                name: 'users',
                description: 'The Discord user to manage.',
                required: true,
                type: 'STRING',
            },
            {
                name: 'amount',
                description: 'The XP amount to add.',
                required: true,
                type: 'NUMBER'
            }
        ]
        });

});





client.on('interactionCreate', async (interaction) => {
    if (interaction.isCommand()) {
        const { commandName } = interaction;
        const command = client.commands.get(commandName);
        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            const embed = new MessageEmbed()
                .setTitle(`Error`)
                .setDescription(`**Command:** ${commandName}\n**Error:** ${error}`)
                .setColor('#ff0000')
                .setTimestamp();
            
            const { WebhookClient } = require('discord.js');
            const { errorwebhookid, errorwebhooktoken } = require('./config.json');

            const webhookClient = new WebhookClient({ id: errorwebhookid, token: errorwebhooktoken });
            webhookClient.send({
                content: 'Error',
                username: 'Error Log',
                avatarURL: 'https://media.discordapp.net/attachments/1236040861922623589/1236041242023039076/Untitled507_20230916101939.png?ex=663f225c&is=663dd0dc&hm=24e39c6f8999f83c022d58ef4d1171444040e8a446813b1b2f88e2ec1580fd5f&=&format=webp&quality=lossless&width=372&height=350',
                embeds: [embed],
            });

            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }

    const logChannelId = config.InteractionLogChannelid;
    const logChannel = client.channels.cache.get(logChannelId);
    if (!logChannel) {
        console.error(`Could not find channel with ID ${logChannelId}`);
        return;
    }

    const { body } = await snekfetch.get(`${config.firebaseURL}Interactions.json`);
    const latest_acknowledged = body.latest || 0; 
    const updated_latest = latest_acknowledged + 1; 
    
    const Interaction_ID = updated_latest; 
    const embed = new MessageEmbed()
    .setTitle(`Interaction Log`)
    .setDescription(`**interactionID:** ${Interaction_ID}\n**channel:** ${interaction.channel.name}\n**channelid:** ${interaction.channel.id}\n**command:** ${interaction.commandName}\n**commandid:** ${interaction.commandID}\n**guild:** ${interaction.guild.name}\n**guildID:** ${interaction.guild.id}\n**username:** ${interaction.user.tag}\n**userid:** ${interaction.user.id}\n**Version:** v2`)
    .setColor('#ff0000')
    .setTimestamp();


        


        const guildId = interaction.guild.id

const newData = {
        "interactionID": Interaction_ID,
        "channel": interaction.channel.name,
        "channelid": interaction.channel.id,
        "command": interaction.commandName,
        "commandid": "test", // Use commandID instead of commandid
        "guild": interaction.guild.name, 
        "guildID": interaction.guild.id, 
        "userid": interaction.user.id,
        "username": interaction.user.tag,
        "Version": "v2",
        //"options": interaction // Include only the options the user used in the command
};
        

    firebase.database().ref(`Interactions/Logs/${Interaction_ID}`).set(newData)
    .then(() => {
        console.log('Data set successfully.');
    })
    .catch((error) => {
        console.error('Error setting data:', error);
    });
    firebase.database().ref(`Interactions/`).update({ "latest": updated_latest }); 

    logChannel.send({ embeds: [embed], content: `ID: ${updated_latest}` });

});





async function getCpuUsage() {
return `42`
}
    

function getBotStartupTime() {
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    return `${hours}h ${minutes}m ${seconds}s`;
}

function getOperatingSystem() {
    const os = require('os');
    return os.platform();
}

function getServerUptime() {
    const botStartTime = new Date(); 
    const currentTime = new Date();
    const uptimeMilliseconds = currentTime - botStartTime;
    const uptimeSeconds = Math.floor(uptimeMilliseconds / 1000);
    const hours = Math.floor(uptimeSeconds / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const seconds = uptimeSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
}

function getFreeMemory() {
    const os = require('os');
    const freeMemory = os.freemem();
    return `${(freeMemory / (1024 * 1024)).toFixed(2)} MB`;
}

function getTotalMemory() {
    const os = require('os');
    const totalMemory = os.totalmem();
    return `${(totalMemory / (1024 * 1024)).toFixed(2)} MB`;
}

client.on('ready', () => {
    const StatusChannelId = config.StatusChannelId;
    const StatusChannel = client.channels.cache.get(StatusChannelId);
    console.log(`${client.user.tag} Booted`);


    const embed = new Discord.MessageEmbed()
    .setTitle('Quantum OS Booted')
    .setColor(16711680)
    .addFields(
       // { name: 'Cpu Usage:', value: getCpuUsage() },
        { name: 'Bot Startup Time', value: getBotStartupTime() },
        { name: 'Operating System:', value: getOperatingSystem() },
        { name: 'Server Uptime:', value: getServerUptime() },
        { name: 'Free Memory:', value: getFreeMemory() },
        { name: 'Total Memory:', value: getTotalMemory() },
        { name: 'Api Key:', value: '7jD-f2nG9R-5aP3-sL8eVX' }
    )

if (StatusChannel) {
    StatusChannel.send({ embeds: [embed] });
} else {
    console.error('Could not find the specified channel.');
}
});

const express = require('express'); 
const app = express(); 
const http = require('http'); 
const { error } = require('console');
const { message } = require('noblox.js');
const server = http.createServer(app); 

app.get('/', (req, res) => {
  res.send('Testing...'); 
});

server.listen(3000, () => { });



// Final Login lol
client.login(config.token);

