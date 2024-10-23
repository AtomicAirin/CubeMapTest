// script.js
let namesVisible = true; // Initialize toggle state

// Function to fetch the configuration from config.yaml
async function fetchConfig() {
    const response = await fetch('config.yaml');
    const configText = await response.text();
    const config = jsyaml.load(configText);

    // Assuming you have already set the innerHTML for the footer items
    document.querySelector('.footer-item:nth-child(3)').textContent = `v${config.version}, updated ${config.last_updated}`;
}

function updatePlotNamesVisibility() {
    const plots = document.querySelectorAll('.plot, .plot-circle, .plot-dot');
    plots.forEach(plot => {
        plot.style.fontSize = namesVisible ? '10px' : '0px'; // Adjust font size based on the state
    });
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
        loadSectorImage(this.value);
    });

    // Optionally, load the initial sector image when the dropdown is first populated
    if (sectors.length > 0) {
        const initialSector = sectors[0];
        loadSectorImage(initialSector.url);
        fetchPlots(initialSector.name);
    }
}

// Function to load the sector image and adjust the grid accordingly
function loadSectorImage(imageUrl) {
    const dynmapImg = document.getElementById('dynmap-img');
    dynmapImg.src = imageUrl;

    // Ensure plots are correctly aligned when the image is loaded
    dynmapImg.onload = function() {
        fetchPlots(document.getElementById('sector-dropdown').selected[0].textContent);
    };
}

function squarePlot(plot) {
    const [[x1, y1], [x2, y2]] = plot.coordinates;
    const plotDiv = document.createElement('div');
    plotDiv.className = 'plot';
    plotDiv.style.border = `2px solid ${plot.borderColor}`;
    plotDiv.style.backgroundColor = `${plot.fillColor}4D`; // 30% opacity

    // Get the image dimensions for correct positioning
    const dynmapImg = document.getElementById('dynmap-img');
    const gridWidth = dynmapImg.naturalWidth;
    const gridHeight = dynmapImg.naturalHeight;

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
    plotDiv.style.textAlign = 'center';

    // Click event for showing description
    plotDiv.onclick = () => {
        const title = document.getElementById('plot-title');
        const description = document.getElementById('plot-description');
        const coords = document.getElementById('plot-coords');
        const infoImage = document.getElementById('info-image'); // Get the image element
        
        title.textContent = plot.title;
        description.innerHTML = plot.description;
        coords.textContent = `x: ${Math.round((x1 + x2)/2)}, z: ${Math.round((y1 + y2)/2)}`

        if (plot.img) {
            infoImage.src = plot.img;
            infoImage.style.display = 'block'; // Ensure the image is visible
        } else {
            infoImage.style.display = 'none'; // Hide the image if no img field
        }

        infoImage.onclick = () => {
            const highResImageContainer = document.getElementById('high-res-image-container');
            const highResImage = document.getElementById('high-res-image');
            // Set the high-resolution image source
            highResImage.src = infoImage.src; // Use the same image source or a high-res version
        
            // Toggle the visibility of the high-res image container
            if (highResImageContainer.classList.contains('show')) {
                // Fade out the image container
                highResImageContainer.classList.remove('show');
            } else {
                // Fade in the image container
                highResImageContainer.classList.add('show');
            }
        };
    };

    const grid = document.getElementById('grid');
    grid.appendChild(plotDiv);
}

