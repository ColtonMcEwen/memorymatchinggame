// quote id
var quoteID = null;

// cards array holds all cards
var card = document.getElementsByClassName("card");
var cards = [...card]

// deck of all cards in game
const deck = document.getElementById("card-deck");

// user phrases
var p = "";
var phrases = document.getElementById("phrases");

// declaring move variable
var moves = 0;
var counter = document.querySelector(".moves");

// declaring variable of matchedCards
var matchedCard = document.getElementsByClassName("match");

// declare popup
var popup = document.getElementById("popup");

// array for opened cards
var openedCards = [];

// INPUTS
// name input
var nameInput = document.querySelector("#name");

// quote input
var quoteInput = document.querySelector("#quote");

// edit input
var editInput = document.querySelector("#edit-input");

// DIVS
// show edit quote div
function showDivEditQuote() {
    var x = document.getElementById("edit-quote");
    x.style.display = "block";
  }

// hide edit quote div
function hideDivEditQuote() {
    var x = document.getElementById("edit-quote");
    x.style.display = "none";
}

// show signup form
function showDivSignupForm() {
    var x = document.getElementById("signup-generator");
    x.style.display = "";
}

// hide signup form
function hideDivSignupForm() {
    var x = document.getElementById("signup-generator");
    x.style.display = "none";
}

// show signin form
function showDivSigninForm() {
    var x = document.getElementById("signin-generator");
    x.style.display = "";
}

// hide signin form
function hideDivSigninForm() {
    var x = document.getElementById("signin-generator");
    x.style.display = "none";
}

// show quote form
function showDivQuoteForm() {
    var x = document.getElementById("quote-generator");
    x.style.display = "";
}

// hide quote form
function hideDivQuoteForm() {
    var x = document.getElementById("quote-generator");
    x.style.display = "none";
}

hideDivSigninForm();
hideDivSignupForm();
hideDivEditQuote();

// BUTTONS
// update button
var updateButton = document.getElementById("update")
    updateButton.onclick = function () {
    updateQuote(quoteID)
    hideDivEditQuote()
};

// login button
var loginButton = document.querySelector("#login-register");
loginButton.onclick = function() {
    loginMessageShow();
}

// popup signup button
var popupRegisterButton = document.querySelector("#popupRegisterButton");
popupRegisterButton.onclick = function() {
    popup2.classList.remove("show");
    hideDivQuoteForm();
    showDivSignupForm();
}

// popup signin button
var popupLoginButton = document.querySelector("#popupLoginButton");
popupLoginButton.onclick = function() {
    popup2.classList.remove("show");
    hideDivQuoteForm();
    showDivSigninForm();
}

// register button
var registerButton = document.querySelector("#registerButton");
registerButton.onclick = function() {
    createUser();
}

// login button
var loginButton = document.querySelector("#loginButton");
loginButton.onclick = function() {
    loginUser();
}

// play button upon successful login
var popupLoginPlayButton = document.querySelector("#popupLoginPlayButton");
popupLoginPlayButton.onclick = function() {
    loginSuccessRemove();
}

// play button upon successful registration
var popupRegisterPlayButton = document.querySelector("#popupRegisterPlayButton");
popupRegisterPlayButton.onclick = function() {
    registerSuccessRemove();
}

// try again button upon fail
var tryAgainButton = document.querySelector("#tryAgainButton");
tryAgainButton.onclick = function() {
    loginFailRemove();
}

// okay button
var okayButton = document.querySelector("#okayButton");
okayButton.onclick = function() {
    confusedMessageRemove();
}

// user already used button
var userAlreadyUsedButton = document.querySelector("#popupUserAlreadyUsed");
userAlreadyUsedButton.onclick = function() {
    userAlreadyUsedRemove();
}

// close button
var closeButton = document.querySelector("#close");
closeButton.onclick = function() {
    playAgainClose();
}

// close button 2
var closeButton2 = document.querySelector("#close2");
closeButton2.onclick = function() {
    loginMessageRemove();
}

