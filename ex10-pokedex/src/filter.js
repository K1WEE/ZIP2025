import {
    pokemonCard,
    addCardListeners,
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
    showLoading();
    try {
        const pokedexElement = document.querySelector('main > .pokedex');
        pokedexElement.classList.add('hidden')
        pokedexElement.innerHTML = '';
        totalPage = Math.ceil(pokemonIds.length / perPage.value);
        pagebtnChange();
        pokemon = pokemonIds;
        for (let i = 0; i < perPage.value; i++) {
            await pokemonCard(pokemonIds[offset + i]);
            if ((offset + i)=== pokemonIds.length-1){
                break
            }
        }
        addCardListeners();
        pokedexElement.classList.remove('hidden')
    } catch (error) {
        console.error("Error displaying Pokémon:", error);
    }finally{
        hideLoading();
    }

}

function pagebtnChange() {
    if(currentPage <= 1) {
        buttons[0].classList.add('hidden')
    }else{
        buttons[0].classList.remove('hidden')
    }
    if(currentPage >= totalPage){
        buttons[1].classList.add('hidden')
    }else{
        buttons[1].classList.remove('hidden')
    }
}

perPage.addEventListener("input", () => {
    // console.log(perPage.value);
    configFordisplay(pokemon);
});

buttons.forEach((button) => {
    button.addEventListener("click", (event) => {
        const buttonValue = event.target.textContent;
        if (buttonValue === "Next"){
            currentPage+=1;
        }
        offset = (currentPage - 1) * perPage.value;
        // console.log("Button clicked: " + offset, buttonValue);
        pagebtnChange();
        pageDisplay(pokemon);
    });
});


