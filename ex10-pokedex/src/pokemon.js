function getImageURL(pokemon) {
    const baseURL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other';

    // Has only PNG.
    if (parseInt(pokemon) >= 650) {
        return `${baseURL}/official-artwork/${pokemon}.png`;
    }

    // Has SVG.
    return `${baseURL}/dream-world/${pokemon}.svg`;
}

export async function pokemonCard(pokemonId) {
    const pokedexElement = document.querySelector('main > .pokedex');
    if (!pokedexElement) {
        console.error("Could not find pokedex element");
        return;
    }

    const data = await getType(pokemonId);
    const types = data.types;
    const name = data.name;
    const className = types.map(({ type }) => 'type-' + type.name).join(' '),
        paddedId = '#' + pokemonId.toString().padStart(3, '000');
    const imgURL = getImageURL(pokemonId);


    pokedexElement.innerHTML += `
        <div class="card-container">
            <div class="card ${className}">
                <div class="bg-pokeball"><img alt="pokeball" src="img/pokeball.png" loading="lazy" /></div>
                <span class="pokemon-id">${paddedId}</span>

                <div class="card-title">
                    <h2>
                        ${name.replace(/-/g, ' ')}
                    </h2>

                    <div class="pokemon-types">
                        ${types.map(({ type }) =>
        `<span class="type" key="${type.name}">${type.name}</span>`
    ).join('')}
                    </div>
                </div>

                <div class="pokemon-image">
                    <img alt="${name}" src="${imgURL}" loading="lazy" />
                </div>
            </div>
        </div>
    `;
}

async function getType(Id) {
    const url = `https://pokeapi.co/api/v2/pokemon/${Id}`
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const data = await response.json();
        const types = {
            name: data.name,
            types: data.types
        }

        return types
    }
    catch (error) {
        console.error(error.message);
    }
}

export async function displayPokemonByGen(generation) {
    showLoading();
    try {
        const pokedexElement = document.querySelector('main > .pokedex');
        pokedexElement.classList.add('hidden')
        pokedexElement.innerHTML = '';
        const pokemonIds = await getPokemonIDinGen(generation);

        pokemonIds.sort((a, b) => a - b);
        console.log(pokemonIds);
        for (const id of pokemonIds) {
            await pokemonCard(id);
        }
        addCardListeners();
        pokedexElement.classList.remove('hidden')
    } catch (error) {
        console.error("Error displaying Pokémon:", error);
    } finally {
        hideLoading();
    }
}

async function getPokemonIDinGen(gen) {
    const url = `https://pokeapi.co/api/v2/generation/${gen}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        const pokemonSpecies = data.pokemon_species;
        const pokemonIds = pokemonSpecies.map(species => {
            const urlParts = species.url.split('/');
            return parseInt(urlParts[urlParts.length - 2]);
        });
        return pokemonIds
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}
function addCardListeners() {
    const cardContainers = document.querySelectorAll('.card');

    cardContainers.forEach(card => {
        card.addEventListener('click', function () {
            const idSpan = this.querySelector('.pokemon-id');
            const pokemonId = idSpan ? parseInt(idSpan.textContent.replace('#', '')) : null;
            console.log(pokemonId);
            pokemonInfo(pokemonId);
        })
    });
}

async function pokemonInfo(pokemonId) {

    try {
        const pokemonData = await fetchPokemonData(pokemonId);
        console.log(pokemonData)
        const types = pokemonData.types;
        const imgURL = getImageURL(pokemonId),
            classType = types.map(({ type }) => 'type-' + type.name).join(' '),
            paddedId = '#' + pokemonId.toString().padStart(3, '000'),
            name = pokemonData.name;

        const modal = document.createElement('div');
        modal.classList.add('details-view-container')
        modal.innerHTML = `
        <span class="close-button">&times;</span>
        <div class="card-container">
            <div class="card ${classType}">
            <div class="bg-pokeball"></div>
            <span class="pokemon-id">${paddedId}</span>
            <div class="card-title">
                <h2>${name}</h2>
                <div class="pokemon-types">
                <span class="type">grass</span><span class="type">poison</span>
                </div>
            </div>
            </div>
        </div>
        <div class="details">
            <img
            src="${imgURL}"
            class="pokemon-image"
            alt="${name}"
            />
            <div class="tabs-switch-container">
            <button class="tab-switch">About</button>
            <button class="tab-switch">Base Stats</button>
            <button class="tab-switch">Evolution</button>
            </div>
        </div>
    `;
        document.body.appendChild(modal);
        var span = document.getElementsByClassName("close-button")[0];
        span.onclick = function () {
            modal.remove();
        }
    } catch (error) {
        console.error('Error displaying Pokémon infomation :', error);
    }
}

async function fetchPokemonData(pokemonId) {
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        const pokemonData = {
            name: data.name,
            types: data.types,
            height: data.height,
            weight: data.weight,
            abilities: data.abilities,
            stats: data.stats,
        }
        return pokemonData;
    } catch (error) {
        console.error('Error :', error);
    }
}

function addDetailListeners() {
    const detailTabs = document.querySelectorAll('.tab-switch')

    detailTabs.forEach(detail => {
        detail.addEventListener('click', () => {

        })
    });
}

function showLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    loadingOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    loadingOverlay.classList.add('hidden');
    document.body.style.overflow = '';
}