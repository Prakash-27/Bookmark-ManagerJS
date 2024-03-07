import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, query, where, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBfobQZEbus5FaV1HVtUsoFkZqIdAyNHug",
    authDomain: "bookmark-56548.firebaseapp.com",
    projectId: "bookmark-56548",
    storageBucket: "bookmark-56548.appspot.com",
    messagingSenderId: "968873715780",
    appId: "1:968873715780:web:1440921fb1b79e9eee7411"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const colRef = collection(db, "bookmarks");

function deleteEvent(){
    const deleteButtons = document.querySelectorAll("i.delete");
    deleteButtons.forEach(button => {
        button.addEventListener("click", event => {
            const deleteRef = doc(db, "bookmarks", button.dataset.id);
            deleteDoc(deleteRef)
                .then(() => {
                    button.parentElement.parentElement.parentElement.remove();
                    // showCard(); either we can use this instead of above remove option
                })
        })
    });
}

function generateTemplate(response, id){
    return `<div class="card">
                <p class="title">${response.title}</p>
                <div class="sub-information">
                    <p>
                        <span class="category ${response.category}">${response.category[0].toUpperCase()}${response.category.slice(1)}</span>
                    </p>
                    <a href="${response.link}" target="_blank"><i class="bi bi-box-arrow-up-right website"></i></a>
                    <a href="https://www.google.com/search?q=${response.title}" target="_blank"><i class="bi bi-google search"></i></a>
                    <span><i class="bi bi-trash delete" data-id="${id}"></i></span>
                </div>
            </div>`;
}

// 2
const cards = document.querySelector(".cards");
function showCard(){
    cards.innerHTML = "";
    getDocs(colRef)
    .then(data => {
        data.docs.forEach(document => {
            // console.log(document.data(), document.id);
            cards.innerHTML += generateTemplate(document.data(), document.id);
        })
        deleteEvent(); //One all card are loaded we are using the deleteEvent function
    })
    .catch(error => {
        console.log(error);
    });
}
showCard();

// 1
const addForm = document.querySelector(".add");
addForm.addEventListener("submit", event => {
    event.preventDefault();
    addDoc(colRef, {
        link: addForm.link.value,
        title: addForm.title.value,
        category: addForm.category.value,
        createdAt: serverTimestamp()
    })
    .then(() => {
        addForm.reset();
        showCard();
    })
});

function filteredCard(category){
    if(category === "All"){
        showCard();
    } else {
        const qRef = query(colRef, where("category", "==", category.toLowerCase()));
        cards.innerHTML ="";
        getDocs(qRef)
           .then(data => {
               data.docs.forEach(document => {
                   cards.innerHTML += generateTemplate(document.data(), document.id);
               });
               deleteEvent();
           })
           .catch(error => {
               console.log(error);
           });
    }
}

const categoryList = document.querySelector(".category-list");
const categorySpan = document.querySelectorAll(".category-list span");
categoryList.addEventListener("click", event => {
    if(event.target.tagName === "SPAN"){
        // console.log(event.target.innerText);
        filteredCard(event.target.innerText);
        categorySpan.forEach(span => span.classList.remove("active"));
        event.target.classList.add("active");
    }
});

