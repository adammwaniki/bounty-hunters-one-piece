let carousel = document.querySelector(".carousel"); //the overarching carousel div
let thumbs = document.querySelector(".thumbnail"); //the thumbnails
let thumbnailItem = document.querySelector(".item"); //the individual thumbnails
let thumbnailItems = document.querySelectorAll(".item"); //all thumbnails
let bountyContent = document.querySelector("#bountyContent"); //the bounty details that we'll be updating
let carouselBountyListDiv = document.querySelector("#carouselBountyListDiv"); //the div for all the items in the carousel that we'll be editing 

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

//this one's not fixing the bug because of the conflict being caused by the background image which actually covers the carousel and not the body
//carousel.addEventListener("mouseleave", ()=>{
    //carousel.style.cursor = "default"
//})
//

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

/*
//starting on the fetch api
function fetchBounties() {
    // Fetch data from the server
    fetch('db.json')
        .then(res => res.json()) // Parse response as JSON
        .then(data => renderBounties(data)) // Passing in the data to render function
        .catch(error => {
            console.error('Error fetching bounty data:', error);
        });
}
*/

//this one makes sense but i can't get it to work
// Attach click event listener to each thumbnail item
//thumbnailItems.forEach((thumbnailItem, index) => {
//    thumbnailItem.addEventListener("click", () => {
//        const bountyId = index + 1; // because the bounty IDs start from 1
//        fetchBounties(bountyId); // Passing in the bounty ID to fetchBounties function
//    });
//});



function fetchBounties(id) {
    // Fetch data for the specific bounty using its ID
    return fetch(`db.json?id=${id}`) 
        .then(res => res.json()) 
        .then(data => renderBounties(data)) // Passing in the data to render function
        .catch(error => {
            console.error('Error fetching bounty data:', error);
        });
}


function renderBounties(bounties) {
    carouselBountyListDiv.innerHTML = ''; // Clear existing content
    bounties.forEach(bounty => {
        carouselBountyListDiv.innerHTML += 
            `
                <div class="list-item" id="carouselBountyContent">
                    <img id="carouselBackgroundImage" src="${bounty.image}" alt=""> 
                    <div class="content" id="bountyContent">
                        <div class="wanted-status">${bounty.wantedStatus}</div>
                        <div class="criminal-name">${bounty.name}</div>
                        <div class="bounty-amount" id="bounty-amount">$ ${bounty.amount}</div>
                        <div class="des">
                            Crimes: ${bounty.crimes.join(', ')} <!--let me see if this will return the array as a string-->
                        </div>
                        <div class="formDiv">
                            <form id="comment-form" class="comment-form">
                                <input
                                class="comment-input"
                                type="text"
                                name="comment"
                                id="comment"
                                placeholder="Add a crime..."
                                />
                            </form>
                            <div class="buttons">
                                <button class="comment-button" type="submit">POST</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
    });
}

// Attach click event listener to each thumbnail item
thumbnailItems.forEach(thumbnailItem => {
    thumbnailItem.addEventListener("click", //() => {
        fetchBounties() // Call fetchBounties function when clicked
    )});
//});
