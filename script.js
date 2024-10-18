// script.js

async function fetchConfig() {
    const response = await fetch('config.yaml');
    const yamlText = await response.text();
    return jsyaml.load(yamlText);
}

async function fetchPlots() {
    const response = await fetch('plots.yaml');
    const yamlText = await response.text();
    return jsyaml.load(yamlText);
}

async function fetchSectors() {
    const response = await fetch('sectors.yaml');
    const yamlText = await response.text();
    return jsyaml.load(yamlText);
}

function createPlotElement(plot) {
    const plotDiv = document.createElement('div');
    plotDiv.classList.add('plot');
    plotDiv.style.borderColor = plot.outlineColor;
    plotDiv.style.backgroundColor = plot.fillColor + '4C'; // Adding 30% transparency
    plotDiv.textContent = plot.title;

    // Click event to show the description
    plotDiv.addEventListener('click', () => {
        document.getElementById('plot-description').textContent = plot.description;
        document.getElementById('plot-description').classList.remove('hidden');
    });

    return plotDiv;
}

function positionPlots(plots) {
    const dynmap = document.getElementById('dynmap');
    const width = dynmap.clientWidth;
    const height = dynmap.clientHeight;

    plots.forEach(plot => {
        const plotElement = createPlotElement(plot);
        
        // Calculate the plot position based on percentage values
        const left = plot.coordinates[0] * width;
        const top = plot.coordinates[1] * height;

        plotElement.style.left = `${left}px`;
        plotElement.style.top = `${top}px`;
        document.getElementById('grid').appendChild(plotElement);
    });
}

// Load and render the data
async function loadAndRender() {
    const config = await fetchConfig();
    const plots = await fetchPlots();
    const sectors = await fetchSectors();

    document.getElementById('footer').innerHTML = `
        Created by [H] Kaybeo.<br>
        CubeMap v${config.version}, updated ${config.lastUpdatedDate}.<br>
        <a href="https://example.com">Submit plots here</a>
    `;

    // Populate the dropdown with sectors
    const sectorDropdown = document.getElementById('sector-dropdown');
    sectors.forEach(sector => {
        const option = document.createElement('option');
        option.value = sector.name;
        option.textContent = sector.name;
        sectorDropdown.appendChild(option);
    });

    positionPlots(plots);
}

// Handle window resize
window.addEventListener('resize', () => {
    document.getElementById('grid').innerHTML = ''; // Clear existing plots
    loadAndRender(); // Re-render plots
});

loadAndRender();
