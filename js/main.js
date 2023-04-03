"use strict";
const elWrapper = document.querySelector('.wrapper');
const elModal = document.querySelector('.modal-content');
const modal = document.querySelector('#modal');
const elModalBack = document.querySelector('#modal-back');
const elBookMark = document.querySelector('.aside-wrapper');
const elSearch = document.querySelector('.header__input');
const logoutBtn=document.querySelector('.logout');
const cards = document.getElementById('cards');

const token=localStorage.getItem('token');
if(!token){
    window.location.href="../login.html";
}
if(token){
    logoutBtn.addEventListener("click", ()=>{
        localStorage.removeItem("token");
    })
}

let array = [];
const BASE_URL = "https://www.googleapis.com/books";
const fragment = new DocumentFragment();

// fetchdata
async function fetchData() {
    const res = await fetch(BASE_URL + "/v1/volumes?q=N");
    const data = await res.json();
    array = data.items;
    renderBook(array);
}
fetchData();

// render book
function renderBook(array) {
    array.forEach(book => {
        const newDiv = document.createElement("div");
        newDiv.innerHTML = `
        <div class="card">
            <a href="#" class="card-img-wrapper">
                <img src="${book.volumeInfo.imageLinks.thumbnail}" class="card-img" alt="${book.volumeInfo.title}">
            </a>
            <div class="card-body">
                <h5 class="card-title" title="${book.volumeInfo.title}">${book.volumeInfo.title.slice(0, 20) + "..."}</h5>
                <div class="d-flex flex-column">
                    <span class="author">${book.volumeInfo.authors}</span>
                    <span class="year">${book.volumeInfo.publishedDate}</span>
                </div>
                <div>
                    <div class="d-flex align-items-center justify-content-between gap-2">
                        <a href="#" class="btn btn-warning fw-semibold px-3" data-book="${book.id}">BookMark</a>
                        <a href="#" class="btn btn-more px-3" data-book="${book.id}">More Info</a>
                    </div>
                    <a href="${book.accessInfo.webReaderLink}" target="_blank" class="btn btn-read fw-semibold text-white w-100">Read</a>
                </div>
            </div>
        </div>  
        `;
        fragment.appendChild(newDiv);

        // btn-more 
        const moreInfoBtn = newDiv.querySelector('.btn-more');

        moreInfoBtn.addEventListener('click', (evt) => {
            evt.preventDefault();
            elModalBack.classList.remove("back-hidden");
            const bookId = evt.target.dataset.book;
            const selectedBook = array.find((book) => book.id === bookId);
            renderModal(selectedBook);
        });

        // btn-warning
        const elBookMarkBtn = newDiv.querySelector('.btn-warning');
        elBookMarkBtn.addEventListener('click', (evt) => {
            evt.preventDefault();
            const bookMarkId = evt.target.dataset.book;
            const selectedBookMark = array.find((book) => book.id === bookMarkId);
            renderBookMark(selectedBookMark);
        })
    });
    elWrapper.appendChild(fragment);
}


// render modal
function renderModal(book) {
    elModal.innerHTML = "";
    const newDiv = document.createElement("div");
    newDiv.className = "modal-wrapper";
    newDiv.innerHTML = `
        <div class="modal-nav d-flex justify-content-between">
            <h4>${book.volumeInfo.title.slice(0, 20)}</h4>
            <img class="modal-close-icon" src="../images/close.svg" alt="close icon">
         </div>
        <div class="modal-fund">
            <div class="d-flex flex-column align-items-center justify-content-center gap-5">
                <img class="modal-img" src="${book.volumeInfo.imageLinks.thumbnail}" alt="${book.volumeInfo.title}">
                <p class="modal-description">${book.volumeInfo.description}</p>
            </div>
            <div class="d-flex flex-column gap-3">
                <h6>Author : <span>${book.volumeInfo.authors}</span></h6>
                <h6>Published :<span>${book.volumeInfo.publishedDate}</span></h6>
                <h6>Publishers: <span>${book.volumeInfo.publisher}</span></h6>
                <h6>Categories:<span>${book.volumeInfo.categories}</span></h6>
                <h6>Pages Count: <span>${book.volumeInfo.pageCount}</span></h6>            
            </div>
        </div>
        <footer class="modal-footer">
            <div>
                <a href="${book.accessInfo.webReaderLink}" target="_blank" id="modal-read" class="btn btn-read fw-semibold text-white">Read</a>
            </div>
         </footer>
    `;
    fragment.appendChild(newDiv);
    elModal.appendChild(fragment);
    modal.appendChild(elModal);

    const modalImg = newDiv.querySelector('.modal-close-icon');
    modal.classList.remove("hidden");

    modalImg.addEventListener("click", () => {
        elModalBack.classList.add("back-hidden");
        modal.classList.add("hidden");
    });
}


// render bookmark
function renderBookMark(array) {
    const newDiv = document.createElement("div");
    newDiv.classList = ("my-3")
    newDiv.innerHTML = `
        <div class="aside-card d-flex align-items-center justify-content-between" data-id="${array.id}">
            <div class="d-flex flex-column">
                <h4>${array.volumeInfo.title.slice(0, 8) + "..."}</h4>
                <p>${array.volumeInfo.authors}</p>
            </div>
            <div class="aside-icon d-flex gap-2">
                <img src="./images/book.svg" alt="book icon" class="aside-book">
                <img src="./images/delete.svg" alt="delete icon" data-id="${array.id}" class="aside-delete">
            </div>
        </div>
    `;

    const deleteBtn = newDiv.querySelector('.aside-delete');
    deleteBtn.addEventListener('click', (evt) => {
        const delId = evt.target.dataset.id;
        const selectedBookmark = document.querySelector('.aside-card[data-id="' + delId + '"]');
        selectedBookmark.remove();
    });

    elBookMark.appendChild(newDiv);
}

elSearch.addEventListener('input', (evt) => {
    let titleSort = evt.target.value;
    console.log(titleSort);
    let filteredArr = array.filter((item) => {
        return item.volumeInfo.title.toLowerCase().includes(titleSort);
    });
    console.log(filteredArr);
    renderSearchInput(filteredArr);
});

function renderSearchInput(array){
let result = array.map(book => {
    let element = `
        <div class="card">
            <a href="#" class="card-img-wrapper">
                <img src="${book.volumeInfo.imageLinks.thumbnail}" class="card-img" alt="${book.volumeInfo.title}">
            </a>
            <div class="card-body">
                <h5 class="card-title" title="${book.volumeInfo.title}">${book.volumeInfo.title.slice(0, 20) + "..."}</h5>
                <div class="d-flex flex-column">
                    <span class="author">${book.volumeInfo.authors}</span>
                    <span class="year">${book.volumeInfo.publishedDate}</span>
                </div>
                <div>
                    <div class="d-flex align-items-center justify-content-between gap-2">
                        <a href="#" class="btn btn-warning fw-semibold px-3" data-book="${book.id}">BookMark</a>
                        <a href="#" class="btn btn-more px-3" data-book="${book.id}">More Info</a>
                    </div>
                    <a href="${book.accessInfo.webReaderLink}" target="_blank" class="btn btn-read fw-semibold text-white w-100">Read</a>
                </div>
            </div>
        </div>  
    `

    return element;
}).join(' ');

cards.innerHTML = result;
}

