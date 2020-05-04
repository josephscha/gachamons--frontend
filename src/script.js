const monstersUrl = 'http://127.0.0.1:3000/monsters';
const usersUrl = 'http://localhost:3000/users';


document.addEventListener('DOMContentLoaded', function(){

    const navBar = document.querySelector('.nav-bar');
    const logInButton = document.querySelector('.log-in-button')

    //log-in page/home page
    logInButton.addEventListener('click', function(event){
        event.preventDefault();
        let eventTarget = event.target.parentNode;
        let username = eventTarget.username.value;
        let homePage = document.querySelector('.home-page')
        homePage.style.display = 'none';
        fetch(usersUrl)
        .then(res => res.json())
        .then(function(result){
            let userId = findUser(result, username);
            if (userId) {
                //render the user's profile                
                showUser(userId);
            } else {
                //render sign up page;
                showSignUp();
            }
        })
    })

    function findUser(array, target) {
        let result = false;
        let id = null;
        array.forEach(function(element){
            if (element["username"] === target) {
                result = true;
                id = element.id
            }
        })
        return id;
    }

    function showUser(id) {
        navBar.dataset.userId = id;
        fetch(`${usersUrl}/${id}`)
        .then(res => res.json())
        .then(function(userInfo){
            displayUser(userInfo);
        })
    }

    function displayUser(user) {
        let div = document.createElement('div')
        div.setAttribute('class', 'profile-page')
        div.innerHTML = `
        <h3>Username: ${user.username}</h3>
        <h3>Nickname: ${user.nickname}</h3>
        <h3>Gender: ${user.gender}</h3>
        <h3>Balance: ${user.balance}</h3>
        <img src=${user.img} alt=${user.username}>
        `
        div.dataset.userId = user.id;
        document.body.append(div);
    }

    function showSignUp() {
        let div = document.createElement('div')
        div.setAttribute('class', 'sign-up-page')
        div.innerHTML = `
        <form id='sign-up-form'>
        <input type="text" name="username" value="" placeholder="Enter username">
        <input type="text" name="nickname" value="" placeholder="Enter nickname">
        <select id="gender">
            <option value="male">male</option>
            <option value="female">female</option>
        </select>
        <input type="text" name="img" value="" placeholder="Enter user's image url">
        <input type="submit" value="Submit">
        </form>
        `
        document.body.append(div);
        div.addEventListener('submit', function(event) {
            event.preventDefault();
            let eventTarget = event.target;
            let signUpForm = document.querySelector('.sign-up-page')
            let newUser = {
                'username': eventTarget.username.value,
                'nickname': eventTarget.nickname.value,
                'gender': eventTarget.gender.value,
                'img': eventTarget.img.value
            }
            
            fetch(usersUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    accept: 'application/json'
                }, 
                body: JSON.stringify(newUser)
            }).then(res => res.json())
            .then(function(result){
                signUpForm.style.display = 'none';
                showUser(result.id);
            })
        })
    }

    
    // function getMonsters() {
    //     fetch(monstersUrl)
    //     .then(res => res.json())
    //     .then(function(result) {
    //         result.forEach(function(monster){
    //             showMonster(monster)
    //         })
    //     })
    // }

    // function showMonster(monster) {

    //     let img = document.createElement('img')
    //     img.setAttribute('src', monster.img_url)
    //     document.body.append(img);
    // }

    // getMonsters();
})