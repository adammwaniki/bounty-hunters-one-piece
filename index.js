const thumbs = document.querySelector(".thumbnail"); //the overarching thumbnail div
const thumbnailItem = document.querySelector(".item"); //the thumbnail items themselves

let pressed = false;
let startX;
let x;

thumbs.addEventListener("mousedown" , (e) =>{
    pressed = true
    startX = e.offsetX - thumbnailItem.offsetLeft; //e.offsetX lets us know the pixels relative to the parent node
    console.log(e.offsetX)
})