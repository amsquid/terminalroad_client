function stdout(out) {
	outElement.innerText += out;

	return out;
}

function isFolder(obj) {
	return obj.contents != undefined;
}

function isFile(obj) {
	return obj.content != undefined;
}

function save() {
	socket.emit("save", {"files": filesystem});
}

function updateInput() {
	if(logging_in) {
		switch(login_prompt) {
			case -1:
				prompt = "";

			case 0:
				prompt = "IP: ";
				ip = input;
				break;

			case 1:
				prompt = "Username: ";
				user = input;
				break;

			case 2:
				prompt = "Password: ";
				pass = input;
				break;

			case 3:
				let signed_in = signin(ip, user, pass);

				login_prompt = 0;

				updateInput();
		}
	} else {
		prompt = user + "@" + ip + ":" + working_directory + "$ ";
	}

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

				if(folder != undefined && isFolder(folder) && folder.name == dir) {
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

				if(folder != undefined && isFolder(folder) && folder.name == dir) {
					files = folder;

					break;
				}
			}
		}
	}

	files.contents.push(file);

	save();
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

				if(folder != undefined && isFolder(folder) && folder.name == dir) {
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

	save();
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

				if(folder != undefined && isFolder(folder) && folder.name == dir) {
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

	save();
}
