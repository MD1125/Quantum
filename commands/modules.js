const { MessageActionRow, MessageSelectMenu, MessageEmbed, MessageButton } = require('discord.js');
const snekfetch = require('snekfetch');
const firebase = require('firebase');
const path = require('path');
const { error } = require('console');

//This script is not made simple because it was one of my first. But i wanted to keep it to learn from it
module.exports = {
    name: 'modules',
    async execute(interaction) {
        const { options, member, guild } = interaction;
        const userid = member.id;
        const config = require(path.resolve(__dirname, '..', 'config.json'));

        try {
            // Creating the initial embed message
            const page = new MessageEmbed()
                .setTitle("Available modules")
                .setDescription("Select a module to activate or configure:")
                .setColor(0x5d65f3)
                .addFields(
                    { name: "Verification System", value: "A system to verify users before granting them access to specific channels or roles." },
                    { name: "XP System", value: "A system to track and reward users with experience points based on their activity in the server." },
                    { name: "Asset Binds (Roblox/Discord)", value: "A system to link and synchronize assets or roles between Roblox and Discord." },
                    { name: "Rank System", value: "A system to assign and manage ranks or roles based on predefined criteria." }
                );

            // Creating action row for the select menu
            const row = new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                        .setCustomId('module_select')
                        .setPlaceholder('Select a module...')
                        .addOptions([
                            {
                                label: 'Verification System',
                                value: 'verification'
                            },
                            {
                                label: 'XP System',
                                value: 'xp'
                            },
                            {
                                label: 'Asset Binds',
                                value: 'asset'
                            },
                            {
                                label: 'Rank System',
                                value: 'rank'
                            }
                        ])
                );
                const row2 = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                    .setCustomId('back')                
                    .setLabel('test')
                    .setStyle('PRIMARY')
                );    

            // Sending the initial message with the select menu and storing the ID
            interaction.reply({ embeds: [page], components: [row], ephemeral: false });






            // Handling interaction
            const filter = (i) => i.user.id === userid;
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

            collector.on('collect', async i => {
                // Check if values property exists and is an array
                if (i.values && Array.isArray(i.values) && i.values.length > 0) {
                    const selectedModule = i.values[0];
                    console.log(`User selected module: ${selectedModule}`);
            
                    let moduleEmbed;
                    let buttons = null;
                    const body = await snekfetch.get(`${config.firebaseURL}guilds/${guild.id}/modules.json`);
                    switch (selectedModule) {
                        case 'verification':
                            moduleEmbed = new MessageEmbed()
                                .setTitle('Module Information • Verification System')
                                .setDescription('Verify Users with their Roblox Accounts and manage them within groups and or Create Group Binds')
                                .setColor('#00ff00');               
                                // Assuming 'guild' is defined elsewhere in your code
                                console.log(`${guild.id}`)
                                if (body.body.hasOwnProperty("verification")) {
                                    verification = body.body["verification"];
                                } 
                                console.log("Verification status:", verification); // Log verification status
                                
    
    
                                if (verification === true) {
                                    buttons = new MessageActionRow().addComponents(
                                        new MessageButton()
                                            .setCustomId('module_disable_verification')
                                            .setLabel('Module is enabled (click to disable)')
                                            .setStyle('PRIMARY'),
                                        new MessageButton()
                                            .setLabel('Go back')
                                            .setCustomId('back')
                                            .setStyle('SECONDARY')
                                    );
                                    console.log("Verification is enabled.");
                                } else if (verification === false) {
                                    buttons = new MessageActionRow().addComponents(
                                        new MessageButton()
                                            .setCustomId('module_enable_verification')
                                            .setLabel('Module is disabled (click to enable)')
                                            .setStyle('SECONDARY'),
                                        new MessageButton()
                                            .setLabel('Go back')
                                            .setCustomId('back')
                                            .setStyle('SECONDARY')
                                    );
                                    console.log("Verification is disabled.");
                                } else {
                                    console.log(`Error, Bruh`)
                                }
                            break;
                        case 'xp':
                            moduleEmbed = new MessageEmbed()
                                .setTitle('Module Information • XP System')
                                .setDescription('Track and reward users with experience points based on their activity in the server.')
                                .setColor('#00ff00');

                                if (body.body.hasOwnProperty("xp")) {
                                    verification = body.body["xp"];
                                } 
                                console.log("XP status:", verification); // Log verification status
                                
    
    
                                if (verification === true) {
                                    buttons = new MessageActionRow().addComponents(
                                        new MessageButton()
                                            .setCustomId('module_disable_xp')
                                            .setLabel('Module is enabled (click to disable)')
                                            .setStyle('PRIMARY'),
                                        new MessageButton()
                                            .setLabel('Go back')
                                            .setCustomId('back')
                                            .setStyle('SECONDARY')
                                    );
                                    console.log("XP is enabled.");
                                } else if (verification === false) {
                                    buttons = new MessageActionRow().addComponents(
                                        new MessageButton()
                                            .setCustomId('module_enable_xp')
                                            .setLabel('Module is disabled (click to enable)')
                                            .setStyle('SECONDARY'),
                                        new MessageButton()
                                            .setLabel('Go back')
                                            .setCustomId('back')
                                            .setStyle('SECONDARY')
                                    );
                                    console.log("XP is disabled.");
                                } else {
                                    console.log(`Error, Bruh`)
                                }
                            break;

                        case 'asset':
                            moduleEmbed = new MessageEmbed()
                                .setTitle('Module Information • Asset Binds')
                                .setDescription('Link and synchronize assets or roles between Roblox and Discord.')
                                .setColor('#00ff00');

                                if (body.body.hasOwnProperty("asset")) {
                                    verification = body.body["asset"];
                                } 
                                console.log("Asset status:", verification); // Log verification status
                                
    
    
                                if (verification === true) {
                                    buttons = new MessageActionRow().addComponents(
                                        new MessageButton()
                                            .setCustomId('module_disable_asset')
                                            .setLabel('Module is enabled (click to disable)')
                                            .setStyle('PRIMARY'),
                                        new MessageButton()
                                            .setLabel('Go back')
                                            .setCustomId('back')
                                            .setStyle('SECONDARY')
                                    );
                                    console.log("Asset is enabled.");
                                } else if (verification === false) {
                                    buttons = new MessageActionRow().addComponents(
                                        new MessageButton()
                                            .setCustomId('module_enable_asset')
                                            .setLabel('Module is disabled (click to enable)')
                                            .setStyle('SECONDARY'),
                                        new MessageButton()
                                            .setLabel('Go back')
                                            .setCustomId('back')
                                            .setStyle('SECONDARY')
                                    );
                                    console.log("Asset is disabled.");
                                } else {
                                    console.log(`Error, Bruh`)
                                }
                            break;
                        case 'rank':
                            moduleEmbed = new MessageEmbed()
                                .setTitle('Module Information • Rank System')
                                .setDescription('Assign and manage ranks or roles based on predefined criteria.')
                                .setColor('#00ff00');


                                if (body.body.hasOwnProperty("rank")) {
                                    verification = body.body["rank"];
                                } 
                                console.log("Rank status:", verification); // Log verification status
                                
    
    
                                if (verification === true) {
                                    buttons = new MessageActionRow().addComponents(
                                        new MessageButton()
                                            .setCustomId('module_disable_rank')
                                            .setLabel('Module is enabled (click to disable)')
                                            .setStyle('PRIMARY'),
                                        new MessageButton()
                                            .setLabel('Go back')
                                            .setCustomId('back')
                                            .setStyle('SECONDARY')
                                    );
                                    console.log("Rank is enabled.");
                                } else if (verification === false) {
                                    buttons = new MessageActionRow().addComponents(
                                        new MessageButton()
                                            .setCustomId('module_enable_rank')
                                            .setLabel('Module is disabled (click to enable)')
                                            .setStyle('SECONDARY'),
                                        new MessageButton()
                                            .setLabel('Go back')
                                            .setCustomId('back')
                                            .setStyle('SECONDARY')
                                    );
                                    console.log("Rank is disabled.");
                                } else {
                                    console.log(`Error, Bruh`)
                                }    
                            break;
                        default:
                            moduleEmbed = new MessageEmbed()
                                .setTitle('Invalid Module')
                                .setDescription('Please select a valid module.')
                                .setColor('#ff0000');
                    }
                    try {
                        // Fetching the initial message by ID
                        
                        console.log(`editReply`)
                        // Edit the initial message with the selected module's embed
                        interaction.editReply({ embeds: [moduleEmbed], components: buttons ? [buttons] : [] });
    
                        // Acknowledge the interaction
                        await i.deferUpdate();
                        
                    } catch (error) {
                        console.error('Error editing message:', error);
                    }
            }    
            });

            collector.on('end', async collected => {
                // Check if the original reply message still exists before trying to delete it
                if (interaction.replied) {
                    await interaction.deleteReply();
                }
            });

            const collector2 = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });
            var { body } = await snekfetch.get(`${config.firebaseURL}guilds/${guild.id}/modules.json`);
            collector2.on('collect', async i => {
                i.deferUpdate();
                //Verification System Functions
                if (i.customId === 'module_disable_verification') {
                    var { body } = await snekfetch.get(`${config.firebaseURL}guilds/${guild.id}/modules.json`);
                    
                    if (body && body.hasOwnProperty("verification")) { 
                        firebase.database().ref(`guilds/${guild.id}/modules`).update({"verification": false}), (error) => {
                            if (error) {
                                console.error("Error updating modules in Firebase:");
                            } else {
                                console.log("Modules updated successfully.");
                            }
                        };

                        disablebutton = new MessageActionRow().addComponents(
                            new MessageButton()
                            .setCustomId('module_enable_verification')
                            .setLabel('Module is disabled (click to enable)')
                            .setStyle('SECONDARY'),
                            new MessageButton()
                            .setLabel('Go back')
                            .setCustomId('back')
                            .setStyle('SECONDARY')
                        );
                        disableembed = new MessageEmbed()
                        .setTitle('Module Information • Verification System')
                        .setDescription('Verify Users with their Roblox Accounts and manage them within groups and or Create Group Binds')
                        .setColor('#00ff00');  
                        interaction.editReply({ embeds: [disableembed], components: [disablebutton] });
                    } else {
                        console.log(`Could not set verification module to false`);
                    }
                } else if (i.customId === 'module_enable_verification') {
                    
                    var { body } = await snekfetch.get(`${config.firebaseURL}guilds/${guild.id}/modules.json`);
                    
                    if (body && body.hasOwnProperty("verification")) {
                        firebase.database().ref(`guilds/${guild.id}/modules`).update({"verification": true}), (error) => {
                            if (error) {
                                console.error("Error updating modules in Firebase:");
                            } else {
                                console.log("Modules updated successfully.");
                            }
                        };
                        enablebutton = new MessageActionRow().addComponents(
                            new MessageButton()
                            .setCustomId('module_disable_verification')
                            .setLabel('Module is enabled (click to disable)')
                            .setStyle('PRIMARY'),
                            new MessageButton()
                            .setLabel('Go back')
                            .setCustomId('back')
                            .setStyle('SECONDARY')
                        );
                        enableembed = new MessageEmbed()
                        .setTitle('Module Information • Verification System')
                        .setDescription('Verify Users with their Roblox Accounts and manage them within groups and or Create Group Binds')
                        .setColor('#00ff00');  
                        interaction.editReply({ embeds: [enableembed], components: [enablebutton] });
                    } else {
                        console.log(`Could not set verification module to true`);
                    }
                } 
                //XP System Functions
                else if (i.customId === 'module_enable_xp') {
                    
                    var { body } = await snekfetch.get(`${config.firebaseURL}guilds/${guild.id}/modules.json`);
                    
                    if (body && body.hasOwnProperty("xp")) {
                        firebase.database().ref(`guilds/${guild.id}/modules`).update({"xp": true}), (error) => {
                            if (error) {
                                console.error("Error updating modules in Firebase:");
                            } else {
                                console.log("Modules updated successfully.");
                            }
                        };
                        enablebutton = new MessageActionRow().addComponents(
                            new MessageButton()
                            .setCustomId('module_disable_xp')
                            .setLabel('Module is enabled (click to disable)')
                            .setStyle('PRIMARY'),
                            new MessageButton()
                            .setLabel('Go back')
                            .setCustomId('back')
                            .setStyle('SECONDARY')
                        );
                        enableembed = new MessageEmbed()
                        .setTitle('Module Information • XP System')
                        .setDescription('Track and reward users with experience points based on their activity in the server.')
                        .setColor('#00ff00');
                        interaction.editReply({ embeds: [enableembed], components: [enablebutton] });
                    } else {
                        console.log(`Could not set xp module to true`);
                    }
                }   else if (i.customId === 'module_disable_xp') {
                    
                    var { body } = await snekfetch.get(`${config.firebaseURL}guilds/${guild.id}/modules.json`);
                    
                    if (body && body.hasOwnProperty("xp")) {
                        firebase.database().ref(`guilds/${guild.id}/modules`).update({"xp": false}), (error) => {
                            if (error) {
                                console.error("Error updating modules in Firebase:");
                            } else {
                                console.log("Modules updated successfully.");
                            }
                        };
                        enablebutton = new MessageActionRow().addComponents(
                            new MessageButton()
                            .setCustomId('module_enable_xp')
                            .setLabel('Module is disabled (click to enable)')
                            .setStyle('SECONDARY'),
                            new MessageButton()
                            .setLabel('Go back')
                            .setCustomId('back')
                            .setStyle('SECONDARY')
                        );
                        enableembed = new MessageEmbed()
                        .setTitle('Module Information • XP System')
                        .setDescription('Track and reward users with experience points based on their activity in the server.')
                        .setColor('#00ff00');
                        interaction.editReply({ embeds: [enableembed], components: [enablebutton] });
                    } else {
                        console.log(`Could not set xp module to true`);
                    }
                }
                //Asset System Functions
                else if (i.customId === 'module_enable_asset') {
                    
                    var { body } = await snekfetch.get(`${config.firebaseURL}guilds/${guild.id}/modules.json`);
                    
                    if (body && body.hasOwnProperty("asset")) {
                        firebase.database().ref(`guilds/${guild.id}/modules`).update({"asset": true}), (error) => {
                            if (error) {
                                console.error("Error updating modules in Firebase:");
                            } else {
                                console.log("Modules updated successfully.");
                            }
                        };
                        enablebutton = new MessageActionRow().addComponents(
                            new MessageButton()
                            .setCustomId('module_disable_asset')
                            .setLabel('Module is enabled (click to disable)')
                            .setStyle('PRIMARY'),
                            new MessageButton()
                            .setLabel('Go back')
                            .setCustomId('back')
                            .setStyle('SECONDARY')
                        );
                        enableembed = new MessageEmbed()
                        .setTitle('Module Information • Asset Binds')
                        .setDescription('Link and synchronize assets or roles between Roblox and Discord.')
                        .setColor('#00ff00');
                        interaction.editReply({ embeds: [enableembed], components: [enablebutton] });
                    } else {
                        console.log(`Could not set asset module to true`);
                    }
                }   else if (i.customId === 'module_disable_asset') {
                    
                    var { body } = await snekfetch.get(`${config.firebaseURL}guilds/${guild.id}/modules.json`);
                    
                    if (body && body.hasOwnProperty("asset")) {
                        firebase.database().ref(`guilds/${guild.id}/modules`).update({"asset": false}), (error) => {
                            if (error) {
                                console.error("Error updating modules in Firebase:");
                            } else {
                                console.log("Modules updated successfully.");
                            }
                        };
                        enablebutton = new MessageActionRow().addComponents(
                            new MessageButton()
                            .setCustomId('module_enable_asset')
                            .setLabel('Module is disabled (click to enable)')
                            .setStyle('SECONDARY'),
                            new MessageButton()
                            .setLabel('Go back')
                            .setCustomId('back')
                            .setStyle('SECONDARY')
                        );
                        enableembed = new MessageEmbed()
                        .setTitle('Module Information • Asset Binds')
                        .setDescription('Link and synchronize assets or roles between Roblox and Discord.')
                        .setColor('#00ff00');
                        interaction.editReply({ embeds: [enableembed], components: [enablebutton] });
                    } else {
                        console.log(`Could not set asset module to true`);
                    }
                }
                //Rank System Functions
                else if (i.customId === 'module_enable_rank') {
                    
                    var { body } = await snekfetch.get(`${config.firebaseURL}guilds/${guild.id}/modules.json`);
                    
                    if (body && body.hasOwnProperty("rank")) {
                        firebase.database().ref(`guilds/${guild.id}/modules`).update({"rank": true}), (error) => {
                            if (error) {
                                console.error("Error updating modules in Firebase:");
                            } else {
                                console.log("Modules updated successfully.");
                            }
                        };
                        enablebutton = new MessageActionRow().addComponents(
                            new MessageButton()
                            .setCustomId('module_disable_rank')
                            .setLabel('Module is enabled (click to disable)')
                            .setStyle('PRIMARY'),
                            new MessageButton()
                            .setLabel('Go back')
                            .setCustomId('back')
                            .setStyle('SECONDARY')
                        );
                        enableembed = new MessageEmbed()
                        .setTitle('Module Information • Rank System')
                        .setDescription('Assign and manage ranks or roles based on predefined criteria.')
                        .setColor('#00ff00');
                        interaction.editReply({ embeds: [enableembed], components: [enablebutton] });
                    } else {
                        console.log(`Could not set rank module to true`);
                    }
                }   else if (i.customId === 'module_disable_rank') {
                    
                    var { body } = await snekfetch.get(`${config.firebaseURL}guilds/${guild.id}/modules.json`);
                    
                    if (body && body.hasOwnProperty("asset")) {
                        firebase.database().ref(`guilds/${guild.id}/modules`).update({"asset": false}), (error) => {
                            if (error) {
                                console.error("Error updating modules in Firebase:");
                            } else {
                                console.log("Modules updated successfully.");
                            }
                        };
                        enablebutton = new MessageActionRow().addComponents(
                            new MessageButton()
                            .setCustomId('module_enable_rank')
                            .setLabel('Module is disabled (click to enable)')
                            .setStyle('SECONDARY'),
                            new MessageButton()
                            .setLabel('Go back')
                            .setCustomId('back')
                            .setStyle('SECONDARY')
                        );
                        enableembed = new MessageEmbed()
                        .setTitle('Module Information • Rank System')
                        .setDescription('Assign and manage ranks or roles based on predefined criteria.')
                        .setColor('#00ff00');
                        interaction.editReply({ embeds: [enableembed], components: [enablebutton] });
                    } else {
                        console.log(`Could not set rank module to true`);
                    }
                }
                else if (i.customId === 'back') {
                    console.log("Back")
                    interaction.editReply({ embeds: [page], components: [row], ephemeral: false });
                } else {
                    console.log("No Button Pressed")
                } 
            });
            
            

        } catch (error) {
            console.error('Error sending message:', error);
        }
    },
};

