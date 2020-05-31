const config = require('./config.json');

const SteamUser = require('steam-user'),
    SteamTopt = require('steam-totp'),
    SteamCommunity = require('steamcommunity'),
    TradeOfferManager = require('steam-tradeoffer-manager');

const client = new SteamUser(),
    community = new SteamCommunity();
const manager = new TradeOfferManager({
    steam: client,
    community: community,
    language: 'en'
});

const logOnOptions = {
    accountName: process.env.login,
    password: process.env.password,

    twoFactorCode: SteamTopt.generateAuthCode(process.env.shared),
};

client.logOn(logOnOptions);

client.on('loggedOn', () => {
    console.log('Successfully logged into Steam!');
    client.setPersona(SteamUser.EPersonaState.Online);
    client.gamesPlayed(config.games);
});

client.on("friendMessage", function(steamID, message) {
    if (message) {
        client.chatMessage(steamID, "Hello, im Ro-Bot-OZ. Ozaron cant talk with you now because he's sleeping. :steambored: Enter a message in comments, thank you.");
		client.chatMessage(steamID, "/sticker Winter2019CocoaCheers");
		console.log(message);
    }
});

client.on('webSession', (sessionid, cookies) => {
    manager.setCookies(cookies);

    community.setCookies(cookies);
    community.startConfirmationChecker(15000, process.env.identity);
});
