var character = document.getElementById("character");
var block = document.getElementById("block");
var counter=0;
var ingame = false;
var targetnote = document.getElementById("target-note");

var rightPressed = false;
var leftPressed = false;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

// handles when key is pushed
function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

// handles when key is lifted
function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

var concrete = document.getElementById("break-concrete");

function jump(){
    if(character.classList == "animate"){return}
    character.classList.add("animate");
    setTimeout(function(){
        character.classList.remove("animate");
    },300);
}

// character.addEventListener("click", function() {
//     block.style.animationPlayState="running";
// })

var offset=0;           // for positioning of character
var distance=50;        // distance between blocks when message appears
var endGame = false;    // determines whether to end game

var checkDead = setInterval(function() {
    let characterTop = parseInt(window.getComputedStyle(character).getPropertyValue("top")); 
    let blockLeft = parseInt(window.getComputedStyle(block).getPropertyValue("left"));
    let popUp = document.getElementById("notes-to-play");
    
    if(ingame) {
        if(/*(blockLeft<offset && blockLeft>-20 && characterTop>=130) ||*/ endGame){
            block.style.animation = "none";
            alert("Game Over. score: "+Math.floor(counter/100));
            counter=0;
            character.classList.remove("animate");
            ingame = false;
        } 
        else if(blockLeft<offset+distance) {
            rightPressed=false;
            block.style.animationPlayState="paused";
            popUp.style.display="block";    // pop-up message appears
            popUp.style.marginLeft=blockLeft+"px";
            // if (notes correct) --> block disappears, set rightPressed=true again
            // if (notes wrong) --> endGame = true;
        }
        else{
            counter++;
            document.getElementById("scoreSpan").innerHTML = Math.floor(counter/100);
        }

        // for left and right movement
        if(rightPressed) {
            character.style.left = offset+'px';
            offset += 1;
            characterWidth = window.getComputedStyle(character).getPropertyValue("width");
            if(offset>700) { // fix this number
                offset=700;
            }
        }
        if(leftPressed) {
            character.style.left = offset+'px';
            offset -= 1;
            if(offset<0) {
                offset=0;
            }
        }
    }
    else {
        offset=0;
        block.style.animation = "none";
        popUp.style.display="none"; 
        concrete.innerHTML = "Play the right note to break out this musician!";
    }
}, 10);

function startgame() {
    //reset parameters
    offset=0;
    character.style.left="0px";
    ingame = true;
    block.style.animation = "block 2s infinite linear";
    concrete.innerHTML = "";
    // character.classList.add("animate"); 
}