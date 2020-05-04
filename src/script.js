const monstersUrl = 'http://127.0.0.1:3000/monsters';
const usersUrl = 'http://localhost:3000/users';

document.addEventListener('DOMContentLoaded', function(){

    document.addEventListener('submit', function(event){
        event.preventDefault();
        let eventTarget = event.target;
        let username = eventTarget.username.value;
        let homePage = document.querySelector('.home-page')
        fetch(usersUrl)
        .then(res => res.json())
        .then(function(result){
            let userId = findUser(result, username);
            if (userId) {
                //render the user's profile
                homePage.style.display = 'none';
                showUser(userId);
            } else {
                //render sign up page;
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