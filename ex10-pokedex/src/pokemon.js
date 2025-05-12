import { pageDisplay ,
    configFordisplay
} from './filter.js'

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
        return null;
    }
}

export async function displayPokemonByGen(generation) {
    showLoading();
    try {
        const pokemonIds = await getPokemonIDinGen(generation);

        pokemonIds.sort((a, b) => a - b);
        console.log(pokemonIds);
        configFordisplay(pokemonIds);
        addCardListeners();
        
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

        const overlay = document.createElement('div');
        overlay.classList.add('overlay');
        document.body.appendChild(overlay);

        const modal = document.createElement('div');
        modal.classList.add('details-view-container')
        modal.innerHTML = `
        <span class="close-button">&times;</span>
        <div class="card-container">
            <div class="card ${classType}">
            <div class="bg-pokeball"><img alt="pokeball" src="img/pokeball.png" loading="lazy" /></div>
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
            <button class="tab-switch active">About</button>
            <button class="tab-switch">Base Stats</button>
            <button class="tab-switch">Evolution</button>
            </div>
            <div class="tab">
            </div>
        </div>
        
    `;
        document.body.appendChild(modal);
        var span = document.getElementsByClassName("close-button")[0];
        span.onclick = function () {
            modal.remove();
            overlay.remove();
        }
        overlay.onclick = function () {
            modal.remove();
            overlay.remove();
        }
        getAbout(pokemonData);
        addDetailListeners(pokemonData);
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
            id: data.id,
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

function addDetailListeners(pokemonData) {
    const detailTabs = document.querySelectorAll('.tab-switch')

    detailTabs.forEach((detail,index) => {
        detail.addEventListener('click', () => {
            detailTabs.forEach(dt => {
                dt.classList.remove('active');
            });
            if(index === 0){
                console.log('about');
                detail.classList.add('active');
                getAbout(pokemonData);
            }else if(index === 1){
                console.log('stats');
                detail.classList.add('active');
                getStats(pokemonData);
            }else if(index === 2){
                console.log('evolution');
                detail.classList.add('active');
                fetchEvolution(pokemonData.id);
            }
        })
    });
}

function getAbout(pokemonData){
    const types = pokemonData.types.map( ( { type } ) => type.name ).join( ', ' );
    const abilities = pokemonData.abilities.map( ( { ability } ) => {
		return ability.name.replace( '-', ' ' );
	} ).join( ', ' );
    const height = pokemonData.height * 10; // cm
	const weight = pokemonData.weight / 10; // kg

    const detailsElement = document.querySelector('.tab');
    detailsElement.classList.remove('tab-stats','tab-evolution');
    detailsElement.classList.add('tab-about');
    detailsElement.innerHTML = `
                <table>
				<tbody>
					<tr>
						<td>Species</td>
						<td>${ types }</td>
					</tr>

					<tr>
						<td>Height</td>
						<td>${ height }cm</td>
					</tr>

					<tr>
						<td>Weight</td>
						<td>${ weight }kg</td>
					</tr>

					<tr>
						<td>Abilities</td>
						<td>${ abilities }</td>
					</tr>
				</tbody>
			</table>
            `;
}

function getStats(pokemonData){
    const labels = [
        'HP',
        'Attack',
        'Defense',
        'Sp. Atk',
        'Sp. Def',
        'Speed',
    ];
    const stats = pokemonData.stats;
    const total = stats.reduce( ( sum, current ) => sum + parseInt( current.base_stat ), 0 );
    const detailsElement = document.querySelector('.tab');
    detailsElement.classList.remove('tab-about','tab-evolution');
    detailsElement.classList.add('tab-stats');
    detailsElement.innerHTML = '';

    const table = document.createElement('table');
    const tbody = document.createElement('tbody');
    
    labels.forEach((label, i) => {
        const tr = document.createElement('tr');
        
        const labelTd = document.createElement('td');
        labelTd.textContent = label;

        const valueTd = document.createElement('td');
        valueTd.textContent = stats[i].base_stat;

        const rangeView = RangeView(stats[i].base_stat);
        valueTd.innerHTML += rangeView;

        tr.appendChild(labelTd);
        tr.appendChild(valueTd);

        tbody.appendChild(tr);
    });

    table.appendChild(tbody);

    detailsElement.appendChild(table);
}

function RangeView(value = 50, max = 100 ){
    const percent = parseInt( value ) / parseInt( max ) * 100;
	const colorClass = percent >= 50 ? 'range-view-positive' : 'range-view-negative';

	return (`
		<div class="range-view ${ colorClass }" style=" --percent : ${ percent }% " />`
	);
}

function getEvolution(){

}

async function fetchEvolution(pokemonId){
    try {
        const url = `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`
        const response = await fetch(url);
        if (!response.ok){
            console.error("Could not find evolution");
        }
        const data = await response.json();
        console.log(data.evolution_chain['url']);
        // if (data.evolution_chain != null){
        //     console.log(data.evolution_chain[0]);
        // } else{
        //     console.log(data.evolution_chain)
        // }

    } catch (error) {
        
    }
}

export function showLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    loadingOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

export function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    loadingOverlay.classList.add('hidden');
    document.body.style.overflow = '';
}