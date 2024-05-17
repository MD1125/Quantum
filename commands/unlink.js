const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const firebase = require('firebase');
const config = require('../config.json');

module.exports = {
    name: 'unlink',
    async execute(interaction) {
        const { options, member, guild } = interaction;
        const userid = member.id


        const verifiedRole = guild.roles.cache.find(role => role.name === config.verifiedRole);

        if (member.roles.cache.some(role => role.name === config.verifiedRole)) {
            var { body } = await snekfetch.get(`${config.firebaseURL}verified/${userid}.json`);


            if (body) {
                const currentTime = new Date();
                const futureTime = new Date(currentTime.getTime() + 24 * 60 * 60 * 1000); // Adding 24 hours in milliseconds

                // Format the future time to show the timestamp
                const timestamp = `<t:${Math.floor(futureTime.getTime() / 1000)}>`;

                console.log(timestamp);



                const page1 = new MessageEmbed()
                .setTitle("Account deletion")
                .setColor('0xFFFF00')
                .setDescription("By unlinking your account, all of your data will be permanently deleted,")
                .addFields(
                    { name: "Including:", value: "• Any Userdata related to you\n• Any Statistics\n• Every Verification in Every Server you joined, you won't be able to use these servers anymore" },
                );
                const page2 = new MessageEmbed()
                .setTitle("Account scheduled for deletion.")
                .setDescription(`All of your Data will be deleted on ${timestamp}. You may cancle this before then by running /unlink again.`)
                .setColor('0xFFFF00')
                .addFields(
                    { name: "If you want to delete your account immediantly,", value: "Please press Delete Account Now" },
                );
                const page3 = new MessageEmbed()
                .setTitle("Successfully Deleted Account. All links have been removed!")
                .setColor('FF0000')
                const page4 = new MessageEmbed()
                .setTitle("Error.")
                .setDescription("You ran out of time, please try again.")
                .setColor('0xFFFF00')
                const page5 = new MessageEmbed()
                .setTitle("Canceled Account Deletion")
                .setColor('0xFFFF00')
                const row = new MessageActionRow().addComponents(
                    new MessageButton()
                        .setCustomId('delete')
                        .setLabel('Delete Account')
                        .setStyle('DANGER'),
                        new MessageButton()
                        .setCustomId('cancel')
                        .setLabel('Cancel')
                        .setStyle('SECONDARY')
                );
                const row2 = new MessageActionRow().addComponents(
                    new MessageButton()
                        .setCustomId('delete_now')
                        .setLabel('Confirm')
                        .setStyle('DANGER')

                );

                interaction.reply({ embeds: [page1], components: [row], ephemeral: false }).then(message => {
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
                
            




            } else  {
                return interaction.reply({ content: 'You are not verified! Consider running /link instead.', ephemeral: true })

            }
        } else { return interaction.reply({content: 'Please verify first using /link.', ephemeral : true })
        }
    },
};
