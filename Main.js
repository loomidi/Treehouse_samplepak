const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Island and treehouse data
const island = {
    x: canvas.width / 2,
    y: canvas.height / 2 + 100,
    radius: 150
};
const tree = {
    x: canvas.width / 2,
    y: canvas.height / 2 + 50,
    size: 50
};
let platforms = [];
let roof = null;
let gems = [];
let vines = [];
let sprite = { x: canvas.width / 2, y: canvas.height / 2 + 50, color: '#FF69B4' };
const roofColors = ['#FFD700', '#FF4500', '#9932CC']; // Gold, orange, purple
let roofColorIndex = 0;

// Draw scene
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Water background
    ctx.fillStyle = '#4682B4';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Island
    ctx.beginPath();
    ctx.arc(island.x, island.y, island.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#228B22';
    ctx.fill();

    // Central tree
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(tree.x - 5, tree.y - tree.size, 10, tree.size);
    ctx.beginPath();
    ctx.arc(tree.x, tree.y - tree.size, tree.size * 0.75, 0, Math.PI * 2);
    ctx.fillStyle = '#32CD32';
    ctx.fill();

    // Platforms
    platforms.forEach((p, i) => {
        ctx.fillStyle = '#A0522D';
        ctx.fillRect(p.x, p.y, p.width, p.height);
        ctx.beginPath();
        ctx.moveTo(p.x + 30, p.y);
        ctx.lineTo(p.x + 30, tree.y + 50);
        ctx.strokeStyle = '#228B22';
        ctx.lineWidth = 2;
        ctx.stroke();
    });

    // Roof
    if (roof) {
        ctx.beginPath();
        ctx.moveTo(roof.x - 60, roof.y);
        ctx.lineTo(roof.x, roof.y - 80);
        ctx.lineTo(roof.x + 60, roof.y);
        ctx.closePath();
        ctx.fillStyle = roof.color;
        ctx.fill();
    }

    // Gems with glow
    const time = Date.now() / 1000;
    gems.forEach(gem => {
        ctx.beginPath();
        ctx.arc(gem.x, gem.y, 5 + Math.sin(time * 2) * 2, 0, Math.PI * 2);
        ctx.fillStyle = '#FFD700';
        ctx.fill();
    });

    // Sprite with sway
    ctx.beginPath();
    ctx.arc(sprite.x + Math.sin(time) * 10, sprite.y, 10, 0, Math.PI * 2);
    ctx.fillStyle = sprite.color;
    ctx.fill();
}
draw();

// Add platform
window.addPlatform = function() {
    platforms.push({
        x: tree.x - 50,
        y: tree.y - platforms.length * 30,
        width: 100,
        height: 20
    });
    vines.push({ x: tree.x - 20, y: tree.y - platforms.length * 30 });
    if (!roof) {
        roof = { x: tree.x, y: tree.y, color: roofColors[roofColorIndex] };
    }
    draw();
};

// Change roof color
window.changeRoofColor = function() {
    if (roof) {
        roofColorIndex = (roofColorIndex + 1) % roofColors.length;
        roof.color = roofColors[roofColorIndex];
        draw();
    }
};

// Add gem
window.addGem = function() {
    gems.push({
        x: tree.x + (Math.random() - 0.5) * 80,
        y: tree.y - Math.random() * 60
    });
    draw();
};

// Interactive tree planting
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const dx = x - island.x;
    const dy = y - island.y;
    if (dx * dx + dy * dy <= island.radius * island.radius) {
        const size = Math.random() * 20 + 20;
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(x - 5, y - size, 10, size);
        ctx.beginPath();
        ctx.arc(x, y - size, size * 0.75, 0, Math.PI * 2);
        ctx.fillStyle = '#32CD32';
        ctx.fill();
        // Play sound
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(400, audioCtx.currentTime);
        const gainNode = audioCtx.createGain();
        gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
        oscillator.connect(gainNode).connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.3);
    }
});

// Export design
window.exportDesign = function() {
    const design = {
        platforms: platforms.length,
        roofColor: roof ? roof.color : null,
        gems: gems,
        sprite: { x: sprite.x, y: sprite.y, color: sprite.color }
    };
    const json = JSON.stringify(design);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'treehouse-design.json';
    a.click();
    URL.revokeObjectURL(url);
};

// Animation loop
function animate() {
    draw();
    requestAnimationFrame(animate);
}
animate();

// Resize canvas
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    island.x = canvas.width / 2;
    island.y = canvas.height / 2 + 100;
    tree.x = canvas.width / 2;
    tree.y = canvas.height / 2 + 50;
    sprite.x = canvas.width / 2;
    sprite.y = canvas.height / 2 + 50;
    draw();
});
