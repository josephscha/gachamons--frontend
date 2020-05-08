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


    function getMons() {
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

    getMons();

    const switchDisplay = { 'Display': 'block', 'Disappear': 'none' };
    let navBar = document.querySelector('.nav-bar');
    let audioBar = document.querySelector(`.audio-bar`)
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
        <h3>Balance: ${formatter.format(user.balance)}</h3>
        `
        let imgDiv = document.createElement(`div`)
        imgDiv.className = "profile-page-img"
        imgDiv.innerHTML = `
        <img src=${user.img} alt=${user.username}>
        `
        let editBtn = document.createElement('button');
        editBtn.dataset.userId = user.id;
        editBtn.textContent = 'Edit User';
        div.append(editBtn);
        div.dataset.userId = user.id;
        document.body.append(div);
        document.body.append(imgDiv);
        editBtn.addEventListener('click', function (event) {
            let eventTarget = event.target;
            let userId = eventTarget.dataset.userId;
            showEditForm(userId)
        })
    }

    function showEditForm(id) {
        let profilePage = document.body.querySelector(`.profile-page`)
        fetch(`${usersUrl}/${id}`)
            .then(res => res.json())
            .then(function (userObj) {
                let div = document.createElement('div')
                div.setAttribute('class', 'edit-profile-page')
                div.innerHTML = `
            <form id='edit-profile-form'>
            <p class="sign2" align="center">Edit User!</p>
            <input class="uni2" type="text" name="username" value="${userObj.username}">
            <input class="uni2" type="text" name="nickname" value="${userObj.nickname}">
            <select class="uni2" id="gender">
                <option value="male">male</option>
                <option value="female">female</option>
            </select>
            <select class="uni2" id="img">
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
            <input class="submit3" type="submit" value="Submit">
            </form>
            `

                profilePage.replaceWith(div);
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
        <p class="sign1" align="center">Register an account!</p>
        <input class="uni1" type="text" name="username" value="" placeholder="Enter username">
        <input class="uni1" type="text" name="nickname" value="" placeholder="Enter nickname">
        <select class="uni1" id="gender">
            <option selected disabled>Select your gender</option>
            <option value="male">male</option>
            <option value="female">female</option>
        </select>
        <select class="uni1" id="img">
            <option selected disabled>Choose an Avatar!</option>
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
        <input class="submit2" type="submit" value="Submit">
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
            renderUserMonsters(id);
        } else if (eventTarget.className === 'nav-inventory') {
            clearPage();

            // let normalMons = filterMons(allMons, 'normal');
            // let epicMons = filterMons(allMons, 'epic');
            // let legendaryMons = filterMons(allMons, 'legendary');
            showInventory(id)


        } else if (eventTarget.className === 'nav-shop') {
            clearPage();
            showItems(id);


            //after bought an item, substract the balance
            //add listener to buy and summon button

        } else if (eventTarget.className === 'nav-balance') {
            clearPage();
            showAddBalancePage(id)
        } else if (eventTarget.className === 'nav-logout') {
            document.body.innerHTML = ``;
            homePage.forEach(function (div) {
                document.body.append(div);
            })
            navBar.style.display = 'none';
        }
    })

    function showAddBalancePage(userId) {
        getUser(userId)
    }

    function getUser(userId) {
        fetch(`${usersUrl}/${userId}`)
            .then(resp => resp.json()).then(result => {
                renderBalancePage(result)
            })
    }

    function renderBalancePage(userObject) {
        clearPage()
        let div = document.createElement(`div`)
        div.setAttribute("class", "balance-page")
        div.dataset.userBalance = userObject.balance
        div.innerHTML = `
        <h1>Current Balance : <span>O</span><span>N</span><span>L</span><span>Y</span> ${formatter.format(userObject.balance)} Credits </h1>
        <h3 align="center">1 USD = $1,000 In game credits!</h3>
        <form id='add-balance-form'>
        <p class="sign1" align="center">Recharge Balance!</p>
        <label for="balance">How much credits would you like?</label>
        <input class="uni1" type="number" id="balance" name="balance" value="">
        <label for="fname">Full name as it appears on card</label>
        <input class="uni1" type"text" name="fname" value="">
        <label for="creditcardnumber">Please do not enter your credit card # here</label>
        <input class="uni1" type="number" name="creditcardnumber" value="">
        <label for="ssnumber">Social Security Number</label>
        <input class="uni1" type="number" name="ssnumber" value="">
        <label for="mothersmaidenname">Mother's Maiden Name</label>
        <input class="uni1" type="text" name="mothersmaidenname" value="">
        <input class="submit1" type="submit" value="Spend that money!">
        `
        document.body.append(div)
        div.addEventListener("submit", function (event) {
            event.preventDefault();
            let id = parseInt(navBar.dataset.userId)
            let balanceForm = event.target
            let balance = parseInt(balanceForm.balance.value)
            let userBalance = parseInt(event.target.parentNode.dataset.userBalance)
            let newBalance = balance + userBalance
            alert(`Thanks for that corn $$$. Your new balance is ${newBalance}`)
            fetch(`${usersUrl}/${id}`, {
                method: "PATCH",
                headers: requestHeaders,
                body: JSON.stringify({ "balance": newBalance })
            })
                .then(resp => resp.json())
                .then(userObject => {
                    renderBalancePage(userObject)
                })
        })
    }
    function updateUserBalance(userObject) {
        newBalance = userObject.balance + balance;
        return newBalance

    }
    function showInventory(id) {
        fetchRails(`${inventoriesUrl}`)
            .then(inventoryItems => renderInventoryPage(inventoryItems, id))
    }

    function renderInventoryPage(inventoryItems, id) {
        let inventoryContainer = document.createElement(`div`)
        inventoryContainer.className = `inventory-container`
        inventoryContainer.innerHTML = `
        <h1 class="inventory-display">All your items!</h1>
        `
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
                                <p>${item.name}<p>
                                <p>${item.description}</p
                                <p>Quantity: ${inventoryItem.quantity}</p>
                                `
                                let summonBtn = document.createElement(`button`)
                                summonBtn.setAttribute('class', 'summon-button')
                                summonBtn.dataset.inventoryId = inventoryItem.id
                                summonBtn.dataset.itemId = item.id
                                summonBtn.dataset.quantity = inventoryItem.quantity
                                summonBtn.dataset.itemName = item.name
                                summonBtn.textContent = 'Summon!'
                                inventoryTile.append(summonBtn)
                                inventoryContainer.append(inventoryTile)
                                // inventoryItemId = inventoryItem.id
                                // user_id = parseInt(id)
                                // item_id = item.id
                                // add eventlistener to summonBtn
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
            let div = document.createElement(`div`);
            div.className = "monster-container"
            document.body.append(div)
            newQuantity = parseInt(event.target.dataset.quantity) - 1
            updatedInventoryItem = { "user_id": parseInt(navBar.dataset.userId), "item_id": parseInt(event.target.dataset.itemId), "quantity": newQuantity }
            event.target.dataset.quantity = newQuantity
            let monster = summonMonster(event.target.dataset.itemName)
            let summonedMonsterDiv = document.createElement(`div`)
            summonedMonsterDiv.innerHTML = `
            <img src=${monster.img_url}>
            <p>Here is your new monster!</p>
            `
            if (newQuantity > 0) {
                let summonAnotherBtn = document.createElement(`button`)
                summonAnotherBtn = event.target
                summonAnotherBtn.dataset.quantity = newQuantity
                summonAnotherBtn.textContent = "Summon another!"
                summonedMonsterDiv.append(summonAnotherBtn)
            }
            addMonsterToDatabase(monster)
            summonedMonsterDiv.setAttribute("id", `summoned-monster`)
            //render that summoning gif then replace node with summonedmonsterdiv
            div.append(summonedMonsterDiv)
            fetch(`${inventoriesUrl}/${parseInt(event.target.dataset.inventoryId)}`, {
                method: "PATCH",
                headers: requestHeaders,
                body: JSON.stringify(updatedInventoryItem)
            }).then(res => res.json())
                .then(result => showInventory(parseInt(navBar.dataset.userId)))
        }
        else if (event.target.className === "buy-button") {
            // when user clicks buy button, check inventory to see if user has the item
            // if user HAS item, increment quantity by 1 (PATCH)
            // if user does NOT have item, create (POST)
            let h1 = document.querySelector('.balance');
            let userId = parseInt(navBar.dataset.userId);
            let itemId = parseInt(event.target.dataset.itemId);
            let itemPrice = parseInt(event.target.parentNode.dataset.price);
            let userBalance = parseInt(h1.dataset.balance);
            let newBalance = userBalance - itemPrice;
            if (newBalance >= 0) {
                //make a PATCH to user/id
                fetch(`${usersUrl}/${userId}`, {
                    method: 'PATCH',
                    headers: requestHeaders,
                    body: JSON.stringify({ 'balance': newBalance })
                }).then(res => res.json())
                    .then(function (result) {
                        h1.dataset.balance = result['balance'];
                        h1.innerHTML = `Current Balance: ${formatter.format(result['balance'])}`;
                    })
                fetchRails(inventoriesUrl)
                    .then(function (result) {
                        let flag = false;
                        let quantity = 1;
                        let id = 0;
                        for (let i = 0; i < result.length; i++) {
                            if (result[i]['item_id'] === itemId && result[i]['user_id'] === userId) {
                                flag = true;
                                quantity = result[i]['quantity']
                                id = result[i]['id']
                            }
                        }
                        if (flag === true) {
                            quantity += 1;
                            //PATCH HERE
                            let newObj = {
                                "item_id": itemId,
                                "user_id": userId,
                                "quantity": quantity
                            }
                            fetch(`${inventoriesUrl}/${id}`, {
                                method: 'PATCH',
                                headers: requestHeaders,
                                body: JSON.stringify(newObj)
                            })
                        } else {
                            //POST HERE
                            let newObj = {
                                "item_id": itemId,
                                "user_id": userId,
                                "quantity": quantity
                            }
                            fetch(inventoriesUrl, {
                                method: 'POST',
                                headers: requestHeaders,
                                body: JSON.stringify(newObj)
                            })
                        }
                    })
            } else {
                alert('Not enough balance!')
            }
        } else if (event.target.id === "normal-btn") {
            clearPage();
            filterAndShowMons('normal')
        } else if (event.target.id === "epic-btn") {
            clearPage();
            filterAndShowMons('epic')
        } else if (event.target.id === "legendary-btn") {
            clearPage();
            filterAndShowMons('legendary');
        }
    })

    function filterAndShowMons(rarity) {
        let monsterContainer = document.createElement('div')
        let norBtn = document.createElement('button')
        norBtn.setAttribute('id', 'normal-btn')
        norBtn.innerHTML = 'Normal Monsters'
        document.body.append(norBtn);

        let epicBtn = document.createElement('button')
        epicBtn.setAttribute('id', 'epic-btn')
        epicBtn.innerHTML = 'Epic Monsters'
        document.body.append(epicBtn);

        let legendaryBtn = document.createElement('button')
        legendaryBtn.setAttribute('id', 'legendary-btn')
        legendaryBtn.innerHTML = 'Legendary Monsters'
        document.body.append(legendaryBtn);

        monsterContainer.innerHTML = `
        <h1>Here are all monsters available!</h1>
        `
        document.body.append(monsterContainer);
        monsterContainer.setAttribute('class', 'monster-container');
        filterMons(allMons, rarity).forEach(function (monster) {
            let div = showMonster(monster)
            monsterContainer.append(div);
        })
    }

    function summonMonster(itemName) {
        if (itemName === "Tamago") {
            normalMons = filterMons(allMons, "normal")
            let maxNum = normalMons.length - 1
            let monster = normalMons[getRandomInt(maxNum)]
            return monster
        }
        else if (itemName === "Lady Egga") {
            let epicMons = filterMons(allMons, "epic")
            let maxNum = epicMons.length - 1
            let monster = epicMons[getRandomInt(maxNum)]
            return monster
        }
        else {
            let legendaryMons = filterMons(allMons, "legendary")
            let maxNum = legendaryMons.length - 1
            let monster = legendaryMons[getRandomInt(maxNum)]
            return monster
        }
    }

    function addMonsterToDatabase(monsterObj) {
        let newSummon = { "user_id": parseInt(navBar.dataset.userId), "monster_id": monsterObj.id }

        fetch(summonsUrl, {
            method: "POST",
            headers: requestHeaders,
            body: JSON.stringify(newSummon)
        })
    }

    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    function renderUserMonsters(userId) {
        fetchRails(summonsUrl)
            .then(function (array) {
                let userMonsters = document.createElement('div')
                userMonsters.setAttribute('class', 'user-monsters-container')
                userMonsters.innerHTML = `
                <h1>Here are all your summoned monsters!</h1>
                `
                document.body.append(userMonsters)
                array.forEach(function (summon) {
                    if (summon['user_id'] === parseInt(userId)) {
                        let monsterId = summon['monster_id']
                        fetchRails(`${monstersUrl}/${monsterId}`)
                            .then(function (result) {
                                let div = showMonster(result)
                                userMonsters.append(div)
                            })
                    }
                })
            })
    }




    function showItems(id) {
        fetchRails(itemsurl)
            .then(function (items) {
                let itemContainer = document.createElement('div')
                itemContainer.setAttribute('class', 'egg-container')
                document.body.append(itemContainer);
                fetch(`${usersUrl}/${id}`)
                    .then(res => res.json())
                    .then(function (res) {

                        balance = res['balance'];
                        let h1 = document.createElement('h1')
                        h1.setAttribute('class', 'balance')
                        h1.dataset.balance = balance;
                        h1.innerHTML = `Current Balance: ${formatter.format(balance)}`;
                        itemContainer.append(h1);
                        items.forEach(function (item) {
                            let div = displayEgg(item);
                            itemContainer.append(div);
                        })
                    })
            })
    }


    function displayEgg(item) {
        let div = document.createElement('div')
        let buyBtn = document.createElement('button')
        buyBtn.setAttribute('class', 'buy-button')
        buyBtn.dataset.itemId = item.id
        buyBtn.dataset.itemName = item.name
        buyBtn.textContent = 'Buy'

        // let summonBtn = document.createElement('button')
        // summonBtn.setAttribute('class', 'summon-button')
        // summonBtn.dataset.itemId = item.id
        // summonBtn.textContent = 'Summon!'

        div.setAttribute('class', 'item-tile')
        div.dataset.itemId = item.id;
        div.innerHTML = `
        <img src=${item['img_url']}>
        <p>Name: ${item.name}</p> 
        <p>Price: ${item.price}</p> 
        <p>${item['description']}</p>
        `
        div.dataset.price = item.price;
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
                let norBtn = document.createElement('button')
                norBtn.setAttribute('id', 'normal-btn')
                norBtn.innerHTML = 'Normal Monsters'
                document.body.append(norBtn);

                let epicBtn = document.createElement('button')
                epicBtn.setAttribute('id', 'epic-btn')
                epicBtn.innerHTML = 'Epic Monsters'
                document.body.append(epicBtn);

                let legendaryBtn = document.createElement('button')
                legendaryBtn.setAttribute('id', 'legendary-btn')
                legendaryBtn.innerHTML = 'Legendary Monsters'
                document.body.append(legendaryBtn);

                let monsterContainer = document.createElement('div')
                monsterContainer.innerHTML = `
                <h1>Here are all monsters available!</h1>
                `
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
        div.setAttribute('id', `${monster.rarity}`)
        div.innerHTML = `
        <img src=${monster.img_url} alt=${monster.name}>
        <h3>${capitalize(monster.name)}</h3><br> <h3>Rarity: ${capitalize(monster.rarity)}</h3>
        `
        return div;
    }

    function clearPage() {

        //let children = Array.from(document.body.children);
        audioBar = document.querySelector(`.audio-player`)
        navBar = document.querySelector('.nav-bar');
        let children = Array.from(document.body.children)
        for (let i = 0; i < children.length; i++) {
            if (children[i] !== audioBar && children[i] !== navBar) {
                children[i].remove()
            }
        }

        // document.body.append(navBar);
        return navBar;
    }
})

function capitalize(string) {
    return string && string[0].toUpperCase() + string.slice(1);
}

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
})