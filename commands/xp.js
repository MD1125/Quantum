const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const firebase = require('firebase');


async function view(interaction, user, guildID) {
    interaction.deferReply();
    try {
        let embedString;
        while (true) {
            let currentXP = "";
            let currentRankName = "";
            var { body } = await snekfetch.get(`${process.env.firebaseURL}/guilds/${guildID}/XP_MODULE/USER_DATA/${user.id}.json`);
            currentXP = body.XP || 0;
            
            var { body } = await snekfetch.get(`${process.env.firebaseURL}/guilds/${guildID}/RANK_MODULE/USER_DATA/${user.id}.json`);
            let currentRank;
            if (currentRank < 1) {
                currentRank = 1;
                firebase.database().ref(`guilds/${guildID}/RANK_MODULE/USER_DATA/${user.id}`).update({ RANK: "1" });
            } else {
                currentRank = body.RANK;
            }
            var { body } = await snekfetch.get(`${process.env.firebaseURL}guilds/${guildID}/RANK_MODULE/RANKS/${currentRank}.json`);
            let currentRankXP = body.REQUIRED
            currentRankName = body.RANK_NAME;
            let nextRank = "";
            nextRank = currentRank + 1; // Increment currentRank by 1 to get the next rank
            

            var { body } = await snekfetch.get(`${process.env.firebaseURL}/guilds/${guildID}/RANK_MODULE/RANKS/${nextRank}.json`);
            let nextRankXP, nextRankName;
            if (body === null) {
                nextRankXP = "Max rank reached";
                nextRankName = "Max rank reached";
            } else {
                nextRankXP = body.REQUIRED;
                nextRankName = body.RANK_NAME;
            }

            if (currentXP < currentRankXP) {
                while (true) {
                    var { body } = await snekfetch.get(`${process.env.firebaseURL}guilds/${guildID}/RANK_MODULE/USER_DATA/${user.id}.json`);
                    const currentRank2 = body.RANK;
                    await firebase.database().ref(`guilds/${guildID}/RANK_MODULE/USER_DATA/${user.id}`).update({ RANK: currentRank2 - 1 });
                    const nextRank2 = currentRank2 - 1;
                    var nextRankData = await snekfetch.get(`${config.firebaseURL}/guilds/${guildID}/RANK_MODULE/RANKS/${nextRank2}.json`);
                    const nextRankXP2 = nextRankData.body.REQUIRED;


                    if (currentXP >= nextRankXP2) {
                        var { body } = await snekfetch.get(`${process.env.firebaseURL}/guilds/${guildID}/XP_MODULE/USER_DATA/${user.id}.json`);
                        currentXP = body.XP
                        
                        var { body } = await snekfetch.get(`${process.env.firebaseURL}/guilds/${guildID}/RANK_MODULE/USER_DATA/${user.id}.json`);
                        currentRank = body.RANK
                        var { body } = await snekfetch.get(`${process.env.firebaseURL}guilds/${guildID}/RANK_MODULE/RANKS/${currentRank}.json`);
                        const currentRankName = body.RANK_NAME;
                        nextRank = "";
                        nextRank = currentRank + 1; // Increment currentRank by 1 to get the next rank
                        
            
                        var { body } = await snekfetch.get(`${process.env.firebaseURL}/guilds/${guildID}/RANK_MODULE/RANKS/${nextRank}.json`);
                        nextRankXP, nextRankName;
                        if (body === null) {
                            nextRankXP = "Max rank reached";
                            nextRankName = "Max rank reached";
                        } else {
                            nextRankXP = body.REQUIRED;
                            nextRankName = body.RANK_NAME;
                        }
                        break;
                    }
                }
            }
            var { body } = await snekfetch.get(`${process.env.firebaseURL}/guilds/${guildID}/XP_MODULE/USER_DATA/${user.id}.json`);
                        currentXP = body.XP
                        
                        var { body } = await snekfetch.get(`${process.env.firebaseURL}/guilds/${guildID}/RANK_MODULE/USER_DATA/${user.id}.json`);
                        currentRank = body.RANK
                        var { body } = await snekfetch.get(`${process.env.firebaseURL}guilds/${guildID}/RANK_MODULE/RANKS/${currentRank}.json`);
                        currentRankName = body.RANK_NAME;
                        nextRank = "";
                        nextRank = currentRank + 1; // Increment currentRank by 1 to get the next rank
                        
            
                        var { body } = await snekfetch.get(`${process.env.firebaseURL}/guilds/${guildID}/RANK_MODULE/RANKS/${nextRank}.json`);
                        nextRankXP, nextRankName;
                        if (body === null) {
                            nextRankXP = "Max rank reached";
                            nextRankName = "Max rank reached";
                        } else {
                            nextRankXP = body.REQUIRED;
                            nextRankName = body.RANK_NAME;
                        }
            

            const percentage = (currentXP / nextRankXP) * 100;
            const squaresCount = Math.floor(percentage / 10);

            if (squaresCount < 10) {
                const emptySquaresCount = 10 - squaresCount;
                const yellowSquare = ":yellow_square:";
                const blackSquare = ":black_large_square:";
                const squares = yellowSquare.repeat(squaresCount) + blackSquare.repeat(emptySquaresCount);

            embedString = `${squares} **${percentage.toFixed(2) + "%"}** \n\n**Rank: ${currentRankName}**\n**XP: ${currentXP}**\n\n**${nextRankXP - currentXP} XP remaining for ${nextRankName} (${nextRankXP} needed)**`;

            const response = new MessageEmbed()
                .setTitle(`${user.username}'s XP:`)
                .setDescription(embedString)
                .setThumbnail(user.displayAvatarURL())
                .setColor('08ace0');
            return interaction.editReply({ embeds: [response], ephemeral: false, content: null });
            } else {
                
                firebase.database().ref(`guilds/${guildID}/RANK_MODULE/USER_DATA/${user.id}`).update({ RANK: currentRank + 1 });
            }
        }
        
        
    
    } catch (error) {
        console.error('Error:', error);
        return interaction.editReply('An error occurred while fetching XP data.');
    }
}

module.exports = {
    name: 'xp',
    async execute(interaction) {
        const { options } = interaction;
        const guildID = interaction.guild.id;
        const user = options.getUser('user') || interaction.member.user;
        await view(interaction, user, guildID);
    },
};