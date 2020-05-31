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
var randomgifs = ["Winter2019BirdPlop", "Winter2019CocoaCheers", "Winter2019SaltShaker", "Winter2019SnowmanGoodbye"];
var automsgs = false

client.logOn(logOnOptions);

client.on('loggedOn', () => {
    console.log('Successfully logged into Steam!');
    client.setPersona(SteamUser.EPersonaState.Invisible);
    client.gamesPlayed(config.games);
});

client.on("friendOrChatMessage", function(steamID, message, room) {
	if (steamID == "76561198151537298" && message == "!automsg"){
		if (automsgs) {
			automsgs = false
			client.chatMessage(steamID, "Auto msgs disabled");
		}else{
			automsgs = true
			client.chatMessage(steamID, "Auto msgs enabled");
		}
	}
});

client.on("friendMessage", function(steamID, message) {
	if (steamID == "76561198144217938" && message == "!automsg"){
		if (automsgs) {
			automsgs = false
			client.chatMessage(steamID, "Auto msgs disabled");
		}else{
			automsgs = true
			client.chatMessage(steamID, "Auto msgs enabled");
		}
	}
    if (message && automsgs) {
        client.chatMessage(steamID, "Hello, " + steamID.getSteam3RenderedID() +", im Ro-Bot-OZ. Ozaron cant talk with you now because he's sleeping. :steambored: Enter a message in comments, thank you.");
		client.chatMessage(steamID, "/sticker " + randomgifs[Math.floor( Math.random() * randomgifs.length )]);
    }
});

client.on('webSession', (sessionid, cookies) => {
    manager.setCookies(cookies);

    community.setCookies(cookies);
    community.startConfirmationChecker(15000, process.env.identity);
});

process.on('SIGINT', function() {
	console.log("Logging off...");
	shutdown();
});

function shutdown(code) {
	client.logOff();
	client.once('disconnected', function() {
		process.exit(code);
	});

	setTimeout(function() {
		process.exit(code);
	}, 500);
}
