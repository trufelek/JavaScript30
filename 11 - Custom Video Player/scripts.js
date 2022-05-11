// Elements
const player = document.querySelector('.player')
const video = player.querySelector('.viewer')
const progress = player.querySelector('.progress')
const progressBar = player.querySelector('.progress__filled')
const toggle = player.querySelector('.toggle')
const fullscreen = player.querySelector('.fullscreen')
const skipButtons = player.querySelectorAll('[data-skip]')
const ranges = player.querySelectorAll('.player__slider')
let mousedown = false
let fullscreenActive = false

// Functions
function togglePlay() {
  if (video.paused) {
    video.play()
  } else {
    video.pause()
  }
}

function updateButton() {
  toggle.textContent = this.paused ? '►' : '❚ ❚'
}

function skip () {
  video.currentTime += parseFloat(this.dataset.skip)
}

function handleRangeUpdate() {
  video[this.name] = this.value
}

function updateProgress() {
  const percent = (video.currentTime / video.duration) * 100
  progressBar.style.flexBasis = `${percent}%`
}

function goToTimeframe(e) {
  const videoTime = (e.offsetX / progress.offsetWidth) * video.duration
  video.currentTime = videoTime
}

function toggleFullscreen () {
  if (fullscreenActive) {
    closeFullscreen()
  } else {
    openFullscreen()
  }
}

function openFullscreen() {
  fullscreenActive = true
  if (player.requestFullscreen) {
    player.requestFullscreen()
  } else if (player.webkitRequestFullscreen) { /* Safari */
    player.webkitRequestFullscreen()
  } else if (player.msRequestFullscreen) { /* IE11 */
    player.msRequestFullscreen()
  }
}

function closeFullscreen() {
  fullscreenActive = false
  if (document.exitFullscreen) {
    document.exitFullscreen()
  } else if (document.webkitExitFullscreen) { /* Safari */
    document.webkitExitFullscreen()
  } else if (document.msExitFullscreen) { /* IE11 */
    document.msExitFullscreen()
  }
}

// Hook up event listeners
video.addEventListener('click', togglePlay)
video.addEventListener('play', updateButton)
video.addEventListener('pause', updateButton)
video.addEventListener('timeupdate', updateProgress)

toggle.addEventListener('click', togglePlay)

fullscreen.addEventListener('click', toggleFullscreen)

skipButtons.forEach(button => button.addEventListener('click', skip))

ranges.forEach(range => range.addEventListener('change', handleRangeUpdate))
ranges.forEach(range => range.addEventListener('mousemove', handleRangeUpdate))

progress.addEventListener('click', goToTimeframe)
progress.addEventListener('mousemove', (e) => mousedown && goToTimeframe(e))
progress.addEventListener('mousedown', () => mousedown = true)
progress.addEventListener('mouseup', () => mousedown = false)
