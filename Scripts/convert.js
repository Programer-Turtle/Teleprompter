let fileInput = document.getElementById("FILE");
let SettingBox = document.getElementById("SettingHolder")
let typeSelect = document.getElementById("TypeTele")
document.getElementById("TeleName").value = "Teleprompter"
let type = typeSelect.value
let NumberOfInputs = 0

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

async function GetLines() {
    let FileText = await CheckFile()
    let splitText = FileText.split("\n")
    SettingBox.innerHTML = ""
    NumberOfInputs = splitText.length
    for(let i = 0; i<splitText.length; i++){
        let FlexDiv = document.createElement("div")
        FlexDiv.className = "flex"

        let NewLine = document.createElement("p")
        NewLine.innerText = splitText[i]
        NewLine.id  = `TextInput${i}`
        FlexDiv.appendChild(NewLine)

       if(type=="time"){
            let SecondInput = document.createElement("input")
            SecondInput.id = `SecondInput${i}`
            SecondInput.className = "SecondInput"
            FlexDiv.appendChild(SecondInput)
       }

        SettingBox.appendChild(FlexDiv)
    }
}

function Save(Name, Text){
    console.log(Name)
    let blob = new Blob([Text], { type: 'text/plain' })
    let link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${Name}.tele`
    link.click()

    link.remove()
    setTimeout(() => URL.revokeObjectURL(link.href), 100);
}

async function ConvertTextToTele() {
    let TeleData = {"type":type}
    for(let i = 0; i<NumberOfInputs; i++){
        let Text = document.getElementById(`TextInput${i}`).innerText.replaceAll("\n", "")
        if(type == "time"){
            let Number = document.getElementById(`SecondInput${i}`).value
            if(Number == ""){
                Number = 1
            }
            else{
                Number = parseFloat(Number)
            }
            TeleData[`${i}`] = {"Text":Text,"Seconds":Number}
        }
        else{
            TeleData[`${i}`] = {"Text":Text}
        }
    }
    let TeleName = document.getElementById("TeleName").value
    if(TeleName == ""){
        TeleName = "Teleprompter"
    }
    console.log(TeleData)
    console.log(JSON.stringify(TeleData))
    Save(TeleName, JSON.stringify(TeleData))
}

function SetType(){
    type = typeSelect.value
    GetLines()
}

fileInput.addEventListener("input", GetLines)
typeSelect.addEventListener("input", SetType)