function circlePlot(plot) {
    const [[x1, z1]] = plot.coordinates; // Center point
    const radius = plot.radius; // Radius value for the circle

    const plotDiv = document.createElement('div');
    plotDiv.className = 'plot-circle';
    plotDiv.style.border = `2px solid ${plot.borderColor}`;
    plotDiv.style.backgroundColor = `${plot.fillColor}66`; // 40% opacity

    // Get the image dimensions for correct positioning
    const dynmapImg = document.getElementById('dynmap-img');
    const gridWidth = dynmapImg.naturalWidth;
    const gridHeight = dynmapImg.naturalHeight;

    // Calculate circle dimensions based on the radius and coordinates
    const diameter = radius * 2 * gridWidth;
    const left = (x1 * gridWidth) - (radius * gridWidth);
    const top = (z1 * gridHeight) - (radius * gridHeight);

    plotDiv.style.width = `${diameter}px`;
    plotDiv.style.height = `${diameter}px`;
    plotDiv.style.left = `${left}px`;
    plotDiv.style.top = `${top}px`;

    // Display the title inside the circle div
    plotDiv.textContent = plot.title;
    plotDiv.style.color = 'white';
    plotDiv.style.display = 'flex';
    plotDiv.style.alignItems = 'center';
    plotDiv.style.justifyContent = 'center';
    plotDiv.style.textAlign = 'center';

    // Click event for showing description
    plotDiv.onclick = () => {
        const title = document.getElementById('plot-title');
        const description = document.getElementById('plot-description');
        const coords = document.getElementById('plot-coords');
        const infoImage = document.getElementById('info-image'); // Get the image element
        
        title.textContent = plot.title;
        description.innerHTML = plot.description;
        coords.textContent = `x: ${Math.round(x1)}, z: ${Math.round(z1)}`;

        if (plot.img) {
            infoImage.src = plot.img;
            infoImage.style.display = 'block'; // Ensure the image is visible
        } else {
            infoImage.style.display = 'none'; // Hide the image if no img field
        }

        infoImage.onclick = () => {
            const highResImageContainer = document.getElementById('high-res-image-container');
            const highResImage = document.getElementById('high-res-image');
            // Set the high-resolution image source
            highResImage.src = infoImage.src; // Use the same image source or a high-res version
        
            // Toggle the visibility of the high-res image container
            if (highResImageContainer.classList.contains('show')) {
                // Fade out the image container
                highResImageContainer.classList.remove('show');
            } else {
                // Fade in the image container
                highResImageContainer.classList.add('show');
            }
        };
    };

    const grid = document.getElementById('grid');
    grid.appendChild(plotDiv);
}

function dotPlot(plot) {
    const [[x1, z1]] = plot.coordinates; // Center point for the dot

    const plotDiv = document.createElement('div');
    plotDiv.className = 'plot-dot';
    plotDiv.style.border = `1px solid ${plot.borderColor}`;
    plotDiv.style.backgroundColor = `${plot.fillColor}9A`; // Dot fill color, slight opacity change

    // Get the image dimensions for correct positioning
    const dynmapImg = document.getElementById('dynmap-img');
    const gridWidth = dynmapImg.naturalWidth;
    const gridHeight = dynmapImg.naturalHeight;

    // Position the dot at the center point (account for the dot's radius)
    const left = (x1 * gridWidth) - 3.5; // Centering the 5px dot
    const top = (z1 * gridHeight) - 3.5; // Centering the 5px dot

    plotDiv.style.left = `${left}px`;
    plotDiv.style.top = `${top}px`;

    const plotText = document.createElement('span');
    plotText.textContent = plot.title;
    plotDiv.appendChild(plotText);
    
    // Click event for showing description and image (if present)
    plotDiv.onclick = () => {
        const title = document.getElementById('plot-title');
        const description = document.getElementById('plot-description');
        const coords = document.getElementById('plot-coords');
        const infoImage = document.getElementById('info-image'); // Get the image element

        title.textContent = plot.title;
        description.innerHTML = plot.description;
        coords.textContent = `x: ${Math.round(x1)}, z: ${Math.round(z1)}`;

        // Check if the img field exists in the plot
        if (plot.img) {
            infoImage.src = plot.img;
            infoImage.style.display = 'block'; // Ensure the image is visible
        } else {
            infoImage.style.display = 'none'; // Hide the image if no img field
        }

        infoImage.onclick = () => {
            const highResImageContainer = document.getElementById('high-res-image-container');
            const highResImage = document.getElementById('high-res-image');
            // Set the high-resolution image source
            highResImage.src = infoImage.src; // Use the same image source or a high-res version
        
            // Toggle the visibility of the high-res image container
            if (highResImageContainer.classList.contains('show')) {
                // Fade out the image container
                highResImageContainer.classList.remove('show');
            } else {
                // Fade in the image container
                highResImageContainer.classList.add('show');
            }
        };
    };

    const grid = document.getElementById('grid');
    grid.appendChild(plotDiv);
}

