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

    // Set grid dimensions to match the image
    grid.style.width = `${dynmapImg.clientWidth}px`;
    grid.style.height = `${dynmapImg.clientHeight}px`;
}

// Listen for image load event to adjust the grid size
document.getElementById('dynmap-img').addEventListener('load', adjustGridSize);

// Function to fetch the plots from plots.yaml
async function fetchPlots() {
    const response = await fetch('plots.yaml');
    const plotsText = await response.text();
    const plots = jsyaml.load(plotsText);
    const grid = document.getElementById('grid');

    // Clear existing plots
    adjustGridSize();
    
    // Iterate through plots and set their positions
    for (let i = 0; i < plots.length; i++) {
        const plot = plots[i];
        const plotDiv = document.createElement('div');
        plotDiv.className = 'plot';
        plotDiv.style.borderColor = plot.borderColor;
        plotDiv.style.backgroundColor = plot.fillColor + '4D'; // 30% opacity
        plotDiv.style.position = 'absolute';
        plotDiv.style.width = `${plot.width * grid.clientWidth}px`;
        plotDiv.style.height = `${plot.height * grid.clientHeight}px`;
        plotDiv.style.left = `${plot.x * grid.clientWidth}px`;
        plotDiv.style.top = `${plot.y * grid.clientHeight}px`;

        // Create a span element for the title and add it to the plotDiv
        const titleSpan = document.createElement('span');
        titleSpan.textContent = plot.title;
        titleSpan.style.position = 'absolute';
        titleSpan.style.top = '50%';
        titleSpan.style.left = '50%';
        titleSpan.style.transform = 'translate(-50%, -50%)';
        titleSpan.style.fontSize = '12px'; // Adjust as needed
        titleSpan.style.color = '#ffffff'; // Adjust for visibility
        titleSpan.style.textAlign = 'center';
        plotDiv.appendChild(titleSpan);

        // Add an onclick event to display the plot description
        plotDiv.onclick = () => {
            const description = document.getElementById('plot-description');
            description.textContent = plot.description;
            description.classList.remove('hidden');
        };

        console.log(plot.title, plotDiv.style, titleSpan.style);

        // Append the plotDiv to the grid
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
