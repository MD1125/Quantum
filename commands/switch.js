const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const firebase = require('firebase');
const noblox = require('noblox.js');

module.exports = {
    name: 'switch',
    async execute(interaction) {
        const { options, member, guild } = interaction;
        const userid = member.id

        interaction.reply('This Command is Currently Unavailable');
            




    },
};
