// I want to change this to be actual "files" in game later on 
// Whoever finds this found a "sneak peek"

const commands = { 
	"help": {
		action: function(args) {
			const cmd = args[1];

			if(cmd == undefined) {
				stdout("Available Commands\n=================\n");

				let keys = Object.keys(commands);

				for(let i = 0; i < keys.length; i++) {
					stdout(keys[i] + "\n");
				}
			} else {
				stdout(commands[args[1]].description + "\n");
			}
		},
		description: "Prints out the description of the command given"
	},
	"clear": {
		action: function(args) {
			document.getElementById("out").innerText = "";
		},
		description: "Clears input the screen"
	}
}