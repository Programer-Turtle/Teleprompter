const body = document.body
let fileInput = document.getElementById("FILE");
let TextLines = []
let WaitTimes = []
let CurrentSlide = 0
let type

function CheckFile() {
    return new Promise((resolve, reject) => {
        let file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                resolve(event.target.result);
            };
            reader.onerror = function(error) {
                reject(`E32${error}`);
            };
            reader.readAsText(file);
        } else {
            reject("No file selected");
        }
    });
}

async function SetUpData() {
    let Data = await CheckFile()
    Data = JSON.parse(Data)
    type = Data.type
    let DataLength = Object.keys(Data).length
    for(let i = 0; i<(DataLength-1); i++){
        TextLines.push(Data[i]['Text'])
        if(type == 'time'){
            WaitTimes.push(Data[i]['Seconds'])
        }
    }
    console.log(TextLines)
    console.log(WaitTimes)
}

async function CreateTextLines() {
    for(let i = 0; i<TextLines.length; i++){
        let NewLine = document.createElement("h1")
        NewLine.innerText = TextLines[i]
        NewLine.id = `Line${i}`
        NewLine.style.fontSize = "55px"
        NewLine.style.margin = "0"
        NewLine.style.paddingTop = "50px"
        NewLine.style.paddingBottom = "50px"
        body.appendChild(NewLine)
    }
}

async function DeterminTeleprompter() {
    if(CurrentSlide > TextLines.length - 1){
        location.reload()
    }
    let CurrentLine = document.getElementById(`Line${CurrentSlide}`)
    CurrentLine.style.fontSize = "55px"
    CurrentLine.style.backgroundColor = "rgba(18, 255, 10, 0.726)"
    CurrentLine.scrollIntoView({behavior:'smooth', block:'center'})

    if(CurrentSlide!=0){
        let PreviousLine = document.getElementById(`Line${CurrentSlide-1}`)  
        PreviousLine.style.fontSize = "55px"
        PreviousLine.style.backgroundColor = "transparent"  
    }

    if(CurrentSlide!=TextLines.length-1){
        let NextLine = document.getElementById(`Line${CurrentSlide+1}`)  
        NextLine.style.fontSize = "55px"
        NextLine.style.backgroundColor = "transparent"  
    }
}

async function RunTeleprompter() {
    body.style.overflow = "hidden"
    document.body.removeChild(document.getElementById("UI"))
    await SetUpData()
    await CreateTextLines()
    await DeterminTeleprompter()
    body.addEventListener('keydown', event => {
        console.log(event.key)
        if (event.key === ' ') {
            event.preventDefault();
            CurrentSlide++
            DeterminTeleprompter()
        }
        else if (event.key === 'ArrowLeft') {
            event.preventDefault();
            if(CurrentSlide!=0){
                CurrentSlide--
            }
            DeterminTeleprompter()
        }
    })
}