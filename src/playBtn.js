const sound = ['wave']

const playBtn = document.getElementById('buttonPlay')
const pauseBtn = document.getElementById('buttonPause')

playBtn.addEventListener('click', (e) => {
    document.getElementById('sound').play()
})

pauseBtn.addEventListener('click', (e) => {
    document.getElementById('sound').pause()
})