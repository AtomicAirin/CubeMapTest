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
            displayPlotInfo(clickedPlot);
        }
    };
}

function displayPlotInfo(plot) {
    let descriptionBox = document.getElementById('plot-description');
    if (!descriptionBox) {
        descriptionBox = document.createElement('div');
        descriptionBox.id = 'plot-description';
        descriptionBox.style.position = 'fixed';
        descriptionBox.style.bottom = '10px';
        descriptionBox.style.right = '10px';
        descriptionBox.style.backgroundColor = '#333';
        descriptionBox.style.color = '#fff';
        descriptionBox.style.padding = '10px';
        descriptionBox.style.borderRadius = '5px';
        document.body.appendChild(descriptionBox);
    }
    descriptionBox.innerHTML = `<strong>${plot.title}</strong><br>${plot.description}`;
}

function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });
}

async function updateFooter() {
    const config = await fetchConfig();
    const footer = document.getElementById('footer');
    footer.innerHTML = `
        <div style="flex: 1;">Created by [H] Kaybeo.</div>
        <div style="flex: 1;">${config.version}, updated ${config.last_updated}</div>
        <div style="flex: 1;"><a href="https://example.com" target="_blank">Submit plots here</a></div>
    `;
}

async function init() {
    const sectorsConfig = await fetchSectors();
    populateSectors(sectorsConfig.sectors);

    loadSectorMap(sectorsConfig.sectors[0].name);

    setupThemeToggle();
    updateFooter();
}

window.onload = init;
