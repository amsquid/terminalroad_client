// Variables
let outElement = document.getElementById("out");
let inElement = document.getElementById("input");

let prompt = "";

let working_directory = "/";

let input = "";

let canWrite = true;
let writingBox = false; // | symbol at the end of input

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
		inElement.innerText = prompt + input + "|";
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
				}
			}
		}
	}

	return files;
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