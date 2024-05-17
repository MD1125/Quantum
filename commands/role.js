const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const firebase = require('firebase');
const config = require('../config.json');
const noblox = require('noblox.js');

module.exports = {
    name: 'role',
    async execute(interaction) {
        const { options, member, guild } = interaction;
        const userid = member.id

        interaction.reply("This command is currently not Available")
            
        const guildId = '1131918228176785519';
        const userId = '823157584822665246';
        const roleName = '---Senior Operative---';


  console.log(`Logged in as ${client.user.tag}`);
  if (!guild) return console.error(`Unable to find guild with ID ${guildId}`);

  if (!member) return console.error(`Unable to find member with ID ${userId}`);

  const role = guild.roles.cache.find(role => role.name === roleName);
  if (!role) return console.error(`Unable to find role with name '${roleName}'`);

  member.roles.add(role)
    .then(() => console.log(`Role ${role.name} added to user ${member.user.tag}`))
    .catch(console.error);



    },
};
