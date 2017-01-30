
const updateIndicator = function updateIndicator(failures) {
  const indicatorLabels = document.querySelectorAll('.side .side-headline');
  if (failures === 0) {
    indicatorLabels.forEach(label => {
      label.classList.remove('fail');
      label.classList.add('success');
    });
  } else {
    indicatorLabels.forEach(label => {
      label.classList.remove('success');
      label.classList.add('fail');
    });
  }
}

const toggleFullscreen = function toggleFullscreen() {
  if (document.isFullScreen || document.webkitIsFullScreen) {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  } else {
    if (document.documentElement.requestFullScreen) {
      document.documentElement.requestFullScreen();
    } else if (document.documentElement.webkitRequestFullScreen) {
      document.documentElement.webkitRequestFullScreen();
    }
  }
}

module.exports = {
  updateIndicator,
  toggleFullscreen
};
