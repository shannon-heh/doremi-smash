var mynote;
var test = 0;
const Application = function() {
  this.tuner = new Tuner()
  this.notes = new Notes('.notes', this.tuner)
  this.meter = new Meter('.meter')
  this.frequencyBars = new FrequencyBars('.frequency-bars')
  this.update({ name: 'A', frequency: 440, octave: 4, value: 69, cents: 0 })
}

var isCorrectNote = false;
var correctNote = 'A';

Application.prototype.start = function() {
  const self = this
  this.tuner.onNoteDetected = function(note) {
    if (self.notes.isAutoMode) {
      if (self.lastNote === note.name) {
        self.update(note);
        mynote = note.name;
      } else {
        self.lastNote = note.name;
        mynote = note.name;
      }
      if(mynote =='C' && self.lastNote != 'D') {
        movL();
      }
      else if(mynote =='E' && self.lastNote != 'D') {
        movR();
      }
      if(mynote == 'D'){
        jump();
      }
      if(mynote == 'C' && self.lastNote == 'D'){
        //jumpL();
      }
      if(mynote == 'E' && self.lastNote == 'D'){
        //jumpR();
      }
    }
    isCorrectNote = (mynote == correctNote);
  }
  swal("Welcome to Our Game!").then(function() {
    self.tuner.init()
    self.frequencyData = new Uint8Array(self.tuner.analyser.frequencyBinCount)
  })

  this.updateFrequencyBars()
}

Application.prototype.updateFrequencyBars = function() {
  if (this.tuner.analyser) {
    this.tuner.analyser.getByteFrequencyData(this.frequencyData)
    this.frequencyBars.update(this.frequencyData)
  }
  requestAnimationFrame(this.updateFrequencyBars.bind(this))
}

Application.prototype.update = function(note) {
  this.notes.update(note)
  this.meter.update((note.cents / 50) * 45)
}

// noinspection JSUnusedGlobalSymbols
Application.prototype.toggleAutoMode = function() {
  this.notes.toggleAutoMode()
}

const app = new Application()
app.start()
var character = document.getElementById("character");
var block = document.getElementById("block");
var counter=0;
var ingame = false;
var target = document.getElementById("target-note");

function jump(){
    if(character.classList == "animate"){return}
    character.classList.add("animate");
    setTimeout(function(){
      character.classList.remove("animate");
    },3000);
}
function movL(){
  character.style.left = offset+'px';
  offset -= 5;
  if(offset<0) {
      offset=0;
  }
}
function movR(){
  character.style.left = offset+'px';
  offset += 5;
  characterWidth = window.getComputedStyle(character).getPropertyValue("width");
  if(offset>700) {
      offset=700;
  }
}
function jumpL(){
  character.style.left = offset+'px';
  
  offset += 5;
  characterWidth = window.getComputedStyle(character).getPropertyValue("width");
  if(offset>700) {
      offset=700;
  }
}
var offset=0;           // for positioning of character
var distance=50;        // distance between blocks when message appears

var checkDead = setInterval(function() {

  let characterTop = parseInt(window.getComputedStyle(character).getPropertyValue("top")); 
  let blockLeft = parseInt(window.getComputedStyle(block).getPropertyValue("left"));
  let popUp = document.getElementById("notes-to-play");
  
  if(ingame) {
      block.style.display="block";
      block.style.animationPlayState="running";

      if(blockLeft<offset+distance) {
          block.style.animationPlayState="paused";
          popUp.style.display="block";    // pop-up message appears
          popUp.style.marginLeft=blockLeft+"px";

        // game over if user does not answer in 10 secs
        var myTimer = setTimeout(() => {
            ingame=false;
        }, 60000)
        console.log(myTimer);

        if(isCorrectNote) {
          block.style.display = "none"; // make block disappear
          clearTimeout(myTimer);
          isCorrectNote=false;
          $("#block").finish();
          console.log('what');
          counter++;  // increase score when block destroyed
        }
      }
      else{
          document.getElementById("scoreSpan").innerHTML = counter;
      }
  }
  else {
    block.style.animation = "none";
    popUp.style.display="none"; 
    character.style.left="0px";
    document.getElementById("gameover").innerHTML = "Game Over :( Play again?";
    // alert("Game Over. score: "+Math.floor(counter/100));
    counter=0;
    character.classList.remove("animate");
  }
}, 10);

function startgame() {
    //reset parameters
    offset=0;
    character.style.left="0px";
    ingame = true;
    block.style.animation = "block 2s infinite linear";
    target.innerHTML = "";
    character.classList.add("animate"); 
    document.getElementById("gameover").innerHTML = "";
}
