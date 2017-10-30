const login = require("facebook-chat-api"),
	fs = require('fs'),
	afox = require('./admins.js'),
	botId = "100022605855740"; // BOT IT !IMPORTANT

var useChar = "/";
var spokoj = true,
	ai = false;
	// All commands starts here:
var commands = [
	{
		cmd: "help",
		groupAccess: false,
		transform: true,
		hidden: false,
		syntax: " --",
		desc: "Pomoc",
		func: (api, event, args) => {

		}
	},
	{
		cmd: "cmdchar",
		groupAccess: false,
		transform: true,
		hidden: false,
		syntax: "character",
		desc: "Znak komendy. domyślnie /",
		func: (api, event, args) => {
	       if(afox.isAdmin(event.senderID)){
 				if(args == ""){
	                api.sendMessage("Znak komendy to " + useChar, event.threadID);                
 				} else if(args.length == 1)
	            {
	                useChar = args;
	                api.sendMessage("Znak komendy ustawiono na " + args, event.threadID);
	            } else{
	                api.sendMessage("Znak komendy musi być pojedynczym znakiem alfanumerycznym!", event.threadID);
	            }
	       } else{
	       		api.sendMessage("[NoAdmin] Nie masz uprawnień do tej komendy!", event.threadID);
	       }
		}
	},
	{
		// toFix : Sprawdzić na czym polega (usunieta jedna linijka kodu)
		cmd: "test",
		groupAccess: false,
		transform: false,
		hidden: false,
		syntax: " [--parameter]",
		desc: "Komenda do testowania",
		func: (api, event, args) => {
			api.sendMessage("Args:" + "\n" + args, event.threadID);
        }
    },
    {
    	// Zmiana koloru czatu
        cmd: "color",
		groupAccess: false,
		transform: true,
		hidden: false,
        syntax: " RRGGBB/RGB",
        desc: "Zmiana koloru czatu",
        func: (api, event, args) => {
			let color = args;
           
            if(args.length == 3)
            {
                color = args[0] + args[0] + args[1] + args[1] + args[2] + args[2];   
            }
            
            if(color.length == 6)
            {
                api.changeThreadColor(color, event.threadID, (err) => {
                    if (err)
                    {
                        api.sendMessage("Niepoprawne kolory!", event.threadID);

                        return console.error(err);   
                    }
                    else{
                     api.sendMessage("Kolory zmienione.",event.threadID);
                    }
                });    
            }
            else{
                api.sendMessage("Źle wpisałeś kolory mistrzu", event.threadID);
            }
        }
    },
    {
    	// Zmiana emoji
        cmd: "emoji",
		groupAccess: false,
		transform: false,
		hidden: false,
        syntax: " EMOJI",
        desc: "Zmiana emoji czatu",
        func: (api, event, args) => {
            api.changeThreadEmoji(args, event.threadID, (err) => {
                if(err){
                    api.sendMessage(args + " Złe emoji!", event.threadID);
                    
                    return console.error(err);
                }
            });
            api.sendMessage("Ustawiłem emoji czatu na " + args, event.threadID);
        }
    },
    {
    	// Wypisywanie tekstu toFix sprawdzic dzialanie
        cmd: "echo",
		groupAccess: false,
		transform: false,
		hidden: false,
        syntax: " TEXT",
        desc: "Wyprowadzanie tekstu podanego jako argument",
        func: (api, event, args) => {
            let arguments = args.split('|');
            
            for(let i = 0; i < arguments.length; i++)
                api.sendMessage(arguments[i], event.threadID);
        }
    },
    {
    	// Dodaje uzytkownika toFix [dodac error: nie ma takiego uzytkownika]
        cmd: "add",
		groupAccess: false,
		transform: false,
		hidden: false,
        syntax: "[name]",
        desc: "Dodaje uzytkownika",
        func: (api, event, args) => {
			api.getUserID(args, (err, data) => {
				if(err){ return callback(err) };
				let foundID = data[0].userID;
				api.addUserToGroup(foundID, event.threadID);
            });
        }
    },
    {
    	//ID USERA
        cmd: "senderid",
		groupAccess: false,
		transform: false,
		hidden: false,
        syntax: "[name]",
        desc: "Zwraca ID użytkownika",
        func: (api, event, args) => {
            api.sendMessage("ID :" + "\n" + event.senderID, event.threadID);
        }
    },
    {
        cmd: "random",
		groupAccess: false,
		transform: false,
		hidden: false,
        syntax: "",
        desc: "Wyswietla losowy numer (0-100)",
        func: (api, event, args) => {
              var randnumber = Math.floor(Math.random() * 100) + 1;
            api.sendMessage("Twoj numer to: " + randnumber, event.threadID);
        }
    },
    {
    	// toFix: CMD ALIAS HERE!
        cmd: "wypierdalac",
        cmdAlias: "removeall",
		groupAccess: false,
		transform: false,
		hidden: true,
        syntax: "",
        desc: "Wyrzuca wszystkich z konferencji.",
        func: (api, event, args) => {
			if(afox.isAdmin(event.senderID)) {
				api.getThreadInfo(event.threadID, (err, info) => {
					if(err !== null){ return console.error(err); }
					let IDs = info.participantIDs;
					let users = info.participantIDs.length -1;
					api.sendMessage("Proces uruchomiony. Obiektów: " + users-1, event.threadID);

					setTimeout(function(){ 
						for (let i = 0; i < users; i++) {
							if(IDs[i] == "100001810636246"){
								console.log("Twórca nie może zostać usuniety.");
							}
							else{
								api.removeUserFromGroup(IDs[i], event.threadID);
							}
						};
					}, 300);
				});
			}
            else{
                api.sendMessage("[NoAdmin] Nie masz uprawnień cwaniaczku ;)))", event.threadID);
            }
        }
    },
	{
        cmd: "msginfo",
		groupAccess: false,
		transform: false,
		hidden: false,
        syntax: "",
        desc: "Liczba napisanych wiadomości od momentu dodania bota.",
        func: (api, event, args) => {
            api.getThreadInfo(event.threadID, (err, info) => {
                if(err){
                   return callback(err);
                }
             api.sendMessage("Zostało tutaj wyslane " + info.messageCount + " wiadomości.", event.threadID);     
            }); 
        }
    },
    {
        cmd: "bot",
		groupAccess: false,
		transform: false,
		hidden: false,
        syntax: "[name]",
        desc: "zmienia nazwe bota",
        func: (api, event, args) => {
            let newBotName = args.charAt(0).toUpperCase() + args.slice(1);
            let msg = {
                body: "Od dzisiaj nazywam sie " + newBotName + "!",
                attachment: api.changeNickname(newBotName, event.threadID, botId)
            };
            api.sendMessage(msg, event.threadID);
        }
    },
    {
    	// toFix: Sprawdzić czy dziala
        cmd: "kick",
		groupAccess: false,
		transform: true,
		hidden: false,
        syntax: "[user_id]",
        desc: "Wyrzuca użytkownika.",
        func: (api, event, args) => {
            if(args != ""){
                api.getUserID(args, (err, data) => {
	                if(err){
	                    return callback(err);
	                }

	                let idtoban = data[0].userID;
	                if (idtoban === "100001810636246") {
	                    api.removeUserFromGroup(event.senderID, event.threadID);
	                } else {
	                    api.removeUserFromGroup(idtoban, event.threadID);    
	                }
	            });
        	}
        }
    },
    {
        cmd: "search",
		groupAccess: false,
		transform: true,
		hidden: false,
        syntax: "",
        desc: "Wyszukuje ID usera",
        func: (api, event, args) => {
            api.getUserID(args, function(err, data) {
            if(err){
                return callback(err);
            }

            let foundID = data[0].userID;
            api.sendMessage("Wynik wyszukiwania dla " + args + ": " + foundID, event.threadID);
            });
        }
    },
    {
		cmd: "selfkick",
		groupAccess: false,
		transform: true,
		hidden: true,
        syntax: "",
        desc: "Wyrzuca bota.",
        func: (api, event, args) => {
			if(afox.isAdmin(event.senderID)) {
				api.removeUserFromGroup(botId, event.threadID);
			}
			else{
				api.sendMessage("[NoAdmin] Brak uprawnień!", event.threadID);
			}
        }
    },
    {
		cmd: "moneta",
		groupAccess: false,
		transform: true,
		hidden: false,
        syntax: "",
        desc: "Rzut monetą (orzeł/reszka)",
        func: (api, event, args) => {
			let moneta = Math.floor(Math.random() * 2) + 1;
			if (moneta == 1){
				api.sendMessage( "Reszka" , event.threadID);
			}
			if (moneta == 2){
				api.sendMessage( "Orzeł" , event.threadID);
			}
        }
    },
    {
    	// ToFix: Sprawdzic dzialanie.
        cmd: "nick",
		groupAccess: false,
		transform: false,
		hidden: false,
        syntax: " [nazwa]|[nick]",
        desc: " Zmienia nick użytkownika",
        func: (api, event, args) => {
            let nickArgs = args.split("|", 2);
            api.getUserID(nickArgs[0], function(err, data) {
                if(err){
                    return callback(err);
                }
                let idToChange = data[0].userID;
				// let newnick = nickArgs[1].charAt(0).toUpperCase() + nickArgs[1].slice(1);
                api.changeNickname(nickArgs, event.threadID, idToChange, function callback(err) {
                    if(err) return console.error(err);
                });
            });
        }
    }
];

