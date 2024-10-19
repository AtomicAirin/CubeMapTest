// script.js

// Function to fetch the configuration from config.yaml
async function fetchConfig() {
    const response = await fetch('config.yaml');
    const configText = await response.text();
    const config = jsyaml.load(configText);

    // Assuming you have already set the innerHTML for the footer items
    document.querySelector('.footer-item:nth-child(3)').textContent = `CubeMap v${config.version}`;
    document.querySelector('.footer-item:nth-child(4)').textContent = `Updated ${config.last_updated}`;
}

// Function to fetch the sectors from sectors.yaml
async function fetchSectors() {
    const response = await fetch('sectors.yaml');
    const sectorsText = await response.text();
    const sectors = jsyaml.load(sectorsText);
    const sectorDropdown = document.getElementById('sector-dropdown');

    // Clear existing options
    sectorDropdown.innerHTML = '';

    // Populate dropdown with options
    for (const sector of sectors) {
        const option = document.createElement('option');
        option.value = sector.url; // Set the value to the URL
        option.textContent = sector.name; // Set the displayed text
        sectorDropdown.appendChild(option);
    }

    // Change the dynmap image when a sector is selected
    sectorDropdown.addEventListener('change', function() {
        const dynmapImg = document.getElementById('dynmap-img');
        dynmapImg.src = this.value; // Update image source to selected sector URL
    });
}


// Function to fetch the plots from plots.yaml
async function fetchPlots() {
    const response = await fetch('plots.yaml');
    const plotsText = await response.text();
    const plots = jsyaml.load(plotsText);
    const grid = document.getElementById('grid');

    // Clear existing plots
    grid.innerHTML = '';

    // Get the dynmap image dimensions
    const dynmapImg = document.getElementById('dynmap-img');
    const imgWidth = dynmapImg.clientWidth;
    const imgHeight = dynmapImg.clientHeight;

    // Create plot elements
    for (let i = 0; i < plots.length; i++) {
        const plot = plots[i];
        const plotDiv = document.createElement('div');
        plotDiv.className = 'plot';
        plotDiv.style.borderColor = plot.borderColor;
        plotDiv.style.backgroundColor = plot.fillColor + '4D'; // 30% opacity
        plotDiv.style.position = 'absolute'; // Ensure plots are absolutely positioned
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
    }
}


// Function to toggle between light and dark mode
function toggleMode() {
    document.body.classList.toggle('dark-mode');
}

// Event listener for mode toggle button
document.getElementById('mode-toggle').addEventListener('click', toggleMode);

// Fetch configuration, sectors, and plots on page load
document.addEventListener('DOMContentLoaded', async () => {
    await fetchConfig();
    await fetchPlots();
    await fetchSectors();
});
