import './style.css'
import {fetchGenerationData} from './generation.js'
import {
        pokemonCard,
      displayPokemonByGen}from './pokemon.js'

const generations = await fetchGenerationData();

function displayGenerations(generations) {
    const container = document.querySelector('main');
    console.log(generations[0])
    generations.forEach((generation,index) => {
      const generationDiv= document.querySelector('nav >.links-container');
      let generationName = generation['name'].replace(/generation-/g, '');
      generationDiv.innerHTML += `
        <a id="gen-${index+1}" class="nav-link" href="#${generation['name']}">
            <h2>${generationName.toUpperCase()}</h2>
        </a>
      `;
    });
    addButtonListeners();
}

function addButtonListeners() {
  const generationButtons = document.querySelectorAll('.nav-link');
  
  generationButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      button.classList.toggle('active');
      generationButtons.forEach(btn => {
        if (btn !== button) {
          btn.classList.remove('active');
        }
      });
      const id = (button.id.split('-'))[1]
      console.log("clicked :", id);
      
      displayPokemonByGen(id)
      
    });
  });
}



displayGenerations(generations);
displayPokemonByGen(1);



