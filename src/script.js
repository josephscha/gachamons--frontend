const monstersUrl = 'http://127.0.0.1:3000/monsters';
const usersUrl = 'http://localhost:3000/users';


document.addEventListener('DOMContentLoaded', function () {

    let navBar = null;
    const logInButton = document.querySelector('.log-in-button')

    //log-in page/home page
    logInButton.addEventListener('click', function (event) {
        let eventTarget = event.target.parentNode;
        let username = eventTarget.username.value;

        //let homePage = document.querySelector('.home-page')
        clearPage();
        showNavBar();
        //homePage.style.display = 'none';
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
                    showNavBar();

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
                            //editForm.style.display = 'none';
                            clearPage();
                            showNavBar();
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
                    //signUpForm.style.display = 'none';
                    showUser(result.id);
                })
        })
    }

    navBar.addEventListener('click', function (event) {
        let eventTarget = event.target;

        //TODO: helper function to clear the page!!!
        //TODO: modify showMonster(monster)!!!!

        if (eventTarget.className === 'nav-monsters-collection') {
            let div = document.querySelector('.profile-page')
            clearPage();
            showNavBar();
            //div.style.display = 'none';
            getMonsters();
        }
    })


    function getMonsters() {
        fetch(monstersUrl)
            .then(res => res.json())
            .then(function (result) {
                result.forEach(function (monster) {
                    showMonster(monster)
                })
            })
    }

    function showMonster(monster) {
        let img = document.createElement('img')
        img.setAttribute('src', monster.img_url)
        document.body.append(img);
    }

    function clearPage() {
        document.body.innerHTML = ``; 
    }

    function showNavBar(){

        let div = document.createElement('div')
        div.setAttribute('class', 'nav-bar')
        div.style.cursor = 'pointer';
        div.innerHTML = `
        <a class='nav-profile'>Profile | </a>
        <a class='nav-monsters'>My Monsters | </a>
        <a class='nav-monsters-collection'>All Monsters | </a>
        <a class='nav-inventory'>Inventory | </a>
        <a class='nav-shop'>Shop | </a>
        <a class='nav-balance'>Add balance | </a>
        <a class='nav-logout'>Log out</a>
        `

        navBar = div;
        document.body.append(div);
    }
})