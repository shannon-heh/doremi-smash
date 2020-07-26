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
const notes = ['A', 'B', 'C', 'D', 'E', 'F', 'G']

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
  swal({title: "Welcome to doremi SMASH",
  text: "You're at a concert (with your voice or instrument of choice, of course) when suddenly, it starts pouring concrete! By some miracle, there's no concrete on you. Alas, everyone else is stuck, including the musicians. But, the show must go on!\n\n To save the musicians, use your voice or instrument to play notes to control your movements, all while playing the notes on each musician to break them out of the concrete. Be careful, though--if you wait too long, the concrete will harden and the musician will be trapped forever!",
  button: "Let's Play!"})
  .then(function() {
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
var popUp = document.getElementById("notes-to-play");
var counter=0;
var ingame = false;

function jump(){
    if(character.classList == "animate"){return}
    character.classList.add("animate");
    setTimeout(function(){
        character.classList.remove("animate");
    },300);
}
function movL(){
  character.style.left = offset+'px';
        offset -= 10;
        if(offset<0) {
            offset=0;
        }
}
function movR(){
  character.style.left = offset+'px';
        offset += 10;
        characterWidth = window.getComputedStyle(character).getPropertyValue("width");
        if(offset>700) {
            offset=700;
            console.log(offset);
        }
}
var offset=0;           // for positioning of character
var distance=50;        // distance between blocks when message appears
var myTimer;
var correctNote = notes[Math.floor(Math.random()*notes.length)]; // note to play

var checkDead = setInterval(function() {
    // console.log(window.getComputedStyle(character));
    let characterTop = parseInt(window.getComputedStyle(character).getPropertyValue("top")); 
    let blockLeft = parseInt(window.getComputedStyle(block).getPropertyValue("left"));
    
    if(ingame) {
      block.style.display="block";
      block.style.animationPlayState="running";
      popUp.style.display="none";
      document.getElementById("startgame").style.visibility = "hidden";
      document.getElementById("gameover").innerHTML="";

      if(blockLeft<offset+distance) {
        document.getElementById("notes-to-play").innerHTML=`Play this note: ${correctNote}`;
        block.style.animationPlayState="paused";
        popUp.style.display="block";    // pop-up message appears
        popUp.style.marginLeft=blockLeft+"px";

        while(!isCorrectNote) {
          console.log('hi');
        // game over if user does not answer in 10 secs
          myTimer = setTimeout(function() {
            ingame=false;
            document.getElementById("gameover").innerHTML = "GAME OVER";
          }, 10000)
        }
        if(isCorrectNote) {
          block.style.display = "none"; // make block & text disappear
          clearTimeout(myTimer);  // NOT WORKING
          isCorrectNote=false;
          $("#block").finish();
          correctNote = notes[Math.floor(Math.random()*notes.length)]; // randomly pick next note
          counter++;  // increase score when block destroyed
        }
        document.getElementById("scoreSpan").innerHTML = counter;

      }
    }else {
      block.style.animation = "none";
      character.style.left="0px";
      document.getElementById("startgame").style.visibility = "visible";
      // alert("Game Over. score: "+Math.floor(counter/100));
      counter=0;
      character.classList.remove("animate");
    }
}, 1000/60);

function startgame() {
    ingame = true;
    block.style.animation = "block 2s infinite linear";
    concrete.innerHTML = "";

    character.classList.add("animate"); 
    document.getElementById("gameover").innerHTML = "";
}