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

// Function to set the grid size based on the image size
function adjustGridSize() {
    const dynmapImg = document.getElementById('dynmap-img');
    const grid = document.getElementById('grid');

    // Get the dimensions of the image itself, excluding padding, borders, and margins
    const rect = dynmapImg.getBoundingClientRect();

    // Set grid dimensions to match the image dimensions
    grid.style.width = `${rect.width}px`;
    grid.style.height = `${rect.height}px`;
}

// Listen for image load event to adjust the grid size
document.getElementById('dynmap-img').addEventListener('load', adjustGridSize);

// Function to fetch the plots from plots.yaml
async function fetchPlots(currentSector) {
    const response = await fetch('plots.yaml');
    const plotsText = await response.text();
    const plotsData = jsyaml.load(plotsText);
    const grid = document.getElementById('grid');
    const dynmapImg = document.getElementById('dynmap-img');

    // Clear previous plots
    grid.innerHTML = '';

    // Ensure the image is loaded before accessing its dimensions
    dynmapImg.onload = () => {
        // Set the grid dimensions to match the image dimensions
        grid.style.width = `${dynmapImg.clientWidth}px`;
        grid.style.height = `${dynmapImg.clientHeight}px`;
        grid.style.position = 'absolute';
        grid.style.top = `${dynmapImg.offsetTop}px`;
        grid.style.left = `${dynmapImg.offsetLeft}px`;

        // Iterate through the plots and add only those that match the current sector
        plotsData.plots.forEach(plot => {
            if (plot.sector === currentSector) {
                const plotDiv = document.createElement('div');
                plotDiv.className = 'plot';
                plotDiv.style.position = 'absolute';
                plotDiv.style.border = `2px solid ${plot.borderColor}`;
                plotDiv.style.backgroundColor = `${plot.fillColor}4D`; // 30% opacity

                // Calculate the position and size based on coordinates and image dimensions
                const x1 = plot.coordinates[0][0] * dynmapImg.clientWidth;
                const y1 = plot.coordinates[0][1] * dynmapImg.clientHeight;
                const x2 = plot.coordinates[1][0] * dynmapImg.clientWidth;
                const y2 = plot.coordinates[1][1] * dynmapImg.clientHeight;

                plotDiv.style.width = `${Math.abs(x2 - x1)}px`;
                plotDiv.style.height = `${Math.abs(y2 - y1)}px`;
                plotDiv.style.left = `${Math.min(x1, x2)}px`;
                plotDiv.style.top = `${Math.min(y1, y2)}px`;

                // Create a span for the title and add it to the plotDiv
                const titleSpan = document.createElement('span');
                titleSpan.textContent = plot.title;
                titleSpan.style.color = '#ffffff'; // White text for visibility
                titleSpan.style.position = 'absolute';
                titleSpan.style.top = '50%';
                titleSpan.style.left = '50%';
                titleSpan.style.transform = 'translate(-50%, -50%)';
                titleSpan.style.textAlign = 'center';
                titleSpan.style.fontSize = '10px'; // Adjust for readability

                plotDiv.appendChild(titleSpan);

                // Add an onclick event to display the plot description
                plotDiv.onclick = () => {
                    const description = document.getElementById('plot-description');
                    description.textContent = plot.description;
                    description.classList.remove('hidden');
                };

                // Append the plotDiv to the grid
                grid.appendChild(plotDiv);
            }
        });
    };

    // Trigger the onload event if the image is already loaded
    if (dynmapImg.complete) {
        dynmapImg.onload();
    }
}


// Function to toggle between light and dark mode
function toggleMode() {
    document.body.classList.toggle('dark-mode');
}

// Event listener for mode toggle button
document.getElementById('mode-toggle').addEventListener('click', toggleMode);

// Fetch configuration, sectors, and plots on page load
document.addEventListener('DOMContentLoaded', () => {
    const sectorDropdown = document.getElementById('sector-dropdown');
    await fetchConfig();
    await fetchSectors();
    await fetchPlots(sectorDropdown.value);

    // Event listener to call fetchPlots whenever the sector changes
    sectorDropdown.addEventListener('change', () => {
        const selectedSector = sectorDropdown.value;
        fetchPlots(selectedSector);
    });
});
