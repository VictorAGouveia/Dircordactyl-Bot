const { SlashCommandBuilder } = require('discord.js');
const embedForm = require('./../../embedForm.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('controlar')
		.setDescription('Inicia o controle dos Servidores'),
	async execute(interaction) {
		let emb = await embedForm('undef', interaction);
		await interaction.reply(emb);
	},
};
