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
        option.value = sector.imagePath; // Set the value to the URL
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

    // Set grid dimensions to match the image dimensions
    grid.style.width = `${dynmapImg.naturalWidth}px`;
    grid.style.height = `${dynmapImg.naturalHeight}px`;
}

// Function to fetch the plots from plots.yaml
async function fetchPlots(currentSector) {
    console.log("Fetching Plots");
    const response = await fetch('plots.yaml');
    const plotsText = await response.text();
    const data = jsyaml.load(plotsText);
    const plots = data.plots;

    const grid = document.getElementById('grid');
    grid.innerHTML = ''; // Clear previous plots

    // Filter the plots for the current sector
    const filteredPlots = plots.filter(plot => plot.sector === currentSector);
    console.log(plots, filteredPlots, currentSector);

    filteredPlots.forEach(plot => {
        const [[x1, y1], [x2, y2]] = plot.coordinates;
        const plotDiv = document.createElement('div');
        plotDiv.className = 'plot';
        plotDiv.style.position = 'absolute';
        plotDiv.style.border = `2px solid ${plot.borderColor}`;
        plotDiv.style.backgroundColor = `${plot.fillColor}4D`; // 30% opacity

        // Get the image dimensions for correct positioning
        const dynmapImg = document.getElementById('dynmap-img');
        const gridWidth = dynmapImg.clientWidth;
        const gridHeight = dynmapImg.clientHeight;
        
        // Calculate plot dimensions based on the coordinates
        const width = Math.abs(x2 - x1) * gridWidth;
        const height = Math.abs(y2 - y1) * gridHeight;
        const left = Math.min(x1, x2) * gridWidth;
        const top = Math.min(y1, y2) * gridHeight;
        
        plotDiv.style.width = `${width}px`;
        plotDiv.style.height = `${height}px`;
        plotDiv.style.left = `${left}px`;
        plotDiv.style.top = `${top}px`;

        // Display the title inside the plot div
        plotDiv.textContent = plot.title;
        plotDiv.style.color = 'white';
        plotDiv.style.display = 'flex';
        plotDiv.style.alignItems = 'center';
        plotDiv.style.justifyContent = 'center';
        plotDiv.style.fontSize = '12px';
        plotDiv.style.textAlign = 'center';

        // Click event for showing description
        plotDiv.onclick = () => {
            const description = document.getElementById('plot-description');
            description.textContent = plot.description;
            description.classList.remove('hidden');
        };

        console.log(plot.title, width, height, left, top);
        grid.appendChild(plotDiv);
    });
}


// Function to toggle between light and dark mode
function toggleMode() {
    document.body.classList.toggle('dark-mode');
}

// Event listener for mode toggle button
document.getElementById('mode-toggle').addEventListener('click', toggleMode);

function waitForElement(selector, callback) {
    const interval = setInterval(() => {
        const element = document.querySelector(selector);
        if (element) {
            clearInterval(interval); // Stop checking once the element is found
            callback(element); // Call the callback function with the found element
        }
    }, 100); // Check every 100 milliseconds
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("Loaded");
    fetchConfig(); // Ensure this function is defined and works correctly
    fetchSectors(); // Ensure this function is defined and works correctly

    // Wait for the sector dropdown to be available
    waitForElement('#sector-dropdown', (sectorDropdown) => {
        fetchPlots(sectorDropdown.value); // Fetch plots for the currently selected sector

        // Listen for changes on the dropdown
        sectorDropdown.addEventListener('change', (event) => {
            console.log("Dropdown Change");
            const selectedSector = event.target.options[event.target.selectedIndex].text;
            console.log(selectedSector);
            fetchPlots(selectedSector); // Fetch plots for the new sector
        });
    });

    // Wait for the dynmap image to be available
    waitForElement('#dynmap-img', (dynmapImg) => {
        console.log("Image Change");
        dynmapImg.onload = () => {
            adjustGridSize(); // Adjust grid size when image loads
        };
    });
});

