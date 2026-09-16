const {
 EmbedBuilder,
 StringSelectMenuBuilder,
 StringSelectMenuOptionBuilder,
 ButtonBuilder,
 ActionRowBuilder,
 ButtonStyle,
 } = require('discord.js');
const { NodeactylClient } = require('nodeactyl');
const { pteroAPIKey, hostURL } = require('./config.json')
const embedForm = async (sID, inter, sel = 0) => {
	let selectMenu = new StringSelectMenuBuilder();
//select menu for all hosts
	for(let i = 0; i < hostURL.length; i++){

	let node = await new NodeactylClient(hostURL[i], pteroAPIKey[i]).getAllServers();

	selectMenu
		.setCustomId(inter.id)
                .setPlaceholder('Escolha o servidor...')
                .setMinValues(0)
                .setMaxValues(1)
                .addOptions(node.data.map((item) => new StringSelectMenuOptionBuilder()
			.setLabel(item.attributes.name)
			.setDescription('Painel: ' + hostURL[i])
                        .setValue(i+','+item.attributes.identifier)
        ));
	}
//buttons
	let start = new ButtonBuilder()
                .setCustomId('start')
                .setLabel('Iniciar')
                .setStyle(ButtonStyle.Success);

	let restart = new ButtonBuilder()
                .setCustomId('restart')
                .setLabel('Reiniciar')
                .setStyle(ButtonStyle.Primary);

	let stop = new ButtonBuilder()
                .setCustomId('stop')
                .setLabel('Parar')
                .setStyle(ButtonStyle.Danger);

	let kill = new ButtonBuilder()
                .setCustomId('kill')
                .setLabel('Kill')
                .setStyle(ButtonStyle.Danger);

	let update = new ButtonBuilder()
                .setCustomId('update')
                .setLabel('Atualizar')
                .setStyle(ButtonStyle.Secondary);
//undef server embed builder
	if(sID === 'undef'){
		let embed = new EmbedBuilder()
			.setTitle("Selecione um servidor para gerenciar.")
			.setDescription("Use o menu seletor abaixo para escolher o servidor.")
			.setColor(0xad539b);
		start.setDisabled(true);
		restart.setDisabled(true);
		stop.setDisabled(true);
		kill.setDisabled(true);
		update.setDisabled(true);
		const actRSelect = new ActionRowBuilder().addComponents(selectMenu);
	        const actRButton = new ActionRowBuilder().addComponents(update, start, restart, stop, kill);

		return { embeds: [embed], components: [actRSelect, actRButton], ephemeral: true }
	}
//catching info for selected server
	let status = await new NodeactylClient(hostURL[sel], pteroAPIKey[sel]).getServerStatus(sID);
	let info = await new NodeactylClient(hostURL[sel], pteroAPIKey[sel]).getServerDetails(sID);
	let use = await new NodeactylClient(hostURL[sel], pteroAPIKey[sel]).getServerUsages(sID);

	let gbMax = Math.round(info.limits.memory*100/1024)/100;
	let gbUse = Math.round(use.resources.memory_bytes*100/1073741824)/100;

	let cpuMax = info.limits.cpu.toString() + '%';
	let cpuUse = Math.round(use.resources.cpu_absolute*100)/100;

	let diskMax = Math.round(info.limits.disk*100/1024)/100;
	let diskUse = Math.round(use.resources.disk_bytes*100/1073741824)/100;
//building embed for selected server
        let embed = new EmbedBuilder();
	if(info.description != '') embed.addFields({ name: '\u200B', value: '*'+info.description+'*' });
	embed
                .setTitle(info.name)
		//.addFields({ name: '\u200B', value: info.description })
		.addFields({ name: '\u200B', value: '--------------------------------------------------' })
		.setFooter({ text: 'AVISO: A interação com os botões leva em torno\nde 15 segundos para atualizar. Isso é intencional.'});
	let cpuSTR = '`' + cpuUse.toString() + '%/' + cpuMax + '`';
	let gbSTR = '`' + gbUse.toString() + ' Gb/' + gbMax.toString() + ' Gb`';
	let diskSTR = '`' + diskUse.toString() + ' Gb/' + diskMax.toString() + ' Gb`';

        info = null; //cleaning variables to be sure
	use = null;

//defining server status
	switch(status){
		case 'running':
			embed
			.setDescription(':green_square: **ONLINE**')
			.addFields(
				{ name: 'Processador', value: cpuSTR, inline: true },
				{ name: 'RAM', value: gbSTR, inline: true },
				{ name: 'Disco', value: diskSTR, inline: true },
			)
			.setColor(0x1cc928);
			start.setDisabled(true);
                	restart.setDisabled(false);
        	        stop.setDisabled(false);
	                kill.setDisabled(false);
                	update.setDisabled(false);
			break;
                case 'offline':
                        embed
                        .setDescription(':red_square: **OFFLINE**')
                        .addFields(
                                { name: 'Processador', value: cpuSTR, inline: true },
                                { name: 'RAM', value: gbSTR, inline: true },
                                { name: 'Disco', value: diskSTR, inline: true },
                        )
                        .setColor(0xbf1520);
        	        start.setDisabled(false);
	                restart.setDisabled(false);
                	stop.setDisabled(true);
        	        kill.setDisabled(true);
	                update.setDisabled(false);
			break;
                case 'starting':
                        embed
                        .setDescription(':arrows_counterclockwise: **INICIANDO**')
                        .addFields(
                                { name: 'Processador', value: cpuSTR, inline: true },
                                { name: 'RAM', value: gbSTR, inline: true },
                                { name: 'Disco', value: diskSTR, inline: true },
                        )
                        .setColor(0xde9116);
                        start.setDisabled(true);
                        restart.setDisabled(true);
                        stop.setDisabled(false);
                        kill.setDisabled(false);
                        update.setDisabled(false);
			break;
                case 'stopping':
                        embed
                        .setDescription(':orange_square: **PARANDO**')
                        .addFields(
                                { name: 'Processador', value: cpuSTR, inline: true },
                                { name: 'RAM', value: gbSTR, inline: true },
                                { name: 'Disco', value: diskSTR, inline: true },
                        )
                        .setColor(0xde9116);
			start.setDisabled(true);
                        restart.setDisabled(true);
                        stop.setDisabled(true);
                        kill.setDisabled(false);
                        update.setDisabled(false);
			break;
		default:
			embed.setTitle("Selecione um servidor para gerenciar.")
                        .setDescription("Use o menu seletor abaixo para escolher o servidor.")
                        .setColor(0xad539b);
                	start.setDisabled(true);
                	restart.setDisabled(true);
                	stop.setDisabled(true);
                	kill.setDisabled(true);
                	update.setDisabled(true);
			break;
	}

//setting action rows
	const actRSelect = new ActionRowBuilder().addComponents(selectMenu);
        const actRButton = new ActionRowBuilder().addComponents(update, start, restart, stop, kill);

        return { embeds: [embed], components: [actRSelect, actRButton], ephemeral: true };
}

module.exports = embedForm;
