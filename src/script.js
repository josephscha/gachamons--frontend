const monstersUrl = 'http://127.0.0.1:3000/monsters';
const usersUrl = 'http://localhost:3000/users';
const itemsurl = 'http://localhost:3000/items';
const inventoriesUrl = 'http://localhost:3000/inventories';
const summonsUrl = 'http://localhost:3000/summons';
let allMons = []//stroe all monsters

document.addEventListener('DOMContentLoaded', function () {
    const requestHeaders = {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }

    function getMonsArr() {
        fetchRails(monstersUrl)
            .then(function (result) {
                result.forEach(function (mon) {
                    allMons.push(mon);
                })
            })
    }

    function filterMons(arr, rarity) {
        let result = [];
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].rarity === rarity) {
                result.push(arr[i]);
            }
        }
        return result;
    }
    getMonsArr();

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
                    clearPage();
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

        } else if (eventTarget.className === 'nav-profile') {
            clearPage();
            showUser(id);
        } else if (eventTarget.className === 'nav-monsters') {
            clearPage();

        } else if (eventTarget.className === 'nav-inventory') {
            clearPage();
            let normalMons = filterMons(allMons, 'normal');
            let epicMons = filterMons(allMons, 'epic');
            let legendaryMons = filterMons(allMons, 'legendary');
            showInventory(id)

        } else if (eventTarget.className === 'nav-shop') {
            clearPage();
            showItems(id);


            //after bought an item, substract the balance
            //add listener to buy and summon button

        } else if (eventTarget.className === 'nav-balance') {
            clearPage();

        } else if (eventTarget.className === 'nav-logout') {
            document.body.innerHTML = ``;
            homePage.forEach(function (div) {
                document.body.append(div);
            })
            navBar.style.display = 'none';
        }
    })

    function showInventory(id) {
        fetchRails(`${inventoriesUrl}`)
            .then(inventoryItems => renderInventoryPage(inventoryItems, id))
    }

    function renderInventoryPage(inventoryItems, id) {
        let inventoryContainer = document.createElement(`div`)
        inventoryContainer.className = `inventory-container`
        document.body.append(inventoryContainer)
        inventoryItems.forEach(function (inventoryItem) {
            if (inventoryItem.user_id === parseInt(id)) {
                // go into items database.
                fetch(itemsurl).then(resp => resp.json()).then(function (results) {
                    results.forEach(function (item) {
                        if (item.id === inventoryItem.item_id) {
                            if (parseInt(inventoryItem.quantity) !== 0) {
                                let inventoryTile = document.createElement(`div`)
                                inventoryTile.className = `inventory-tile`
                                inventoryTile.innerHTML = `
                    <img src=${item.img_url}>
                    <p>${item.name}<br>
                    ${item.description}<br>
                    Quantity: ${inventoryItem.quantity}</p>
                    `
                                let summonBtn = document.createElement(`button`)
                                summonBtn.setAttribute('class', 'summon-button')
                                summonBtn.dataset.inventoryId = inventoryItem.id
                                summonBtn.dataset.itemId = item.id
                                summonBtn.dataset.quantity = inventoryItem.quantity
                                summonBtn.textContent = 'Summon!'
                                inventoryTile.append(summonBtn)
                                inventoryContainer.append(inventoryTile)
                                // inventoryItemId = inventoryItem.id
                                // user_id = parseInt(id)
                                // item_id = item.id
                                // add eventlistener to summonBtn
                                // debugger;
                                // send patch request to current inventory object
                                // decrement quantity by 1, if quantity = 0, delete 
                                // render updated inventoryitem
                                // if summonBtn.dataset.id = 1, go into normalMons and pull out random object
                                // if id = 2, Epicmons
                                // if id = 3, LegendaryMons
                                // send post request to summons with pulled out object
                            }
                        }
                    })
                })
            }
        })
    }
    document.body.addEventListener("click", function (event) {
        if (event.target.className === "summon-button") {
            clearPage()
            newQuantity = parseInt(event.target.dataset.quantity) - 1
            updatedInventoryItem = { "user_id": parseInt(navBar.dataset.userId), "item_id": parseInt(event.target.dataset.itemId), "quantity": newQuantity }
            event.target.dataset.quantity = newQuantity
            fetch(`${inventoriesUrl}/${parseInt(event.target.dataset.inventoryId)}`, {
                method: "PATCH",
                headers: requestHeaders,
                body: JSON.stringify(updatedInventoryItem)
            }).then(res => res.json())
                .then(result => showInventory(parseInt(navBar.dataset.userId)))
        }
    })

    function showItems(id) {
        fetchRails(itemsurl)
            .then(function (items) {
                let itemContainer = document.createElement('div')
                itemContainer.setAttribute('class', 'egg-container')
                document.body.append(itemContainer);
                fetch(`${ usersUrl } /${id}`)
                                .then(res => res.json())
                                .then(function (res) {

                                    balance = res['balance'];
                                    itemContainer.innerHTML = `
              <h1>Balance: ${balance}</h1>
              `
                                    items.forEach(function (item) {
                                        let div = displayEgg(item);
                                        itemContainer.append(div);
                                    })
                                })
                            //debugger;
                        })
                }

    function displayEgg(item) {
                        let div = document.createElement('div')

                        let buyBtn = document.createElement('button')
                        buyBtn.setAttribute('class', 'buy-button')
                        buyBtn.dataset.itemId = item.id
                        buyBtn.textContent = 'Buy'

                        // let summonBtn = document.createElement('button')
                        // summonBtn.setAttribute('class', 'summon-button')
                        // summonBtn.dataset.itemId = item.id
                        // summonBtn.textContent = 'Summon!'

                        div.setAttribute('class', 'item-tile')
                        div.dataset.itemId = item.id;
                        div.innerHTML = `
        <img src=${item['img_url']}>
        <p>Name: ${item.name}, Price: ${item.price} <br>
        ${item['description']}</p>
        `
                        div.append(buyBtn);
                        // div.append(summonBtn);
                        return div;
                    }

    //fetch data from rails api, here using GET method only
    function fetchRails(url) {
                        return fetch(url)
                            .then(res => res.json())
                            .then(result => result)
                    }


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