// Function to fetch the plots from plots.yaml
async function fetchPlots(currentSector) {
    const response = await fetch('plots.yaml');
    const plotsText = await response.text();
    const data = jsyaml.load(plotsText);
    const plots = data.plots;

    const grid = document.getElementById('grid');
    
    // Remove all plotDivs while keeping the dynmap-img intact
    Array.from(grid.children).forEach(child => {
        if (child.classList.contains('plot') || child.classList.contains('plot-circle') || child.classList.contains('plot-dot')) {
            grid.removeChild(child);
        }
    });

    // Filter the plots for the current sector
    const filteredPlots = plots.filter(plot => plot.sector === currentSector);

    filteredPlots.forEach(plot => {
        if (plot.shape === 'rect') {
            squarePlot(plot);
        } else if (plot.shape === 'circle') {
            circlePlot(plot);
        } else if (plot.shape === 'dot') {
            dotPlot(plot);
        }
    });

    updatePlotNamesVisibility();
}

function toggleNames() {
    const plots = document.querySelectorAll('.plot, .plot-circle, .plot-dot');
    namesVisible = !namesVisible; // Toggle the state
    plots.forEach(plot => {
        plot.style.fontSize = namesVisible ? '10px' : '0px'; // Adjust font size based on the state
    });
    document.getElementById('toggle-names').style.border = namesVisible ? "#27db57 solid 2px" : "#f74343 solid 2px";
}

function toggleOptions() {
    const divs = [document.getElementById('toggle-names'), document.getElementById('toggle-name-scaling'), document.getElementsByClassName('slider-label'), document.getElementsByClassName('slider-container')];
    divs.forEach(div => {
        const currentOpacity = window.getComputedStyle(div).opacity;

        if (currentOpacity === '1') {
            // Shrink to 0 size, hide by opacity, remove margin
            div.style.transform = 'scale(0)';
            div.style.opacity = '0';
            div.style.marginTop = '0px';
        } else {
            // Expand to full size, show with opacity, add margin
            div.style.transform = 'scale(1)';
            div.style.opacity = '1';
            div.style.marginTop = '10px';
        }
    });
}

function closeImage() {
    document.getElementById('high-res-image-container').classList.remove('show');
}

function waitForElement(selector, callback) {
    const interval = setInterval(() => {
        const element = document.querySelector(selector);
        if (element) {
            clearInterval(interval); // Stop checking once the element is found
            callback(element); // Call the callback function with the found element
        }
    }, 10); // Check every 100 milliseconds
}

document.addEventListener('DOMContentLoaded', async () => {
    await fetchConfig(); // Ensure this function is defined and works correctly

    // Wait for the sector dropdown to be available
    waitForElement('#sector-dropdown', (sectorDropdown) => {
        fetchSectors();
        fetchPlots("Sector 1"); // Fetch plots for the currently selected sector
        document.getElementById('plot-title').textContent = "Welcome to KrowdMap.";
        document.getElementById('plot-description').innerHTML = "Get started by clicking an area marked on the map, or choose a specific map region above. <br><br> Want to submit your own base, shop, or build? Check out the form below.";

        // Listen for changes on the dropdown
        sectorDropdown.addEventListener('change', (event) => {
            const selectedSector = event.target.options[event.target.selectedIndex].text;
            fetchPlots(selectedSector); // Fetch plots for the new sector
        });

        // Listen for changes on the sliders
        document.getElementById('opacity-dynmap').addEventListener('input', function() {
            const opacityValue = this.value;
            document.getElementById('dynmap-img').style.opacity = opacityValue;
        });
        document.getElementById('opacity-plots').addEventListener('input', function() {
            const opacityValue = this.value;
            const plots = document.querySelectorAll('.plot, .plot-circle, .plot-dot');
            plots.forEach(plot => {
                plot.style.opacity = opacityValue;
            });
        });
        
        document.getElementById('options-button').addEventListener('click', toggleOptions);
        document.getElementById('toggle-names').addEventListener('click', toggleNames);
        document.getElementById('close-image').addEventListener('click', closeImage);
    });
});