// Logowanie:
login({
  email: "logg.webfoxcode@gmail.com",
  password: "pass"
}, function callback(err, api) {
	if(err){
		return console.error(err);
	}
	api.setOptions({ listenEvents: true }); // Słuchanie eventów: True
	// api.sendMessage("Pomyślny restart \n Witam ponownie :)", defaultGroupId);


	// Addtons
	var stopListening = api.listen(function(err, event) {
		if (err){
			return console.error(err);
		}

		fs.writeFileSync('appstate.json', JSON.stringify(api.getAppState()));

		api.markAsRead(event.threadID, (err) => {
			if(err) console.error(err);
        });


        switch(event.type) {
            case "message":

				if (!spokoj){ // Only for somm [ToDevelop]
					if (event.senderID === "100003359877664"){
						let mess = ["Critical error: radek sie odzywa","Japierdole radek","chuj nas to obchodzi radek","Ucisz sie radoslaw", "radek spokojnie", "UCISZ KTOS RADKA", "ehh nie moge sluchac tego pierdolenia"];
						api.sendMessage(mess[Math.floor(Math.random() * 7) + 1], event.threadID);
						break; 
					}
				}
				if(event.body === '/spokoj') {
					if(afox.isAdmin(event.senderID)) {
						api.sendMessage("Masz dzisiaj szczescie radek.", event.threadID);
						spokoj = true;
					}
					else{
						api.sendMessage("Nie masz uprawnien kurwa >:(", event.threadID);
					}
				}
				if(event.body === '/stop') {
                    // Zatrzymuje bota.
					if(afox.isAdmin(event.senderID)){
						api.sendMessage("BOT zostaje wylączony.", event.threadID);
						return stopListening();
					} else{
						api.sendMessage("[NoAdmin] Nie masz uprawnień do wyłączenia mnie! >:(", event.threadID);
					}
                }
                /////// A I  M O D E \\\\\\\ toFix - przenieść do commands
				if(event.body === '/AI on' || event.body === '/ai on') {
                    // Włącza tryb AI.
					if(afox.isAdmin(event.senderID)){
						api.sendMessage("[AI] Włączam tryb sztucznej inteligencji.", event.threadID);
						ai = true;
					} else{
						api.sendMessage("[NoAdmin] Nie masz uprawnień.", event.threadID);
					}
                }
				if(event.body === '/AI off' || event.body === '/ai off') {
                    // Wyłącza tryb AI
					if(afox.isAdmin(event.senderID)){
						api.sendMessage("[AI] Wyłączam tryb sztucznej inteligencji.", event.threadID);
						ai = false;
					} else{
						api.sendMessage("[NoAdmin] Nie masz uprawnień.", event.threadID);
					}
                }



                if(ai){
            		api.sendMessage("Moduł AI jest włączony!", event.threadID);
            	}



				/// Strefa testów:
            	//////////// WORK WORK WORK
		        if (typeof(event.body) == "string") {
					var input = event.body.toLowerCase();
					var split = input.split(' ');
		                    
					if(input == "cmdchar"){
						commands[1].func(api, event, "");
					}
					if(input[0] == useChar){
						var cmd = split[0].substring(1);
						var args = input.slice(split[0].length + 1);
		                        
						for(var i = 0; i < commands.length; i++){   
							if(cmd == commands[i].cmd){
								if(typeof(commands[i].func) == "function"){
									console.log("Executed: '" + cmd + "'");
									commands[i].func(api, event, args);
								}
								else{
									api.sendMessage(JSON.stringify(commands[i]), event.threadID);
								}
							}
						}
					}
				}
                break;
            case "event":
                console.log(event);
                break;
        }
    });
});