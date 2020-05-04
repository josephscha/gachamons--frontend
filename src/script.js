const monstersUrl = 'http://127.0.0.1:3000/monsters' 

document.addEventListener('DOMContentLoaded', function(){

    function getMonsters() {
        fetch(monstersUrl)
        .then(res => res.json())
        .then(function(result) {
            debugger;
            result.forEach(function(monster){
                showMonster(monster)
            })
        })
    }

    function showMonster(monster) {

    }

    getMonsters();
})