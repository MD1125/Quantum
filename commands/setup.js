const { MessageActionRow, MessageButton, MessageSelectMenu, ModalBuilder, Events, MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const firebase = require('firebase');
const config = require('../config.json');
const noblox = require('noblox.js');

module.exports = {
    name: 'setup',
    async execute(interaction) {
        const { options, member, guild } = interaction;
        interaction.reply('This Command is Currently Unavailable');
        const userid = member.id;

        // Define the data structure to add (I will change this in the future while i add more Modules)

        function generateRandomCode() {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let code = '';
            for (let i = 0; i < 3; i++) {
                const randomIndex = Math.floor(Math.random() * characters.length);
                code += characters.charAt(randomIndex);
            }
            console.log(code)
            return Buffer.from(code).toString('base64');
        }
        
        function generateserverid() {
            const guildId = interaction.guild.id;
            const tokenData = `${guildId}`;
            const serverid = Buffer.from(tokenData).toString('base64');
            console.log(serverid)
            return serverid;
        }
        
        function generatetime() {
            const currentTimeMillis = Date.now();
            const unixTimestampSeconds = Math.floor(currentTimeMillis / 1000);
            const discordEpochTimestamp = unixTimestampSeconds - 1420070400;
            const encodedTimestamp = Buffer.from(discordEpochTimestamp.toString()).toString('base64');
            console.log(encodedTimestamp)
            return encodedTimestamp;
        }

        const server = generateserverid()
        const timestamp = generatetime()
        const randomCode = generateRandomCode();
        
        const trimmedServer = server.slice(0, -2);
        const trimmedTimestamp = timestamp
        const encodedRandomCode = randomCode
        
        const databasetoken = `${trimmedServer}.${trimmedTimestamp}.${encodedRandomCode}`
        console.log("Generated Token:", databasetoken);
        
        
        const dataToAdd = {
            "ASSET_BIND_MODULE": {
                "BINDS": {
                    "GROUP_BINDS": "",
                    "GROUP_RANK_BINDS": "",
                    "RANK_BINDS": ""
                }
            },
            "DATABASE_TOKEN": {
                "TOKEN": `${databasetoken}`
            },
            "RANK_MODULE": {
                "RANKS": "",                
                "USER_DATA": ""
            },
            "VERIFICATION_MODULE": "",
            "XP_MODULE": {
                "USER_DATA": ""
            },
            "LOG_CHANNEL": {
                "CHANNEL_ID": ""
            },
            "modules": {
                "asset": false,
                "rank": false,
                "verification": false,
                "xp": false
            }
        };

        //setup embeds
        const page1 = new MessageEmbed()
        .setTitle("Setup Manager")
        .setDescription("You will be asked to configure a few modules and channels etc. If you dont want to configure something right away you can press the Skip button below. You can change these in the future though")
        .setColor('0xFFFF00')
        const page2 = new MessageEmbed()
        .setTitle("Log Channel")
        .setDescription("Do you want the bot to log all its used Functions etc. in one channel?")
        .setColor('0xFFFF00')




        //setup messageActionRows
        const page1row = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setCustomId('startprogress')
            .setLabel('Start')
            .setStyle('PRIMARY'),
        );
        const page2row = new MessageActionRow()
            .addComponents(
                new ModalBuilder()
                    .setCustomId('logchannel')
                    .setTitle('Log Channel ID')
                    .setPlaceholder('Select a channel')
                    .addOptions([
                        {
                            label: 'Channel 1',
                            value: 'channel1',
                        },
                        {
                            label: 'Channel 2',
                            value: 'channel2',
                        },
                        // Add more channels as needed
                    ]),
                new MessageButton()
                    .setCustomId('startprogress')
                    .setLabel('Start')
                    .setStyle('PRIMARY')
            );
        

        const alreadyconfigured = new MessageEmbed()
        .setTitle("Configuration Menu.")
        .setDescription("Select What you want to Change or See Below")
        .setColor('0xFFFF00')
        const row = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
                .setCustomId('module_select')
                .setPlaceholder('Select a module...')
                .addOptions([
                    {
                        label: 'Log Channel',
                        value: 'logchannel'
                    },
                    {
                        label: 'Database Token',
                        value: 'databasetoken'
                    },
                    {
                        label: '',
                        value: 'asset'
                    },
                    {
                        label: 'Rank System',
                        value: 'rank'
                    }
                ])
        );


        const response = await snekfetch.get(`${config.firebaseURL}guilds/${guild.id}.json`);


        interaction.reply({ embeds: [page1], components: [page2row], ephemeral: false }).then(message => {
            const filter = i => i.user.id === member.id;
            const collector = interaction.channel.createMessageComponentCollector({ filter, componentType: 'BUTTON', time: 300000 });
        
            collector.on('collect', async i => {
                i.deferUpdate();
        
                if (i.customId === 'delete') {
                    if (!interaction.replied) { // Check if interaction has already been replied to
                        interaction.editReply({ embeds: [page2], components: [], ephemeral: false })
                        firebase.database().ref(`deletion/${member.id}`).set(timestamp);
                    }
                } else if (i.customId === 'delete_now') {
                    if (!interaction.replied) { // Check if interaction has already been replied to
                        interaction.editReply({ embeds: [page3], components: [], ephemeral: false })
                        await member.roles.remove(verifiedRole);
                        firebase.database().ref(`verified/${userid}`).set({});
                        firebase.database().ref(`deletion/${member.id}`).set({});
                    }
                } else if (i.customId === 'cancel') {
                    if (!interaction.replied) { // Check if interaction has already been replied to
                        interaction.editReply({ embeds: [page5], components: [], ephemeral: false })
                        firebase.database().ref(`deletion/${member.id}`).set({});
                    }
                };
            });
        
            collector.on('end', async i => {
                console.log('canceled deletion');
                if (!interaction.replied) { // Check if interaction has already been replied to
                    interaction.editReply({ embeds: [page4], components: [], ephemeral: false });
                }
                firebase.database().ref(`deletion/${member.id}`).set({});
            });
        });
        if (response.body !== null) {
            interaction.reply("Server Already Setup");
        } else {
            interaction.reply("Configured Database!");
            // If not set up, add the data to Firebase (Self Explaining)
            firebase.database().ref(`guilds/DATABASE_TOKENS/${guild.id}`).update(databasetoken)
            firebase.database().ref(`guilds/DATABASE_TOKENS/${databasetoken}`).update(guild.id)
            firebase.database().ref(`guilds/${guild.id}`).update(dataToAdd, (error) => {
                if (error) {
                    console.error("Error adding data:", error);
                } else {
                    console.error("Registered Guild");
                }
            });
        }
    },
};