// close button 3
var closeButton3 = document.querySelector("#close3");
closeButton3.onclick = function() {
    loginSuccessRemove();
}

// close button 4
var closeButton4 = document.querySelector("#close4");
closeButton4.onclick = function() {
    loginFailRemove();
}

// close button 5
var closeButton5 = document.querySelector("#close5");
closeButton5.onclick = function() {
    confusedMessageRemove();
}

// close button 6
var closeButton6 = document.querySelector("#close6");
closeButton6.onclick = function() {
    registerSuccessRemove();
}

// close button 7
var closeButton7 = document.querySelector("#close7");
closeButton7.onclick = function() {
    userAlreadyUsedRemove();
}

// play button
var playButton = document.querySelector("#start-button");
playButton.onclick = function() {
    fetch("https://memorymatchinggame.herokuapp.com/quotes", {
      credentials: 'include',
    }).then(function (response) {
        if (response.status == 401) { // Not logged in
            // TODO: show the login/register forms
            loginMessageShow();
            return;
        }
        if (response.status != 200) {
            // Something weird/unexpected, maybe show some kind of confused emoji or something
            confusedMessageShow();
            return;
        }
        response.json().then(function () {
            var newItem = document.getElementById("phrases");
            if (newItem.innerHTML === nameInput.value + " - \"" + quoteInput.value + "\"") {
                newItem.innerHTML = nameInput.value + " - \"" + quoteInput.value + "\"";
            } else {
                newItem.innerHTML = nameInput.value + " - \"" + quoteInput.value + "\"";
            }
            console.log("the input is", newItem);
        });
    });
};

// QUOTES
// create a quote
var createQuote = function() {
    var data = "name=" + encodeURIComponent(nameInput.value);
    data += "&quote=" + encodeURIComponent(quoteInput.value);
    data += "&score=" + encodeURIComponent(counter.innerHTML);
    fetch("https://memorymatchinggame.herokuapp.com/quotes", {
        method: 'POST',
        credentials: 'include',
        body: data,
        headers: {
            "Content-type": "application/x-www-form-urlencoded"
        }

    // this code happens after you have been notified that mail is in the mailbox
    }).then(function (response) {
    console.log("quote created.");
    });

    // load the new list of quotes
    getQuotes();
};

// delete a quote
var deleteQuote = function (id) {
    fetch(`https://memorymatchinggame.herokuapp.com/quotes/${id}`, {
      credentials: 'include',
      method: 'DELETE',
    }).then(function (response) {
        console.log("quote deleted.")
        // one more thing to do: refresh the quotes
        getQuotes();
    });
};

// update a quote
var updateQuote = function (id) {
    var data = "quote=" + encodeURIComponent(editInput.value);
    fetch(`https://memorymatchinggame.herokuapp.com/quotes/${id}`, {
      method: 'PUT',
      credentials: 'include',
      body: data,
      headers: {
        "Content-type": "application/x-www-form-urlencoded"
      }

    }).then(function (response) {
        console.log("quote updated.")
        // one more thing to do: refresh the quotes
        getQuotes();
    });
};

