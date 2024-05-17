const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const firebase = require('firebase');
const config = require('../config.json');

module.exports = {
    name: 'xpremove',
    async execute(interaction) {
        const { options, member, guild } = interaction;
        const usersInput = options.getString('users'); // Get text input containing user mentions
        const amount = options.getNumber('amount');
        const mentionedUsers = []; // Array to store mentioned users

        // Extract mentioned users from the input text
        const userMentions = usersInput.match(/<@!?(\d+)>/g);
        if (userMentions) {
            for (const mention of userMentions) {
                const userId = mention.match(/\d+/)[0]; // Extract user ID from mention
                const user = await guild.members.fetch(userId); // Fetch the user object
                if (user) {
                    mentionedUsers.push(user); // Add user to the mentionedUsers array
                }
            }
        }

        try {
            const embedFields = [];

            for (const user of mentionedUsers) {
                const { body } = await snekfetch.get(`${config.firebaseURL}guilds/${guild.id}/XP_MODULE/USER_DATA/${user.id}.json`);

                if (body) {
                    const currentXP = body.XP || 0;
                    const newXPamount = currentXP - amount;
                    if (newXPamount<0) {
                        const newXPamount = 0
                    }
                    console.log(newXPamount);
                    await firebase.database().ref(`guilds/${guild.id}/XP_MODULE/USER_DATA/${user.id}`).update({ "XP": newXPamount });

                    // Add a field for the user to the embed
                    embedFields.push({
                        name: user.displayName,
                        value: `Removed: ${amount} XP`,
                    });
                } else {
                    console.log(amount);
                    await firebase.database().ref(`guilds/${guild.id}/XP_MODULE/USER_DATA/${user.id}`).set({ "XP": amount });

                    // Add a field for the user to the embed
                    embedFields.push({
                        name: user.displayName,
                        value: `Removed: ${amount} XP`,
                    });
                }
            }

            // Reply with success message including fields for each user
            const successEmbed = new MessageEmbed()
                .setTitle('XP Removed Successfully')
                .setColor(0x00ff00)
                .setDescription(`Removed ${amount} XP to ${mentionedUsers.length} user(s).`)
                .addFields(embedFields); // Add fields for each user
            interaction.reply({ embeds: [successEmbed], ephemeral: true });


            // Send the success embed to the log channel
            const log = await snekfetch.get(`${config.firebaseURL}guilds/${guild.id}/LOG_CHANNEL.json`);
            const logChannelId = log.body.CHANNEL_ID;
            const logChannel = guild.channels.cache.get(logChannelId);
            if (logChannel && logChannel.isText()) {
                logChannel.send({ embeds: [successEmbed] });
            }
        } catch (error) {
            console.error(`Error while updating XP data: ${error}`);
            // Reply with error message
            const errorEmbed = new MessageEmbed()
                .setTitle('Error')
                .setColor(0xff0000)
                .setDescription('An error occurred while updating XP data.');
            interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    },
};
