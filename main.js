// Sortowanie
const arrayOfSortContainers = [...document.getElementsByClassName('column__tasksContainer')];

for (let i = 0; i < arrayOfSortContainers.length; i++) {
    new Sortable(arrayOfSortContainers[i], {
        group: 'shared',
        animation: 150,
        // delay: 500,
        forceFallback: true, //
        scroll: true,
        scrollSensitivity: 80, // px, how near the mouse must be to an edge to start scrolling.
        scrollSpeed: 10, // px

        onStart: function (evt) {
            binContainer.style.display = 'flex';
            binColorContainer.style.display = 'flex';
        },

        onEnd: function (evt) {
            binContainer.style.display = 'none';
            binColorContainer.style.display = 'none';
            if (binContainer.firstElementChild) {
                binContainer.removeChild(binContainer.firstElementChild);
            }
        },
    });
}
new Sortable(binContainer, {
    group: 'shared',
    animation: 150,
});


// Modal
const modal = document.querySelector('#my-modal');
const closeBtn = document.querySelector('.close');
let colNumModal;
let editItem = null;
const description = document.getElementById('modalDescription');
const title = document.getElementById('modalTitle');

closeBtn.addEventListener('click', closeModal);
window.addEventListener('click', outsideClick);
window.addEventListener('click', editClick);
title.addEventListener('click', () => title.innerHTML = '');
description.addEventListener('click', () => description.innerHTML = '');

function openModal(colNum, edit = false, toEdit = null) {
    modal.style.display = 'flex';
    colNumModal = colNum;
    editItem = toEdit;
    if (editItem !== null) {
        description.innerText = editItem.querySelector('.desc').innerText;
        title.innerText = editItem.querySelector('.title').innerText;
    }
}

function closeModal() {
    modal.style.display = 'none';
    clearModalDivs();
}

function outsideClick(e) {
    if (e.target == modal) {
        closeModal();
    }
}

function editClick(e) {
    if (e.target.className === 'column__task') {
        openModal(0, true, e.target);
    }
}

async function newTask() {
    const description = document.getElementById('modalDescription').innerText;
    const title = document.getElementById('modalTitle').innerText;
    const tags = [...document.getElementById('modalTags').innerText];
    let status = '';
    




    if (description == '' || description == null || title == '' || title == null) {
        alert("Tytuł i opis nie mogą być puste! Tytuł może mieć maksymalnie 35 znaków")
        return;
    }
    if (description.length > 1024){
        alert("Opis jest zbyt długi!");
        return;
    }
    if (title.length > 35){
        alert("Tytuł może mieć maksymalnie 35 znaków");
        return;
    }
    if(tags.length<1){
        alert("Dodaj przynajmniej 1 tag");
        return;
    }
    if (editItem !== null) {
        console.log(editItem);

        let newDiv = "";
        newDiv += `<b class="title">${title}: </b> <span class="desc"> ${description}</span>`;
        editItem.innerHTML = newDiv;
        clearModalDivs();
        closeModal();
        return;
    }

    if (document.getElementsByClassName('column')[colNumModal].children[0].innerText === 'To Do') status = 'to-do';
    else if (document.getElementsByClassName('column')[colNumModal].children[0].innerText  === 'In Progress') status = 'in progress';
    else if (document.getElementsByClassName('column')[colNumModal].children[0].innerText  === 'Done') status = 'done';

    
    

    const body = {
        "title": title,
        "description": description,
        "tags": tags,
        "status": status
    }

    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get('myParam');

    await fetch('https://to-do-a.herokuapp.com/api/mytasks', {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json",
            "x-auth-token": myParam
        }
    })
        .then(res => res.json())
        .then(res => {
            const el = document.createElement("div");
            let newDiv = "";
            newDiv += `<div key=${res._id} class="column__task" spellcheck="false"><b class="title">${res.title} </b> <span class="desc">
                    </br>${res.description}</span></div>`;
            el.innerHTML = newDiv;
            document.getElementById(res.status).appendChild(el);
            })
        .catch(err => alert(err));



    clearModalDivs();
    closeModal();
}

function clearModalDivs() {
    const allDivs = document.getElementsByClassName("modal__text-area");
    for (let i = 0; i <= allDivs.length; i++) {
        if (allDivs[i] != null) {
            allDivs[i].innerText = null;
        }
    }
}