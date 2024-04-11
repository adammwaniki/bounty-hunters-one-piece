let carousel = document.querySelector(".carousel"); //the overarching carousel div
let thumbsSlider = document.querySelector(".thumbsSlider")
let thumbs = document.querySelector(".thumbnail"); //the thumbnails
let thumbnailItem = document.querySelector(".item"); //the individual thumbnails
let thumbnailItems = document.querySelectorAll(".item"); //all thumbnails
let bountyContent = document.querySelector("#bountyContent"); //the bounty details that we'll be updating
let carouselBountyListDiv = document.querySelector("#carouselBountyListDiv"); //the div for all the items in the carousel that we'll be editing 
let carouselBackgroundImage = document.querySelector("#carouselBackgroundImage")
let body = document.querySelector("body")

let pressed = false;
let startX;
let x;

thumbsSlider.addEventListener("mousedown" , (e) =>{
    pressed = true;
    startX = e.offsetX - thumbs.offsetLeft; //e.offsetX lets us know the pixels relative to the parent node. 
    thumbsSlider.style.cursor = "grabbing"
});

thumbsSlider.addEventListener("mouseenter", ()=>{
    thumbsSlider.style.cursor = "grab"
});

//this one's not fixing the bug because of the conflict being caused by the background image which actually covers the carousel and not the body
//carousel.addEventListener("mouseleave", ()=>{
    //carousel.style.cursor = "default"
//})
//

thumbsSlider.addEventListener("mouseup", ()=>{
    thumbsSlider.style.cursor = "grab"
})

//event listener to the window so that when the mouse is down it returns true and when its up its false
//this event listener lets us know what happens if line 8:12 is false
window.addEventListener("mouseup", ()=>{
    pressed = false;
})

thumbsSlider.addEventListener("mousemove" , (e)=>{
    if(!pressed) return; //if pressed isnt true then we won't fire the event
    e.preventDefault();

    x = e.offsetX

    thumbs.style.left = `${x - startX}px`;

    checkBoundary()
})

function checkBoundary(){
    let outer = thumbsSlider.getBoundingClientRect();
    let inner = thumbs.getBoundingClientRect(); //these two will give us the coordinates for our two elements i.e. the carousel and the thumbs

    if(parseInt(thumbs.style.left) > 0){
        thumbs.style.left = "0px";
    } else if(inner.right < outer.right){
        thumbs.style.left = `-${inner.width - outer.width}px`
    }
}

//declaring a variable to store the ID of the currently displayed bounty
let currentBountyId = null; 

//making a function to handle the click event
function clickHandler(index) {
    const bountyId = index + 1; // Because the bounty IDs start from 1
    if (bountyId !== currentBountyId) {
        fetchBounties(bountyId); // Fetch the bounty only if it's different from the currently displayed one
        currentBountyId = bountyId; // Update the currently displayed bounty ID
        console.log("Clicked thumbnail with ID:", bountyId);
    }
}

// Attaching a click event listener to each thumbnail item
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

//function to render the bounties
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
                            Crimes: ${bounty.crimes} <!--${bounty.crimes.join(', ')} let me see if this will return the array as a string-->
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

            //using style method to make the carouselBackgroundImage be the background image
            body.style.backgroundImage = `url('${bounty.image}')`;

    });
    handleCrimeSubmission(currentBountyId, bounties);
}


//debug from here
// Function to append a crime to the array of crimes for the current bounty and set up the event listener for the crime form
function handleCrimeSubmission(bountyId, bounties) {
    const commentForm = document.getElementById('comment-form');
    const commentInput = document.getElementById('comment');
    const btn = document.querySelector(".comment-button")

    commentForm.addEventListener('submit', event => {
        event.preventDefault(); // Prevent the default form submission behavior
        
        const crime = commentInput.value.trim(); // Get the crime input value and trim whitespace

        if (crime) {
            appendCrimeToBounty(bountyId, crime, bounties); // Call the function to append the crime to the bounty
            commentInput.value = ''; // Clear the input field after submitting
        } else {
            console.log('Please enter a crime.'); // Optionally, provide feedback if the input is empty
        }
    });
}

// Function to append a crime to the array of crimes for the current bounty
function appendCrimeToBounty(bountyId, crime, bounties) {
    const currentBounty = bounties.find(bounty => bounty.id === bountyId);

    if (currentBounty) {
        currentBounty.crimes.push(crime); // Append the crime to the array of crimes for the current bounty
        renderBounties(bounties); // Re-render the bounty details to reflect the updated crimes
    } else {
        console.error(`Bounty with ID ${bountyId} not found.`);
    }
}

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