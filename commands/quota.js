const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const firebase = require('firebase');
const config = require('../config.json');
const noblox = require('noblox.js');
const { mem } = require('node-os-utils');

module.exports = {
    name: 'quota',
    async execute(interaction) {
        const { options, member, guild } = interaction;
        const userid = member.id;
        const guildID = guild.id;
        const response = await snekfetch.get(`${config.firebaseURL}/guilds/${guildID}/CLAN_MODULE/MEMBERS/${userid}.json`);
        if (response.body) {
            console.log("yeah")
            try {
                let embedString;
                let currentquotapoints = "";
                let response = await snekfetch.get(`${config.firebaseURL}/guilds/${guildID}/QUOTA_MODULE/USER_DATA/${userid}.json`);
                currentquotapoints = response.body.POINTS || 0;
    
                response = await snekfetch.get(`${config.firebaseURL}/guilds/${guildID}/QUOTA_MODULE.json`);
                const quota = response.body.QUOTA || 0;
                
                const percentage = (currentquotapoints / quota) * 100;
                let squares = "";
                let text;
                response = await snekfetch.get(`${config.firebaseURL}/guilds/${guildID}/QUOTA_MODULE.json`);
                const time_left = response.body.RESET;
                if (percentage === 100) {
                    squares = ":green_square::green_square::green_square::green_square::green_square::green_square::green_square::green_square::green_square::green_square:"
                    text = "You have Completed your Quota! Congratulations"
                } else if (currentquotapoints > quota) {
                    squares = ":green_square::green_square::green_square::green_square::green_square::green_square::green_square::green_square::green_square::green_square:"
                    text = "You have Completed your Quota! Congratulations"
                } else {
                    const squaresCount = Math.floor(percentage / 10);
                    const yellowSquare = ":yellow_square:";
                    const blackSquare = ":black_large_square:";
                    const emptySquaresCount = 10 - squaresCount;
                    squares = yellowSquare.repeat(squaresCount) + blackSquare.repeat(emptySquaresCount);
                    text = `You have left until ${time_left} to complete the quota.`
                }
    
                
    
    
                embedString = `${squares} **${percentage.toFixed(2) + "%"}**\n\n **Points: ${currentquotapoints}/${quota} Points** \n\n ** ${text} **`;
                const embed = new MessageEmbed()
                    .setTitle(`Quota Completion:`)
                    .setDescription(embedString)
                    .setColor('08ace0');
    
                await interaction.reply({ embeds: [embed], ephemeral: false, content: null });
            
            } catch (error) {
                console.error('Error:', error);
                return interaction.reply('An error occurred while fetching quota data.', { ephemeral: true });
            }
        } else {
            console.log("nah")
            const embed = new MessageEmbed()
            .setTitle(`It Seems like you are not in the Clan.`)
            .setDescription("Join the Clan to view your Quota Completion")
            .setColor('08ace0');
            return interaction.reply({ embeds: [embed], ephemeral: true, content: null })
        }
        
    },
};
