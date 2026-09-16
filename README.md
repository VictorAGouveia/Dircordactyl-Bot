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
