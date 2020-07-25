var character = document.getElementById("character");
var block = document.getElementById("block");
var counter=0;

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

function jump(){
    if(character.classList == "animate"){return}
    character.classList.add("animate");
    setTimeout(function(){
        character.classList.remove("animate");
    },300);
}

var offset=0;
var checkDead = setInterval(function() {
    // console.log(window.getComputedStyle(character));
    let characterTop = parseInt(window.getComputedStyle(character).getPropertyValue("top")); 
    let blockLeft = parseInt(window.getComputedStyle(block).getPropertyValue("left"));

    if(rightPressed) {
        character.style.left = offset+'px';
        offset += 1;
        characterWidth = window.getComputedStyle(character).getPropertyValue("width");
        console.log(characterWidth);
        if(offset>700) {
            offset=700;
            console.log(offset);
        }
    }
    if(leftPressed) {
        character.style.left = offset+'px';
        offset -= 1;
        if(offset<0) {
            offset=0;
        }
    } 

    if(blockLeft<20 && blockLeft>-20 && characterTop>=130){
        block.style.animation = "none";
        alert("Game Over. score: "+Math.floor(counter/100));
        counter=0;
        block.style.animation = "block 10s infinite linear";
    } else{
        counter++;
        document.getElementById("scoreSpan").innerHTML = Math.floor(counter/100);
    }
}, 10);
