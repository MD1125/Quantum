const config = require('../config.json');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { options } = require('node-os-utils');
const snekfetch = require('snekfetch');

async function update(interaction, user, guild, members, memberPermissions) {
    var { body } = await snekfetch.get(`${process.env.firebaseURL}/verified/${user.id}.json`)

    if (!body) {
        return interaction.reply({ content: 'User is not Verified, run /link to verify!', ephemeral: false });
    }

    var { body } = await snekfetch.get(`https://users.roblox.com/v1/users/${body.linked}`)

    const currentName = interaction.member.user
    var displayName

    // Function to format the time to "Today at hh:mm am/pm" format
    function formatTime(date) {
       const options = { hour: 'numeric', minute: 'numeric', hour12: true };
        return new Date(date).toLocaleString('en-US', options);
    }

    // Get the current time
    const currentTime = new Date();

    // Calculate the time difference
    //const timeDifference = new Date(currentTime - startTime); // Assuming startTime is the time when the command started

    // Format the time difference
    //const executionTime = `${timeDifference.getUTCHours()}h ${timeDifference.getUTCMinutes()}m`;

    // Format the current time
    //const formattedCurrentTime = formatTime(currentTime);
    

    const page1 = new MessageEmbed()
    .setTitle("Update")
    .setColor(0x00ff00)
    .addFields(
        { name: "Nickname", value: `${body.name}` },
        { name: "Added Roles", value: `None`},
        { name: "Removed Roles", value: `None`},
    );
    //page1.setFooter(`Execution Time: ${executionTime} • Today at ${formattedCurrentTime}`);
    

    //if (interaction.member.displayName !== body.name) {
        // Update the display name in Discord
        try {
            const member = await interaction.guild.members.fetch(interaction.user.id);
            await member.setNickname(body.name);
            await interaction.reply({ embeds: [page1], components: [], ephemeral: false });
        } catch (error) {
            //console.error('Error updating display name:', error);
            const page1 = new MessageEmbed()
    .setTitle("Update Failed")
    .setDescription("Due to discord limitations, I cannot update anyone with a higher role than mine")
    .setColor(0xFF0000)
            await interaction.reply({ embeds: [page1], components: [], ephemeral: false });
        }
        
    //} else {
    //    return interaction.reply({ content: 'Your display name is already up-to-date.', ephemeral: true });
    //}

}

module.exports = {
    name: 'update',
    async execute(interaction) {
        const { options, member, guild } = interaction
        const user = options.getUser('user')

        if (user) {
            update(interaction, user)
        } else {
            update(interaction, interaction.member.user)
        }
    },
};
