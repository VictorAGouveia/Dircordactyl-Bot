// Require the necessary discord.js classes
const fs = require('node:fs');
const path = require('node:path');
const {
 Client,
 Collection,
 Events,
 GatewayIntentBits,
 EmbedBuilder,
 StringSelectMenuBuilder,
 StringSelectMenuOptionBuilder,
 ButtonBuilder,
 ActionRowBuilder,
 ButtonStyle,
 } = require('discord.js');
const { DiscBotToken, pteroAPIKey, hostURL } = require('./config.json');
const { NodeactylClient } = require('nodeactyl');
const { setTimeout } = require('timers/promises');
let actualServer = 'undef';
let selPanel = 0;

const embedForm = require('./embedForm.js');

// Create a new client instance and command handler
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.on(Events.InteractionCreate, async interaction => {
	if(interaction.isButton()){
		await interaction.deferReply({ ephemeral: true });
		//after defering reply, start embed process
		try{
		//use switch to determine wich button was pressed
		let request;
		switch(interaction.customId){
			case 'start':
				request = await new NodeactylClient(hostURL[selPanel], pteroAPIKey[selPanel]).startServer(actualServer);
			break;
			case 'stop':
                                request = await new NodeactylClient(hostURL[selPanel], pteroAPIKey[selPanel]).stopServer(actualServer);
                        break;
                        case 'restart':
                                request = await new NodeactylClient(hostURL[selPanel], pteroAPIKey[selPanel]).restartServer(actualServer);
                        break;
                        case 'kill':
                                request = await new NodeactylClient(hostURL[selPanel], pteroAPIKey[selPanel]).killServer(actualServer);
                        break;
			case 'update':
			break;
                        default:
				throw new Error('Button not found, try again'); //lol, lmao even
                        break;
		}
		await setTimeout(15000); //await time for ptero. api updating, idk why it is that long but if i put less sometimes it just wont update, then edits reply
		let embed = await embedForm(actualServer, interaction);
		interaction.editReply(embed);
		} catch (error){
			//transform error in string, reduce its size for response content
			var stringErr = error.toString();
			var trimErr = stringErr.length > 48 ? stringErr.substring(0, 48) + "..." : stringErr;
			//throw error in log with date, console and then message for user
			let date = new Date();
			let strDate = date.toISOString();
			fs.writeFileSync('./errorLogs/errorLog'+strDate+'.txt', 'Erro em ButtonInteraction:\n' + stringErr);
                        console.log(stringErr);
			interaction.editReply({ content: 'Ops! Parece que teve um erro, reenvie o comando e tente novamente.\nSe o erro persistir, contate o criador do bot.\n`'+trimErr+'`', ephemeral: true });
		}
	}
	if(interaction.isStringSelectMenu()){
		await interaction.deferReply({ ephemeral: true });
		//after defering reply, start embed process
		try{
		//separate selected panel and server from values (check embedForm.js for value definition)
		let inputs = interaction.values[0].split(',');
		actualServer = inputs[1];
		selPanel = inputs[0];
		//get new embed for server control, then edit reply
		const embed = await embedForm(actualServer, interaction, selPanel);
		await interaction.editReply(embed);
		} catch(error){
                        //transform error in string, reduce its size for response content
                        var stringErr = error.toString();
                        var trimErr = stringErr.length > 48 ? stringErr.substring(0, 48) + "..." : stringErr;
                        //throw error in log with date, console and then message for user
                        let date = new Date();
                        let strDate = date.toISOString();
			fs.writeFileSync('./errorLogs/errorLog'+strDate+'.txt', 'Erro em SelectInteraction:\n' + stringErr);
			console.log(stringErr);
			interaction.editReply({ content: 'Ops! Parece que teve um erro, reenvie o comando e tente novamente.\nSe o erro persistir, contate o criador do bot.\n`'+trimErr+'`', ephemeral: true });
                }
	}
	if (interaction.isChatInputCommand()){
                const command = interaction.client.commands.get(interaction.commandName);
		//if no command, stop. if command, commands
                if (!command) {
                        console.error(`No command matching ${interaction.commandName} was found.`);
                        return;
        }
	try {
		await command.execute(interaction);
	} catch (error) {
		//transform error in string
                var stringErr = error.toString();
                //throw error in log with date and console, no need for specific user message here << past me was dumb
		//added user message because it drove me crazy randomly one day
                let date = new Date();
                let strDate = date.toISOString();
                fs.writeFileSync('./errorLogs/errorLog'+strDate+'.txt', 'Erro em SelectInteraction:\n' + stringErr);
                console.log(stringErr);
		var trimErr = stringErr.length > 48 ? stringErr.substring(0, 48) + "..." : stringErr;
		//"hey! something wrong isnt right!"
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!\n`'+trimErr+'`', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!\n`'+trimErr+'`', ephemeral: true });
		}
	}
}});

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// Log in to Discord with your client's token
client.login(DiscBotToken);
