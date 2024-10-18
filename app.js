async function fetchConfig() {
    const response = await fetch('config.yaml');
    const text = await response.text();
    return jsyaml.load(text);
}

async function fetchSectors() {
    const response = await fetch('sectors.yaml');
    const text = await response.text();
    return jsyaml.load(text);
}

async function fetchPlots() {
    const response = await fetch('plots.yaml');
    const text = await response.text();
    return jsyaml.load(text);
}

function hexToRgba(hex, alpha = 0.3) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function populateSectors(sectors) {
    const sectorSelect = document.getElementById('sector-select');
    sectors.forEach(sector => {
        const option = document.createElement('option');
        option.value = sector.name;
        option.textContent = sector.name;
        sectorSelect.appendChild(option);
    });

    sectorSelect.addEventListener('change', (event) => {
        const selectedSector = event.target.value;
        loadSectorMap(selectedSector);
    });
}

async function loadSectorMap(sectorName) {
    const sectors = await fetchSectors();
    const sector = sectors.sectors.find(s => s.name === sectorName);
    if (sector) {
        const dynmapImage = document.getElementById('dynmap');
        dynmapImage.src = sector.image_url;

        dynmapImage.onload = () => {
            const canvas = document.getElementById('overlay');
            canvas.width = dynmapImage.width;
            canvas.height = dynmapImage.height;

            fetchPlots().then(plotsConfig => {
                const plots = plotsConfig.plots.filter(plot => plot.sector === sectorName);
                drawPlots(plots);
            });
        };
    }
}

function drawPlots(plots) {
    const canvas = document.getElementById('overlay');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    plots.forEach(plot => {
        const [topLeft, bottomRight] = plot.coordinates;
        const width = bottomRight[0] - topLeft[0];
        const height = bottomRight[1] - topLeft[1];

        const fillColor = hexToRgba(plot.fill_color);
        ctx.fillStyle = fillColor;
        ctx.strokeStyle = plot.border_color;
        ctx.lineWidth = 2;
        ctx.fillRect(topLeft[0], topLeft[1], width, height);
        ctx.strokeRect(topLeft[0], topLeft[1], width, height);

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(plot.title, topLeft[0] + width / 2, topLeft[1] + height / 2);
    });

    canvas.onclick = (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const clickedPlot = plots.find(plot => {
            const [topLeft, bottomRight] = plot.coordinates;
            return x >= topLeft[0] && x <= bottomRight[0] && y >= topLeft[1] && y <= bottomRight[1];
        });

        if (clickedPlot) {
            showPlotDescription(clickedPlot, x, y);
        }
    };
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
