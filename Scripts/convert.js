let fileInput = document.getElementById("FILE");
const reader = new FileReader();

function CheckFile() {
    let file = fileInput.files[0]; // Get the first file from the input
    if (file) {
        reader.onload = function(fileLoadedEvent) {
            return fileLoadedEvent.target.result; // Log the text content
        };
        reader.readAsText(file); // Read the file as text
    } else {
        console.log("No file selected");
    }
}

function IDK() {
    console.log(CheckFile()); // Call CheckFile directly
}
