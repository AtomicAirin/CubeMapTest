// script.js

// Function to fetch the configuration from config.yaml
async function fetchConfig() {
    const response = await fetch('config.yaml');
    const configText = await response.text();
    const config = jsyaml.load(configText);
    
    // Set footer content
    const footer = document.getElementById('footer');
    footer.innerHTML = `Created by [H] Kaybeo. CubeMap v${config.version}, updated ${config.last_updated}`;
}

// Function to fetch the sectors from sectors.yaml
async function fetchSectors() {
    const response = await fetch('sectors.yaml');
    const sectorsText = await response.text();
    const sectors = jsyaml.load(sectorsText);
    
    const dropdown = document.getElementById('sector-dropdown');
    sectors.forEach(sector => {
        const option = document.createElement('option');
        option.value = sector.url;
        option.textContent = sector.name;
        dropdown.appendChild(option);
    });
}

// Function to fetch the plots from plots.yaml
async function fetchPlots() {
    const response = await fetch('plots.yaml');
    const plotsText = await response.text();
    const plots = jsyaml.load(plotsText);
    const grid = document.getElementById('grid');

    plots.forEach(plot => {
        const plotDiv = document.createElement('div');
        plotDiv.className = 'plot';
        plotDiv.style.borderColor = plot.borderColor;
        plotDiv.style.backgroundColor = plot.fillColor + '4D'; // 30% opacity
        plotDiv.style.width = `${plot.width * 100}%`;
        plotDiv.style.height = `${plot.height * 100}%`;
        plotDiv.style.left = `${plot.x * 100}%`;
        plotDiv.style.top = `${plot.y * 100}%`;
        plotDiv.onclick = () => {
            const description = document.getElementById('plot-description');
            description.textContent = plot.description;
            description.classList.remove('hidden');
        };
        grid.appendChild(plotDiv);
    });
}

// Function to toggle between light and dark mode
function toggleMode() {
    document.body.classList.toggle('dark-mode');
}

// Event listener for mode toggle button
document.getElementById('mode-toggle').addEventListener('click', toggleMode);

// Fetch configuration, sectors, and plots on page load
window.onload = async () => {
    await fetchConfig();
    await fetchSectors();
    await fetchPlots();
};
