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

function renderGrid(plots) {
    const grid = document.getElementById('grid');
    grid.innerHTML = ''; // Clear previous grid

    plots.forEach(plot => {
        const plotDiv = document.createElement('div');
        plotDiv.className = 'plot';
        plotDiv.style.borderColor = plot.borderColor; // Assuming hex code
        plotDiv.style.backgroundColor = plot.fillColor + '4D'; // 30% opacity

        // Calculate position based on 0 to 1
        plotDiv.style.left = `${plot.coordinates[0] * 100}%`;
        plotDiv.style.top = `${plot.coordinates[1] * 100}%`;
        plotDiv.style.width = `${plot.width * 100}%`;
        plotDiv.style.height = `${plot.height * 100}%`;
        plotDiv.textContent = plot.title;

        plotDiv.addEventListener('click', () => {
            document.getElementById('plot-description').textContent = plot.description;
            document.getElementById('plot-description').classList.remove('hidden');
        });

        grid.appendChild(plotDiv);
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    const config = await fetchConfig();
    const plots = await fetchPlots();
    const sectors = await fetchSectors();

    // Populate sector dropdown
    const dropdown = document.getElementById('sector-dropdown');
    sectors.forEach(sector => {
        const option = document.createElement('option');
        option.value = sector.name; // Assuming each sector has a 'name'
        option.textContent = sector.name;
        dropdown.appendChild(option);
    });

    // Initial render of plots
    renderGrid(plots);
    
    // Update footer with version and last updated date
    const footer = document.getElementById('footer');
    footer.textContent = `Created by [H] Kaybeo. CubeMap v${config.version}, updated ${config.lastUpdated}`;
});
