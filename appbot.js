// Vienna Bot v2.0

/**
 * This code's prerequisites are:
 * npm install steam-user
 * npm install steam-totp
 * npm install steam-tradeoffer-manager
 * npm install steamcommunity
 */

 // Imports
const config = require('./config.json');


 // Constants
const SteamUser = require('steam-user'),
    SteamTopt = require('steam-totp'),
    SteamCommunity = require('steamcommunity'),
    TradeOfferManager = require('steam-tradeoffer-manager');

// Objects
const client = new SteamUser(),
    community = new SteamCommunity();
const manager = new TradeOfferManager({
    steam: client,
    community: community,
    language: 'en'
});

// Logins on Steam and simulates its client
const logOnOptions = {
    accountName: "fly_rice",
    password: "A1e2Z3a4K5m6I7%80",

    twoFactorCode: SteamTopt.generateAuthCode("+PZQijrvp4+uOe+mwtpsTCLjTBU="),
};

client.logOn(logOnOptions);

client.on('loggedOn', () => {
    console.log('Successfully logged into Steam!');

    // Sets status (can also receive a second parameter to change steam name i.e , 'lafter' )
    client.setPersona(SteamUser.EPersonaState.Online);
    // Sets currently currently playing
    client.gamesPlayed(config.games); // <- gameID
});

client.on("friendMessage", function(steamID, message) {
    if (message) {
        client.chatMessage(steamID, "Hello, im Ro-Bot-OZ. Ozaron cant talk with you now because he's sleeping. :steambored: Enter a message in comments, thank you.");
		client.chatMessage(steamID, "/sticker Winter2019CocoaCheers");
		console.log(message);
    }
});

// Event listener to pass the cookies to the manager
client.on('webSession', (sessionid, cookies) => {
    manager.setCookies(cookies);

    community.setCookies(cookies);
    community.startConfirmationChecker(15000, "2sD6At18PwAYX187Tu5XdPtbicI="); // <- checks if there's any pending confirmation every 10 secs
});