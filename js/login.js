"use strict";
const elForm = document.querySelector('#form');
let userEmail = "eve.holt@reqres.in";
let userPassword = "cityslicka";
elForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const email = evt.target.email.value;
    const password = evt.target.password.value;

    fetch('https://reqres.in/api/login', {
        method: 'POST',
        body: JSON.stringify({
            email,
            password,
        }),
        headers: {
            'Content-type': 'Application/json',
        },
    }).then((res) => {
        return res.json();
    }).then((data) => {
        localStorage.setItem('token', data.token);
        window.location.href = "../index.html";
    });
})
