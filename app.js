var mynote;
var test = 0;
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
    if (self.notes.isAutoMode) {
      if (self.lastNote === note.name) {
        self.update(note);
        mynote = note.name;
      } else {
        self.lastNote = note.name;
        mynote = note.name;
      }
      if(mynote =='C') {
        movL();
      }
      else if(mynote =='E') {
        movR();
      }
      if(mynote == 'D'){
        jump();
      }}
    }
  swal('Welcome online tuner!').then(function() {
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
var concrete = document.getElementById("break-concrete");

function jump(){
    if(character.classList == "animate"){return}
    character.classList.add("animate");
    setTimeout(function(){
        character.classList.remove("animate");
    },300);
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
        console.log(characterWidth);
        if(offset>700) {
            offset=700;
            console.log(offset);
        }
}
var offset=0;
var checkDead = setInterval(function() {
    // console.log(window.getComputedStyle(character));
    let characterTop = parseInt(window.getComputedStyle(character).getPropertyValue("top")); 
    let blockLeft = parseInt(window.getComputedStyle(block).getPropertyValue("left"));
    if(blockLeft<20 && blockLeft>-20 && characterTop>=130){
        block.style.animation = "none";
        alert("Game Over. score: "+Math.floor(counter/100));
        counter=0;
        block.style.animation = "block 10s infinite linear";
    } else{
        counter++;
        document.getElementById("scoreSpan").innerHTML = Math.floor(counter/100);
    }

    if(ingame) {
        if(blockLeft<20 && blockLeft>-20 && characterTop>=130){
            block.style.animation = "none";
            // alert("Game Over. score: "+Math.floor(counter/100));
            counter=0;
            character.classList.remove("animate");
            concrete.innerHTML = "Play the right note to break out this musician!";
            ingame = false;
        }else{
            counter++;
            document.getElementById("scoreSpan").innerHTML = Math.floor(counter/100);
        }
    }
}, 10);

function startgame() {
    ingame = true;
    block.style.animation = "block 5s infinite linear";
    concrete.innerHTML = "";
    // character.classList.add("animate"); 
}
