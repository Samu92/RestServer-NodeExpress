const myForm = document.querySelector('form');

const url = (window.location.hostname.includes('localhost'))
    ? 'http://localhost:8080/api/auth/'
    : 'https://restserver-node-shb.herokuapp.com/api/auth/';

myForm.addEventListener('submit', event => {
    event.preventDefault();

    const formData = {};

    for(let element of myForm.elements) {
        if (element.name.length > 0) {
            formData[element.name] = element.value;
        }
    }

    fetch(url + 'login', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {'Content-Type': 'application/json'}
    })
    .then(response => response.json())
    .then(({message, token}) => {
        if(message){
            return console.error(message);
        }

       localStorage.setItem('token', token);
       window.location = 'chat.html';
    })
    .catch(error => {
        console.log(error);
    });
});

function handleCredentialResponse(response) {
  const body = { id_token: response.credential };

  fetch(url + 'google', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
    .then((response) => response.json())
    .then((response) => {
      console.log(response);
      localStorage.setItem('token', response.token);
      window.location = 'chat.html';
    })
    .catch(console.warn);
}

const button = document.getElementById('google_signout');
button.onclick = () => {
  console.log(google.accounts.id);
  google.accounts.id.disableAutoSelect();

  google.accounts.id.revoke(localStorage.getItem('email'), (donde) => {
    localStorage.clear();
    location.reload();
  });
};
