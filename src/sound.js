var audio = document.getElementById('song');

function soundPlay() {
    const myAudio = new Audio('/src/sounds/wave.mp3');
    myAudio.autoplay = true;
    myAudio.play()
}

function soundPause() {
    const myAudio = new Audio('/src/sounds/wave.mp3');
    myAudio.pause()
}