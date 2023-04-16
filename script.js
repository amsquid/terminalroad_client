// Variables
let outElement = document.getElementById("out");
let inElement = document.getElementById("input");

let prompt = "";

let working_directory = "/";

let input = "";

let canWrite = true;
let writingBox = false; // | symbol at the end of input

let blinking_symbol = "_";

let filesystem = new trFolder("", [
	new trFile("test.txt", "you read a file :)"),
	new trFile("test1.txt", "you read a file :)"),
	new trFile("test2.txt", "you read a file :)"),
	new trFile("test3.txt", "you read a file :)"),
	new trFolder("test_folder", [
		new trFile("file.txt", "woah you changed directories")
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

				if(folder != undefined && folder.constructor == trFolder) {
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

				if(folder != undefined && folder.constructor == trFolder) {
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

	let directory = split_path.splice(0, -1);
	let file_name = split_path[split_path.length - 1];

	let files = filesystem;

	for(let i = 0; i < directory.length; i++) {
		let dir = directory[i];

		if(dir !== "") {
			for(let x = 0; x < files.contents.length; x++) {
				let folder = files.contents[x];

				if(folder != undefined && folder.constructor == trFolder) {
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

	file.content = content;
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

				if(folder != undefined && folder.constructor == trFolder) {
					files = folder;
				
					break;
				}
			}
		}
	}

	let file_index = 0;

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
stdout("Welcome to the Terminal Road\nDon't Cheat!\n");

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