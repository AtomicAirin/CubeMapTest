async function fetchDynmap() {
    const dynmapUrl = "https://image.api.playstation.com/vulcan/ap/rnd/202407/0401/670c294ded3baf4fa11068db2ec6758c63f7daeb266a35a1.png"; // Replace with the actual image URL
    const dynmapImage = document.getElementById('dynmap');
    dynmapImage.src = dynmapUrl;

    // Wait for the image to load before setting up the overlay
    dynmapImage.onload = () => {
        const canvas = document.getElementById('overlay');
        const ctx = canvas.getContext('2d');

        // Set the canvas size to match the image
        canvas.width = dynmapImage.width;
        canvas.height = dynmapImage.height;

        drawGrid(ctx, dynmapImage.width, dynmapImage.height);
    };
}

function drawGrid(ctx, width, height) {
    // Define the size of each grid cell
    const gridSize = 50;

    ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
    ctx.lineWidth = 1;

    // Draw vertical lines
    for (let x = 0; x <= width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }

    // Draw horizontal lines
    for (let y = 0; y <= height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }
}

function drawPlots(plots, ctx) {
    plots.forEach(plot => {
        const [start, end] = plot.coordinates;
        const width = end.x - start.x;
        const height = end.y - start.y;

        ctx.strokeStyle = plot.border_color;
        ctx.fillStyle = plot.fill_color;
        ctx.lineWidth = 2;

        ctx.fillRect(start.x, start.y, width, height);
        ctx.strokeRect(start.x, start.y, width, height);

        ctx.font = "14px Arial";
        ctx.fillStyle = "#000000";
        ctx.fillText(plot.title, start.x + 5, start.y + 20);
    });
}

async function init() {
    await fetchDynmap();

    // Fetch plot data and draw it on the canvas
    const config = await fetchConfig();
    const plots = config.plots;
    const canvas = document.getElementById('overlay');
    const ctx = canvas.getContext('2d');

    drawPlots(plots, ctx);

    // Add click event to display plot information
    canvas.addEventListener('click', (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        plots.forEach(plot => {
            const [start, end] = plot.coordinates;
            if (x >= start.x && x <= end.x && y >= start.y && y <= end.y) {
                displayPlotInfo(plot.title, plot.description);
            }
        });
    });
}

window.onload = init;
