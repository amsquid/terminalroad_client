// Variables
let outElement = document.getElementById("out");
let inElement = document.getElementById("input");

let prompt = "";

let working_directory = "/";

let input = "";

let canWrite = true;
let writingBox = false; // Blinking symbol at the end of input

let logging_in = true;

let login_prompt = 0;
let ip, user, pass;

let blinking_symbol = "_";

let filesystem = new trFolder("", [
	new trFolder("bin", [
		new trFile("test_app", "echo The app works!; echo Automation is incredible!")
	])
]);

const socket = io("http://localhost:3000", {
	withCredentials: false
});

// Functions
function signin(ip, username, password) {
	socket.emit("login", {
		"ip": ip,
		"username": username,
		"password": password
	});
}

// Startup Code
stdout("Welcome to the Terminal Road\nType help for the list of commands\nBy playing this game, you aknowledge that any information you input into the game can be stolen by other players.\n");

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

					if(!logging_in) {
						let split = input.split(" ");
						let command = split[0];

						if(commands[command] != undefined) {
							interpret(input);
						} else {
							let files = findFilesInDir("/bin");

							let content;

							for(let i = 0; i < files.contents.length; i++) {
								if(command === files.contents[i].name) {
									content = files.contents[i].content;
								}
							}

							if(content == undefined) {
								stdout("Illegal Command\n");
							} else {
								interpret(content);
							}
						}
					} else {
						login_prompt++;

						if(login_prompt == 3) {
							signin(ip, user, pass);

							login_prompt = -1;

							canWrite = false;

							updateInput();
						}
					}

					input = "";

					window.scrollTo(0, document.body.scrollHeight);

					break;

				case "Backspace":
					input = input.slice(0, -1);
					break;
			}
		}

		writingBox = true;

		updateInput();
	}
});

// Socket events
socket.on("signed_in", (data) => {
	let signed_in = data['successful'];

	logging_in = !signed_in;
	canWrite = true;
	login_prompt = 0;

	if(!signed_in) {
		stdout("Invalid Login...\n");
	}
})

// Intervals
setInterval(() => {
	writingBox = !writingBox;

	updateInput();
}, 500);