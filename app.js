const Application = function() {
  this.tuner = new Tuner()
  this.notes = new Notes('.notes', this.tuner)
  this.meter = new Meter('.meter')
  this.frequencyBars = new FrequencyBars('.frequency-bars')
  this.update({ name: 'A', frequency: 440, octave: 4, value: 69, cents: 0 })
}

Application.prototype.start = function() {
  const self = this

  this.tuner.onNoteDetected = function(note) {
    var randnote = note.name;
    console.log(randnote);
    console.log(note.name);
    console.log(typeof note.name);
    console.log(typeof randnote);
    if (this.randNote === note.name) {
      console.log("hereeeeeee");
      alert("You played the right note!");
    }
    else {
      console.log("noooooooo");
    }
    // document.getElementById("current-note").innerHTML = "You played: " + note.name;
    if (self.notes.isAutoMode) {
      if (self.lastNote === note.name) {
        self.update(note)
      } else {
        self.lastNote = note.name
      }
    }
  }

  swal('Let\'s play breaking notes!').then(function() {
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
var targetnote = document.getElementById("target-note");

function jump(){
    if(character.classList == "animate"){return}
    character.classList.add("animate");
    setTimeout(function(){
        character.classList.remove("animate");
    },300);
}

var checkDead = setInterval(function() {
    let characterTop = parseInt(window.getComputedStyle(character).getPropertyValue("top"));
    let blockLeft = parseInt(window.getComputedStyle(block).getPropertyValue("left"));
    if(ingame) {
        if(blockLeft<20 && blockLeft>-20 && characterTop>=130){
            block.style.animation = "none";
            // alert("Game Over. score: "+Math.floor(counter/100));
            counter=0;
            character.classList.remove("animate");
            targetnote.innerHTML = "Play an A to break out this musician!";
            ingame = false;
        }else{
            counter++;
            document.getElementById("scoreSpan").innerHTML = Math.floor(counter/100);
        }
    }
}, 10);

function startgame() {
    ingame = true;
    block.style.animation = "block 2s infinite linear";
    targetnote.innerHTML = "";
    // character.classList.add("animate"); 
}
