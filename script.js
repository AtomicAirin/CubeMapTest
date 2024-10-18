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
    try {
        const response = await fetch('sectors.yaml');
        const text = await response.text();
        const sectors = jsyaml.load(text);

        // Ensure sectors is an array
        if (!Array.isArray(sectors)) {
            throw new TypeError("Sectors is not an array");
        }

        const dropdown = document.getElementById('sector-dropdown');
        dropdown.innerHTML = '';

        for (const sector of sectors) {
            const option = document.createElement('option');
            option.value = sector.url; // Store the URL in the value
            option.textContent = sector.name; // Display the name
            dropdown.appendChild(option);
        }

        return sectors;
    } catch (error) {
        console.error("Error fetching sectors:", error);
    }
}


// Function to fetch the plots from plots.yaml
async function fetchPlots() {
    try {
        const response = await fetch('plots.yaml');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const plotsText = await response.text();
        const plots = jsyaml.load(plotsText);

        // Verify that plots is an array
        if (!Array.isArray(plots)) {
            throw new TypeError("Plots is not an array");
        }

        const grid = document.getElementById('grid');

        for (let i = 0; i < plots.length; i++) {
            const plot = plots[i];

            if (typeof plot === 'object' && plot.title && plot.coordinates) {
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
            } else {
                console.warn("Plot is not properly formatted:", plot);
            }
        }
    } catch (error) {
        console.error("Error fetching plots:", error);
    }
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
