async function fetchConfig() {
    const response = await fetch('config.yaml');
    return response.text().then((text) => jsyaml.load(text));
}

async function fetchSectors() {
    const response = await fetch('sectors.yaml');
    return response.text().then((text) => jsyaml.load(text).sectors);
}

async function fetchPlots(sector) {
    const response = await fetch('plots.yaml');
    const plots = await response.text().then((text) => jsyaml.load(text).plots);
    return plots.filter(plot => plot.sector === sector);
}

function populateSectors(sectors) {
    const sectorDropdown = document.getElementById('sector-dropdown');
    sectorDropdown.innerHTML = '';
    sectors.forEach(sector => {
        const option = document.createElement('option');
        option.value = sector.name;
        option.textContent = sector.name;
        sectorDropdown.appendChild(option);
    });
    sectorDropdown.addEventListener('change', (e) => {
        loadSectorMap(e.target.value);
    });
}

async function loadSectorMap(sector) {
    const sectors = await fetchSectors();
    const selectedSector = sectors.find(s => s.name === sector);
    const dynmapImg = document.getElementById('dynmap');
    dynmapImg.src = selectedSector.image_url;
    const plots = await fetchPlots(sector);
    drawPlots(plots);
}

function drawPlots(plots) {
    const grid = document.getElementById('grid');
    grid.innerHTML = ''; // Clear previous plots
    plots.forEach(plot => {
        const [topLeft, bottomRight] = plot.coordinates;
        const plotDiv = document.createElement('div');
        plotDiv.className = 'plot';
        plotDiv.style.left = `${topLeft[0]}px`;
        plotDiv.style.top = `${topLeft[1]}px`;
        plotDiv.style.width = `${bottomRight[0] - topLeft[0]}px`;
        plotDiv.style.height = `${bottomRight[1] - topLeft[1]}px`;
        plotDiv.style.borderColor = plot.border_color;
        plotDiv.style.backgroundColor = `${plot.fill_color}50`; // 30% transparency
        plotDiv.setAttribute('data-description', plot.description);
        grid.appendChild(plotDiv);
        
        plotDiv.addEventListener('click', (e) => {
            showPlotDescription(plot, e.pageX, e.pageY);
        });
    });
}

function showPlotDescription(plot, x, y) {
    const descriptionBox = document.getElementById('plot-description');
    descriptionBox.textContent = plot.description;
    descriptionBox.style.top = `${y}px`;
    descriptionBox.style.left = `${x}px`;
    descriptionBox.classList.remove('hidden');
}

function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        document.querySelector('header').classList.toggle('dark-mode');
        document.querySelector('aside').classList.toggle('dark-mode');
        document.querySelector('footer').classList.toggle('dark-mode');
    });
}

async function init() {
    const config = await fetchConfig();
    document.getElementById('footer').innerHTML = `
        <span>Created by [H] Kaybeo.</span>
        <span>CubeMap v${config.version}, updated ${config.last_updated}</span>
        <a href="https://example.com">Submit plots here</a>
    `;
    const sectors = await fetchSectors();
    populateSectors(sectors);
    setupThemeToggle();
    loadSectorMap(sectors[0].name);
}

init();
