const dropdown = document.querySelector('.dropdown')
const toggleButton = document.querySelector('.dropdown-toggle')
const menu = document.querySelector('.dropdown-menu')
const options = document.querySelectorAll('.dropdown-option')

const gallery = document.querySelector('.galler');
const photoContainer = document.querySelector('.photoContainer');

const nextButton = document.querySelector('.next-button')
const searchButton = document.querySelector('.searchButton');

const inputText = document.querySelector('#search');
const inputSize = document.querySelector('#size-options');
const inputSort = document.querySelector('#sort-options');
const inputNumber = document.querySelector('#number-options');


const popUp = document.querySelector('.pop-up');
const popUpText = document.querySelector('.pop-up_message');
const popUpRefresh = document.querySelector('.pop-up_refresh');

const bugSound = new Audio('./sound/bug_pull.mp3');
const gameWinSound = new Audio('./sound/game_win.mp3');
const carrotSound = new Audio('./sound/carrot_pull.mp3');
const alertSound = new Audio('./sound/alertwav');

let optionSizeValue = '';
let sortValue = '';
let imgNumberValue = '';
let textValue = '';
// ---------------------------------------
//text-input as user wants to search
inputText.addEventListener('blur', (e) => {
    textValue = e.target.value;
    console.log(textValue);
    inputText.focus();

});
//choose one of 3 options as user's intention
inputSize.addEventListener('change', function (e) {
    console.log(e.target.value);
    optionSizeValue = e.target.value;
});
// the number of photos user want 
inputNumber.addEventListener('change', function (e) {
    console.log(e.target.value);
    imgNumberValue = e.target.value;
});

// drop-down button created  with just buttons

toggleButton.addEventListener('click', function () {
    menu.classList.toggle('show');
});

options.forEach(function (item) {
    item.addEventListener('click', selectOption);
});

function selectOption() {

    sortValue = this.textContent;
    console.log(sortValue);
    toggleButton.textContent = sortValue;
    menu.classList.remove('show');
};

function stopGame() {

    showPopUpWithText('Please, click here to try it again!');
}

function showPopUpWithText(text) {

    popUpText.innerText = text;
    popUp.classList.remove('pop-up-hide');
}

function playSound(sound) {
    sound.play();
}

//loading  mark for photos from Filickr
function displayLoading() {
    anime({
        //what works for element
        targets: ".box1",
        scale: ['0', '3'],
        easing: "easeInOutQuad",
        //how it works
        opacity: 1,
        duration: '300',
        loop: '1'
    });
}

function hideLoading() {
    anime({
        targets: ".box1",
        scale: ['3', '0'],
        easing: "easeInOutQuad",

        opacity: 0,
        duration: '300',
        loop: '1'
    });
}


function fetchGetData() {
    if (!textValue || !sortValue || !imgNumberValue || !optionSizeValue) {
        clear();
        stopGame();
        return;
    }

    displayLoading();


    const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=358be4901f416ebee58ec9ab473d4b4d&text=${textValue}&sort=${sortValue}&per_page=${imgNumberValue}&format=json&nojsoncallback=1`;

    fetch(url)
        .then((res) => res.json())

        .then((result) => {

            const photoarr = result.photos.photo;

            photoarr.forEach((result) => {
                console.log(result);
                const img = document.createElement('img');

                img.src = `https://live.staticflickr.com/${result.server}/${result.id}_${result.secret}_${optionSizeValue}.jpg`;

                photoContainer.appendChild(img);
                playSound(gameWinSound);
            })

            hideLoading();


            if (result.photos.pages === 0) {
            
                stopGame();
            
            }
        })

        .catch((error) => {
            console.log(error.name);
            stopGame();
        })
};

// all of all functions are intialised 
function clear() {

    inputText.value = '';
    inputSize.value = '';
    inputNumber.value = '';

    //inputSort.value = '';
    photoContainer.innerHTML = '';
    toggleButton.textContent = 'Select sort-options';

    popUp.classList.add('pop-up-hide');

};

// click this search button to down load photos that I want to search 
//and at the same time all inputs are intialised for a new search
searchButton.addEventListener('click', (e) => {
    e.preventDefault();
    clear();
    fetchGetData();
});

popUpRefresh.addEventListener('click', (e) => {
    e.preventDefault();
    hidePopUp();
    clear();
    playSound(carrotSound);
});

function hidePopUp() {
    popUp.classList.add('pop-up-hide');
}

