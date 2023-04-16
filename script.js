// Variables
let outElement = document.getElementById("out");
let inElement = document.getElementById("input");

let prompt = "";

let working_directory = "/";

let input = "";

let canWrite = true;
let writingBox = false; // Blinking symbol at the end of input

let blinking_symbol = "_";

let filesystem = new trFolder("", [
	new trFolder("bin", [
		new trFile("test_app", "echo The app works!; echo Automation is incredible!")
	])
]);

// Functions
function stdout(out) {
	outElement.innerText += out;

	return out;
}

function updateInput() {
	prompt = "guest@road:" + working_directory + "$ ";

	if(writingBox) {
		inElement.innerText = prompt + input + blinking_symbol;
	} else {
		inElement.innerText = prompt + input;
	}
}

function findFilesInDir(folder_path) {
	let directory = folder_path.split("/");

	let files = filesystem;

	for(let i = 0; i < directory.length; i++) {
		let dir = directory[i];

		if(dir !== "") {
			for(let x = 0; x < files.contents.length; x++) {
				let folder = files.contents[x];

				if(folder != undefined && folder.constructor == trFolder && folder.name == dir) {
					files = folder;

					break;
				}
			}
		}
	}

	return files;
}

function addFileToDir(folder_path, file) {
	let directory = folder_path.split("/");

	let files = filesystem;

	for(let i = 0; i < directory.length; i++) {
		let dir = directory[i];

		if(dir !== "") {
			for(let x = 0; x < files.contents.length; x++) {
				let folder = files.contents[x];

				if(folder != undefined && folder.constructor == trFolder && folder.name == dir) {
					files = folder;

					break;
				}
			}
		}
	}

	files.contents.push(file);
}

function writeToFile(file_path, content) {
	let split_path = file_path.split("/");

	let file_name = split_path[split_path.length - 1];
	
	split_path.pop(); // Gets only the directories without the file

	let files = filesystem;

	for(let i = 0; i < split_path.length; i++) {
		let dir = split_path[i];

		if(dir !== "") {
			for(let x = 0; x < files.contents.length; x++) {
				let folder = files.contents[x];

				if(folder != undefined && folder.constructor == trFolder && folder.name == dir) {
					files = folder;

					break;
				}
			}
		}
	}

	let file;

	for(let i = 0; i < files.contents.length; i++) {
		let file_ = files.contents[i];

		if(file_.name == file_name) {
			file = file_;

			break;
		}
	}

	if(file == undefined) {
		return -1;
	} else {
		file.content = content;
	}
}

function delFile(file_path) {
	let split_path = file_path.split("/");

	let directory = split_path.splice(0, -1);
	let file_name = split_path[-1];

	let files = filesystem;

	for(let i = 0; i < directory.length; i++) {
		let dir = directory[i];

		if(dir !== "") {
			for(let x = 0; x < files.contents.length; x++) {
				let folder = files.contents[x];

				if(folder != undefined && folder.constructor == trFolder && folder.name == dir) {
					files = folder;
				
					break;
				}
			}
		}
	}

	let file_index = -1;

	for(let i = 0; i < files.contents.length; i++) {
		let file = files.contents[i];

		if(file.name == file_name) {
			file_index = i;

			break;
		}
	}

	files = files.contents.splice(file_index, 1);
}

// Startup Code
stdout("Welcome to the Terminal Road\nType help for the list of commands\n");

updateInput();

// Events
document.addEventListener("keydown", (e) => {
	e.preventDefault();

	if(canWrite) {
		const key = e.key;

		if(key.length == 1) {
			input += key;
		} else {
			switch(key) {
				case "Enter": // Running commands
					stdout(prompt + input + "\n");

					let split = input.split(" ");
					let command = split[0];

					if(commands[command] != undefined) {
						commands[command].action(split);
					} else {
						stdout("Illegal Command\n");
					}

					input = "";

					window.scrollTo(0, document.body.scrollHeight);

					break;

				case "Backspace":
					input = input.slice(0, -1);
			}
		}

		writingBox = true;

		updateInput();
	}
});

// Intervals
setInterval(() => {
	writingBox = !writingBox;

	updateInput();
}, 500);