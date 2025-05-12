import {
    pokemonCard,
    showLoading,
    hideLoading
} from './pokemon.js'

const perPage = document.querySelector("#per-page");
const buttons = document.querySelectorAll(".btn-pp");
let totalPage;
let currentPage;
let offset;
let pokemon;

export function configFordisplay(pokemonIds){
    offset=0;
    currentPage=1;
    pagebtnChange();
    pageDisplay(pokemonIds);
}

export async function pageDisplay(pokemonIds) {
    try {
        const pokedexElement = document.querySelector('main > .pokedex');
        pokedexElement.classList.add('hidden')
        pokedexElement.innerHTML = '';
        totalPage = Math.ceil(pokemonIds.length / perPage.value);
        pagebtnChange();
        pokemon = pokemonIds;
        console.log(totalPage);
        for (let i = 0; i < perPage.value; i++) {
            console.log(offset,pokemonIds.length-1)
            console.log(pokemonIds[offset + i])
            await pokemonCard(pokemonIds[offset + i]);
            if (offset === pokemonIds.length-1){
                break
            }
        }
        pokedexElement.classList.remove('hidden')
    } catch (error) {
        console.error("Error displaying Pokémon:", error);
    }

}

function pagebtnChange() {
    buttons[3].textContent = totalPage;


    if (parseInt(buttons[2].textContent) === currentPage & currentPage !== totalPage) {
        console.log('test');
        buttons[1].textContent = currentPage;
        buttons[0].textContent = currentPage - 1;
        buttons[2].textContent = currentPage + 1;
    } else if (parseInt(buttons[0].textContent) === currentPage & parseInt(buttons[0].textContent) > 1) {
        buttons[1].textContent = currentPage;
        buttons[0].textContent = currentPage - 1;
        buttons[2].textContent = currentPage + 1;
    } else if (parseInt(buttons[3].textContent) === currentPage) {
        buttons[1].textContent = currentPage - 2;
        buttons[0].textContent = currentPage - 3;
        buttons[2].textContent = currentPage - 1;
    }
}

perPage.addEventListener("input", () => {
    console.log(perPage.value);
    pageDisplay(pokemon);
});

buttons.forEach((button) => {
    button.addEventListener("click", (event) => {
        const buttonValue = parseInt(event.target.textContent);
        offset = (buttonValue - 1) * perPage.value;
        console.log("Button clicked: " + offset, buttonValue);
        currentPage = buttonValue > 0 & buttonValue <= totalPage ? currentPage = buttonValue : currentPage = 1;
        pagebtnChange();
        pageDisplay(pokemon);
    });
});


