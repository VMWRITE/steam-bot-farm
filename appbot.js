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
var autoaccept = true
client.logOn(logOnOptions);

client.on('loggedOn', () => {
    console.log('Successfully logged into Steam!');
    client.setPersona(SteamUser.EPersonaState.Online);
    client.gamesPlayed(config.games);
});

client.on('friendRelationship', (steamid, relationship) => {
    if (relationship === 2) {
		community.getSteamUser(steamid, function (err, user){
			hook.send(user.name + " | " + steamid + " accepted in friendlist");
		});
        client.addFriend(steamid);
        client.chatMessage(steamid, `:violetjelly: Ｈｅｙ，　ｍｙ　ｂｏｔ　ｈａｓ　ａｃｃｅｐｔｅｄ　ｙｏｕｒ　ｉｎｖｉｔａｔｉｏｎ．　Ｗｈａｔ　ａｒｅ　ｕ　ｗａｎｔ　？ :violetjelly:
		:violetjelly: Привет. Мой бот принял твой запрос. Что ты хочешь ? :violetjelly:`);
    }
});

client.on("friendOrChatMessage", function(steamID, message, room) {
	if (steamID == "76561198144217938"){
	  if (message == "!automsg"){
client.chatMessage(steamID,SteamTopt.generateAuthCode(process.env.shared) );
		if (automsgs) {
			automsgs = false
			client.chatMessage(steamID, "/code ＡＵＴＯ　ＭＥＳＳＡＧＥＳ　ＤＩＳＡＢＬＥＤ．");
		}else{
			automsgs = true
			client.chatMessage(steamID, "/code ＡＵＴＯ　ＭＥＳＳＡＧＥＳ　ＥＮＡＢＬＥＤ．");
		}
	  }else if(message == "!accept"){
		if (autoaccept) {
			autoaccept = false
			client.chatMessage(steamID, "/code ＡＵＴＯ　autoaccept　ＤＩＳＡＢＬＥＤ．");
		}else{
			autoaccept = true
			client.chatMessage(steamID, "/code ＡＵＴＯ　autoaccept　ＥＮＡＢＬＥＤ．");
		}
	  }
	}
});
client.on("friendMessage", function(steamID, message) 
    if (message && automsgs) {
        client.chatMessage(steamID, "Hello, im Ro-Bot-OZ. Ozaron cant talk with you now because he's sleeping. :steambored: Enter a message in comments, thank you.");
		client.chatMessage(steamID, "/sticker " + randomgifs[Math.floor( Math.random() * randomgifs.length )]);
    }else if(message == "!clearchat" || message == "!cc"){
		client.chatMessage(steamID, 
		`ᅠ
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		ᅠ
		`);
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
