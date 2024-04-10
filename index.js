let carousel = document.querySelector(".carousel"); //the overarching carousel div
let thumbs = document.querySelector(".thumbnail"); //the thumbnails
let thumbnailItem = document.querySelector(".item"); //the individual thumbnails

let pressed = false;
let startX;
let x;

carousel.addEventListener("mousedown" , (e) =>{
    pressed = true;
    startX = e.offsetX - thumbs.offsetLeft; //e.offsetX lets us know the pixels relative to the parent node. 
    carousel.style.cursor = "grabbing"
});

carousel.addEventListener("mouseenter", ()=>{
    carousel.style.cursor = "grab"
});
/*
//this one's not exactly necessary based on what i can see
carousel.addEventListener("mouseleave", ()=>{
    carousel.style.cursor = "default"
})
*/

carousel.addEventListener("mouseup", ()=>{
    carousel.style.cursor = "grab"
})

//event listener to the window so that when the mouse is down it returns true and when its up its false
//this event listener lets us know what happens if line 8:12 is false
window.addEventListener("mouseup", ()=>{
    pressed = false;
})

carousel.addEventListener("mousemove" , (e)=>{
    if(!pressed) return; //if pressed isnt true then we won't fire the event
    e.preventDefault();

    x = e.offsetX

    thumbs.style.left = `${x - startX}px`;

    checkBoundary()
})

function checkBoundary(){
    let outer = carousel.getBoundingClientRect();
    let inner = thumbs.getBoundingClientRect(); //these two will give us the coordinates for our two elements i.e. the carousel and the thumbs

    if(parseInt(thumbs.style.left) > 0){
        thumbs.style.left = "0px";
    } else if(inner.right < outer.right){
        thumbs.style.left = `-${inner.width - outer.width}px`
    }
}

//starting on the fetch api

