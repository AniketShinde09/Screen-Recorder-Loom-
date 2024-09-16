let video = document.querySelector("video");
let recordBtnCont = document.querySelector(".record-btn-cont");
let recordBtn = document.querySelector(".record-btn");
let captureBtnCont = document.querySelector(".capture-btn-cont");
let captureBtn = document.querySelector("capture-btn");
let transparentColor = "transparent";

let recordFlag = false;

let recorder;
let chunks = [];

let constraints = {
    audio: true,
    video: true,
}

navigator.mediaDevices.getUserMedia(constraints)

.then((stream) => {
     video.srcObject = stream;
     recorder = new MediaRecorder(stream);

     recorder.addEventListener("start",(e)=>
    {
        chunks=[];
    })
    recorder.addEventListener("start",(e)=>
        {
            chunks.push(e.data);
    })
    recorder.addEventListener("stop",(e) =>{
        let blob = new Blob(chunks,{ type : "video/mp4"});
        let videoURL = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = videoURL;
        a.download = "stream.mp4";
        a.click();
    })

    recordBtnCont.addEventListener("click",(e) =>
    {
        if(!recorder) return;

        recordFlag = !recordFlag;
        if(recordFlag){
            recorder.start();
            recordBtn.classList.add("scale-record");
            startTimer();
        }
        else{
            recorder.stop();
            recordBtn.classList.remove("scale-record");
            stopTimer();
        }
    })
});

let timerID;
let counter = 0;
let timer = document.querySelector(".timer");
function startTimer(){
    timer.style.display = "block";
    function displayTimer(){
        let totalSeconds = counter;
        let hours = Number.parseInt(totalSeconds/3600);
        totalSeconds = totalSeconds % 3600;
        let mintues = Number.parseInt(totalSeconds/60);
        totalSeconds = totalSeconds % 60;
        let seconds = totalSeconds;

        hours = (hours < 10) ? `0${hours}`:hours;
        mintues = (mintues < 10) ? `0${mintues}`:mintues;
        seconds = (seconds < 10) ? `0${seconds}`: seconds;

        timer.innerText = `${hours}:${mintues}:${seconds}`;
        timer.classList.add("timer-color");
        
        counter++;
    }
    timerID = setInterval(displayTimer,1000);
}
function stopTimer(){
    clearInterval(timerID);
    timer.innerText = "00:00:00";
    timer.style.display = "none";
}

captureBtnCont.addEventListener("click",(e) =>{
    captureBtnCont.classList.add("scale-capture");

    let canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    let imageURL = canvas.toDataURL();

    let tool = canvas .getContext("2d");
    tool.drawImage(video,0,0,canvas.width,canvas.height);
    tool.fillStyle = transparentColor;
    tool.fillRect(0,0,canvas.width,canvas.height);

    let a = document.createElement('a');
    a.href = imageURL;
    a.download = "Image.jpg";
    a.click();

    serTimeout(()=>{
        captureBtn.classList.remove("scale-capture");
    },500)
})

let filter = document.querySelector(".filter-layer");
let allFilter = document.querySelectorAll(".filter");

allFilter.forEach((filterElem) => {
    filterElem.addEventListener("click",(e)=>{
        transparentColor = getComputedStyle(filterElem).getPropertyValue("background-color");
        filter.style.backgroundColor = transparentColor; 
    });
})