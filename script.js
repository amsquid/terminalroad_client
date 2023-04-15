// Variables
let outElement = document.getElementById("code");
let inElement = document.getElementById("input");

const prompt = "guest@road:~$ "; // Temporary prompt for now

let input = "";

let canWrite = true;
let writingBox = false; // ▌ symbol at the end of input

// Functions
function stdout(out) {
	outElement.innerText += out;

	return out;
}

function updateInput() {
	if(writingBox) {
		inElement.innerText = prompt + input + "▌";
	} else {
		inElement.innerText = prompt + input;
	}
}

// Startup Code
stdout("Welcome to the Terminal Road\nDon't Cheat!\n");

// Events
document.addEventListener("keydown", (e) => {
	if(canWrite) {
		const key = e.key;

		if(key.length == 1) {
			input += key;
		} else {
			switch(key) {
				case "Enter":
					stdout(prompt + input + "\n");

					input = "";
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