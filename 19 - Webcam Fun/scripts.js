const video = document.querySelector('.player')
const canvas = document.querySelector('.photo')
const ctx = canvas.getContext('2d')
const strip = document.querySelector('.strip')
const snap = document.querySelector('.snap')

function getVideo() {
  navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(localMediaStream => {
      video.srcObject = localMediaStream
      video.play()
    })
    .catch(error => {
      console.error('Something went wrong :c', err)
    })
}

function paintToCanvas() {
  const { videoWidth: width, videoHeight: height } = video
  canvas.width = width
  canvas.height = height

  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height)
    let imagePixelsData = ctx.getImageData(0, 0, width, height)
    imagePixelsData = rgbSplit(imagePixelsData)
    ctx.globalAlpha = 0.1
    ctx.putImageData(imagePixelsData, 0, 0)
  }, 16)
}

function takePhoto() {
  snap.currentTime = 0
  snap.play()

  const data = canvas.toDataURL('image/jpeg')
  const link = document.createElement('a')
  link.href = data
  link.setAttribute('download', 'smile')
  link.innerHTML = `<img src="${data}" alt="Your photo" />`
  strip.insertBefore(link, strip.firstChild)
}

function pinkEffect(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 50
    pixels.data[i + 1] = pixels.data[i + 1] - 30
    pixels.data[i + 2] = pixels.data[i + 2] * 0.9
  }

  return pixels
}

function rgbSplit(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 150] = pixels.data[i + 0]
    pixels.data[i + 500] = pixels.data[i + 1]
    pixels.data[i - 550] = pixels.data[i + 2]
  }

  return pixels
}

function greenScreen(pixels) {
  const levels = {}

  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value
  })

  for (i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i + 0]
    green = pixels.data[i + 1]
    blue = pixels.data[i + 2]
    alpha = pixels.data[i + 3]

    if (red >= levels.rmin
      && green >= levels.gmin
      && blue >= levels.bmin
      && red <= levels.rmax
      && green <= levels.gmax
      && blue <= levels.bmax) {
      pixels.data[i + 3] = 0
    }
  }

  return pixels
}



getVideo()

video.addEventListener('canplay', paintToCanvas)
