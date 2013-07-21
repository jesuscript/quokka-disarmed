Audio = {

  play: function(soundFile){
    var audioElement = document.createElement('audio');
    audioElement.setAttribute('src', '/audio/' + soundFile + '.mp3');
    audioElement.play();
  }

};