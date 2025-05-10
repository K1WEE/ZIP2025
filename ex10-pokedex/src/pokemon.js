export async function fetchPokemonData(pokemon) {
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemon}`
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);

    }
    catch (error) {
        console.error(error.message);
    }
}

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

    // เพิ่ม event listener แทนการใช้ onClick ใน innerHTML
    const newCard = pokedexElement.lastElementChild;
    newCard.addEventListener('click', function () {
        // ใส่โค้ด onClick ที่ต้องการ
        console.log(`Clicked on ${name}`);
    });
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
            console.log(id);
            await pokemonCard(id);
        }
        pokedexElement.classList.remove('hidden')
    } catch (error) {
        console.error("Error displaying Pokémon:", error);
    }finally{
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

function showLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    loadingOverlay.classList.remove('hidden');
    
    // ปิดกั้นการ scroll ของหน้าเว็บด้วย
    document.body.style.overflow = 'hidden';
}

  function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    loadingOverlay.classList.add('hidden');
    
    // อนุญาตให้ scroll ได้อีกครั้ง
    document.body.style.overflow = '';
  }