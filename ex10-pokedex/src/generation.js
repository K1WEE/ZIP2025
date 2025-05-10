export async function fetchGenerationData() {
    const url = 'https://pokeapi.co/api/v2/generation/';
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        const generations = data.results;
        return generations;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