// get a single quote
var getQuote = function (id) {
    fetch(`https://memorymatchinggame.herokuapp.com/quotes/${id}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        "Content-type": "application/x-www-form-urlencoded"
      }

    }).then(function (response) {
        response.json().then(function (data) {
            editInput.value = data.quote;
        })
    });
};

// get multiple quotes
var getQuotes = function () {
    fetch("https://memorymatchinggame.herokuapp.com/quotes", {
      credentials: 'include',
    }).then(function (response) {
        if (response.status == 401) { // Not logged in
            // TODO: show the login/register forms
            // loginFailShow();
            return;
        }
        if (response.status != 200) {
            // Something weird/unexpected, maybe show some kind of confused emoji or something
            confusedMessageShow();
            return;
        }
        response.json().then(function (data) {
            var lList = document.querySelector("#list");
            lList.innerHTML = "";

            // add the quotes to the list
            data.forEach(function (quote) { // for quote in data
                var newItem = document.createElement("div");
                newItem.innerHTML = quote.name + " (" +  quote.score + ") - \"" + quote.quote + "\"";

                var deleteButton = document.createElement("button")
                deleteButton.id = "delete";
                deleteButton.innerHTML = '<i class="fa fa-trash"></i>';
                deleteButton.onclick = function () {
                    var proceed = confirm(`Do you want to delete: ${quote.name + " (" +  quote.score + ") - \"" + quote.quote + "\""}?`);
                    if (proceed) {
                        deleteQuote(quote.id);
                    }
                };

                var editButton = document.createElement("button")
                editButton.id = "edit";
                editButton.innerHTML = '<i class="fa fa-edit"></i>';
                editButton.onclick = function () {
                    var proceed = confirm(`Do you want to edit: ${quote.name + " (" +  quote.score + ") - \"" + quote.quote + "\""}?`);
                    if (proceed) {
                        getQuote(quote.id);
                        quoteID = quote.id;
                        showDivEditQuote();
                    }
                };

                newItem.appendChild(deleteButton)
                newItem.appendChild(editButton)
                lList.appendChild(newItem)
            });
        });
    });
};
getQuotes();

// USERS
// create a user
var createUser = function() {
    var fnameInput = document.querySelector("#firstname");
    var lnameInput = document.querySelector("#lastname");
    var emailSignupInput = document.querySelector("#email-signup");
    var passwordSignupInput = document.querySelector("#password-signup");

    var data = "fname=" + encodeURIComponent(fnameInput.value);
    data += "&lname=" + encodeURIComponent(lnameInput.value);
    data += "&email=" + encodeURIComponent(emailSignupInput.value);
    data += "&password=" + encodeURIComponent(passwordSignupInput.value);

    fetch("https://memorymatchinggame.herokuapp.com/users", {
        method: 'POST',
        credentials: 'include',
        body: data,
        headers: {
            "Content-type": "application/x-www-form-urlencoded"
        }
    }).then(function (response) {
        if (response.status == 401) { // Not logged in
            // TODO: show the login/register forms
            loginFailShow();
            return;
        }
        if (response.status == 422) {
            userAlreadyUsedShow();
            return;
        }
        if (response.status != 201) {
            // Something weird/unexpected, maybe show some kind of confused emoji or something
            confusedMessageShow();
            return;
        }
        console.log("user created.");
        registerSuccessShow();
        hideDivSignupForm();
        showDivSigninForm();
    });
};

// login a single user
var loginUser = function () {
    var emailSigninInput = document.querySelector("#email-signin");
    var passwordSigninInput = document.querySelector("#password-signin");

    var data = "email=" + encodeURIComponent(emailSigninInput.value);
    data += "&password=" + encodeURIComponent(passwordSigninInput.value);

    fetch(`https://memorymatchinggame.herokuapp.com/sessions`, {
      method: 'POST',
      credentials: 'include',
      body: data,
      headers: {
        "Content-type": "application/x-www-form-urlencoded"
      }
    }).then(function (response) {
        if (response.status == 401 || data == "") { // Not logged in
            // TODO: show the login/register forms
            loginFailShow();
            return;
        }
        if (response.status != 201) {
            // Something weird/unexpected, maybe show some kind of confused emoji or something
            confusedMessageShow();
            return;
        }
        console.log("user logged in.")
        loginSuccessShow();
        hideDivSigninForm();
        showDivQuoteForm();
        getQuotes();
    });
};

function checkForm() {
    var fname = document.getElementById("firstname").value;
    var lname = document.getElementById("lastname").value;
    var email = document.getElementById("email-signup").value;
    var password = document.getElementById("password-signup").value;
    var cansubmit = (fname.length > 0 && lname.length > 0 && email.length > 0 && password.length > 0);
    document.getElementById("registerButton").disabled = !cansubmit;
};

function checkForm2() {
    var email = document.getElementById("email-signin").value;
    var password = document.getElementById("password-signin").value;
    var cansubmit = (email.length > 0 && password.length > 0);
    document.getElementById("loginButton").disabled = !cansubmit;

};

