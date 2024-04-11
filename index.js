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


let currentBountyId = null; // Variable to store the ID of the currently displayed bounty
/*
//this one works really well
// Attach click event listener to each thumbnail item
thumbnailItems.forEach((thumbnailItem, index) => {
    thumbnailItem.addEventListener("click", () => {
        const bountyId = index + 1; // Because the bounty IDs start from 1
        if (bountyId !== currentBountyId) {
            fetchBounties(bountyId); // Fetch the bounty only if it's different from the currently displayed one
            currentBountyId = bountyId; // Update the currently displayed bounty ID
            console.log("Clicked thumbnail with ID:", bountyId);
        }
    });
});
*/

//making a function to handle the click event
function clickHandler(index) {
    const bountyId = index + 1; // Because the bounty IDs start from 1
    if (bountyId !== currentBountyId) {
        fetchBounties(bountyId); // Fetch the bounty only if it's different from the currently displayed one
        currentBountyId = bountyId; // Update the currently displayed bounty ID
        console.log("Clicked thumbnail with ID:", bountyId);
    }
}

// Attach click event listener to each thumbnail item
thumbnailItems.forEach((thumbnailItem, index) => {
    thumbnailItem.addEventListener("click", () => {
        clickHandler(index);
    });
});

fetchBounties(1);
function fetchBounties(id) {
    // Fetch data for the specific bounty using its ID
    return fetch(`db.json?id=${id}`) 
        .then(res => res.json()) 
        .then(data => renderBounties(data)) // Passing in the data to render function
        .catch(error => {
            console.error('Error fetching bounty data:', error);
        });
}
//this one doesn't work probably because of how i'm handling the data once it's parsed
//function fetchBounties(id) {
    // Fetch data for the specific bounty using its ID
    //return fetch(`db.json?id=${id}`) 
        //.then(res => res.json()) 
        //.then(data => {
            //const bounty = data.find(item => item.id === id); // Find the bounty with the specified ID
            //renderBounties(bounty); // Passing in the data for the specific bounty to render function
        //})
        //.catch(error => {
            //console.error('Error fetching bounty data:', error);
        //});
//}



function renderBounties(bounties) {
    carouselBountyListDiv.innerHTML = ''; // Clear existing content
    bounties.forEach(bounty => {
        carouselBountyListDiv.innerHTML = 
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
//this one wasn't able to return with the ID
// Attach click event listener to each thumbnail item
//thumbnailItems.forEach(thumbnailItem => {
//    thumbnailItem.addEventListener("click", () => {
//        fetchBounties() // Call fetchBounties function when clicked
//        console.log("I have been clicked")
//    });
//});

//making a function to allow us to append 

