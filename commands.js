// I want to change this to be actual "files" in game later on 
// Whoever finds this found a "sneak peek"

const commands = { 
	"help": {
		action: function(args) {
			const cmd = args[1];

			if(cmd == undefined) {
				let keys = Object.keys(commands);
				let vals = Object.values(commands);

				for(let i = 0; i < keys.length; i++) {
					stdout(keys[i] + " - " + vals[i].description + "\n");
				}
			} else {
				stdout(commands[args[1]].description + "\n");
			}
		},
		description: "Prints out the description of the command given | help <command>"
	},
	"clear": {
		action: function(args) {
			document.getElementById("out").innerText = "";
		},
		description: "Clears input the screen"
	},
	"echo": {
		action: function(args) {
			for(let i = 1; i < args.length; i++) {
				stdout(args[i] + " ");
			}

			stdout("\n");
		},
		description: "Prints the given arguments into the stdout"
	},
	"ls": {
		action: function(args) {
			let files = findFilesInDir(working_directory);

			for(let i = 0; i < files.contents.length; i++) {
				let file = files.contents[i];

				stdout(file.name + "  ");
			}

			stdout("\n");
		},
		description: "Prints the current directory's files to the stdout | ls"
	},
	"cat": {
		action: function(args) {
			let file_name = args[1];

			let files = findFilesInDir(working_directory);

			for(let i = 0; i < files.contents.length; i++) {
				let file = files.contents[i];

				if(file.name == file_name && file.constructor == trFile) {
					stdout(file.content + "\n");

					return;
				}
			}

			stdout("File does not exist\n");

		},
		description: "Prints the contents of a file | cat <file>"
	},
	"cd": {
		action: function(args) {
			let folder_name = args[1];

			let files = findFilesInDir(working_directory);

			if(folder_name == "..") {
				let dir_split = working_directory.split("/");

				dir_split = dir_split.splice(0, -1);

				working_directory = dir_split.join("/");

				if(working_directory == "") working_directory = "/"; // Just to have it there, no real change
			} else {
				for(let i = 0; i < files.contents.length; i++) {
					let file = files.contents[i];

					if(file.name == folder_name && file.constructor == trFolder) {
						working_directory += folder_name + "/";

						return;
					}
				}

				stdout("Folder does not exist\n");
			}
		},
		description: "Changes directory to given directory | cd <dir>"
	},
	"touch": {
		action: function(args) {
			let file_name = args[1];

			let file = new trFile(file_name, "");

			addFileToDir(working_directory, file);
		},
		description: "Creates file with given name in current directory"
	},
	"put": {
		action: function(args) {
			let file_name = args[1];
			let content = "";

			for(let i = 2; i < args.length; i++) {
				content += args[i] + " ";
			}

			let file = new trFile(file_name, content);

			let path = working_directory + file_name;

			writeToFile(path, content);
		},
		description: "Overwrites file with given text | put <file name> <content>"
	}
}