

const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const firebase = require('firebase');

module.exports = {
    name: 'botinfo',
    async execute(interaction) {
        const { options } = interaction;
        const member = interaction.member.user.id;

        const DeveloperRole = interaction.guild.roles.cache.find(role => role.name === config.DeveloperRole);

        function getCpuUsage() {
            const os = require('os');
            const cpuUsage = os.loadavg()[0];
            return `${cpuUsage.toFixed(2)}%`;
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
            const botStartTime = new Date(); // Replace this with your bot's actual start time
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

        const embed = new MessageEmbed()
           .setTitle('Debug Information')
           .setColor(16711680)
           .addFields(
                { name: 'Cpu Usage:', value: getCpuUsage() },
                { name: 'Bot Startup Time', value: getBotStartupTime() },
                { name: 'Operating System:', value: getOperatingSystem() },
                { name: 'Server Uptime:', value: getServerUptime() },
                { name: 'Free Memory:', value: getFreeMemory() },
                { name: 'Total Memory:', value: getTotalMemory() }
            );


            return interaction.reply({ embeds: [embed], ephemeral: false });
        
    },
};