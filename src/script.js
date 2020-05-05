const monstersUrl = 'http://127.0.0.1:3000/monsters';
const usersUrl = 'http://localhost:3000/users';


document.addEventListener('DOMContentLoaded', function () {

    const switchDisplay = { 'Display': 'block', 'Disappear': 'none' };
    let navBar = document.querySelector('.nav-bar');
    navBar.style.display = switchDisplay['Disappear'];
    let homePage = Array.from(document.body.children);

    const logInButton = document.querySelector('.log-in-button')

    //log-in page/home page
    logInButton.addEventListener('click', function (event) {
        event.preventDefault();
        let eventTarget = event.target.parentNode;
        let username = eventTarget.username.value;
        //TODO: simplify the code when log-out

        clearPage();
        navBar = document.querySelector('.nav-bar');
        navBar.style.display = 'block';
        //document.body.append(navBar);
        fetch(usersUrl)
            .then(res => res.json())
            .then(function (result) {
                let userId = findUser(result, username);
                if (userId) {
                    //render the user's profile                
                    showUser(userId);
                } else {
                    //render sign up page;
                    showSignUp();
                }
            })
        eventTarget.reset();
    })

    function findUser(array, target) {
        let result = false;
        let id = null;
        array.forEach(function (element) {
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
            .then(function (userInfo) {
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
        let editBtn = document.createElement('button');
        editBtn.dataset.userId = user.id;
        editBtn.textContent = 'Edit User';
        div.append(editBtn);
        div.dataset.userId = user.id;
        document.body.append(div);
        editBtn.addEventListener('click', function (event) {
            let eventTarget = event.target;
            let userId = eventTarget.dataset.userId;
            showEditForm(userId)
        })
    }

    function showEditForm(id) {
        fetch(`${usersUrl}/${id}`)
            .then(res => res.json())
            .then(function (userObj) {
                let div = document.createElement('div')
                div.setAttribute('class', 'edit-profile-page')
                div.innerHTML = `
            <form id='edit-profile-form'>
            <input type="text" name="username" value="${userObj.username}">
            <input type="text" name="nickname" value="${userObj.nickname}">
            <select id="gender">
                <option value="male">male</option>
                <option value="female">female</option>
            </select>
            <select id="img">
                <option value="./assets/mario-gif/birdo.gif">Birdo</option>
                <option value="./assets/mario-gif/bowser.gif">Bowser</option>
                <option value="./assets/mario-gif/daisy.gif">Daisy</option>
                <option value="./assets/mario-gif/diddy_kong.gif">Diddy Kong</option>
                <option value="./assets/mario-gif/dry_bones.gif">Dry Bones</option>
                <option value="./assets/mario-gif/hammer_bro.gif">Hammer Bro</option>
                <option value="./assets/mario-gif/king_boo.gif">King Boo</option>
                <option value="./assets/mario-gif/koopa_troopa.gif">Koopa Troopa</option>
                <option value="./assets/mario-gif/luigi.gif">Luigi</option>
                <option value="./assets/mario-gif/mario.gif">Mario</option>
                <option value="./assets/mario-gif/peach.gif">Peach</option>
                <option value="./assets/mario-gif/rosalina.gif">Rosalina</option>
                <option value="./assets/mario-gif/toad.gif">Toad</option>
                <option value="./assets/mario-gif/yoshi.gif">Yoshi</option>
            </select>
            <input type="submit" value="Submit">
            </form>
            `
                document.body.append(div);
                div.addEventListener('submit', function (event) {
                    event.preventDefault();
                    let eventTarget = event.target;
                    ///clear page!!!!!
                    clearPage();

                    let editForm = document.querySelector('.edit-profile-page')
                    let editUser = {
                        'username': eventTarget.username.value,
                        'nickname': eventTarget.nickname.value,
                        'gender': eventTarget.gender.value,
                        'img': eventTarget.img.value
                    }

                    fetch(`${usersUrl}/${id}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            accept: 'application/json'
                        },
                        body: JSON.stringify(editUser)
                    }).then(res => res.json())
                        .then(function (result) {
                            clearPage();
                            showUser(result.id);
                        })
                })
            })
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
        <select id="img">
            <option value="./assets/mario-gif/birdo.gif">Birdo</option>
            <option value="./assets/mario-gif/bowser.gif">Bowser</option>
            <option value="./assets/mario-gif/daisy.gif">Daisy</option>
            <option value="./assets/mario-gif/diddy_kong.gif">Diddy Kong</option>
            <option value="./assets/mario-gif/dry_bones.gif">Dry Bones</option>
            <option value="./assets/mario-gif/hammer_bro.gif">Hammer Bro</option>
            <option value="./assets/mario-gif/king_boo.gif">King Boo</option>
            <option value="./assets/mario-gif/koopa_troopa.gif">Koopa Troopa</option>
            <option value="./assets/mario-gif/luigi.gif">Luigi</option>
            <option value="./assets/mario-gif/mario.gif">Mario</option>
            <option value="./assets/mario-gif/peach.gif">Peach</option>
            <option value="./assets/mario-gif/rosalina.gif">Rosalina</option>
            <option value="./assets/mario-gif/toad.gif">Toad</option>
            <option value="./assets/mario-gif/yoshi.gif">Yoshi</option>
        </select>
        <input type="submit" value="Submit">
        </form>
        `
        document.body.append(div);
        div.addEventListener('submit', function (event) {
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
                .then(function (result) {
                    showUser(result.id);
                })
        })
    }

    navBar.addEventListener('click', function (event) {
        let eventTarget = event.target;
        let id = eventTarget.parentNode.dataset.userId;
        if (eventTarget.className === 'nav-monsters-collection') {
            clearPage();
            getMonsters();
        } else if (eventTarget.className === 'nav-profile'){
            clearPage();
            showUser(id);
        } else if (eventTarget.className === 'nav-monsters') {
            clearPage();

        } else if (eventTarget.className === 'nav-inventory') {
            clearPage();

        } else if (eventTarget.className === 'nav-shop') {
            clearPage();

        } else if (eventTarget.className === 'nav-balance') {
            clearPage();

        } else if (eventTarget.className === 'nav-logout') {
            document.body.innerHTML = ``;
            homePage.forEach(function(div){
                document.body.append(div);
            })
            navBar.style.display = 'none';
            //go back to home page;

        }
    })


    function getMonsters() {
        fetch(monstersUrl)
            .then(res => res.json())
            .then(function (result) {
                let monsterContainer = document.createElement('div')
                document.body.append(monsterContainer);
                monsterContainer.setAttribute('class', 'monster-container');
                result.forEach(function (monster) {
                    let div = showMonster(monster)
                    monsterContainer.append(div);
                })
            })
    }

    function showMonster(monster) {
        let div = document.createElement('div')
        div.setAttribute('class', 'monster-tile')
        div.innerHTML = `
        <img src=${monster.img_url} alt=${monster.name}>
        <p>${monster.name}, level ${monster.level}</p>
        `
        return div;
    }

    function clearPage() {      
        //let children = Array.from(document.body.children);
        navBar = document.querySelector('.nav-bar');
        document.body.innerHTML = ``;
        document.body.append(navBar);
        return navBar;
    }
})