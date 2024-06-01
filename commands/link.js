const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const firebase = require('firebase');
const path = require('path');
const { error } = require('console');

module.exports = {
    name: 'link',
    async execute(interaction) {
        const { options, member, guild } = interaction;
        const verifiedRoleName = process.env.verifiedRole;
        const verifiedRole = interaction.member.guild.roles.cache.find(role => role.name === verifiedRoleName);
        function generateRandomCode() {
            const length = 4;
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let code = '';
            
            for (let i = 0; i < length; i++) {
                const randomIndex = Math.floor(Math.random() * characters.length);
                code += characters.charAt(randomIndex);
            }
            
            return code;
        }
          
        // Generate random code.
        const verifycode = generateRandomCode();


        var { body } = await snekfetch.get(`${process.env.firebaseURL}verified/${member.id}.json`);
        var { body1 } = await snekfetch.get(`${process.env.firebaseURL}pending/${member.id}.json`);

        if (body) {
            try {
                const { body: robloxUserData } = await snekfetch.get(`https://users.roblox.com/v1/users/${body.linked}`);
                if (verifiedRole) {
                    const page = new MessageEmbed()
                        .setTitle(`Already verified ${member.displayName}!`)
                        .setColor(0x00ff00)
                        .addFields(
                            { name: `Verified as: ${robloxUserData.name}`, value: "Not you? Run /switch to Switch your accounts!" },
                        );
                    member.setNickname(robloxUserData.name);
                    return interaction.reply({ embeds: [page], ephemeral: true });
                } else {
                    await interaction.member.roles.add(verifiedRole);
                    const page = new MessageEmbed()
                        .setTitle(`Welcome to The Server ${member.displayName}!`)
                        .setColor(0x00ff00)
                        .addFields(
                            { name: `Verified as: ${robloxUserData.name}`, value: "Not you? Run /switch to Switch your accounts!" },
                        );
                    member.setNickname(robloxUserData.name);
                    return interaction.reply({ embeds: [page], ephemeral: true });
                }
            } catch (error) {
                console.error(`Error while fetching Roblox user data: ${error}`);
                const page = new MessageEmbed()
                    .setTitle(`Welcome to The Server ${member.displayName}!`)
                    .setColor(0x00ff00)
                    .addFields(
                        { name: `Could not update displayname.`, value: "Make sure the bot has a higher role than you." },
                    );
                return interaction.reply({ embeds: [page], ephemeral: true });
            }
        } else if (body1){
            const userId = options.getNumber('userid');

            if (body1.body.hasOwnProperty("code")) {
                code = body1.body["code"];
                console.log(`${code}`);
                const page = new MessageEmbed()
                .setTitle("You already have a linking prompt active.")
                .setColor(0x5d65f3)
                .addFields(
                    { name: "If you want to remove that prompt press cancel Below.", value: "This will remove any active code." },
                );
                const page9 = new MessageEmbed()
                .setTitle("Verification Prompt Canceled")
                .setColor(0xFFFF00)
                .addFields(
                    { name: "Run /link to send a new prompt", value: " " },
                );
                const row = new MessageActionRow().addComponents(
                    new MessageButton()
                    .setCustomId('verification_cancel2')
                    .setLabel('Cancel Prompt')
                    .setStyle('DANGER')
                );

                return interaction.reply({ embeds: [page], components: [row], ephemeral: true}).then(message => {

                    const filter = i => i.user.id === member.id;
                    const collector = interaction.channel.createMessageComponentCollector({ filter, componentType: 'BUTTON'});

                    collector.on('collect', async i => {
                        i.deferUpdate();
                
                        if (i.customId === 'verification_cancel2') {
                            console.log('canceled prompt');
                            const response = await snekfetch.get(`${process.env.firebaseURL}pending/${member.id}.json`);
                            console.log(`${response}`)

                            if (response.body.hasOwnProperty("code")) {
                                code = response.body["code"];
                                console.log(`${code}`);
                                firebase.database().ref(`pending/${code}`).set({});
                                firebase.database().ref(`pending/${member.id}`).set({});
                            } else {
                                console.log("No Code!")
                            } 

                            return interaction.editReply({ embeds: [page9], components: [], ephemeral: true });
                        } else {
                            return interaction.editReply("We could not remove your Active Prompt. Please Try again in 5 Minutes.");
                        };
                    });
                });
            }
        } else {   




            const body2 = await snekfetch.get(`${process.env.firebaseURL}pending/${member.id}.json`);
            

            let code;
            let timestamp;
            let remainingTime;
            const currentTime = new Date();
            const fiveMinutesFromNow = new Date(currentTime.getTime() + 5 * 60000);
            timestamp = `<t:${Math.floor(fiveMinutesFromNow.getTime() / 1000)}:R>`;            
            if (body2.body !== null) {
                if (body2.body.hasOwnProperty("code")) {
                    code = body2.body["code"];
                    console.log(`${code}`);
                }
                if (body2.body.hasOwnProperty("time")) {
                    const targetTime = new Date(body2.body["time"]);
                    remainingTime = targetTime.getTime() - Date.now();
                    timestamp = body2.body["time"]; // Store the timestamp for display
                } else {
                    // If no time provided, set the collector time to default (300000 milliseconds)
                    remainingTime = 300000;
                    timestamp = ""; // No timestamp to display
                }
            } else {
                console.error("No Time or Code!");
            }
            
            const page1 = new MessageEmbed()
                .setTitle("Link your Account to Roblox")
                .setColor(0x5d65f3)
                .addFields(
                    { name: "Step 1:", value: "Join the linking center on your Roblox account by pressing \"Linking Center\"." },
                    { name: "Step 2:", value: `Enter the Code: \`${code ? code : verifycode}\` with ${timestamp}.`},
                );
            

            const page2 = new MessageEmbed()
                .setTitle('Verification')
                .setDescription(`Sorry, but it looks like you haven't completed the steps in the [verification game](${process.env.verificationLink}). Please complete the steps then click next.`)
                .setColor('0x5d65f3');
            const page3 = new MessageEmbed()
                .setTitle('Verification')
                .setDescription(`Account ownership verified! Welcome to the server, ${member.displayName}.`)
                .setColor('0x00ff00');
            const page4 = new MessageEmbed()
                .setTitle('Verification')
                .setDescription(`Account verification cancelled. To try again, run /link.`)
                .setColor('0x5d65f3');
            const page5 = new MessageEmbed()
                .setTitle('Verification')
                .setDescription(`Verification timed out. To try again, run /link.`)
                .setColor('0x5d65f3');
            const page6 = new MessageEmbed()
                .setTitle('Error.')
                .setDescription(`Your Time to Verify has run out. Use /link again!`)
                .setColor('0xFFFF00');             
            const row = new MessageActionRow().addComponents(
                new MessageButton()
                    .setCustomId('verification_code_next')
                    .setLabel('Next')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setLabel('Linking Center')
                    .setURL('https://www.roblox.com/games/17039852519/Verification-Game#ropro-quick-play')
                    .setStyle('LINK'),
                new MessageButton()
                    .setCustomId('verification_cancel')
                    .setLabel('Cancel')
                    .setStyle('DANGER')
            );


            const response = await snekfetch.get(`${process.env.firebaseURL}pending/${member.id}.json`);

            if (response.body !== null && response.body.hasOwnProperty("code")) {
                const code = response.body["code"];
                console.log(`${code}`);
            } else {
                const verifycode2 = verifycode
                firebase.database().ref(`pending/${member.id}`).set({ "code": verifycode2, "time": timestamp });
                firebase.database().ref(`pending/${verifycode2}`).set(member.id)
                console.error("Error: Code not found in Firebase response or response is null.");
            }



            interaction.reply({ embeds: [page1], components: [row], ephemeral: false }).then(message => {

                const filter = i => i.user.id === member.id;
                const collector = interaction.channel.createMessageComponentCollector({ filter, componentType: 'BUTTON', time: remainingTime });
                collector.on('collect', async i => {
                    i.deferUpdate();
            
                    if (i.customId === 'verification_code_next') {
                        var { body3 } = await snekfetch.get(`${process.env.firebaseURL}verified/${member.id}.json`);
            
                        if (body3) {
                            if (verifiedRole) {
                                await interaction.member.roles.add(verifiedRole);
                            } else {
                                console.error(`Role '${verifiedRoleName}' not found.`);
                            }
                            member.setNickname(body.username);
                            return interaction.editReply({ embeds: [page3], components: [], ephemeral: false });
                        } else {
                            return interaction.editReply({ embeds: [page2], components: [row], ephemeral: false });
                        }
                    } else if (i.customId === 'verification_cancel') {
                        console.log('canceled');
                        const body4 = await snekfetch.get(`${process.env.firebaseURL}pending/${member.id}.json`);
                        var { body5 } = body4
                        
                        if (body5) {
                            firebase.database().ref(`pending/${verifycode}`).set({});
                            firebase.database().ref(`pending/${member.id}`).set({});
                        }
            
                        return interaction.editReply({ embeds: [page4], components: [], ephemeral: false });
                    };
                });

                collector.on('end', async i => {
                    var { body6 } = await snekfetch.get(`${process.env.firebaseURL}pending/${verifycode}.json`);
            
                    if (body6) {
                        firebase.database().ref(`pending/${verifycode}`).set({});
                        firebase.database().ref(`pending/${member.id}`).set({});
                    }
            
                    console.log('canceled');
                    return interaction.editReply({ embeds: [page6], components: [], ephemeral: false });
                });
            });
            
        }
    },
};
