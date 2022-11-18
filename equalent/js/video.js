const video = document.querySelector('video')
const playPause = document.querySelector('.play-pause-btn')
const full = document.querySelector('.full-screen-btn')
const mini = document.querySelector('.mini-player-btn')
const theater = document.querySelector('.theater-btn')
const videoCont = document.querySelector('.video-cont')
const forward5 = document.querySelector('.forward5')
const replay5 = document.querySelector('.replay5')
const muteBtn = document.querySelector('.mute-btn')
const slider = document.querySelector('.volume-slider')
const currentTimeElem = document.querySelector('.current-time')
const TimeElem = document.querySelector('.total-time')
const speed = document.querySelector('.speed-btn')
const timelineContainer = document.querySelector(".timline-cont")

const theaters1 = document.querySelector('.theaters1')
const theaters2 = document.querySelector('.theaters2')

timelineContainer.addEventListener("mousemove", handleTimelineUpdate)
timelineContainer.addEventListener("mousedown", toggleScrubbing)
document.addEventListener("mouseup", e => {
  if (isScrubbing) toggleScrubbing(e)
})
document.addEventListener("mousemove", e => {
  if (isScrubbing) handleTimelineUpdate(e)
})
let isScrubbing = false
let wasPaused
function toggleScrubbing(e) {
  const rect = timelineContainer.getBoundingClientRect()
  const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width
  isScrubbing = (e.buttons & 1) === 1
  videoCont.classList.toggle("scrubbing", isScrubbing)
  if (isScrubbing) {
    wasPaused = video.paused
    video.pause()
  } else {
    video.currentTime = percent * video.duration
    if (!wasPaused) video.play()
  }

  handleTimelineUpdate(e)
}

function handleTimelineUpdate(e) {
  const rect = timelineContainer.getBoundingClientRect()
  const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width
  timelineContainer.style.setProperty("--preview-position", percent)

  if (isScrubbing) {
    e.preventDefault()
    timelineContainer.style.setProperty("--progress-position", percent)
  }
}


document.addEventListener("keydown", e => {
    const tagName = document.activeElement.tagName.toLowerCase()
  
    if (tagName === "input") return
  
    switch (e.key.toLowerCase()) {
      case " ":
        if (tagName === "button") return
      case "k":
      
        Play()
        break
      case "f":
        case "а":
        fullMode()
        break
      case "t":
        case "е":
        theaterMode()
        break
      case "i":
        case "ш":
        miniMode()
        break
      case "m":
        Mute()
        break
      case "arrowleft":
      case "j":
        skip(-5)
        break
      case "arrowright":
      case "l":
        skip(5)
        break
      case 'arrowdown':
      volumeDOWN()
      break
      case 'arrowup':
      volumeUP()
      break
    }
  })
 
  function volumeDOWN() {
    video.volume -= .05;
    if (video.volume == 0) {
      video.volume = 0;
    }
  }
  function volumeUP() {
    video.volume += .05;
    if (video.volume == 1) {
      video.volume = 1;
    }
  }
  speed.addEventListener('click', speedUp)
  function speedUp() {
    let Rate = video.playbackRate + .25
    if (Rate > 2) Rate = .25
        video.playbackRate = Rate
        speed.textContent = `${Rate}x`    
  }

video.addEventListener("timeupdate", () => {
    currentTimeElem.textContent = formatTime(video.currentTime)
    const percent = video.currentTime / video.duration
    timelineContainer.style.setProperty('--progress-position', percent)
})

const leadingZeroFormatter = new Intl.NumberFormat(undefined, {
    minimumIntegerDigits: 2,
  })

video.addEventListener('loadeddata', () => {
    TimeElem.textContent = formatTime(video.duration)
})

function formatTime(time) {
    const seconds = Math.floor(time % 60)
    const minuts = Math.floor(time / 60) % 60
    const hours = Math.floor(time / 3600 )
     if (hours === 0) {
    return `${minuts}:${leadingZeroFormatter.format(seconds)}`
  } else {
    return `${hours}:${leadingZeroFormatter.format(
        minuts
    )}:${leadingZeroFormatter.format(seconds)}`
  }
}
function skip(duration) {
    video.currentTime += duration
  }
muteBtn.addEventListener('click', Mute)
slider.addEventListener('input', e => {
    video.volume = e.target.value
    video.muted = e.target.value === 0
})

function Mute() {
    video.muted = !video.muted
    // if (video.muted) {
    //   video.volume = .5
    // }
}

video.addEventListener('volumechange', () => {
    slider.value = video.volume
    let volumeLevel
    if (video.muted || video.volume === 0) {
        slider.value = 0
        volumeLevel = 'muted'
    } else if (video.volume >= .5){
        volumeLevel = 'high'
    } else {
        volumeLevel = 'low'
    }

    videoCont.dataset.volumeLevel = volumeLevel
})


function replay5down() {
    video.currentTime -= 5;
}
replay5.addEventListener('click', replay5down)
function forward5up() {
    video.currentTime += 5;
}
forward5.addEventListener('click', forward5up)





// view
theater.addEventListener('click', theaterMode)
mini.addEventListener('click', miniMode)
full.addEventListener('click', fullMode)
video.addEventListener('dblclick', fullMode)
function theaterMode(){
    videoCont.classList.toggle('theater')
    theaters1.classList.toggle('theaters1')
    theaters2.classList.toggle('theaters2')

}


function miniMode(){
    
    if (videoCont.classList.contains('mini')) {
        document.exitPictureInPicture()
    } else {
        video.requestPictureInPicture();
    }
    
}


function fullMode(){
    videoCont.classList.toggle('full')
    if (document.fullscreenElement == null) {
        videoCont.requestFullscreen()
    } else {
        document.exitFullscreen();
    }
    
}




//   play/pause
function Play() {
    video.paused ? video.play() : video.pause()
}
playPause.addEventListener('click', Play)

video.addEventListener('click', Play)

video.addEventListener('play', () => {
    videoCont.classList.remove('paused')
})

video.addEventListener('pause', () => {
    videoCont.classList.add('paused')
})