// GAME
// shuffle cards
function shuffle(array) {
    var currentIndex = array.length, temp, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temp = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        console.log("current index is", currentIndex);
        array[randomIndex] = temp;
        console.log("random index is", randomIndex);
    }
    return array;
};

// shuffles cards when page is refreshed
document.body.onload = startGame();

// description function to start a new play 
function startGame(){
    // shuffle deck
    cards = shuffle(cards);

    // remove all exisiting classes from each card
    for (var i = 0; i < cards.length; i++){
        deck.innerHTML = "";
        [].forEach.call(cards, function(item) {
            deck.appendChild(item);
        });
        cards[i].classList.remove("open", "match", "disabled");
    }

    // reset moves
    moves = 0;
    counter.innerHTML = moves;

    // reset phrases
    p = "";
    phrases.innerHTML = p;
}

//  toggles open and show class to display cards
var displayCard = function (){
    this.classList.toggle("open");
    this.classList.toggle("disabled");
};

// add opened cards to OpenedCards list and check if cards are match or not
function cardOpen() {
    openedCards.push(this);
    var len = openedCards.length;
    if(len === 2){
        moveCounter();
        if(openedCards[0].type === openedCards[1].type){
            matched();
        } else {
            unmatched();
        }
    }
};

// when cards match
function matched(){
    openedCards[0].classList.add("match", "disabled");
    openedCards[1].classList.add("match", "disabled");
    openedCards[0].classList.remove("open", "no-event");
    openedCards[1].classList.remove("open", "no-event");
    openedCards = [];
}

// when cards don't match
function unmatched(){
    openedCards[0].classList.add("unmatched");
    openedCards[1].classList.add("unmatched");
    disable();
    setTimeout(function(){
        openedCards[0].classList.remove("open", "no-event","unmatched");
        openedCards[1].classList.remove("open", "no-event","unmatched");
        enable();
        openedCards = [];
    },300);
}

// disable cards temporarily
function disable(){
    Array.prototype.filter.call(cards, function(card){
        card.classList.add('disabled');
    });
}

// enable cards and disable matched cards
function enable(){
    Array.prototype.filter.call(cards, function(card){
        card.classList.remove('disabled');
        for(var i = 0; i < matchedCard.length; i++){
            matchedCard[i].classList.add("disabled");
        }
    });
}

// count player's moves
function moveCounter(){
    moves++;
    counter.innerHTML = moves;
}

// MESSAGES
// you won message when all cards match
function youWon() {
    if(matchedCard[11]){
        // show the you won message
        popup.classList.add("show");
        // creates a list of individuals who finished with a certain number of moves
        createQuote();
    };
}

// ask for user to play again
function playAgainClose(){
    popup.classList.remove("show");
    startGame();
}

// login message
function loginMessageShow() {
    popup2.classList.add("show");
}

// login message
function loginMessageRemove() {
    popup2.classList.remove("show");
}

// login success show
function loginSuccessShow() {
    popup3.classList.add("show");
}

// login success remove
function loginSuccessRemove() {
    popup3.classList.remove("show");
    startGame();
}

// login fail show
function loginFailShow() {
    popup4.classList.add("show");
}

// login fail remove
function loginFailRemove() {
    popup4.classList.remove("show");
    startGame();
}

// something went wrong message show
function confusedMessageShow() {
    popup5.classList.add("show");
}

// something went wrong message remove
function confusedMessageRemove() {
    popup5.classList.remove("show");
    startGame();
}

// register success show
function registerSuccessShow() {
    popup6.classList.add("show");
}

// register success remove
function registerSuccessRemove() {
    popup6.classList.remove("show");
    startGame();
}

// register success show
function userAlreadyUsedShow() {
    popup7.classList.add("show");
}

// register success remove
function userAlreadyUsedRemove() {
    popup7.classList.remove("show");
}

// loop to add event listeners to each card
for (var i = 0; i < cards.length; i++){
    card = cards[i];
    card.addEventListener("click", displayCard);
    card.addEventListener("click", cardOpen);
    card.addEventListener("click", youWon);
};
