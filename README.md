DISCLAIMER: Este repositório tem como finalidade arquivamento de um projeto antigo que consegui recuperar para portfólio. O código é antigo, e pode estar ultrapassado ou conter falhas de segurança. USE POR SUA CONTA E RISCO!
# Discordactyl Bot
Este é um bot para servidores no Discord para gerenciar de forma básica servidores de jogos hospedados em paineis Pterodactyl, permitindo que usuários possam conferir o status do servidor, ligar, desligar e reiniciar servidores sem precisar acessar o painel. O mesmo foi desenvolvido com a biblioteca [*discord.js*](https://discord.js.org/).

## Configuração

Para o bot funcionar corretamente, são necessários pelo menos quatro informações presentes no arquivo config.json:
```
"DiscBotToken" - Token de acesso para seu bot no discord;
"clientId" - O ID de aplicativo do seu bot;
"pteroAPIKey" - A chave de acesso para a API do seu painel Pterodactyl;
"hostURL" - O url de acesso para o seu painel (precisa ser um URL público)
```
Para aprender a obter o Token e ID do seu bot, acesse [aqui](https://docs.discord.com/developers/quick-start/getting-started)
Para aprender a obter sua chave API do pterodactyl, acesse [aqui](https://pteroapi.com/docs/api/client#getting-started)

O arquivo config.json.example possui um layout padrão para a aplicação. As variáveis "pteroAPIKey" e "hostURL" são listas, para adicionar suporte para múltiplos hosts de servidores. Para adicionar mais de um servidor, basta adicionar **em ordem** as APIs e os URLs, exemplo:

```
{
...
  "pteroAPIKey": ["API-do-host-1", "API-do-host-2"],
	"hostURL": ["https://link.host.1", "https://link.host.2"]
}
```

## Inicialização
Primeiramente, deve se garantir que todas as dependências para o programa estão satisfeitas, abrindo a pasta raiz do bot no terminal e executando
```
npm install
```

Depois, deve-se registrar os comandos que fazem o bot funcionar com
```
node deploy-commands.js
```
Por fim, basta iniciar o bot com
```
node .
```

## Uso no Discord
`/controlar` - Inicia a caixa de diálogos do bot.

O bot opera a partir dessa caixa de diálogos inicial, possuindo botões para realizar as ações que é capaz.
