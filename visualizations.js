// ==========================================
// 0. THE EXPANDING INTRO ANIMATION (Bleuje Style)
// ==========================================
(function () {
    const canvas = document.getElementById('introCanvas');
    const ctx = canvas.getContext('2d');

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    let time = 0;
    const layerDefs = [2, 5, 5, 4, 1];
    const nodes = [];

    const w = rect.width;
    const h = rect.height;
    const paddingX = 50;
    const usableW = w - (paddingX * 2);

    for (let l = 0; l < layerDefs.length; l++) {
        const numNodes = layerDefs[l];
        const x = paddingX + (l * (usableW / (layerDefs.length - 1)));

        for (let n = 0; n < numNodes; n++) {
            const spacingY = h / (numNodes + 1);
            const y = spacingY * (n + 1);
            nodes.push({ layer: l, index: n, baseX: x, baseY: y });
        }
    }

    function draw() {
        time += 0.015;
        ctx.clearRect(0, 0, w, h);

        const expansionWave = (Math.sin(time * 0.7) + 1.2) * 2.5;

        const getLayerOpacity = (layerIndex) => {
            if (layerIndex === 0 || layerIndex === layerDefs.length - 1) return 1;
            const diff = expansionWave - layerIndex;
            return Math.max(0, Math.min(1, diff));
        };

        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const n1 = nodes[i];
                const n2 = nodes[j];

                if (n2.layer - n1.layer === 1) {
                    const op1 = getLayerOpacity(n1.layer);
                    const op2 = getLayerOpacity(n2.layer);
                    const edgeOpacity = Math.min(op1, op2) * 0.4;

                    if (edgeOpacity > 0.01) {
                        const dx1 = Math.sin(time + n1.baseY) * 5;
                        const dy1 = Math.cos(time + n1.baseX) * 5;
                        const dx2 = Math.sin(time + n2.baseY) * 5;
                        const dy2 = Math.cos(time + n2.baseX) * 5;

                        ctx.beginPath();
                        ctx.moveTo(n1.baseX + dx1, n1.baseY + dy1);
                        ctx.lineTo(n2.baseX + dx2, n2.baseY + dy2);
                        ctx.strokeStyle = `rgba(0, 229, 255, ${edgeOpacity})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }
        }

        for (let i = 0; i < nodes.length; i++) {
            const n = nodes[i];
            const opacity = getLayerOpacity(n.layer);

            if (opacity > 0.01) {
                const dx = Math.sin(time + n.baseY) * 5;
                const dy = Math.cos(time + n.baseX) * 5;
                const x = n.baseX + dx;
                const y = n.baseY + dy;

                ctx.beginPath();
                ctx.arc(x, y, 6 * opacity, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
                ctx.fill();

                ctx.beginPath();
                ctx.arc(x, y, 12 * opacity, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 229, 255, ${opacity * 0.2})`;
                ctx.fill();
            }
        }

        requestAnimationFrame(draw);
    }
    draw();
})();

// ==========================================
// 1. THE LINE
// ==========================================
(function () {
    const canvas = document.getElementById('lineCanvas');
    const ctx = canvas.getContext('2d');
    const wSlider = document.getElementById('line-w-slider');
    const bSlider = document.getElementById('line-b-slider');
    const wVal = document.getElementById('line-w-val');
    const bVal = document.getElementById('line-b-val');

    const MIN_X = -5, MAX_X = 5, MIN_Y = -5, MAX_Y = 5;
    const points = [];
    for (let i = 0; i < 30; i++) points.push({ x: 1 + Math.random() * 3, y: -1 - Math.random() * 3, type: 'a' });
    for (let i = 0; i < 30; i++) points.push({ x: -1 - Math.random() * 3, y: 1 + Math.random() * 3, type: 'b' });

    function mapX(x) { return ((x - MIN_X) / (MAX_X - MIN_X)) * canvas.width; }
    function mapY(y) { return canvas.height - ((y - MIN_Y) / (MAX_Y - MIN_Y)) * canvas.height; }

    function draw() {
        const w = parseFloat(wSlider.value), b = parseFloat(bSlider.value);
        wVal.innerText = w.toFixed(2); bVal.innerText = b.toFixed(2);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = 1;
        for (let i = MIN_X; i <= MAX_X; i++) { ctx.beginPath(); ctx.moveTo(mapX(i), 0); ctx.lineTo(mapX(i), canvas.height); ctx.stroke(); }
        for (let i = MIN_Y; i <= MAX_Y; i++) { ctx.beginPath(); ctx.moveTo(0, mapY(i)); ctx.lineTo(canvas.width, mapY(i)); ctx.stroke(); }

        const mY_l = w * MIN_X + b, mY_r = w * MAX_X + b;
        const pxLY = mapY(mY_l), pxRY = mapY(mY_r);

        ctx.fillStyle = 'rgba(255, 0, 85, 0.05)';
        ctx.beginPath(); ctx.moveTo(0, pxLY); ctx.lineTo(canvas.width, pxRY); ctx.lineTo(canvas.width, canvas.height); ctx.lineTo(0, canvas.height); ctx.fill();
        ctx.fillStyle = 'rgba(0, 229, 255, 0.05)';
        ctx.beginPath(); ctx.moveTo(0, pxLY); ctx.lineTo(canvas.width, pxRY); ctx.lineTo(canvas.width, 0); ctx.lineTo(0, 0); ctx.fill();

        ctx.strokeStyle = '#444'; ctx.beginPath(); ctx.moveTo(0, mapY(0)); ctx.lineTo(canvas.width, mapY(0)); ctx.moveTo(mapX(0), 0); ctx.lineTo(mapX(0), canvas.height); ctx.stroke();

        ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, pxLY); ctx.lineTo(canvas.width, pxRY); ctx.stroke();

        points.forEach(p => {
            ctx.beginPath(); ctx.arc(mapX(p.x), mapY(p.y), 4, 0, Math.PI * 2);
            ctx.fillStyle = p.type === 'a' ? '#ff0055' : '#00e5ff'; ctx.fill();
            ctx.shadowBlur = 10; ctx.shadowColor = ctx.fillStyle; ctx.fill(); ctx.shadowBlur = 0;
        });

        // Axis labels
        ctx.fillStyle = '#555'; ctx.font = '12px Courier New';
        ctx.fillText('Weight →', canvas.width - 80, mapY(0) - 8);
        ctx.save(); ctx.translate(mapX(0) + 12, 16); ctx.fillText('↑ Yellowness', 0, 0); ctx.restore();
    }
    wSlider.addEventListener('input', draw); bSlider.addEventListener('input', draw); draw();
})();

// ==========================================
// 2. ADDING NEURONS AND LAYERS (POLYGON)
// ==========================================
(function () {
    const canvas = document.getElementById('layersCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const addBtn = document.getElementById('layers-add-btn');
    const resetBtn = document.getElementById('layers-reset-btn');

    let neurons = 1;

    function draw() {
        const W = canvas.width;
        const H = canvas.height;
        ctx.fillStyle = '#0f0f0f';
        ctx.fillRect(0, 0, W, H);

        const cx = W / 2;
        const cy = H / 2;
        const R = 80; // inner radius

        ctx.save();
        ctx.translate(cx, cy);

        // Draw the background shaded regions for the active neurons
        // We draw them individually with low opacity
        for (let i = 0; i < neurons; i++) {
            let angle = (Math.PI * 2 / Math.max(neurons, 3)) * i;
            if (neurons === 1) angle = -Math.PI / 4;
            if (neurons === 2) angle = -Math.PI / 4 + i * (Math.PI / 1.5);

            // Distance of the line from center
            let d = R + 20;
            if (neurons > 12) d = R + 10;

            ctx.save();
            ctx.rotate(angle);
            ctx.fillStyle = 'rgba(0, 229, 255, 0.1)';
            // draw the half plane
            ctx.beginPath();
            ctx.moveTo(-W, -d);
            ctx.lineTo(W, -d);
            ctx.lineTo(W, -W);
            ctx.lineTo(-W, -W);
            ctx.fill();

            // stroke the boundary line
            ctx.strokeStyle = '#00e5ff';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(-W, -d);
            ctx.lineTo(W, -d);
            ctx.stroke();
            ctx.restore();
        }

        ctx.restore();

        // Draw data points (lemons inner, apples outer ring)
        Math.seedrandom('layers'); // fixed seed to keep dots stable
        for (let i = 0; i < 150; i++) {
            let a = Math.random() * Math.PI * 2;
            let d = Math.random() * R;
            let x = cx + Math.cos(a) * d * 0.8;
            let y = cy + Math.sin(a) * d * 0.8;
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fillStyle = '#00e5ff'; // cyan lemons
            ctx.fill();
            ctx.strokeStyle = 'rgba(0,0,0,0.5)';
            ctx.stroke();
        }
        for (let i = 0; i < 200; i++) {
            let a = Math.random() * Math.PI * 2;
            let d = R + 40 + Math.random() * 80;
            let x = cx + Math.cos(a) * d;
            let y = cy + Math.sin(a) * d;
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fillStyle = '#ff0055'; // pink apples
            ctx.fill();
            ctx.strokeStyle = 'rgba(0,0,0,0.5)';
            ctx.stroke();
        }

        // Draw Neuron count
        ctx.font = '16px Courier New';
        ctx.fillStyle = '#aaa';
        ctx.textAlign = 'left';
        ctx.fillText(`HIDDEN NEURONS: ${neurons}`, 20, 30);
    }

    if (addBtn) addBtn.addEventListener('click', () => { neurons++; draw(); });
    if (resetBtn) resetBtn.addEventListener('click', () => { neurons = 1; draw(); });

    // Ensure Math.seedrandom is available (we just need a simple stable prng if not)
    if (!Math.seedrandom) {
        let seed = 1;
        Math.seedrandom = function (s) { seed = s.length || 1; };
        Math.random = function () {
            let x = Math.sin(seed++) * 10000;
            return x - Math.floor(x);
        };
    }

    draw();
})();

// ==========================================
// 3. THE HINGE (WIRE-FRAME 3D)
// ==========================================
(function () {
    const canvas = document.getElementById('foldCanvas');
    const ctx = canvas.getContext('2d');
    const w1Slider = document.getElementById('fold-w1-slider');
    const w2Slider = document.getElementById('fold-w2-slider');
    const rotSlider = document.getElementById('fold-rot-slider');
    const reluToggle = document.getElementById('fold-relu-toggle');

    function project(x, y, z, angleDegrees) {
        const angle = angleDegrees * (Math.PI / 180);
        const rx = x * Math.cos(angle) - y * Math.sin(angle);
        const ry = x * Math.sin(angle) + y * Math.cos(angle);
        const scale = 70;
        const px = canvas.width / 2 + (rx - ry) * Math.cos(Math.PI / 6) * scale;
        const py = canvas.height / 2 + 50 + (rx + ry) * Math.sin(Math.PI / 6) * scale - z * scale;
        return { x: px, y: py, depth: rx + ry };
    }

    function draw() {
        const w1 = parseFloat(w1Slider.value), w2 = parseFloat(w2Slider.value), rot = parseFloat(rotSlider.value);
        const useRelu = reluToggle.checked;
        document.getElementById('fold-w1-val').innerText = w1.toFixed(2);
        document.getElementById('fold-w2-val').innerText = w2.toFixed(2);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const gridSize = 16, min = -2, max = 2, step = (max - min) / gridSize;
        const lines = [];

        for (let i = 0; i <= gridSize; i++) {
            for (let j = 0; j <= gridSize; j++) {
                const x = min + i * step, y = min + j * step;
                let z = w1 * x + w2 * y;
                if (useRelu) z = Math.max(0, z);
                const p = project(x, y, z, rot);

                if (i < gridSize) {
                    let zr = w1 * (x + step) + w2 * y; if (useRelu) zr = Math.max(0, zr);
                    lines.push({ p1: p, p2: project(x + step, y, zr, rot), isFlat: (z < 0.01 && zr < 0.01) });
                }
                if (j < gridSize) {
                    let zd = w1 * x + w2 * (y + step); if (useRelu) zd = Math.max(0, zd);
                    lines.push({ p1: p, p2: project(x, y + step, zd, rot), isFlat: (z < 0.01 && zd < 0.01) });
                }
            }
        }

        lines.forEach(l => {
            ctx.beginPath(); ctx.moveTo(l.p1.x, l.p1.y); ctx.lineTo(l.p2.x, l.p2.y);
            ctx.strokeStyle = (useRelu && l.isFlat) ? '#333' : '#fff';
            ctx.lineWidth = 1; ctx.stroke();
        });
    }
    [w1Slider, w2Slider, rotSlider].forEach(el => el.addEventListener('input', draw));
    reluToggle.addEventListener('change', draw); draw();
})();

// ==========================================
// 3. THE GRAPH (ARCHITECTURE)
// ==========================================
(function () {
    const canvas = document.getElementById('netCanvas');
    const ctx = canvas.getContext('2d');
    const playBtn = document.getElementById('net-play-btn');
    const epochVal = document.getElementById('net-epoch-val');

    const layers = [
        [{ x: 100, y: 125 }, { x: 100, y: 225 }],
        [{ x: 300, y: 75 }, { x: 300, y: 175 }, { x: 300, y: 275 }],
        [{ x: 500, y: 175 }]
    ];

    const conns = [];
    for (let i = 0; i < layers[0].length; i++) for (let j = 0; j < layers[1].length; j++)
        conns.push({ from: layers[0][i], to: layers[1][j], sW: (Math.random() - 0.5) * 4, eW: (Math.random() > 0.5 ? 1 : -1) * (1 + Math.random() * 3) });
    for (let i = 0; i < layers[1].length; i++) for (let j = 0; j < layers[2].length; j++)
        conns.push({ from: layers[1][i], to: layers[2][j], sW: (Math.random() - 0.5) * 4, eW: (Math.random() > 0.5 ? 1 : -1) * (1 + Math.random() * 3) });

    let prog = 0, isPlaying = false;

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const ease = 1 - Math.pow(1 - prog, 4);

        conns.forEach(c => {
            const w = c.sW * (1 - ease) + c.eW * ease;
            ctx.beginPath(); ctx.moveTo(c.from.x, c.from.y); ctx.lineTo(c.to.x, c.to.y);
            ctx.lineWidth = Math.max(0.5, Math.abs(w));
            const op = Math.min(1, Math.max(0.1, Math.abs(w) / 2));
            ctx.strokeStyle = w > 0 ? `rgba(0, 229, 255, ${op})` : `rgba(255, 0, 85, ${op})`; // Cyan / Pink
            ctx.stroke();
        });

        layers.flat().forEach(n => {
            ctx.beginPath(); ctx.arc(n.x, n.y, 8, 0, Math.PI * 2);
            ctx.fillStyle = '#0a0a0a'; ctx.fill();
            ctx.lineWidth = 2; ctx.strokeStyle = '#fff'; ctx.stroke();
        });
    }

    function anim() {
        if (!isPlaying) return;
        prog += 0.005; epochVal.innerText = Math.min(100, Math.floor(prog * 100));
        draw();
        if (prog < 1) requestAnimationFrame(anim);
        else { isPlaying = false; playBtn.innerText = "RESET AND REPLAY"; }
    }

    playBtn.addEventListener('click', () => {
        if (prog >= 1) prog = 0;
        if (!isPlaying) { isPlaying = true; playBtn.innerText = "TRAINING..."; anim(); }
    });
    draw();
})();

// ==========================================
// 4. THE HIKER
// ==========================================
(function () {
    const canvas = document.getElementById('hikerCanvas');
    const ctx = canvas.getContext('2d');
    const lrSlider = document.getElementById('hiker-lr-slider');

    const MIN_X = -3.5, MAX_X = 3.5, MIN_Y = -1, MAX_Y = 10;
    let currentW = 2.5, history = [currentW];

    function mapX(x) { return ((x - MIN_X) / (MAX_X - MIN_X)) * canvas.width; }
    function mapY(y) { return canvas.height - ((y - MIN_Y) / (MAX_Y - MIN_Y)) * canvas.height; }
    function getLoss(w) { return w * w; }
    function getGrad(w) { return 2 * w; }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = '#333'; ctx.beginPath(); ctx.moveTo(0, mapY(0)); ctx.lineTo(canvas.width, mapY(0)); ctx.moveTo(mapX(0), 0); ctx.lineTo(mapX(0), canvas.height); ctx.stroke();

        ctx.strokeStyle = '#888'; ctx.lineWidth = 2; ctx.beginPath();
        for (let x = MIN_X; x <= MAX_X; x += 0.1) {
            if (x === MIN_X) ctx.moveTo(mapX(x), mapY(getLoss(x))); else ctx.lineTo(mapX(x), mapY(getLoss(x)));
        } ctx.stroke();

        if (history.length > 1) {
            ctx.strokeStyle = 'rgba(0, 229, 255, 0.4)'; ctx.lineWidth = 1.5; ctx.setLineDash([5, 5]); ctx.beginPath();
            ctx.moveTo(mapX(history[0]), mapY(getLoss(history[0])));
            for (let i = 1; i < history.length; i++) ctx.lineTo(mapX(history[i]), mapY(getLoss(history[i])));
            ctx.stroke(); ctx.setLineDash([]);
        }

        const px = mapX(currentW), py = mapY(getLoss(currentW));
        ctx.beginPath(); ctx.arc(px, py, 6, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill();
        ctx.shadowBlur = 10; ctx.shadowColor = '#00e5ff'; ctx.fill(); ctx.shadowBlur = 0;

        // Axis labels
        ctx.fillStyle = '#555'; ctx.font = '12px Courier New';
        ctx.fillText('w (weight) →', canvas.width - 110, mapY(0) - 8);
        ctx.save(); ctx.translate(mapX(0) + 12, 16); ctx.fillText('↑ Loss', 0, 0); ctx.restore();
    }

    let autoInterval = null;
    document.getElementById('hiker-step-btn').addEventListener('click', () => {
        currentW = currentW - (parseFloat(lrSlider.value) * getGrad(currentW)); history.push(currentW); draw();
    });
    document.getElementById('hiker-auto-btn').addEventListener('click', function () {
        if (autoInterval) {
            clearInterval(autoInterval); autoInterval = null; this.innerText = 'AUTO DESCEND'; this.style.color = '#00e5ff';
        } else {
            this.innerText = 'STOP'; this.style.color = '#ff0055';
            autoInterval = setInterval(() => {
                currentW = currentW - (parseFloat(lrSlider.value) * getGrad(currentW)); history.push(currentW); draw();
                if (Math.abs(currentW) < 0.001) { clearInterval(autoInterval); autoInterval = null; document.getElementById('hiker-auto-btn').innerText = 'AUTO DESCEND'; document.getElementById('hiker-auto-btn').style.color = '#00e5ff'; }
            }, 120);
        }
    });
    document.getElementById('hiker-reset-btn').addEventListener('click', () => {
        if (autoInterval) { clearInterval(autoInterval); autoInterval = null; document.getElementById('hiker-auto-btn').innerText = 'AUTO DESCEND'; document.getElementById('hiker-auto-btn').style.color = '#00e5ff'; }
        currentW = 2.5; history = [currentW]; draw();
    });
    lrSlider.addEventListener('input', e => { document.getElementById('hiker-lr-val').innerText = parseFloat(e.target.value).toFixed(2); });
    draw();
})();

// ==========================================
// 5. LINEAR REGRESSION (BEST FIT)
// ==========================================
(function () {
    const canvas = document.getElementById('linregCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const fitBtn = document.getElementById('linreg-fit-btn');
    const resetBtn = document.getElementById('linreg-reset-btn');

    const width = canvas.width, height = canvas.height;
    const PAD = 50;

    // Data range
    const DATA_MIN_X = 0, DATA_MAX_X = 10;
    const DATA_MIN_Y = -2, DATA_MAX_Y = 12;

    let points = [];
    let trueW = 0, trueB = 0;
    let w = 0, b = 0;
    let isFitting = false;
    let stepCount = 0;
    let animId = null;

    function generateData() {
        trueW = 0.6 + Math.random() * 0.8;  // slope between 0.6 and 1.4
        trueB = 1 + Math.random() * 2;       // intercept between 1 and 3
        points = [];
        const N = 20;
        for (let i = 0; i < N; i++) {
            const x = DATA_MIN_X + 0.5 + Math.random() * (DATA_MAX_X - 1);
            const noise = (Math.random() - 0.5) * 3;
            const y = trueW * x + trueB + noise;
            points.push({ x, y });
        }
        // Random initial line
        w = (Math.random() - 0.5) * 2;
        b = Math.random() * 4;
        stepCount = 0;
    }
    generateData();

    function mapX(x) { return PAD + ((x - DATA_MIN_X) / (DATA_MAX_X - DATA_MIN_X)) * (width - PAD * 2); }
    function mapY(y) { return (height - PAD) - ((y - DATA_MIN_Y) / (DATA_MAX_Y - DATA_MIN_Y)) * (height - PAD * 2); }

    function getMSE() {
        let sum = 0;
        for (const p of points) {
            const pred = w * p.x + b;
            sum += (pred - p.y) ** 2;
        }
        return sum / points.length;
    }

    function gradStep() {
        const lr = 0.004;
        let dw = 0, db = 0;
        for (const p of points) {
            const err = (w * p.x + b) - p.y;
            dw += 2 * err * p.x;
            db += 2 * err;
        }
        dw /= points.length;
        db /= points.length;
        w -= lr * dw;
        b -= lr * db;
        stepCount++;
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);

        // Grid
        ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = 1;
        for (let x = 0; x <= 10; x += 2) {
            const px = mapX(x);
            ctx.beginPath(); ctx.moveTo(px, PAD); ctx.lineTo(px, height - PAD); ctx.stroke();
        }
        for (let y = 0; y <= 10; y += 2) {
            const py = mapY(y);
            ctx.beginPath(); ctx.moveTo(PAD, py); ctx.lineTo(width - PAD, py); ctx.stroke();
        }

        // Axes
        ctx.strokeStyle = '#333'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(PAD, height - PAD); ctx.lineTo(width - PAD, height - PAD); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(PAD, height - PAD); ctx.lineTo(PAD, PAD); ctx.stroke();

        // Axis labels
        ctx.fillStyle = '#555'; ctx.font = '12px Courier New'; ctx.textAlign = 'center';
        ctx.fillText('Hours Studied →', width / 2, height - 10);
        ctx.save();
        ctx.translate(14, height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('↑ Exam Score', 0, 0);
        ctx.restore();

        // Residual lines (dashed pink)
        const mse = getMSE();
        for (const p of points) {
            const pred = w * p.x + b;
            const px = mapX(p.x);
            const pyActual = mapY(p.y);
            const pyPred = mapY(pred);
            const errMag = Math.min(1, Math.abs(pred - p.y) / 5);
            ctx.strokeStyle = `rgba(255, 0, 85, ${0.2 + errMag * 0.6})`;
            ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
            ctx.beginPath(); ctx.moveTo(px, pyActual); ctx.lineTo(px, pyPred); ctx.stroke();
            ctx.setLineDash([]);
        }

        // Fitted line
        const yLeft = w * DATA_MIN_X + b;
        const yRight = w * DATA_MAX_X + b;
        ctx.strokeStyle = '#00e5ff'; ctx.lineWidth = 2.5;
        ctx.shadowBlur = 8; ctx.shadowColor = '#00e5ff';
        ctx.beginPath(); ctx.moveTo(mapX(DATA_MIN_X), mapY(yLeft)); ctx.lineTo(mapX(DATA_MAX_X), mapY(yRight)); ctx.stroke();
        ctx.shadowBlur = 0;

        // Data points
        for (const p of points) {
            const px = mapX(p.x), py = mapY(p.y);
            ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2);
            ctx.fillStyle = '#fff'; ctx.fill();
            ctx.shadowBlur = 6; ctx.shadowColor = '#fff'; ctx.fill(); ctx.shadowBlur = 0;
        }

        // HUD: Loss and step count
        ctx.fillStyle = '#888'; ctx.font = '13px Courier New'; ctx.textAlign = 'right';
        ctx.fillText(`MSE Loss: ${mse.toFixed(3)}`, width - PAD, PAD - 10);
        ctx.fillStyle = '#555';
        ctx.fillText(`Step: ${stepCount}`, width - PAD, PAD + 8);

        // Equation display
        ctx.fillStyle = '#00e5ff'; ctx.font = 'bold 13px Courier New'; ctx.textAlign = 'left';
        ctx.fillText(`y = ${w.toFixed(2)}x + ${b.toFixed(2)}`, PAD + 5, PAD - 10);
    }

    function animFit() {
        if (!isFitting) return;
        // Run several steps per frame for snappier convergence
        for (let i = 0; i < 3; i++) gradStep();
        draw();

        if (stepCount >= 300 || getMSE() < 0.01) {
            isFitting = false;
            fitBtn.innerText = 'FIT LINE';
            fitBtn.disabled = false;
            return;
        }
        animId = requestAnimationFrame(animFit);
    }

    fitBtn.addEventListener('click', () => {
        if (isFitting) return;
        isFitting = true;
        fitBtn.disabled = true;
        fitBtn.innerText = 'FITTING...';
        animFit();
    });

    resetBtn.addEventListener('click', () => {
        if (animId) { cancelAnimationFrame(animId); animId = null; }
        isFitting = false;
        fitBtn.innerText = 'FIT LINE';
        fitBtn.disabled = false;
        generateData();
        draw();
    });

    draw();
})();

// ==========================================
// 7. LOGISTIC REGRESSION (SIGMOID CLASSIFIER)
// ==========================================
(function () {
    const canvas = document.getElementById('logregCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const fitBtn = document.getElementById('logreg-fit-btn');
    const resetBtn = document.getElementById('logreg-reset-btn');

    const W = canvas.width, H = canvas.height;
    const SPLIT = W * 0.6; // Left panel width (sigmoid), right panel (loss)

    // Generate 1D binary classification data
    let data = [];
    let w = 0, b = 0; // parameters
    let lossHistory = [];
    let animId = null;
    let trainStep = 0;

    function generateData() {
        data = [];
        // Class 0 (cyan): x in range [-3, 0]
        for (let i = 0; i < 15; i++) {
            data.push({ x: -3 + Math.random() * 3, label: 0 });
        }
        // Class 1 (pink): x in range [0, 3]
        for (let i = 0; i < 15; i++) {
            data.push({ x: Math.random() * 3, label: 1 });
        }
    }

    function sigmoid(z) { return 1 / (1 + Math.exp(-Math.max(-20, Math.min(20, z)))); }

    function predict(x) { return sigmoid(w * x + b); }

    function bce() {
        let loss = 0;
        for (const d of data) {
            const p = Math.max(1e-7, Math.min(1 - 1e-7, predict(d.x)));
            loss -= d.label * Math.log(p) + (1 - d.label) * Math.log(1 - p);
        }
        return loss / data.length;
    }

    function reset() {
        if (animId) { cancelAnimationFrame(animId); animId = null; }
        generateData();
        w = 0.1;
        b = 0;
        lossHistory = [];
        trainStep = 0;
        fitBtn.disabled = false;
        draw();
    }

    function gradStep() {
        const lr = 0.15;
        let dw = 0, db = 0;
        for (const d of data) {
            const p = predict(d.x);
            const err = p - d.label;
            dw += err * d.x;
            db += err;
        }
        w -= lr * dw / data.length;
        b -= lr * db / data.length;
    }

    // --- Drawing ---
    function toScreenLeft(x, y) {
        // x: [-4, 4] mapped to [20, SPLIT-20]
        // y: [0, 1] mapped to [H-30, 30]
        return {
            sx: 20 + ((x + 4) / 8) * (SPLIT - 40),
            sy: H - 30 - y * (H - 60)
        };
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);

        // --- Left panel: Sigmoid ---
        // Background
        ctx.fillStyle = 'rgba(255,255,255,0.02)';
        ctx.fillRect(0, 0, SPLIT, H);
        ctx.strokeStyle = '#222'; ctx.strokeRect(0, 0, SPLIT, H);

        // Grid
        ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = 0.5;
        // Horizontal at y=0.5
        const { sy: halfY } = toScreenLeft(0, 0.5);
        ctx.setLineDash([4, 4]); ctx.beginPath();
        ctx.moveTo(20, halfY); ctx.lineTo(SPLIT - 20, halfY); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#444'; ctx.font = '10px Courier New'; ctx.textAlign = 'right';
        ctx.fillText('0.5', 18, halfY + 4);
        ctx.fillText('1.0', 18, 34);
        ctx.fillText('0.0', 18, H - 26);

        // X axis
        ctx.strokeStyle = '#333'; ctx.lineWidth = 1;
        const { sy: axisY } = toScreenLeft(0, 0);
        ctx.beginPath(); ctx.moveTo(20, axisY); ctx.lineTo(SPLIT - 20, axisY); ctx.stroke();

        // Sigmoid curve
        ctx.beginPath();
        for (let px = 20; px <= SPLIT - 20; px++) {
            const x = ((px - 20) / (SPLIT - 40)) * 8 - 4;
            const y = predict(x);
            const { sx, sy } = toScreenLeft(x, y);
            if (px === 20) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
        }
        ctx.strokeStyle = '#a855f7'; ctx.lineWidth = 2.5; ctx.stroke();
        // Glow
        ctx.shadowBlur = 10; ctx.shadowColor = '#a855f7';
        ctx.stroke(); ctx.shadowBlur = 0;

        // Decision boundary vertical line at p=0.5 (where w*x+b=0 → x=-b/w)
        if (Math.abs(w) > 0.01) {
            const boundary = -b / w;
            if (boundary > -4 && boundary < 4) {
                const { sx } = toScreenLeft(boundary, 0);
                ctx.setLineDash([6, 4]);
                ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 1;
                ctx.beginPath(); ctx.moveTo(sx, 30); ctx.lineTo(sx, H - 30); ctx.stroke();
                ctx.setLineDash([]);
                ctx.fillStyle = '#888'; ctx.font = '9px Courier New'; ctx.textAlign = 'center';
                ctx.fillText('BOUNDARY', sx, 24);
            }
        }

        // Data points
        for (const d of data) {
            const { sx, sy } = toScreenLeft(d.x, d.label);
            ctx.beginPath(); ctx.arc(sx, sy, 5, 0, Math.PI * 2);
            ctx.fillStyle = d.label === 0 ? '#00e5ff' : '#ff0055';
            ctx.globalAlpha = 0.8; ctx.fill(); ctx.globalAlpha = 1;
            ctx.strokeStyle = d.label === 0 ? '#00e5ff' : '#ff0055';
            ctx.lineWidth = 1; ctx.stroke();
        }

        // Label
        ctx.fillStyle = '#666'; ctx.font = '11px Courier New'; ctx.textAlign = 'center';
        ctx.fillText('SIGMOID CURVE', SPLIT / 2, H - 8);

        // --- Right panel: Loss ---
        const rX = SPLIT + 15, rW = W - SPLIT - 30;
        ctx.fillStyle = 'rgba(255,255,255,0.02)';
        ctx.fillRect(SPLIT, 0, W - SPLIT, H);
        ctx.strokeStyle = '#222'; ctx.strokeRect(SPLIT, 0, W - SPLIT, H);

        ctx.fillStyle = '#666'; ctx.font = '11px Courier New'; ctx.textAlign = 'center';
        ctx.fillText('BINARY CROSS-ENTROPY', SPLIT + (W - SPLIT) / 2, 14);
        ctx.fillText(`STEP: ${trainStep}`, SPLIT + (W - SPLIT) / 2, H - 8);

        if (lossHistory.length > 0) {
            const maxLoss = Math.max(1, ...lossHistory);
            ctx.beginPath();
            for (let i = 0; i < lossHistory.length; i++) {
                const lx = rX + (i / Math.max(1, lossHistory.length - 1)) * rW;
                const ly = H - 35 - (lossHistory[i] / maxLoss) * (H - 70);
                if (i === 0) ctx.moveTo(lx, ly); else ctx.lineTo(lx, ly);
            }
            ctx.strokeStyle = '#00ff88'; ctx.lineWidth = 2; ctx.stroke();
            ctx.shadowBlur = 6; ctx.shadowColor = '#00ff88'; ctx.stroke(); ctx.shadowBlur = 0;

            // Current loss value
            ctx.fillStyle = '#00ff88'; ctx.font = '12px Courier New'; ctx.textAlign = 'left';
            ctx.fillText(`LOSS: ${lossHistory[lossHistory.length - 1].toFixed(4)}`, rX, 35);
        }

        // Parameters
        ctx.fillStyle = '#888'; ctx.font = '10px Courier New'; ctx.textAlign = 'left';
        ctx.fillText(`w: ${w.toFixed(3)}`, rX, 55);
        ctx.fillText(`b: ${b.toFixed(3)}`, rX + 70, 55);
    }

    // --- Training animation ---
    function trainAnimate() {
        gradStep();
        trainStep++;
        lossHistory.push(bce());
        draw();

        if (trainStep < 100) {
            animId = requestAnimationFrame(trainAnimate);
        } else {
            animId = null;
            fitBtn.disabled = false;
        }
    }

    fitBtn.addEventListener('click', () => {
        if (animId) return;
        fitBtn.disabled = true;
        lossHistory = [];
        trainStep = 0;
        trainAnimate();
    });

    resetBtn.addEventListener('click', reset);

    reset();
})();

// ==========================================
// 6. SPLITTING THE SPACE (DECISION TREES)
// ==========================================
(function () {
    const canvas = document.getElementById('dtCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const splitBtn = document.getElementById('dt-split-btn');
    const resetBtn = document.getElementById('dt-reset-btn');

    const W = canvas.width, H = canvas.height;
    let points = [];
    let treeRoot = null;
    let splitsCount = 0;

    function generateData() {
        points = [];
        for (let i = 0; i < 250; i++) {
            let x = Math.random() * W;
            let y = Math.random() * H;

            // Nested noisy structure: Center blob vs corners, but somewhat chaotic
            let cx = W / 2, cy = H / 2;
            let dist = Math.sqrt((x - cx) * (x - cx) + (y - cy) * (y - cy));

            // Base logic
            let label = dist < 120 ? 1 : 0;

            // Inner-inner hole
            if (dist < 40) label = 0;

            // Add some noise (10% flip)
            if (Math.random() < 0.1) label = 1 - label;

            points.push({ x, y, label });
        }
    }

    function calcGini(groupA, groupB) {
        let total = groupA.length + groupB.length;
        if (total === 0) return 0;

        let gini = 0;
        for (let group of [groupA, groupB]) {
            let size = group.length;
            if (size === 0) continue;
            let score = 0;
            let counts = [0, 0];
            for (let p of group) counts[p.label]++;
            for (let c of counts) {
                let p = c / size;
                score += p * p;
            }
            gini += (1.0 - score) * (size / total);
        }
        return gini;
    }

    function findBestSplit(nodePts, xMin, xMax, yMin, yMax) {
        let bestGini = Infinity;
        let bestSplit = null;

        let counts = [0, 0];
        for (let p of nodePts) counts[p.label]++;
        let nodeClass = counts[1] > counts[0] ? 1 : 0;

        // If pure, no split needed
        if (counts[0] === 0 || counts[1] === 0 || nodePts.length < 2) {
            return { leaf: true, classLabel: nodeClass, pts: nodePts, xMin, xMax, yMin, yMax };
        }

        // Try splitting on X (using random subsets for speed if large, but 250 is small enough)
        for (let pt of nodePts) {
            let val = pt.x;
            if (val <= xMin || val >= xMax) continue;
            let left = [], right = [];
            for (let p of nodePts) {
                if (p.x < val) left.push(p);
                else right.push(p);
            }
            if (left.length === 0 || right.length === 0) continue;

            let gini = calcGini(left, right);
            if (gini < bestGini) {
                bestGini = gini;
                bestSplit = { axis: 'x', val: val, leftPts: left, rightPts: right };
            }
        }

        // Try splitting on Y
        for (let pt of nodePts) {
            let val = pt.y;
            if (val <= yMin || val >= yMax) continue;
            let left = [], right = [];
            for (let p of nodePts) {
                if (p.y < val) left.push(p);
                else right.push(p);
            }
            if (left.length === 0 || right.length === 0) continue;

            let gini = calcGini(left, right);
            if (gini < bestGini) {
                bestGini = gini;
                bestSplit = { axis: 'y', val: val, leftPts: left, rightPts: right };
            }
        }

        if (!bestSplit) {
            return { leaf: true, classLabel: nodeClass, pts: nodePts, xMin, xMax, yMin, yMax };
        }

        return {
            leaf: false,
            axis: bestSplit.axis,
            val: bestSplit.val,
            leftPts: bestSplit.leftPts,
            rightPts: bestSplit.rightPts,
            xMin, xMax, yMin, yMax
        };
    }

    function initTree() {
        treeRoot = { leaf: true, pts: points, xMin: 0, xMax: W, yMin: 0, yMax: H };
        let c = [0, 0];
        for (let p of points) c[p.label]++;
        treeRoot.classLabel = c[1] > c[0] ? 1 : 0;
        splitsCount = 0;
        updateUI();
    }

    // Split all current leaves once
    function splitLeaves(node) {
        if (node.leaf) {
            let c = [0, 0];
            for (let p of node.pts) c[p.label]++;
            if (c[0] === 0 || c[1] === 0 || node.pts.length < 2) return false;

            let split = findBestSplit(node.pts, node.xMin, node.xMax, node.yMin, node.yMax);
            if (split.leaf) return false;

            node.leaf = false;
            node.axis = split.axis;
            node.val = split.val;

            let cL = [0, 0], cR = [0, 0];
            for (let p of split.leftPts) cL[p.label]++;
            for (let p of split.rightPts) cR[p.label]++;

            node.left = {
                leaf: true, pts: split.leftPts,
                classLabel: cL[1] > cL[0] ? 1 : 0,
                xMin: node.xMin, xMax: node.axis === 'x' ? node.val : node.xMax,
                yMin: node.yMin, yMax: node.axis === 'y' ? node.val : node.yMax
            };
            node.right = {
                leaf: true, pts: split.rightPts,
                classLabel: cR[1] > cR[0] ? 1 : 0,
                xMin: node.axis === 'x' ? node.val : node.xMin, xMax: node.xMax,
                yMin: node.axis === 'y' ? node.val : node.yMin, yMax: node.yMax
            };
            return true;
        } else {
            let sL = splitLeaves(node.left);
            let sR = splitLeaves(node.right);
            return sL || sR;
        }
    }

    function drawNodeLines(node) {
        if (!node.leaf) {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            if (node.axis === 'x') {
                ctx.moveTo(node.val, node.yMin);
                ctx.lineTo(node.val, node.yMax);
            } else {
                ctx.moveTo(node.xMin, node.val);
                ctx.lineTo(node.xMax, node.val);
            }
            ctx.stroke();

            drawNodeLines(node.left);
            drawNodeLines(node.right);
        }
    }

    function drawNodeBackgrounds(node) {
        if (node.leaf) {
            ctx.fillStyle = node.classLabel === 1 ? 'rgba(0, 229, 255, 0.15)' : 'rgba(255, 0, 85, 0.15)';
            ctx.fillRect(node.xMin, node.yMin, node.xMax - node.xMin, node.yMax - node.yMin);
        } else {
            drawNodeBackgrounds(node.left);
            drawNodeBackgrounds(node.right);
        }
    }

    function draw() {
        ctx.fillStyle = '#0f0f0f';
        ctx.fillRect(0, 0, W, H);

        if (treeRoot) {
            drawNodeBackgrounds(treeRoot);
            drawNodeLines(treeRoot);
        }

        // Draw points
        for (let p of points) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
            ctx.fillStyle = p.label === 1 ? '#00e5ff' : '#ff0055';
            ctx.fill();
            ctx.strokeStyle = 'rgba(0,0,0,0.5)';
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        ctx.font = '14px Courier New';
        ctx.fillStyle = '#aaa';
        ctx.textAlign = 'left';
        ctx.fillText(`TREE DEPTH: ${splitsCount}`, 10, 25);
    }

    function updateUI() {
        splitBtn.innerText = `SPLIT ALL LEAVES (+1 DEPTH)`;
    }

    if (splitBtn) {
        splitBtn.addEventListener('click', () => {
            let didSplit = splitLeaves(treeRoot);
            if (didSplit) {
                splitsCount++;
                updateUI();
                draw();
            } else {
                splitBtn.innerText = 'FULLY PURE (MAX SPLITS)';
            }
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            generateData();
            initTree();
            draw();
            splitBtn.innerText = `SPLIT ALL LEAVES (+1 DEPTH)`;
        });
    }

    generateData();
    initTree();
    draw();
})();

// ==========================================
// 7. THE SYNTHESIS (TRIANGLE)
// ==========================================
(function () {
    const canvas = document.getElementById('archCanvas');
    const ctx = canvas.getContext('2d');
    const trainSlider = document.getElementById('arch-train-slider');
    const width = canvas.width, height = canvas.height;

    const pts = [];
    for (let i = 0; i < 80; i++) {
        pts.push({ x: (Math.random() - 0.5) * 2.5, y: (Math.random() - 0.5) * 2.5, label: 1 });
        const a = Math.random() * Math.PI * 2, r = 4 + Math.random() * 1.5;
        pts.push({ x: Math.cos(a) * r, y: Math.sin(a) * r, label: 0 });
    }

    const MAP = 6;
    function toX(x) { return (x + MAP) / (MAP * 2) * width; }
    function toY(y) { return height - (y + MAP) / (MAP * 2) * height; }
    function mX(sx) { return (sx / width) * MAP * 2 - MAP; }
    function mY(sy) { return ((height - sy) / height) * MAP * 2 - MAP; }

    const sW = [{ w1: 0.5, w2: 0.5, b: 2 }, { w1: -0.5, w2: 0.8, b: 1 }, { w1: 0.1, w2: -0.9, b: 3 }];
    const eW = [{ w1: 0, w2: -1, b: -2 }, { w1: 1.5, w2: 1, b: -2.5 }, { w1: -1.5, w2: 1, b: -2.5 }];

    function pred(x, y, t) {
        let act = 0;
        for (let i = 0; i < 3; i++) act += Math.max(0, (sW[i].w1 * (1 - t) + eW[i].w1 * t) * x + (sW[i].w2 * (1 - t) + eW[i].w2 * t) * y + (sW[i].b * (1 - t) + eW[i].b * t));
        return act < 0.5 ? 1 : 0;
    }

    function draw() {
        const p = trainSlider.value / 100;
        document.getElementById('arch-train-val').innerText = trainSlider.value + "%";
        ctx.clearRect(0, 0, width, height);

        const res = 5;
        for (let sy = 0; sy < height; sy += res) {
            for (let sx = 0; sx < width; sx += res) {
                ctx.fillStyle = pred(mX(sx), mY(sy), p) === 1 ? 'rgba(0, 229, 255, 0.15)' : 'rgba(255, 0, 85, 0.1)';
                ctx.fillRect(sx, sy, res, res);
            }
        }

        pts.forEach(pt => {
            ctx.beginPath(); ctx.arc(toX(pt.x), toY(pt.y), 3, 0, Math.PI * 2);
            ctx.fillStyle = pt.label === 1 ? '#00e5ff' : '#ff0055'; ctx.fill();
        });
    }
    trainSlider.addEventListener('input', draw); draw();
})();

// ==========================================
// 6. BACKPROPAGATION VISUAL
// ==========================================
(function () {
    const canvas = document.getElementById('backpropCanvas');
    const ctx = canvas.getContext('2d');
    const btn = document.getElementById('bp-btn');

    const nodes = [
        { x: 150, y: 175, type: 'in', label: 'Input' },
        { x: 300, y: 100, type: 'hidden', err: 0, targetErr: 0.8 },
        { x: 300, y: 250, type: 'hidden', err: 0, targetErr: 0.2 },
        { x: 450, y: 175, type: 'out', err: 0, targetErr: 1.0, label: 'Output' }
    ];

    const links = [
        { f: 0, t: 1, w: 0.8, err: 0 }, { f: 0, t: 2, w: 0.2, err: 0 },
        { f: 1, t: 3, w: 0.9, err: 0 }, { f: 2, t: 3, w: -0.1, err: 0 }
    ];

    let state = 0; // 0=idle, 1=out_err, 2=hidden_err, 3=in_err
    let prog = 0;

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        links.forEach(l => {
            ctx.beginPath(); ctx.moveTo(nodes[l.f].x, nodes[l.f].y); ctx.lineTo(nodes[l.t].x, nodes[l.t].y);
            ctx.strokeStyle = '#333'; ctx.lineWidth = 2; ctx.stroke();

            if (l.err > 0) {
                ctx.beginPath(); ctx.moveTo(nodes[l.f].x, nodes[l.f].y); ctx.lineTo(nodes[l.t].x, nodes[l.t].y);
                // The error flows backwards
                ctx.setLineDash([4, 4]); ctx.lineDashOffset = -performance.now() / 20;
                ctx.strokeStyle = `rgba(255, 0, 85, ${l.err})`; ctx.lineWidth = Math.abs(l.w) * 5 * l.err; ctx.stroke();
                ctx.setLineDash([]);
            }
        });

        nodes.forEach(n => {
            ctx.beginPath(); ctx.arc(n.x, n.y, 15, 0, Math.PI * 2);
            ctx.fillStyle = '#111'; ctx.fill();
            ctx.strokeStyle = `rgba(255, 255, 255, ${1 - n.err})`; ctx.lineWidth = 2; ctx.stroke();

            if (n.err > 0) {
                ctx.beginPath(); ctx.arc(n.x, n.y, 15, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(255, 0, 85, ${n.err})`; ctx.lineWidth = 2; ctx.stroke();
                ctx.shadowBlur = 10; ctx.shadowColor = '#ff0055'; ctx.fillStyle = `rgba(255,0,85,${n.err * 0.2})`; ctx.fill(); ctx.shadowBlur = 0;
            }

            if (n.label) {
                ctx.fillStyle = '#888'; ctx.font = "12px Courier New"; ctx.textAlign = "center";
                ctx.fillText(n.label, n.x, n.y + 35);
            }
        });
    }

    function tick() {
        prog += 0.02;
        if (prog > 1) {
            prog = 0; state++;
            if (state > 3) { state = 0; btn.innerText = "TRIGGER BACKPROPAGATION"; btn.disabled = false; return; }
        }

        const ease = prog;
        if (state === 1) nodes[3].err = ease;
        if (state === 2) {
            links[2].err = ease; links[3].err = ease;
            nodes[1].err = ease * nodes[1].targetErr;
            nodes[2].err = ease * nodes[2].targetErr;
        }
        if (state === 3) {
            links[0].err = ease * nodes[1].targetErr;
            links[1].err = ease * nodes[2].targetErr;
        }

        draw(); requestAnimationFrame(tick);
    }

    btn.addEventListener('click', () => {
        if (state !== 0) return;
        btn.disabled = true; btn.innerText = "PROPAGATING ERROR...";
        nodes.forEach(n => n.err = 0); links.forEach(l => l.err = 0);
        state = 1; prog = 0; tick();
    });
    draw();
})();

// ==========================================
// 7. BATCHES & EPOCHS (CONTOUR MAP)
// ==========================================
(function () {
    const canvas = document.getElementById('batchCanvas');
    const ctx = canvas.getContext('2d');
    const slider = document.getElementById('batch-size-slider');
    const btn = document.getElementById('batch-run-btn');
    const val = document.getElementById('batch-size-val');

    const cx = 300, cy = 150;
    let path = [];
    let isRunning = false;

    function drawContour() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let r = 10; r < 300; r += 20) {
            ctx.beginPath(); ctx.ellipse(cx, cy, r * 1.5, r, 0, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 - (r / 3000)})`; ctx.stroke();
        }
        ctx.beginPath(); ctx.arc(cx, cy, 3, 0, Math.PI * 2); ctx.fillStyle = "#00ff88"; ctx.fill();
    }

    function draw() {
        drawContour();
        if (path.length > 0) {
            ctx.beginPath(); ctx.moveTo(path[0].x, path[0].y);
            for (let i = 1; i < path.length; i++) ctx.lineTo(path[i].x, path[i].y);
            ctx.strokeStyle = '#00e5ff'; ctx.lineWidth = 2; ctx.stroke();

            const last = path[path.length - 1];
            ctx.beginPath(); ctx.arc(last.x, last.y, 4, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill();
        }
    }

    function runEpoch() {
        const bSize = parseInt(slider.value);
        const isStoc = bSize === 1;
        path = [{ x: 50, y: 50 }];
        let curX = 50, curY = 50;

        const steps = Math.max(10, Math.floor(100 / bSize));
        let stepIdx = 0;

        function step() {
            if (stepIdx >= steps) { isRunning = false; btn.innerText = "RUN 1 EPOCH"; btn.disabled = false; return; }

            const dx = cx - curX, dy = cy - curY;
            let noiseX = 0, noiseY = 0;

            if (isStoc) { noiseX = (Math.random() - 0.5) * 80; noiseY = (Math.random() - 0.5) * 80; }
            else if (bSize < 50) { noiseX = (Math.random() - 0.5) * (100 / bSize); noiseY = (Math.random() - 0.5) * (100 / bSize); }

            const lr = isStoc ? 0.2 : 0.8;
            curX += dx * lr + noiseX; curY += dy * lr + noiseY;

            path.push({ x: curX, y: curY });
            draw();
            stepIdx++;
            setTimeout(step, isStoc ? 20 : 50);
        }
        step();
    }

    slider.addEventListener('input', e => { val.innerText = e.target.value == 1 ? "1 (STOCHASTIC)" : e.target.value == 100 ? "100 (FULL BATCH)" : e.target.value; });
    btn.addEventListener('click', () => { if (isRunning) return; isRunning = true; btn.disabled = true; btn.innerText = "TRAINING..."; runEpoch(); });
    draw();
})();

// ==========================================
// 8. CONVOLUTIONAL NEURAL NETWORKS
// ==========================================
(function () {
    const canvas = document.getElementById('cnnCanvas');
    const ctx = canvas.getContext('2d');
    const btn = document.getElementById('cnn-scan-btn');

    // Simple 8x8 input image (A plus sign)
    const img = [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 0, 0, 0],
        [0, 0, 0, 1, 1, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 1, 1, 0, 0, 0],
        [0, 0, 0, 1, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]
    ];

    // Vertical edge detector kernel (Sobel-ish)
    const kernel = [
        [-1, 0, 1],
        [-1, 0, 1],
        [-1, 0, 1]
    ];

    let outMap = Array(6).fill(0).map(() => Array(6).fill(0));
    let scanX = 0, scanY = 0;
    let isScanning = false;

    const gridW = 200, gridH = 200, cellW = gridW / 8;
    const kCell = 40;

    function drawGrid(x, y, data, rows, cols, size, highlightX = -1, highlightY = -1, isKernel = false) {
        const cw = size / cols;
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                let val = data[r][c];
                // Normalize visualization
                let colorStr = isKernel ? (val > 0 ? '#00e5ff' : (val < 0 ? '#ff0055' : '#333')) : `rgba(255,255,255,${val})`;
                if (!isKernel && val < 0) colorStr = `rgba(255,0,85,${-val})`;
                if (!isKernel && val > 0) colorStr = `rgba(0,229,255,${val})`;

                ctx.fillStyle = colorStr;
                ctx.fillRect(x + c * cw, y + r * cw, cw, cw);
                ctx.strokeStyle = '#222';
                ctx.strokeRect(x + c * cw, y + r * cw, cw, cw);

                if (highlightX >= 0 && c >= highlightX && c < highlightX + 3 && r >= highlightY && r < highlightY + 3) {
                    ctx.strokeStyle = '#00e5ff'; ctx.lineWidth = 2;
                    ctx.strokeRect(x + highlightX * cw, y + highlightY * cw, cw * 3, cw * 3);
                    ctx.shadowBlur = 10; ctx.shadowColor = '#00e5ff';
                    ctx.strokeRect(x + highlightX * cw, y + highlightY * cw, cw * 3, cw * 3);
                    ctx.shadowBlur = 0; ctx.lineWidth = 1;
                }
            }
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Labels
        ctx.fillStyle = '#888'; ctx.font = "14px Courier New"; ctx.textAlign = 'center';
        ctx.fillText("INPUT IMAGE (8x8)", 150, 40);
        ctx.fillText("KERNEL (3x3)", 300, 120);
        ctx.fillText("OUTPUT FEATURE MAP", 450, 40);

        drawGrid(50, 50, img, 8, 8, 200, isScanning ? scanX : -1, isScanning ? scanY : -1);
        drawGrid(375, 50, outMap, 6, 6, 150);

        // Draw Kernel alone
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
                let kv = kernel[r][c];
                ctx.fillStyle = kv > 0 ? 'rgba(0,229,255,0.8)' : (kv < 0 ? 'rgba(255,0,85,0.8)' : '#222');
                ctx.fillRect(270 + c * 20, 140 + r * 20, 20, 20);
                ctx.strokeStyle = "#111"; ctx.strokeRect(270 + c * 20, 140 + r * 20, 20, 20);
                ctx.fillStyle = "#fff"; ctx.font = "10px Courier New"; ctx.fillText(kv, 270 + c * 20 + 10, 140 + r * 20 + 14);
            }
        }
    }

    function scanStep() {
        if (scanY > 5) { isScanning = false; btn.innerText = "RESET & SCAN"; btn.disabled = false; return; }

        let sum = 0;
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
                sum += img[scanY + r][scanX + c] * kernel[r][c];
            }
        }
        outMap[scanY][scanX] = sum;

        scanX++;
        if (scanX > 5) { scanX = 0; scanY++; }

        draw();
        if (isScanning) setTimeout(scanStep, 100);
    }

    btn.addEventListener('click', () => {
        if (isScanning) return;
        isScanning = true; btn.disabled = true; btn.innerText = "SCANNING...";
        outMap = Array(6).fill(0).map(() => Array(6).fill(0));
        scanX = 0; scanY = 0;
        scanStep();
    });
    draw();
})();

// ==========================================
// 9. THE ATTENTION MECHANISM
// ==========================================
(function () {
    const canvas = document.getElementById('attentionCanvas');
    const ctx = canvas.getContext('2d');
    const slider = document.getElementById('attn-word-slider');
    const val = document.getElementById('attn-word-val');

    const words = ["THE", "BEAR", "SAT", "BY", "THE", "RIVER", "BANK"];

    // Artificial attention matrix representing how strongly words attend to each other
    // Rows are the focal word, columns are the attended words
    const attentionMatrix = [
        [1.0, 0.4, 0.1, 0.0, 0.0, 0.0, 0.0], // THE
        [0.4, 1.0, 0.8, 0.1, 0.0, 0.0, 0.0], // BEAR
        [0.1, 0.9, 1.0, 0.4, 0.1, 0.0, 0.0], // SAT
        [0.0, 0.1, 0.5, 1.0, 0.3, 0.6, 0.2], // BY
        [0.0, 0.0, 0.1, 0.3, 1.0, 0.5, 0.2], // THE
        [0.0, 0.0, 0.0, 0.7, 0.5, 1.0, 0.9], // RIVER
        [0.0, 0.1, 0.0, 0.2, 0.2, 0.9, 1.0]  // BANK
    ];

    function draw() {
        const targetIdx = parseInt(slider.value);
        val.innerText = words[targetIdx];
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const count = words.length;
        const spacingX = canvas.width / (count + 1);

        const nodes = [];
        for (let i = 0; i < count; i++) {
            nodes.push({ x: spacingX * (i + 1), y: 150, text: words[i] });
        }

        // Draw connections
        for (let i = 0; i < count; i++) {
            if (i === targetIdx) continue;

            const weight = attentionMatrix[targetIdx][i];

            if (weight > 0.05) {
                ctx.beginPath();
                ctx.moveTo(nodes[targetIdx].x, nodes[targetIdx].y - 20);

                // Bezier curve to simulate the flow of attention upward
                const cpX = (nodes[targetIdx].x + nodes[i].x) / 2;
                const heightOffset = Math.abs(targetIdx - i) * 30;
                ctx.quadraticCurveTo(cpX, nodes[targetIdx].y - 50 - heightOffset, nodes[i].x, nodes[i].y - 20);

                ctx.lineWidth = weight * 8;
                ctx.strokeStyle = `rgba(0, 229, 255, ${weight * 0.8})`; // Cyan glowing connections
                ctx.stroke();

                // Draw arrow heads
                if (weight > 0.2) {
                    ctx.beginPath(); ctx.arc(nodes[i].x, nodes[i].y - 25, weight * 5, 0, Math.PI * 2);
                    ctx.fillStyle = '#00e5ff'; ctx.fill();
                    ctx.shadowBlur = 10; ctx.shadowColor = '#00e5ff'; ctx.fill(); ctx.shadowBlur = 0;
                }
            }
        }

        // Draw words
        nodes.forEach((n, i) => {
            const isFocal = (i === targetIdx);
            const weight = isFocal ? 1.0 : attentionMatrix[targetIdx][i];

            ctx.fillStyle = isFocal ? '#fff' : `rgba(255, 255, 255, ${0.3 + weight * 0.7})`;
            ctx.font = isFocal ? "bold 18px Courier New" : "16px Courier New";
            ctx.textAlign = "center";
            ctx.fillText(n.text, n.x, n.y);

            if (isFocal) {
                ctx.strokeStyle = '#ff0055'; ctx.lineWidth = 2;
                ctx.beginPath(); ctx.moveTo(n.x - 20, n.y + 10); ctx.lineTo(n.x + 20, n.y + 10); ctx.stroke();
                ctx.shadowBlur = 10; ctx.shadowColor = '#ff0055'; ctx.stroke(); ctx.shadowBlur = 0;
            }
        });
    }

    slider.max = words.length - 1;
    slider.addEventListener('input', draw);
    draw();
})();

// ==========================================
// 10. TOKENISATION (BPE VISUALISER)
// ==========================================
(function () {
    const canvas = document.getElementById('tokenCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const mergeBtn = document.getElementById('token-merge-btn');
    const resetBtn = document.getElementById('token-reset-btn');

    const width = canvas.width, height = canvas.height;

    // Corpus: multiple occurrences of common words so BPE has frequency data
    const CORPUS_TEXT = "the cat sat on the mat the cat ate the rat";
    const WORDS = CORPUS_TEXT.split(' ');

    // State
    let wordTokens = []; // Array of arrays: each word is an array of token strings
    let merges = [];      // Array of {pair: [a,b], merged: string}
    let animState = null; // {pairA, pairB, progress} for animation
    let animId = null;

    function initState() {
        wordTokens = WORDS.map(w => w.split(''));
        merges = [];
        animState = null;
        if (animId) { cancelAnimationFrame(animId); animId = null; }
    }
    initState();

    // Count adjacent pairs across all words
    function countPairs() {
        const counts = new Map();
        for (const tokens of wordTokens) {
            for (let i = 0; i < tokens.length - 1; i++) {
                const key = tokens[i] + '|' + tokens[i + 1];
                counts.set(key, (counts.get(key) || 0) + 1);
            }
        }
        return counts;
    }

    // Find the most frequent pair
    function bestPair() {
        const counts = countPairs();
        let best = null, bestCount = 0;
        for (const [key, count] of counts) {
            if (count > bestCount) { bestCount = count; best = key; }
        }
        if (!best) return null;
        const [a, b] = best.split('|');
        return { a, b, count: bestCount };
    }

    // Apply one merge across the corpus
    function applyMerge(a, b) {
        const merged = a + b;
        for (let w = 0; w < wordTokens.length; w++) {
            const tokens = wordTokens[w];
            const newTokens = [];
            let i = 0;
            while (i < tokens.length) {
                if (i < tokens.length - 1 && tokens[i] === a && tokens[i + 1] === b) {
                    newTokens.push(merged);
                    i += 2;
                } else {
                    newTokens.push(tokens[i]);
                    i++;
                }
            }
            wordTokens[w] = newTokens;
        }
        return merged;
    }

    // Get unique vocabulary
    function getVocab() {
        const vocab = new Set();
        for (const tokens of wordTokens) {
            for (const t of tokens) vocab.add(t);
        }
        return [...vocab].sort((a, b) => a.length - b.length || a.localeCompare(b));
    }

    // Assign hue based on token length (longer = more cyan/merged)
    function tokenColor(token, alpha) {
        const len = token.length;
        if (len === 1) return `rgba(180, 180, 180, ${alpha || 1})`;
        if (len === 2) return `rgba(0, 229, 255, ${alpha || 0.7})`;
        if (len === 3) return `rgba(0, 255, 136, ${alpha || 0.8})`;
        return `rgba(168, 85, 247, ${alpha || 0.9})`; // Purple for 4+ char tokens
    }

    function tokenBgColor(token) {
        const len = token.length;
        if (len === 1) return 'rgba(180, 180, 180, 0.08)';
        if (len === 2) return 'rgba(0, 229, 255, 0.12)';
        if (len === 3) return 'rgba(0, 255, 136, 0.12)';
        return 'rgba(168, 85, 247, 0.12)';
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);

        // --- Header: merge count and vocab size ---
        ctx.fillStyle = '#888';
        ctx.font = '12px Courier New';
        ctx.textAlign = 'left';
        ctx.fillText(`MERGES: ${merges.length}`, 15, 22);

        const vocab = getVocab();
        ctx.textAlign = 'right';
        ctx.fillText(`VOCAB SIZE: ${vocab.length}`, width - 15, 22);

        // --- Draw tokenised corpus as boxes ---
        const startY = 48;
        const boxH = 28;
        const boxPad = 4;
        const wordGap = 18;
        const lineH = boxH + 14;
        let cx = 15, cy = startY;

        ctx.font = 'bold 13px Courier New';
        ctx.textBaseline = 'middle';

        for (let w = 0; w < wordTokens.length; w++) {
            const tokens = wordTokens[w];

            // Calculate total word width to check for wrapping
            let wordW = 0;
            for (const t of tokens) {
                wordW += ctx.measureText(t).width + boxPad * 2 + 3;
            }
            if (cx + wordW > width - 15 && cx > 15) {
                cx = 15;
                cy += lineH;
            }

            for (let i = 0; i < tokens.length; i++) {
                const t = tokens[i];
                const tw = ctx.measureText(t).width + boxPad * 2;

                // Check if this pair is the highlighted one during animation
                let isHighlight = false;
                if (animState && w < wordTokens.length) {
                    // We highlight BEFORE the merge, so we don't need this during post-merge draw
                }

                // Background box
                ctx.fillStyle = tokenBgColor(t);
                ctx.beginPath();
                ctx.roundRect(cx, cy, tw, boxH, 4);
                ctx.fill();

                // Border
                ctx.strokeStyle = tokenColor(t, 0.5);
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.roundRect(cx, cy, tw, boxH, 4);
                ctx.stroke();

                // Text
                ctx.fillStyle = tokenColor(t, 1);
                ctx.textAlign = 'center';
                ctx.fillText(t, cx + tw / 2, cy + boxH / 2 + 1);

                cx += tw + 3;
            }

            // Word gap (space indicator)
            if (w < wordTokens.length - 1) {
                ctx.fillStyle = '#333';
                ctx.font = '10px Courier New';
                ctx.textAlign = 'center';
                ctx.fillText('·', cx + wordGap / 2 - 2, cy + boxH / 2);
                ctx.font = 'bold 13px Courier New';
                cx += wordGap;
            }
        }

        // --- Merge history (recent merges) ---
        const historyY = 200;
        ctx.fillStyle = '#555';
        ctx.font = '11px Courier New';
        ctx.textAlign = 'left';
        ctx.fillText('MERGE HISTORY:', 15, historyY);

        const visibleMerges = merges.slice(-6);
        for (let i = 0; i < visibleMerges.length; i++) {
            const m = visibleMerges[i];
            const idx = merges.length - visibleMerges.length + i;
            const y = historyY + 18 + i * 20;
            const alpha = 0.4 + 0.6 * ((i + 1) / visibleMerges.length);

            ctx.fillStyle = `rgba(136, 136, 136, ${alpha})`;
            ctx.font = '11px Courier New';
            ctx.textAlign = 'left';
            ctx.fillText(`${(idx + 1).toString().padStart(2, '0')}.`, 20, y);

            ctx.fillStyle = `rgba(255, 0, 85, ${alpha})`;
            ctx.fillText(`"${m.pair[0]}"`, 48, y);
            ctx.fillStyle = `rgba(136, 136, 136, ${alpha})`;
            ctx.fillText('+', 48 + ctx.measureText(`"${m.pair[0]}"`).width + 6, y);
            ctx.fillStyle = `rgba(255, 0, 85, ${alpha})`;
            ctx.fillText(`"${m.pair[1]}"`, 48 + ctx.measureText(`"${m.pair[0]}"  +  `).width, y);

            ctx.fillStyle = `rgba(136, 136, 136, ${alpha})`;
            const arrowX = 200;
            ctx.fillText('→', arrowX, y);

            ctx.fillStyle = `rgba(0, 229, 255, ${alpha})`;
            ctx.font = 'bold 11px Courier New';
            ctx.fillText(`"${m.merged}"`, arrowX + 18, y);

            // Show frequency
            ctx.fillStyle = `rgba(100, 100, 100, ${alpha})`;
            ctx.font = '10px Courier New';
            ctx.fillText(`(×${m.count})`, arrowX + 18 + ctx.measureText(`"${m.merged}"`).width + 8, y);
        }

        if (merges.length === 0) {
            ctx.fillStyle = '#444';
            ctx.font = '11px Courier New';
            ctx.textAlign = 'left';
            ctx.fillText('No merges yet. Click "MERGE STEP" to begin.', 20, historyY + 20);
        }

        // --- Vocabulary display ---
        const vocabY = historyY;
        ctx.fillStyle = '#555';
        ctx.font = '11px Courier New';
        ctx.textAlign = 'left';
        ctx.fillText('VOCABULARY:', 340, vocabY);

        let vx = 345, vy = vocabY + 18;
        ctx.font = '11px Courier New';
        for (let i = 0; i < vocab.length; i++) {
            const v = vocab[i];
            const vw = ctx.measureText(v).width + 12;
            if (vx + vw > width - 10) {
                vx = 345;
                vy += 22;
            }

            // Small token chip
            ctx.fillStyle = tokenBgColor(v);
            ctx.beginPath();
            ctx.roundRect(vx, vy - 10, vw, 18, 3);
            ctx.fill();

            ctx.strokeStyle = tokenColor(v, 0.3);
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.roundRect(vx, vy - 10, vw, 18, 3);
            ctx.stroke();

            ctx.fillStyle = tokenColor(v, 0.9);
            ctx.textAlign = 'center';
            ctx.fillText(v, vx + vw / 2, vy + 1);

            vx += vw + 5;
        }

        // --- Next pair preview ---
        const next = bestPair();
        if (next) {
            ctx.fillStyle = '#444';
            ctx.font = '10px Courier New';
            ctx.textAlign = 'left';
            ctx.fillText(`NEXT: "${next.a}" + "${next.b}" (×${next.count})`, 15, height - 12);
        } else {
            ctx.fillStyle = '#444';
            ctx.font = '10px Courier New';
            ctx.textAlign = 'left';
            ctx.fillText('All tokens fully merged.', 15, height - 12);
            mergeBtn.disabled = true;
            mergeBtn.innerText = 'FULLY MERGED';
        }
    }

    // Merge with animation
    function doMerge() {
        const pair = bestPair();
        if (!pair) return;

        // Flash highlight before merge
        mergeBtn.disabled = true;

        // Record merge
        const merged = applyMerge(pair.a, pair.b);
        merges.push({ pair: [pair.a, pair.b], merged, count: pair.count });

        // Animate: quick flash then settle
        let flashProg = 0;
        function flashStep() {
            flashProg += 0.08;
            if (flashProg >= 1) {
                cancelAnimationFrame(animId);
                animId = null;
                mergeBtn.disabled = false;
                draw();
                return;
            }
            // Draw with a flash overlay on the merged tokens
            draw();

            // Highlight newly merged tokens with a glow
            const startY = 48;
            const boxH = 28;
            const boxPad = 4;
            const wordGap = 18;
            const lineH = boxH + 14;
            let cx = 15, cy = startY;
            ctx.font = 'bold 13px Courier New';
            ctx.textBaseline = 'middle';

            const glowAlpha = Math.sin(flashProg * Math.PI) * 0.6;

            for (let w = 0; w < wordTokens.length; w++) {
                const tokens = wordTokens[w];
                let wordW = 0;
                for (const t of tokens) wordW += ctx.measureText(t).width + boxPad * 2 + 3;
                if (cx + wordW > width - 15 && cx > 15) { cx = 15; cy += lineH; }

                for (let i = 0; i < tokens.length; i++) {
                    const t = tokens[i];
                    const tw = ctx.measureText(t).width + boxPad * 2;

                    if (t === merged) {
                        ctx.shadowBlur = 15;
                        ctx.shadowColor = '#00e5ff';
                        ctx.strokeStyle = `rgba(0, 229, 255, ${glowAlpha})`;
                        ctx.lineWidth = 2;
                        ctx.beginPath();
                        ctx.roundRect(cx, cy, tw, boxH, 4);
                        ctx.stroke();
                        ctx.shadowBlur = 0;
                    }
                    cx += tw + 3;
                }
                if (w < wordTokens.length - 1) cx += wordGap;
            }

            animId = requestAnimationFrame(flashStep);
        }
        animId = requestAnimationFrame(flashStep);
    }

    mergeBtn.addEventListener('click', doMerge);
    resetBtn.addEventListener('click', () => {
        initState();
        mergeBtn.disabled = false;
        mergeBtn.innerText = 'MERGE STEP';
        draw();
    });

    draw();
})();

// ==========================================
// 11. WORD EMBEDDINGS (VECTOR SPACE)
// ==========================================
(function () {
    const canvas = document.getElementById('embeddingCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const analogyBtn = document.getElementById('embed-analogy-btn');
    const resetBtn = document.getElementById('embed-reset-btn');

    const width = canvas.width, height = canvas.height;

    // 2D embedding positions (pre-computed for visual clarity)
    // Arranged so semantic clusters are visible and analogy geometry works
    const words = [
        // Royalty cluster (top-right)
        { text: 'king', x: 420, y: 100, vec: [0.82, 0.91], cat: 'royalty' },
        { text: 'queen', x: 480, y: 200, vec: [0.88, 0.65], cat: 'royalty' },
        { text: 'prince', x: 380, y: 150, vec: [0.73, 0.78], cat: 'royalty' },
        { text: 'throne', x: 450, y: 50, vec: [0.85, 0.98], cat: 'royalty' },

        // Gender cluster
        { text: 'man', x: 280, y: 120, vec: [0.52, 0.87], cat: 'person' },
        { text: 'woman', x: 340, y: 220, vec: [0.58, 0.61], cat: 'person' },
        { text: 'boy', x: 240, y: 170, vec: [0.43, 0.74], cat: 'person' },
        { text: 'girl', x: 300, y: 270, vec: [0.49, 0.48], cat: 'person' },

        // Animal cluster (bottom-left)
        { text: 'cat', x: 100, y: 300, vec: [0.15, 0.35], cat: 'animal' },
        { text: 'dog', x: 140, y: 340, vec: [0.22, 0.28], cat: 'animal' },
        { text: 'kitten', x: 60, y: 350, vec: [0.08, 0.25], cat: 'animal' },
        { text: 'puppy', x: 180, y: 370, vec: [0.30, 0.21], cat: 'animal' },

        // Action cluster (left-middle)
        { text: 'run', x: 80, y: 160, vec: [0.10, 0.72], cat: 'action' },
        { text: 'walk', x: 120, y: 200, vec: [0.18, 0.60], cat: 'action' },
        { text: 'jump', x: 60, y: 120, vec: [0.06, 0.84], cat: 'action' },

        // Object cluster (bottom-right)
        { text: 'car', x: 440, y: 340, vec: [0.84, 0.22], cat: 'object' },
        { text: 'house', x: 500, y: 300, vec: [0.92, 0.32], cat: 'object' },
        { text: 'table', x: 480, y: 370, vec: [0.89, 0.18], cat: 'object' },
    ];

    const catColors = {
        royalty: { fill: 'rgba(168, 85, 247, 0.9)', bg: 'rgba(168, 85, 247, 0.1)', border: 'rgba(168, 85, 247, 0.4)' },
        person: { fill: 'rgba(0, 229, 255, 0.9)', bg: 'rgba(0, 229, 255, 0.1)', border: 'rgba(0, 229, 255, 0.4)' },
        animal: { fill: 'rgba(0, 255, 136, 0.9)', bg: 'rgba(0, 255, 136, 0.1)', border: 'rgba(0, 255, 136, 0.4)' },
        action: { fill: 'rgba(255, 159, 0, 0.9)', bg: 'rgba(255, 159, 0, 0.1)', border: 'rgba(255, 159, 0, 0.4)' },
        object: { fill: 'rgba(255, 0, 85, 0.9)', bg: 'rgba(255, 0, 85, 0.1)', border: 'rgba(255, 0, 85, 0.4)' },
    };

    let hoveredWord = null;
    let analogyState = 0; // 0=none, 1=show king-man, 2=show +woman, 3=show =queen
    let analogyAnimProg = 0;
    let analogyAnimId = null;

    function getWord(name) {
        return words.find(w => w.text === name);
    }

    function drawArrow(fromX, fromY, toX, toY, color, lineW, dashed) {
        const angle = Math.atan2(toY - fromY, toX - fromX);
        const headLen = 10;

        ctx.strokeStyle = color;
        ctx.lineWidth = lineW;
        if (dashed) ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.stroke();
        if (dashed) ctx.setLineDash([]);

        // Arrowhead
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(toX, toY);
        ctx.lineTo(toX - headLen * Math.cos(angle - 0.4), toY - headLen * Math.sin(angle - 0.4));
        ctx.lineTo(toX - headLen * Math.cos(angle + 0.4), toY - headLen * Math.sin(angle + 0.4));
        ctx.closePath();
        ctx.fill();
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);

        // Background grid
        ctx.strokeStyle = '#1a1a1a';
        ctx.lineWidth = 1;
        for (let x = 0; x < width; x += 40) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
        }
        for (let y = 0; y < height; y += 40) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
        }

        // Title
        ctx.fillStyle = '#555';
        ctx.font = '11px Courier New';
        ctx.textAlign = 'left';
        ctx.fillText('2D EMBEDDING PROJECTION', 15, 20);

        // Draw cluster regions (faint convex hull approximations)
        const clusters = {};
        for (const w of words) {
            if (!clusters[w.cat]) clusters[w.cat] = [];
            clusters[w.cat].push(w);
        }
        for (const [cat, members] of Object.entries(clusters)) {
            const cx = members.reduce((s, m) => s + m.x, 0) / members.length;
            const cy = members.reduce((s, m) => s + m.y, 0) / members.length;
            const maxDist = Math.max(...members.map(m => Math.hypot(m.x - cx, m.y - cy))) + 35;

            ctx.beginPath();
            ctx.arc(cx, cy, maxDist, 0, Math.PI * 2);
            ctx.fillStyle = catColors[cat].bg;
            ctx.fill();
            ctx.strokeStyle = catColors[cat].border;
            ctx.lineWidth = 1;
            ctx.setLineDash([4, 4]);
            ctx.stroke();
            ctx.setLineDash([]);

            // Cluster label
            ctx.fillStyle = catColors[cat].border;
            ctx.font = '9px Courier New';
            ctx.textAlign = 'center';
            ctx.fillText(cat.toUpperCase(), cx, cy - maxDist - 5);
        }

        // Draw word dots
        for (const w of words) {
            const isHovered = hoveredWord === w;
            const colors = catColors[w.cat];
            const radius = isHovered ? 7 : 5;

            // Dot
            ctx.beginPath();
            ctx.arc(w.x, w.y, radius, 0, Math.PI * 2);
            ctx.fillStyle = colors.fill;
            ctx.fill();

            if (isHovered) {
                ctx.shadowBlur = 15;
                ctx.shadowColor = colors.fill;
                ctx.fill();
                ctx.shadowBlur = 0;
            }

            // Label
            ctx.fillStyle = isHovered ? '#fff' : colors.fill;
            ctx.font = isHovered ? 'bold 13px Courier New' : '12px Courier New';
            ctx.textAlign = 'center';
            ctx.fillText(w.text, w.x, w.y - 12);
        }

        // Draw hovered word vector info
        if (hoveredWord) {
            const w = hoveredWord;
            const infoX = 15, infoY = height - 55;

            ctx.fillStyle = '#111';
            ctx.fillRect(infoX - 5, infoY - 15, 280, 50);
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 1;
            ctx.strokeRect(infoX - 5, infoY - 15, 280, 50);

            ctx.fillStyle = catColors[w.cat].fill;
            ctx.font = 'bold 12px Courier New';
            ctx.textAlign = 'left';
            ctx.fillText(`"${w.text}"`, infoX, infoY);

            ctx.fillStyle = '#888';
            ctx.font = '11px Courier New';
            ctx.fillText(`vec = [${w.vec[0].toFixed(2)}, ${w.vec[1].toFixed(2)}, ...]`, infoX, infoY + 18);
        }

        // Draw analogy vectors
        if (analogyState >= 1) {
            const king = getWord('king');
            const man = getWord('man');
            const woman = getWord('woman');
            const queen = getWord('queen');
            const prog = Math.min(1, analogyAnimProg);

            // Step 1: king - man (the "royalty" direction)
            if (analogyState >= 1) {
                const p = analogyState === 1 ? prog : 1;
                const dx = (king.x - man.x) * p;
                const dy = (king.y - man.y) * p;
                drawArrow(man.x, man.y, man.x + dx, man.y + dy, 'rgba(255, 0, 85, 0.8)', 2, false);

                // Label
                ctx.fillStyle = 'rgba(255, 0, 85, 0.8)';
                ctx.font = '10px Courier New';
                ctx.textAlign = 'center';
                ctx.fillText('king − man', (king.x + man.x) / 2, (king.y + man.y) / 2 - 10);
            }

            // Step 2: + woman (apply the direction to "woman")
            if (analogyState >= 2) {
                const p = analogyState === 2 ? prog : 1;
                const dx = (king.x - man.x) * p;
                const dy = (king.y - man.y) * p;

                // Draw the offset vector from woman
                drawArrow(woman.x, woman.y, woman.x + dx, woman.y + dy, 'rgba(0, 229, 255, 0.8)', 2, true);

                // Predicted point
                const predX = woman.x + (king.x - man.x);
                const predY = woman.y + (king.y - man.y);

                if (analogyState >= 3) {
                    // Show the result landing near queen
                    ctx.beginPath();
                    ctx.arc(predX, predY, 8, 0, Math.PI * 2);
                    ctx.strokeStyle = '#00ff88';
                    ctx.lineWidth = 2;
                    ctx.stroke();
                    ctx.shadowBlur = 15;
                    ctx.shadowColor = '#00ff88';
                    ctx.stroke();
                    ctx.shadowBlur = 0;

                    ctx.fillStyle = '#00ff88';
                    ctx.font = 'bold 12px Courier New';
                    ctx.textAlign = 'center';
                    ctx.fillText('≈ queen!', predX, predY - 15);

                    // Draw dotted line from predicted to actual queen
                    ctx.setLineDash([3, 3]);
                    ctx.strokeStyle = 'rgba(0, 255, 136, 0.4)';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(predX, predY);
                    ctx.lineTo(queen.x, queen.y);
                    ctx.stroke();
                    ctx.setLineDash([]);
                }

                // Label
                ctx.fillStyle = 'rgba(0, 229, 255, 0.8)';
                ctx.font = '10px Courier New';
                ctx.textAlign = 'center';
                ctx.fillText('+ woman', (woman.x + woman.x + dx) / 2 + 15, (woman.y + woman.y + dy) / 2);
            }

            // Equation display at top
            const eqParts = ['king', ' − ', 'man', ' + ', 'woman', ' ≈ ', 'queen'];
            const eqColors = ['#a855f7', '#888', '#00e5ff', '#888', '#00e5ff', '#888', '#00ff88'];
            const eqVisible = analogyState === 1 ? 3 : analogyState === 2 ? 5 : 7;

            let eqX = width - 250;
            ctx.font = 'bold 12px Courier New';
            ctx.textAlign = 'left';
            for (let i = 0; i < eqVisible; i++) {
                ctx.fillStyle = eqColors[i];
                ctx.fillText(eqParts[i], eqX, 20);
                eqX += ctx.measureText(eqParts[i]).width;
            }
        }
    }

    // Mouse tracking for hover
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const mx = (e.clientX - rect.left) * scaleX;
        const my = (e.clientY - rect.top) * scaleY;

        hoveredWord = null;
        for (const w of words) {
            if (Math.hypot(mx - w.x, my - w.y) < 20) {
                hoveredWord = w;
                break;
            }
        }
        canvas.style.cursor = hoveredWord ? 'pointer' : 'default';
        if (analogyState === 0) draw();
    });

    canvas.addEventListener('mouseleave', () => {
        hoveredWord = null;
        if (analogyState === 0) draw();
    });

    // Analogy animation
    function animateAnalogy() {
        analogyAnimProg += 0.04;
        if (analogyAnimProg >= 1.2) {
            analogyAnimProg = 0;
            analogyState++;
            if (analogyState > 3) {
                cancelAnimationFrame(analogyAnimId);
                analogyAnimId = null;
                analogyState = 3;
                analogyBtn.disabled = false;
                analogyBtn.innerText = 'SHOW ANALOGY';
                draw();
                return;
            }
        }
        draw();
        analogyAnimId = requestAnimationFrame(animateAnalogy);
    }

    analogyBtn.addEventListener('click', () => {
        if (analogyAnimId) return;
        analogyState = 1;
        analogyAnimProg = 0;
        analogyBtn.disabled = true;
        analogyBtn.innerText = 'COMPUTING...';
        analogyAnimId = requestAnimationFrame(animateAnalogy);
    });

    resetBtn.addEventListener('click', () => {
        if (analogyAnimId) { cancelAnimationFrame(analogyAnimId); analogyAnimId = null; }
        analogyState = 0;
        analogyAnimProg = 0;
        analogyBtn.disabled = false;
        analogyBtn.innerText = 'SHOW ANALOGY';
        draw();
    });

    draw();
})();

// ==========================================
// 12. THE MEMORIZATION PROBLEM (OVERFITTING)
// ==========================================
(function () {
    const canvas = document.getElementById('overfitCanvas');
    const ctx = canvas.getContext('2d');
    const slider = document.getElementById('overfit-slider');
    const valLabel = document.getElementById('overfit-val');

    const width = canvas.width, height = canvas.height;

    // Generate synthetic points: True wave + noise
    const points = [];
    const NUM_POINTS = 12;
    // X ranges from -1 to 1 in normalized space
    for (let i = 0; i < NUM_POINTS; i++) {
        let normX = -0.9 + (1.8 * i / (NUM_POINTS - 1));
        let trueY = Math.sin(normX * Math.PI * 1.5);
        let noiseY = (Math.random() - 0.5) * 0.8;
        points.push({ x: normX, y: trueY + noiseY });
    }

    function mapX(nx) { return width / 2 + nx * (width / 2.2); }
    function mapY(ny) { return height / 2 - ny * (height / 3); }

    // Gauss-Jordan Elimination to solve A * w = b
    function solve(A, b) {
        const n = A.length;
        let M = [];
        for (let i = 0; i < n; i++) M.push([...A[i], b[i]]);

        for (let i = 0; i < n; i++) {
            let maxRow = i;
            for (let k = i + 1; k < n; k++) {
                if (Math.abs(M[k][i]) > Math.abs(M[maxRow][i])) maxRow = k;
            }
            let temp = M[i]; M[i] = M[maxRow]; M[maxRow] = temp;

            let div = M[i][i];
            if (Math.abs(div) < 1e-10) continue;
            for (let j = i; j <= n; j++) M[i][j] /= div;

            for (let j = 0; j < n; j++) {
                if (i !== j) {
                    let factor = M[j][i];
                    for (let k = i; k <= n; k++) M[j][k] -= factor * M[i][k];
                }
            }
        }
        const res = [];
        for (let i = 0; i < n; i++) res.push(M[i][n]);
        return res;
    }

    // Polynomial Regression
    function getPolynomialCoeffs(degree) {
        const D = degree + 1;
        const A = Array(D).fill(0).map(() => Array(D).fill(0));
        const b = Array(D).fill(0);

        for (let i = 0; i < points.length; i++) {
            let px = points[i].x, py = points[i].y;
            let pxPowers = Array(D * 2).fill(1);
            for (let p = 1; p < D * 2; p++) pxPowers[p] = pxPowers[p - 1] * px;

            for (let r = 0; r < D; r++) {
                for (let c = 0; c < D; c++) {
                    A[r][c] += pxPowers[r + c];
                }
                b[r] += py * pxPowers[r];
            }
        }
        // Add tiny L2 Regularization (ridge) to prevent total singular matrix crash on high degree
        for (let r = 0; r < D; r++) A[r][r] += 1e-6;

        return solve(A, b);
    }

    function evalPoly(x, coeffs) {
        let y = 0, xp = 1;
        for (let i = 0; i < coeffs.length; i++) { y += coeffs[i] * xp; xp *= x; }
        return y;
    }

    function draw() {
        const degree = parseInt(slider.value);
        if (degree <= 2) valLabel.innerText = "UNDERFITTING (Too Simple)";
        else if (degree >= 3 && degree <= 5) valLabel.innerText = "OPTIMAL (Just Right)";
        else valLabel.innerText = "OVERFITTING (Memorizing Noise)";

        ctx.clearRect(0, 0, width, height);

        // Draw Grid/Axes
        ctx.strokeStyle = '#222'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(0, height / 2); ctx.lineTo(width, height / 2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(width / 2, 0); ctx.lineTo(width / 2, height); ctx.stroke();

        // Get weights
        const coeffs = getPolynomialCoeffs(degree);

        // Draw Curve
        ctx.strokeStyle = '#00e5ff'; ctx.lineWidth = 3;
        ctx.beginPath();
        for (let px = 0; px <= width; px += 2) {
            let nx = (px - width / 2) / (width / 2.2);
            let ny = evalPoly(nx, coeffs);
            let py = mapY(ny);
            if (px === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        // Glowing effect
        ctx.shadowBlur = 10; ctx.shadowColor = '#00e5ff'; ctx.stroke(); ctx.shadowBlur = 0;

        // Draw true underlying curve faintly
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'; ctx.lineWidth = 2; ctx.setLineDash([5, 5]);
        ctx.beginPath();
        for (let px = 0; px <= width; px += 4) {
            let nx = (px - width / 2) / (width / 2.2);
            let py = mapY(Math.sin(nx * Math.PI * 1.5));
            if (px === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke(); ctx.setLineDash([]);

        // Draw Data Points
        points.forEach(pt => {
            let px = mapX(pt.x), py = mapY(pt.y);
            ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2);
            ctx.fillStyle = '#ff0055'; ctx.fill();
            ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5; ctx.stroke();
        });
    }

    slider.addEventListener('input', draw);
    draw();
})();

// ==========================================
// 11. SELF-SUPERVISED LEARNING (MASKED PREDICTION)
// ==========================================
(function () {
    const canvas = document.getElementById('sslCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const maskBtn = document.getElementById('ssl-mask-btn');
    const resetBtn = document.getElementById('ssl-reset-btn');

    const width = canvas.width, height = canvas.height;

    const sentences = [
        {
            words: ["The", "cat", "sat", "on", "the", "mat"],
            candidates: {
                0: [{ word: "The", score: 0.85 }, { word: "A", score: 0.60 }, { word: "One", score: 0.20 }, { word: "Her", score: 0.15 }],
                1: [{ word: "cat", score: 0.80 }, { word: "dog", score: 0.55 }, { word: "bird", score: 0.25 }, { word: "fish", score: 0.10 }],
                2: [{ word: "sat", score: 0.75 }, { word: "lay", score: 0.50 }, { word: "slept", score: 0.35 }, { word: "hid", score: 0.10 }],
                3: [{ word: "on", score: 0.90 }, { word: "by", score: 0.30 }, { word: "near", score: 0.20 }, { word: "under", score: 0.15 }],
                4: [{ word: "the", score: 0.88 }, { word: "a", score: 0.45 }, { word: "his", score: 0.18 }, { word: "my", score: 0.12 }],
                5: [{ word: "mat", score: 0.65 }, { word: "floor", score: 0.50 }, { word: "bed", score: 0.35 }, { word: "rug", score: 0.30 }]
            }
        }
    ];

    const sent = sentences[0];
    let maskedIndex = -1;
    let animProg = 0;
    let animId = null;

    function draw() {
        ctx.clearRect(0, 0, width, height);

        // Draw sentence
        const wordSpacing = width / (sent.words.length + 1);
        const sentY = 60;

        ctx.textAlign = 'center';
        for (let i = 0; i < sent.words.length; i++) {
            const x = wordSpacing * (i + 1);

            if (i === maskedIndex) {
                // Draw masked placeholder
                const boxW = 70, boxH = 30;
                ctx.fillStyle = '#ff005533';
                ctx.fillRect(x - boxW / 2, sentY - boxH / 2 - 5, boxW, boxH);
                ctx.strokeStyle = '#ff0055';
                ctx.lineWidth = 2;
                ctx.strokeRect(x - boxW / 2, sentY - boxH / 2 - 5, boxW, boxH);
                ctx.shadowBlur = 8; ctx.shadowColor = '#ff0055';
                ctx.strokeRect(x - boxW / 2, sentY - boxH / 2 - 5, boxW, boxH);
                ctx.shadowBlur = 0;

                ctx.fillStyle = '#ff0055';
                ctx.font = 'bold 16px Courier New';
                ctx.fillText('[???]', x, sentY);
            } else {
                ctx.fillStyle = '#fff';
                ctx.font = '16px Courier New';
                ctx.fillText(sent.words[i], x, sentY);
            }
        }

        // Draw label
        ctx.fillStyle = '#555';
        ctx.font = '11px Courier New';
        ctx.textAlign = 'center';
        if (maskedIndex === -1) {
            ctx.fillText('← Click "MASK NEXT WORD" to hide a word and see the model predict it →', width / 2, sentY + 30);
        }

        // Draw prediction bars if a word is masked
        if (maskedIndex >= 0 && sent.candidates[maskedIndex]) {
            const cands = sent.candidates[maskedIndex];
            const barAreaY = 110;
            const barHeight = 28;
            const barGap = 10;
            const maxBarW = 280;
            const labelX = 130;

            ctx.fillStyle = '#888';
            ctx.font = '12px Courier New';
            ctx.textAlign = 'left';
            ctx.fillText('MODEL PREDICTIONS:', 40, barAreaY - 10);

            ctx.textAlign = 'left';
            ctx.fillText('TARGET (from input):', width - 200, barAreaY - 10);

            // Show the answer
            ctx.fillStyle = '#00ff88';
            ctx.font = 'bold 14px Courier New';
            ctx.fillText('"' + sent.words[maskedIndex] + '"', width - 200, barAreaY + 10);

            for (let i = 0; i < cands.length; i++) {
                const y = barAreaY + i * (barHeight + barGap);
                const animatedScore = cands[i].score * Math.min(1, animProg);
                const barW = animatedScore * maxBarW;
                const isCorrect = (i === 0); // First candidate is always the correct one

                // Label
                ctx.fillStyle = isCorrect ? '#00ff88' : '#888';
                ctx.font = isCorrect ? 'bold 14px Courier New' : '14px Courier New';
                ctx.textAlign = 'right';
                ctx.fillText(cands[i].word, labelX - 10, y + barHeight / 2 + 5);

                // Bar background
                ctx.fillStyle = '#1a1a1a';
                ctx.fillRect(labelX, y, maxBarW, barHeight);

                // Bar fill
                if (isCorrect) {
                    let grad = ctx.createLinearGradient(labelX, 0, labelX + barW, 0);
                    grad.addColorStop(0, '#00ff8855');
                    grad.addColorStop(1, '#00ff88');
                    ctx.fillStyle = grad;
                } else {
                    ctx.fillStyle = `rgba(0, 229, 255, ${0.3 + animatedScore * 0.5})`;
                }
                ctx.fillRect(labelX, y, barW, barHeight);

                // Glow on correct
                if (isCorrect && animProg > 0.8) {
                    ctx.shadowBlur = 12;
                    ctx.shadowColor = '#00ff88';
                    ctx.fillRect(labelX, y, barW, barHeight);
                    ctx.shadowBlur = 0;
                }

                // Score text
                ctx.fillStyle = '#fff';
                ctx.font = '12px Courier New';
                ctx.textAlign = 'left';
                ctx.fillText((animatedScore * 100).toFixed(0) + '%', labelX + barW + 8, y + barHeight / 2 + 4);
            }

            // Arrow from "TARGET" label to the sentence
            if (animProg > 0.9) {
                ctx.strokeStyle = '#00ff8866';
                ctx.lineWidth = 1;
                ctx.setLineDash([4, 4]);
                ctx.beginPath();
                const targetX = wordSpacing * (maskedIndex + 1);
                ctx.moveTo(targetX, sentY + 10);
                ctx.lineTo(targetX, barAreaY - 20);
                ctx.stroke();
                ctx.setLineDash([]);

                ctx.fillStyle = '#00ff8888';
                ctx.font = '10px Courier New';
                ctx.textAlign = 'center';
                ctx.fillText('self-supervised', targetX, sentY + 22);
                ctx.fillText('(no human label)', targetX, sentY + 34);
            }
        }
    }

    function animateBars() {
        animProg += 0.03;
        if (animProg >= 1.2) {
            animProg = 1.2;
            cancelAnimationFrame(animId);
            animId = null;
            draw();
            return;
        }
        draw();
        animId = requestAnimationFrame(animateBars);
    }

    maskBtn.addEventListener('click', () => {
        if (animId) { cancelAnimationFrame(animId); animId = null; }
        maskedIndex = (maskedIndex + 1) % sent.words.length;
        animProg = 0;
        animateBars();
    });

    resetBtn.addEventListener('click', () => {
        if (animId) { cancelAnimationFrame(animId); animId = null; }
        maskedIndex = -1;
        animProg = 0;
        draw();
    });

    draw();
})();

// ==========================================
// 12. REINFORCEMENT LEARNING (Q-LEARNING GRIDWORLD)
// ==========================================
(function () {
    const canvas = document.getElementById('rlCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const epsSlider = document.getElementById('rl-eps-slider');
    const epsVal = document.getElementById('rl-eps-val');
    const stepBtn = document.getElementById('rl-step-btn');
    const trainBtn = document.getElementById('rl-train-btn');
    const resetBtn = document.getElementById('rl-reset-btn');

    const ROWS = 6, COLS = 8;
    const CELL = Math.min(Math.floor((canvas.width - 40) / COLS), Math.floor((canvas.height - 60) / ROWS));
    const offsetX = Math.floor((canvas.width - COLS * CELL) / 2);
    const offsetY = 30;

    // Actions: 0=up, 1=right, 2=down, 3=left
    const DR = [-1, 0, 1, 0], DC = [0, 1, 0, -1];
    const ACTION_SYMS = ['↑', '→', '↓', '←'];

    // Grid: 0=open, 1=wall, 2=goal
    const grid = [];
    const GOAL = { r: 1, c: COLS - 2 };
    const START = { r: ROWS - 2, c: 1 };

    function initGrid() {
        for (let r = 0; r < ROWS; r++) {
            grid[r] = [];
            for (let c = 0; c < COLS; c++) {
                grid[r][c] = 0;
            }
        }
        // Walls
        const walls = [
            [1, 3], [2, 3], [3, 3],
            [3, 5], [2, 5], [1, 5],
            [0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7],
            [5, 0], [5, 1], [5, 2], [5, 3], [5, 4], [5, 5], [5, 6], [5, 7],
            [1, 0], [2, 0], [3, 0], [4, 0],
            [1, 7], [2, 7], [3, 7], [4, 7]
        ];
        walls.forEach(([r, c]) => { grid[r][c] = 1; });
        grid[GOAL.r][GOAL.c] = 2;
    }
    initGrid();

    // Q-Table: Q[r][c][a] = expected reward
    let Q = [];
    let episodeCount = 0;
    let lastPath = [];
    const alpha = 0.1, gamma = 0.9;

    function initQ() {
        Q = [];
        for (let r = 0; r < ROWS; r++) {
            Q[r] = [];
            for (let c = 0; c < COLS; c++) {
                Q[r][c] = [0, 0, 0, 0];
            }
        }
        episodeCount = 0;
        lastPath = [];
    }
    initQ();

    function getEps() { return parseInt(epsSlider.value) / 100; }

    function chooseAction(r, c, eps) {
        if (Math.random() < eps) return Math.floor(Math.random() * 4);
        let best = 0, bestVal = Q[r][c][0];
        for (let a = 1; a < 4; a++) {
            if (Q[r][c][a] > bestVal) { bestVal = Q[r][c][a]; best = a; }
        }
        return best;
    }

    function runEpisode(eps) {
        let r = START.r, c = START.c;
        let path = [{ r, c }];
        let steps = 0;
        const maxSteps = 200;

        while (steps < maxSteps) {
            const a = chooseAction(r, c, eps);
            let nr = r + DR[a], nc = c + DC[a];

            // Clamp to bounds + wall check
            if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS || grid[nr][nc] === 1) {
                nr = r; nc = c;
            }

            let reward = -0.1; // Small step penalty
            let done = false;
            if (grid[nr][nc] === 2) { reward = 10; done = true; }
            if (nr === r && nc === c) { reward = -0.5; } // wall bump penalty

            // Q-update
            let maxNextQ = 0;
            if (!done) {
                maxNextQ = Math.max(...Q[nr][nc]);
            }
            Q[r][c][a] += alpha * (reward + gamma * maxNextQ - Q[r][c][a]);

            r = nr; c = nc;
            path.push({ r, c });
            steps++;
            if (done) break;
        }

        episodeCount++;
        return path;
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Title
        ctx.fillStyle = '#888';
        ctx.font = '12px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText(`EPISODE: ${episodeCount}`, canvas.width / 2, 18);

        // Draw grid
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                const x = offsetX + c * CELL;
                const y = offsetY + r * CELL;

                // Cell fill
                if (grid[r][c] === 1) {
                    ctx.fillStyle = '#1a1a1a';
                } else if (grid[r][c] === 2) {
                    ctx.fillStyle = '#004d00';
                } else {
                    // Heatmap based on best Q-value
                    const maxQ = Math.max(...Q[r][c]);
                    const intensity = Math.min(1, Math.max(0, maxQ / 10));
                    ctx.fillStyle = `rgba(0, 229, 255, ${intensity * 0.25})`;
                }
                ctx.fillRect(x, y, CELL, CELL);

                // Cell border
                ctx.strokeStyle = '#333';
                ctx.lineWidth = 1;
                ctx.strokeRect(x, y, CELL, CELL);

                // Draw Q-value arrows for open cells
                if (grid[r][c] === 0 && episodeCount > 0) {
                    const bestA = Q[r][c].indexOf(Math.max(...Q[r][c]));
                    const maxQ = Math.max(...Q[r][c]);
                    if (maxQ > 0.01) {
                        ctx.fillStyle = `rgba(0, 229, 255, ${Math.min(1, maxQ / 5)})`;
                        ctx.font = `${Math.floor(CELL * 0.5)}px sans-serif`;
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillText(ACTION_SYMS[bestA], x + CELL / 2, y + CELL / 2);
                    }
                }

                // Goal marker
                if (grid[r][c] === 2) {
                    ctx.fillStyle = '#00ff88';
                    ctx.font = `bold ${Math.floor(CELL * 0.5)}px Courier New`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('★', x + CELL / 2, y + CELL / 2);
                    ctx.shadowBlur = 10; ctx.shadowColor = '#00ff88';
                    ctx.fillText('★', x + CELL / 2, y + CELL / 2);
                    ctx.shadowBlur = 0;
                }
            }
        }

        // Draw last path
        if (lastPath.length > 1) {
            ctx.strokeStyle = 'rgba(255, 0, 85, 0.5)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(
                offsetX + lastPath[0].c * CELL + CELL / 2,
                offsetY + lastPath[0].r * CELL + CELL / 2
            );
            for (let i = 1; i < lastPath.length; i++) {
                ctx.lineTo(
                    offsetX + lastPath[i].c * CELL + CELL / 2,
                    offsetY + lastPath[i].r * CELL + CELL / 2
                );
            }
            ctx.stroke();
        }

        // Draw agent at start
        const agentPos = lastPath.length > 0 ? lastPath[lastPath.length - 1] : START;
        const ax = offsetX + agentPos.c * CELL + CELL / 2;
        const ay = offsetY + agentPos.r * CELL + CELL / 2;
        ctx.beginPath();
        ctx.arc(ax, ay, CELL * 0.25, 0, Math.PI * 2);
        ctx.fillStyle = '#00e5ff';
        ctx.fill();
        ctx.shadowBlur = 10; ctx.shadowColor = '#00e5ff';
        ctx.fill();
        ctx.shadowBlur = 0;

        // Start label
        const sx = offsetX + START.c * CELL + CELL / 2;
        const sy = offsetY + START.r * CELL + CELL - 4;
        ctx.fillStyle = '#ff0055';
        ctx.font = '9px Courier New';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText('START', sx, sy);

        // Info panel on the right
        const infoX = offsetX + COLS * CELL + 15;
        ctx.fillStyle = '#666';
        ctx.font = '11px Courier New';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText('Q-LEARNING', infoX, offsetY);
        ctx.fillStyle = '#888';
        ctx.font = '10px Courier New';
        ctx.fillText(`Episodes: ${episodeCount}`, infoX, offsetY + 18);
        ctx.fillText(`ε: ${getEps().toFixed(2)}`, infoX, offsetY + 33);
        ctx.fillText(`Path len: ${lastPath.length > 0 ? lastPath.length - 1 : '—'}`, infoX, offsetY + 48);

        // Legend
        ctx.fillStyle = '#555';
        ctx.fillText('LEGEND:', infoX, offsetY + 75);
        ctx.fillStyle = '#00e5ff'; ctx.fillText('● Agent', infoX, offsetY + 92);
        ctx.fillStyle = '#00ff88'; ctx.fillText('★ Goal', infoX, offsetY + 107);
        ctx.fillStyle = '#444'; ctx.fillText('■ Wall', infoX, offsetY + 122);
        ctx.fillStyle = '#ff0055'; ctx.fillText('— Path', infoX, offsetY + 137);
    }

    // Animate a single episode step by step
    function animateEpisode(path, idx) {
        if (idx >= path.length) { draw(); stepBtn.disabled = false; trainBtn.disabled = false; return; }
        lastPath = path.slice(0, idx + 1);
        draw();
        setTimeout(() => animateEpisode(path, idx + 1), Math.max(10, 80 - episodeCount));
    }

    stepBtn.addEventListener('click', () => {
        stepBtn.disabled = true; trainBtn.disabled = true;
        const path = runEpisode(getEps());
        animateEpisode(path, 0);
    });

    trainBtn.addEventListener('click', () => {
        stepBtn.disabled = true; trainBtn.disabled = true;
        const eps = getEps();
        for (let i = 0; i < 100; i++) {
            lastPath = runEpisode(eps);
        }
        draw();
        stepBtn.disabled = false; trainBtn.disabled = false;
    });

    resetBtn.addEventListener('click', () => {
        initQ();
        lastPath = [];
        draw();
    });

    epsSlider.addEventListener('input', () => {
        epsVal.innerText = getEps().toFixed(2);
    });

    draw();
})();

// ==========================================
// 20. GENETIC ALGORITHMS (RACE CARS)
// ==========================================
(function () {
    const canvas = document.getElementById('gaCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const mutSlider = document.getElementById('ga-mut-slider');
    const mutVal = document.getElementById('ga-mut-val');
    const speedBtn = document.getElementById('ga-speed-btn');
    const resetBtn = document.getElementById('ga-reset-btn');

    const popSize = 100;
    const lifespan = 300; // frames per generation

    // Track definition (centerline points)
    const trackPoints = [
        { x: 50, y: 280 },
        { x: 180, y: 280 },
        { x: 250, y: 180 },
        { x: 200, y: 80 },
        { x: 350, y: 50 },
        { x: 500, y: 150 },
        { x: 480, y: 280 },
        { x: 560, y: 280 }
    ];
    const trackWidth = 50;

    let population = [];
    let frame = 0;
    let generation = 1;
    let speedMult = 1;
    let isRunning = true;
    let animationId;
    let mutationRate = 0.05;

    // Helper: Point to line segment distance and projection
    function distToSegment(p, v, w) {
        const l2 = Math.pow(v.x - w.x, 2) + Math.pow(v.y - w.y, 2);
        if (l2 === 0) return { d: Math.sqrt(Math.pow(p.x - v.x, 2) + Math.pow(p.y - v.y, 2)), t: 0 };
        let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
        t = Math.max(0, Math.min(1, t));
        const proj = { x: v.x + t * (w.x - v.x), y: v.y + t * (w.y - v.y) };
        const d = Math.sqrt(Math.pow(p.x - proj.x, 2) + Math.pow(p.y - proj.y, 2));
        return { d: d, t: t };
    }

    // A single DNA sequence (array of steering angles)
    function DNA(genes) {
        if (genes) {
            this.genes = genes;
        } else {
            this.genes = [];
            for (let i = 0; i < lifespan; i++) {
                // Steering force: -1 (left) to 1 (right)
                this.genes.push((Math.random() * 2 - 1) * 0.15);
            }
        }

        this.crossover = function (partner) {
            let newGenes = [];
            let mid = Math.floor(Math.random() * this.genes.length);
            for (let i = 0; i < this.genes.length; i++) {
                if (i > mid) newGenes[i] = this.genes[i];
                else newGenes[i] = partner.genes[i];
            }
            return new DNA(newGenes);
        };

        this.mutate = function (rate) {
            for (let i = 0; i < this.genes.length; i++) {
                if (Math.random() < rate) {
                    // Small random change rather than full replacement often works better for driving
                    this.genes[i] += (Math.random() * 2 - 1) * 0.1;
                    this.genes[i] = Math.max(-0.2, Math.min(0.2, this.genes[i]));
                }
            }
        };
    }

    // A single Race Car
    function Car(dna) {
        this.pos = { x: trackPoints[0].x, y: trackPoints[0].y };
        this.heading = 0; // Pointing right
        this.speed = 3.5;
        this.dna = dna || new DNA();
        this.fitness = 0;
        this.isDead = false;
        this.hasCompleted = false;
        this.currentSegment = 0;

        this.update = function () {
            if (this.isDead || this.hasCompleted) return;

            // Apply steering from DNA
            const steer = this.dna.genes[frame] || 0;
            this.heading += steer;

            // Move forward
            this.pos.x += Math.cos(this.heading) * this.speed;
            this.pos.y += Math.sin(this.heading) * this.speed;

            // Check collision and progress
            let minDistToTrack = Infinity;
            let bestSegment = this.currentSegment;
            let bestT = 0;

            // Optimization: Only check current and next segment
            for (let i = this.currentSegment; i <= Math.min(this.currentSegment + 1, trackPoints.length - 2); i++) {
                const v = trackPoints[i];
                const w = trackPoints[i + 1];
                const res = distToSegment(this.pos, v, w);

                if (res.d < minDistToTrack) {
                    minDistToTrack = res.d;
                    bestSegment = i;
                    bestT = res.t;
                }
            }

            // Update progress
            if (bestSegment >= this.currentSegment) {
                this.currentSegment = bestSegment;
            }

            // Did it hit the grass/wall?
            if (minDistToTrack > trackWidth / 2) {
                this.isDead = true;
            }

            // Did it finish?
            if (this.currentSegment === trackPoints.length - 2 && bestT > 0.95) {
                this.hasCompleted = true;
            }

            // Calculate real-time fitness mapping
            this.fitness = this.currentSegment * 100 + bestT * 100;
        };

        this.draw = function (ctx) {
            ctx.save();
            ctx.translate(this.pos.x, this.pos.y);
            ctx.rotate(this.heading);

            // Draw car body
            ctx.fillStyle = this.hasCompleted ? '#00ff88' : (this.isDead ? '#ff0055' : 'rgba(0, 229, 255, 0.6)');
            ctx.fillRect(-6, -3, 12, 6);

            ctx.restore();

            if (this.hasCompleted) {
                ctx.beginPath();
                ctx.arc(this.pos.x, this.pos.y, 8, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(0, 255, 136, 0.4)';
                ctx.fill();
            }
        };
    }

    function initPop() {
        population = [];
        for (let i = 0; i < popSize; i++) {
            population.push(new Car());
        }
        frame = 0;
        generation = 1;
    }

    function evaluateAndNextGen() {
        let maxFit = 0.001; // Avoid divide by zero
        // Calc fitness for all
        for (let i = 0; i < popSize; i++) {
            // Reward finishing, heavily penalty dying early
            if (population[i].hasCompleted) {
                population[i].fitness *= 2;
            } else if (population[i].isDead) {
                population[i].fitness *= 0.8;
            }

            population[i].fitness = Math.pow(population[i].fitness, 2); // Exponential selection

            if (population[i].fitness > maxFit) maxFit = population[i].fitness;
        }

        // Normalize fitness
        for (let i = 0; i < popSize; i++) {
            population[i].fitness /= maxFit;
        }

        // Mating pool
        let pool = [];
        for (let i = 0; i < popSize; i++) {
            let n = Math.floor(population[i].fitness * 100);
            for (let j = 0; j < n; j++) {
                pool.push(population[i]);
            }
        }

        // Fallback if pool is empty
        if (pool.length === 0) pool = population;

        // Next generation
        let newPop = [];
        for (let i = 0; i < popSize; i++) {
            let pA = pool[Math.floor(Math.random() * pool.length)].dna;
            let pB = pool[Math.floor(Math.random() * pool.length)].dna;
            let childDNA = pA.crossover(pB);
            childDNA.mutate(mutationRate);
            newPop.push(new Car(childDNA));
        }

        population = newPop;
        frame = 0;
        generation++;
    }

    function drawSystem() {
        ctx.fillStyle = '#0f0f0f';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw Track Outline (Wall)
        ctx.beginPath();
        ctx.moveTo(trackPoints[0].x, trackPoints[0].y);
        for (let i = 1; i < trackPoints.length; i++) {
            ctx.lineTo(trackPoints[i].x, trackPoints[i].y);
        }
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.lineWidth = trackWidth + 4;
        ctx.strokeStyle = '#333';
        ctx.stroke();

        // Draw Track Surface
        ctx.lineWidth = trackWidth;
        ctx.strokeStyle = '#1a1a1a';
        ctx.stroke();

        // Draw Start/Finish lines
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#00e5ff'; // Start line
        ctx.beginPath();
        ctx.moveTo(trackPoints[0].x, trackPoints[0].y - trackWidth / 2);
        ctx.lineTo(trackPoints[0].x, trackPoints[0].y + trackWidth / 2);
        ctx.stroke();

        ctx.strokeStyle = '#00ff88'; // Finish line
        ctx.beginPath();
        ctx.moveTo(trackPoints[trackPoints.length - 1].x, trackPoints[trackPoints.length - 1].y - trackWidth / 2);
        ctx.lineTo(trackPoints[trackPoints.length - 1].x, trackPoints[trackPoints.length - 1].y + trackWidth / 2);
        ctx.stroke();

        // Draw UI
        ctx.fillStyle = '#aaa';
        ctx.font = '14px Courier New';
        ctx.fillText(`GEN: ${generation}`, 10, 20);
        ctx.fillText(`FRAME: ${frame}/${lifespan}`, 10, 40);

        // Update and draw agents
        // Draw dead ones first so they stay in background
        for (let i = 0; i < popSize; i++) {
            if (population[i].isDead) population[i].draw(ctx);
        }
        for (let i = 0; i < popSize; i++) {
            population[i].update();
            if (!population[i].isDead) population[i].draw(ctx);
        }
    }

    function loop() {
        if (!isRunning) return;

        // Handle speed multiplier
        for (let s = 0; s < speedMult; s++) {
            drawSystem();
            frame++;

            // Check if all are dead/finished early
            let allDone = true;
            for (let i = 0; i < popSize; i++) {
                if (!population[i].isDead && !population[i].hasCompleted) {
                    allDone = false; break;
                }
            }

            if (frame >= lifespan || allDone) {
                evaluateAndNextGen();
            }
        }

        animationId = requestAnimationFrame(loop);
    }

    // Controls
    if (mutSlider) {
        mutSlider.addEventListener('input', (e) => {
            const valStr = parseFloat(e.target.value).toFixed(1);
            if (mutVal) mutVal.innerText = valStr + "%";
            mutationRate = parseFloat(e.target.value) / 100;
        });
    }

    if (speedBtn) {
        speedBtn.addEventListener('click', () => {
            if (speedMult === 1) {
                speedMult = 5;
                speedBtn.innerText = "SPEED: 5X";
                speedBtn.style.color = '#00e5ff';
                speedBtn.style.borderColor = '#00e5ff';
            } else {
                speedMult = 1;
                speedBtn.innerText = "SPEED: 1X";
                speedBtn.style.color = '#fff';
                speedBtn.style.borderColor = 'transparent';
            }
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            initPop();
        });
    }

    // Start
    initPop();
    loop();
})();

// ==========================================
// 21. DEEP Q-NETWORK — PONG
// ==========================================
(function () {
    const canvas = document.getElementById('dqnCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const trainBtn = document.getElementById('dqn-train-btn');
    const showBtn = document.getElementById('dqn-show-btn');
    const resetBtn = document.getElementById('dqn-reset-btn');

    const W = canvas.width, H = canvas.height;

    // ---- Pong constants ----
    const GAME_X = 280, GAME_Y = 10;
    const GW = W - GAME_X - 15, GH = H - 20;
    const PADDLE_W = 8, PADDLE_H = 50;
    const BALL_R = 5;
    const PADDLE_SPEED = 4;
    const BALL_SPEED = 3;

    // ---- Neural Network ----
    const INPUT = 5, HIDDEN = 16, OUTPUT = 3; // up, stay, down
    let W1, b1, W2, b2;
    let totalRallies = 0, totalHits = 0;
    let replayBuffer = [];
    const BUFFER_MAX = 3000, BATCH = 32;
    const lr = 0.01, gamma = 0.95;

    function randW(fi, fo) {
        const w = [], scale = Math.sqrt(2 / fi);
        for (let i = 0; i < fi; i++) { w[i] = []; for (let j = 0; j < fo; j++) w[i][j] = (Math.random() - 0.5) * scale; }
        return w;
    }
    function zeros(n) { return new Array(n).fill(0); }

    function initNetwork() {
        W1 = randW(INPUT, HIDDEN); b1 = zeros(HIDDEN);
        W2 = randW(HIDDEN, OUTPUT); b2 = zeros(OUTPUT);
        totalRallies = 0; totalHits = 0;
        replayBuffer = [];
    }
    initNetwork();

    function relu(x) { return Math.max(0, x); }

    function forward(state) {
        const inp = [state[0] / GW, state[1] / GH, state[2] / BALL_SPEED, state[3] / BALL_SPEED, state[4] / GH];
        const h = [];
        for (let j = 0; j < HIDDEN; j++) { let s = b1[j]; for (let i = 0; i < INPUT; i++) s += inp[i] * W1[i][j]; h[j] = relu(s); }
        const out = [];
        for (let j = 0; j < OUTPUT; j++) { let s = b2[j]; for (let i = 0; i < HIDDEN; i++) s += h[i] * W2[i][j]; out[j] = s; }
        return { inp, h, out };
    }

    function bestAction(state) {
        const { out } = forward(state);
        let b = 0;
        for (let a = 1; a < OUTPUT; a++) if (out[a] > out[b]) b = a;
        return b;
    }

    function chooseAction(state, eps) {
        return Math.random() < eps ? Math.floor(Math.random() * OUTPUT) : bestAction(state);
    }

    function trainBatch() {
        if (replayBuffer.length < BATCH) return;
        const batch = [];
        for (let i = 0; i < BATCH; i++) batch.push(replayBuffer[Math.floor(Math.random() * replayBuffer.length)]);

        for (const [s, a, r, ns, done] of batch) {
            const fwd = forward(s);
            let target = r;
            if (!done) { const nf = forward(ns); target += gamma * Math.max(...nf.out); }
            const err = target - fwd.out[a];

            // Compute hidden gradients BEFORE modifying W2
            const dh = zeros(HIDDEN);
            for (let i = 0; i < HIDDEN; i++) {
                dh[i] = err * W2[i][a] * (fwd.h[i] > 0 ? 1 : 0);
            }

            // Now update W2 and b2
            for (let i = 0; i < HIDDEN; i++) {
                W2[i][a] += lr * err * fwd.h[i];
            }
            b2[a] += lr * err;

            // Update W1 and b1
            for (let i = 0; i < INPUT; i++) {
                for (let j = 0; j < HIDDEN; j++) W1[i][j] += lr * dh[j] * fwd.inp[i];
            }
            for (let j = 0; j < HIDDEN; j++) b1[j] += lr * dh[j];
        }
    }

    // ---- Pong simulation ----
    function newBall() {
        const angle = (Math.random() - 0.5) * Math.PI * 0.5;
        return { x: GW * 0.2, y: Math.random() * GH * 0.6 + GH * 0.2, vx: BALL_SPEED, vy: BALL_SPEED * Math.sin(angle) };
    }

    function simRally(eps) {
        let ball = newBall();
        let paddleY = GH / 2 - PADDLE_H / 2;
        let hit = false;

        for (let step = 0; step < 300; step++) {
            const paddleCenter = paddleY + PADDLE_H / 2;
            const state = [ball.x, ball.y, ball.vx, ball.vy, paddleCenter];
            const action = chooseAction(state, eps);

            // Move paddle
            if (action === 0) paddleY = Math.max(0, paddleY - PADDLE_SPEED);
            else if (action === 2) paddleY = Math.min(GH - PADDLE_H, paddleY + PADDLE_SPEED);

            // Move ball
            ball.x += ball.vx; ball.y += ball.vy;

            // Top/bottom bounce
            if (ball.y <= BALL_R) { ball.y = BALL_R; ball.vy = Math.abs(ball.vy); }
            if (ball.y >= GH - BALL_R) { ball.y = GH - BALL_R; ball.vy = -Math.abs(ball.vy); }

            // Left wall bounce
            if (ball.x <= BALL_R) { ball.x = BALL_R; ball.vx = Math.abs(ball.vx); }

            // Reward shaping: small reward for being close to the ball vertically
            const newPaddleCenter = paddleY + PADDLE_H / 2;
            const distBefore = Math.abs(ball.y - (state[4]));
            const distAfter = Math.abs(ball.y - newPaddleCenter);
            let reward = (distBefore - distAfter) * 0.01; // small shaping reward
            let done = false;

            // Paddle collision (right side)
            const paddleX = GW - PADDLE_W - 5;
            if (ball.x >= paddleX - BALL_R && ball.vx > 0) {
                if (ball.y >= paddleY && ball.y <= paddleY + PADDLE_H) {
                    ball.vx = -Math.abs(ball.vx);
                    ball.x = paddleX - BALL_R;
                    // Angle variation, but clamp vy
                    const hitPos = (ball.y - paddleY) / PADDLE_H;
                    ball.vy = BALL_SPEED * (hitPos - 0.5) * 2;
                    ball.vy = Math.max(-BALL_SPEED, Math.min(BALL_SPEED, ball.vy));
                    reward = 5;
                    hit = true;
                } else if (ball.x >= GW - BALL_R) {
                    reward = -5; done = true; // Missed!
                }
            }

            const nextState = [ball.x, ball.y, ball.vx, ball.vy, newPaddleCenter];
            replayBuffer.push([state, action, reward, nextState, done]);
            if (replayBuffer.length > BUFFER_MAX) replayBuffer.shift();

            if (step % 2 === 0) trainBatch();
            if (done) break;
        }

        totalRallies++;
        if (hit) totalHits++;
    }

    // ---- Drawing ----
    const ACTION_LABELS = ['UP', '—', 'DOWN'];
    const INPUT_LABELS = ['bX', 'bY', 'vX', 'vY', 'pY'];

    function drawNetwork() {
        const layerX = [50, 150, 240];
        const layerSizes = [INPUT, HIDDEN, OUTPUT];

        const nodes = [];
        for (let l = 0; l < 3; l++) {
            nodes[l] = [];
            const count = layerSizes[l];
            const spacing = Math.min(28, (H - 80) / (count + 1));
            const startY = H / 2 - (count - 1) * spacing / 2;
            for (let n = 0; n < count; n++) nodes[l][n] = { x: layerX[l], y: startY + n * spacing };
        }

        // W1 connections
        for (let i = 0; i < INPUT; i++) {
            for (let j = 0; j < HIDDEN; j++) {
                const w = W1[i][j], absW = Math.min(Math.abs(w), 2);
                ctx.strokeStyle = w > 0 ? `rgba(0,229,255,${absW / 2})` : `rgba(255,0,85,${absW / 2})`;
                ctx.lineWidth = absW * 1.2;
                ctx.beginPath(); ctx.moveTo(nodes[0][i].x + 6, nodes[0][i].y); ctx.lineTo(nodes[1][j].x - 6, nodes[1][j].y); ctx.stroke();
            }
        }
        // W2 connections
        for (let i = 0; i < HIDDEN; i++) {
            for (let j = 0; j < OUTPUT; j++) {
                const w = W2[i][j], absW = Math.min(Math.abs(w), 2);
                ctx.strokeStyle = w > 0 ? `rgba(0,229,255,${absW / 2})` : `rgba(255,0,85,${absW / 2})`;
                ctx.lineWidth = absW * 1.2;
                ctx.beginPath(); ctx.moveTo(nodes[1][i].x + 6, nodes[1][i].y); ctx.lineTo(nodes[2][j].x - 6, nodes[2][j].y); ctx.stroke();
            }
        }
        // Nodes
        for (let l = 0; l < 3; l++) {
            for (let n = 0; n < layerSizes[l]; n++) {
                const nd = nodes[l][n];
                ctx.beginPath(); ctx.arc(nd.x, nd.y, 5, 0, Math.PI * 2);
                ctx.fillStyle = l === 0 ? '#ff0055' : l === 1 ? '#555' : '#00e5ff';
                ctx.fill(); ctx.strokeStyle = '#888'; ctx.lineWidth = 1; ctx.stroke();
            }
        }
        // Input labels
        ctx.font = '9px Courier New'; ctx.textAlign = 'right'; ctx.fillStyle = '#888';
        for (let i = 0; i < INPUT; i++) ctx.fillText(INPUT_LABELS[i], nodes[0][i].x - 10, nodes[0][i].y + 3);
        // Output labels
        ctx.textAlign = 'left'; ctx.fillStyle = '#888';
        for (let j = 0; j < OUTPUT; j++) ctx.fillText(ACTION_LABELS[j], nodes[2][j].x + 10, nodes[2][j].y + 3);

        // Layer labels
        ctx.font = '8px Courier New'; ctx.textAlign = 'center'; ctx.fillStyle = '#555';
        ctx.fillText('STATE', layerX[0], 18); ctx.fillText('HIDDEN', layerX[1], 18); ctx.fillText('Q-VALUES', layerX[2], 18);

        // Stats
        ctx.font = '10px Courier New'; ctx.textAlign = 'left'; ctx.fillStyle = '#888';
        ctx.fillText(`Rallies: ${totalRallies}`, 10, H - 25);
        const hitRate = totalRallies > 0 ? Math.floor(totalHits / totalRallies * 100) : 0;
        ctx.fillText(`Hit rate: ${hitRate}%`, 10, H - 10);
    }

    function drawPong(ball, paddleY, label) {
        // Game area background
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(GAME_X, GAME_Y, GW, GH);
        ctx.strokeStyle = '#333'; ctx.lineWidth = 1;
        ctx.strokeRect(GAME_X, GAME_Y, GW, GH);

        // Center line
        ctx.setLineDash([4, 4]); ctx.strokeStyle = '#222'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(GAME_X + GW / 2, GAME_Y); ctx.lineTo(GAME_X + GW / 2, GAME_Y + GH); ctx.stroke();
        ctx.setLineDash([]);

        // Paddle
        const px = GAME_X + GW - PADDLE_W - 5;
        ctx.fillStyle = '#00e5ff';
        ctx.shadowBlur = 8; ctx.shadowColor = '#00e5ff';
        ctx.fillRect(px, GAME_Y + paddleY, PADDLE_W, PADDLE_H);
        ctx.shadowBlur = 0;

        // Ball
        if (ball) {
            ctx.beginPath();
            ctx.arc(GAME_X + ball.x, GAME_Y + ball.y, BALL_R, 0, Math.PI * 2);
            ctx.fillStyle = '#fff';
            ctx.shadowBlur = 6; ctx.shadowColor = '#fff';
            ctx.fill();
            ctx.shadowBlur = 0;
        }

        // Label
        if (label) {
            ctx.font = '11px Courier New'; ctx.textAlign = 'center'; ctx.fillStyle = '#666';
            ctx.fillText(label, GAME_X + GW / 2, GAME_Y + GH + 12);
        }
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);
        drawNetwork();
        drawPong(null, GH / 2 - PADDLE_H / 2, totalRallies === 0 ? 'PRESS TRAIN TO BEGIN' : `TRAINED ${totalRallies} RALLIES`);
    }

    // ---- Train ----
    trainBtn.addEventListener('click', () => {
        trainBtn.disabled = true; showBtn.disabled = true;
        trainBtn.innerText = 'TRAINING...';
        let i = 0;
        function step() {
            if (i >= 1000) {
                trainBtn.disabled = false; showBtn.disabled = false;
                trainBtn.innerText = 'TRAIN DQN (1000 RALLIES)';
                draw();
                return;
            }
            const eps = Math.max(0.05, 0.5 - totalRallies * 0.002);
            simRally(eps);
            if (i % 25 === 0) {
                ctx.clearRect(0, 0, W, H);
                drawNetwork();
                drawPong(null, GH / 2 - PADDLE_H / 2, `TRAINING... ${i}/1000`);
            }
            i++;
            setTimeout(step, 0);
        }
        step();
    });

    // ---- Watch AI Play ----
    let watchAnimId = null;

    showBtn.addEventListener('click', () => {
        if (watchAnimId) { cancelAnimationFrame(watchAnimId); watchAnimId = null; }
        trainBtn.disabled = true; showBtn.innerText = 'PLAYING...';

        let ball = newBall();
        let paddleY = GH / 2 - PADDLE_H / 2;
        let rallyHits = 0;

        function gameFrame() {
            const state = [ball.x, ball.y, ball.vx, ball.vy, paddleY + PADDLE_H / 2];
            const action = bestAction(state);

            if (action === 0) paddleY = Math.max(0, paddleY - PADDLE_SPEED);
            else if (action === 2) paddleY = Math.min(GH - PADDLE_H, paddleY + PADDLE_SPEED);

            ball.x += ball.vx; ball.y += ball.vy;
            if (ball.y <= BALL_R) { ball.y = BALL_R; ball.vy = Math.abs(ball.vy); }
            if (ball.y >= GH - BALL_R) { ball.y = GH - BALL_R; ball.vy = -Math.abs(ball.vy); }
            if (ball.x <= BALL_R) { ball.x = BALL_R; ball.vx = Math.abs(ball.vx); }

            const paddleX = GW - PADDLE_W - 5;
            let done = false;
            if (ball.x >= paddleX - BALL_R && ball.vx > 0) {
                if (ball.y >= paddleY && ball.y <= paddleY + PADDLE_H) {
                    ball.vx = -Math.abs(ball.vx); ball.x = paddleX - BALL_R;
                    const hitPos = (ball.y - paddleY) / PADDLE_H;
                    ball.vy += (hitPos - 0.5) * 2;
                    rallyHits++;
                } else if (ball.x >= GW - BALL_R) {
                    done = true;
                }
            }

            ctx.clearRect(0, 0, W, H);
            drawNetwork();
            drawPong(ball, paddleY, `HITS: ${rallyHits}`);

            if (done) {
                // Show miss briefly, then restart
                ctx.fillStyle = '#ff0055'; ctx.font = 'bold 14px Courier New'; ctx.textAlign = 'center';
                ctx.fillText('MISS!', GAME_X + GW / 2, GAME_Y + GH / 2);
                setTimeout(() => {
                    ball = newBall();
                    paddleY = GH / 2 - PADDLE_H / 2;
                    rallyHits = 0;
                    watchAnimId = requestAnimationFrame(gameFrame);
                }, 800);
            } else {
                watchAnimId = requestAnimationFrame(gameFrame);
            }
        }
        watchAnimId = requestAnimationFrame(gameFrame);
    });

    resetBtn.addEventListener('click', () => {
        if (watchAnimId) { cancelAnimationFrame(watchAnimId); watchAnimId = null; }
        initNetwork();
        trainBtn.disabled = false; showBtn.disabled = false;
        trainBtn.innerText = 'TRAIN DQN (500 RALLIES)';
        showBtn.innerText = 'WATCH AI PLAY';
        draw();
    });

    draw();
})();

// ==========================================
// 14. ALPHAZERO & MCTS — TIC-TAC-TOE
// ==========================================
(function () {
    const canvas = document.getElementById('mctsCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resetBtn = document.getElementById('mcts-reset-btn');
    const hintBtn = document.getElementById('mcts-hint-btn');

    const CW = canvas.width, CH = canvas.height;

    // Layout zones
    const TOP_H = 360; // top zone for board + panel
    const TREE_Y = TOP_H + 10; // tree zone starts here

    // Board layout (in top zone)
    const CELL = 56, BOARD_PAD = 25;
    const BX = BOARD_PAD, BY = (TOP_H - CELL * 3) / 2;

    // Right panel (in top zone)
    const PANEL_X = BX + CELL * 3 + 40;
    const PANEL_W = CW - PANEL_X - 10;

    let board, currentPlayer, gameOver, winner, aiThinking;
    let lastMCTSRoot = null;
    let showingAnalysis = false;
    let statusMsg = '';

    function initGame() {
        board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        currentPlayer = 1;
        gameOver = false;
        winner = 0;
        aiThinking = false;
        lastMCTSRoot = null;
        showingAnalysis = false;
        statusMsg = 'YOUR TURN — CLICK A CELL';
    }
    initGame();

    // ---- Game logic ----
    const WIN_LINES = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    function checkWin(b) {
        for (const [a, bb, c] of WIN_LINES) {
            if (b[a] && b[a] === b[bb] && b[bb] === b[c]) return b[a];
        }
        return b.includes(0) ? 0 : -1;
    }

    function getLegalMoves(b) {
        const moves = [];
        for (let i = 0; i < 9; i++) if (b[i] === 0) moves.push(i);
        return moves;
    }

    // ---- MCTS ----
    class MCTSNode {
        constructor(board, player, move, parent) {
            this.board = board.slice();
            this.player = player;
            this.move = move;
            this.parent = parent;
            this.children = [];
            this.visits = 0;
            this.wins = 0;
            this.untriedMoves = getLegalMoves(this.board);
        }
        ucb1(c = 1.41) {
            if (this.visits === 0) return Infinity;
            return (this.wins / this.visits) + c * Math.sqrt(Math.log(this.parent.visits) / this.visits);
        }
        bestChild() {
            let best = this.children[0], bestScore = -Infinity;
            for (const ch of this.children) {
                const score = ch.ucb1();
                if (score > bestScore) { bestScore = score; best = ch; }
            }
            return best;
        }
        expand() {
            const idx = Math.floor(Math.random() * this.untriedMoves.length);
            const move = this.untriedMoves.splice(idx, 1)[0];
            const newBoard = this.board.slice();
            newBoard[move] = this.player;
            const child = new MCTSNode(newBoard, this.player === 1 ? 2 : 1, move, this);
            this.children.push(child);
            return child;
        }
        isFullyExpanded() { return this.untriedMoves.length === 0; }
        isTerminal() { return checkWin(this.board) !== 0; }
    }

    function rollout(board, player) {
        const b = board.slice();
        let p = player;
        let result = checkWin(b);
        while (result === 0) {
            const moves = getLegalMoves(b);
            b[moves[Math.floor(Math.random() * moves.length)]] = p;
            p = p === 1 ? 2 : 1;
            result = checkWin(b);
        }
        return result;
    }

    function backpropagate(node, result) {
        while (node) {
            node.visits++;
            if (result === -1) node.wins += 0.5;
            else if (result !== node.player) node.wins += 1;
            node = node.parent;
        }
    }

    function runMCTS(board, player, iterations) {
        const root = new MCTSNode(board, player, -1, null);
        for (let i = 0; i < iterations; i++) {
            let node = root;
            while (!node.isTerminal() && node.isFullyExpanded() && node.children.length > 0) {
                node = node.bestChild();
            }
            if (!node.isTerminal() && !node.isFullyExpanded()) node = node.expand();
            const result = node.isTerminal() ? checkWin(node.board) : rollout(node.board, node.player);
            backpropagate(node, result);
        }
        return root;
    }

    function aiBestMove(root) {
        let best = null, bestVisits = -1;
        for (const ch of root.children) {
            if (ch.visits > bestVisits) { bestVisits = ch.visits; best = ch; }
        }
        return best ? best.move : getLegalMoves(root.board)[0];
    }

    // ---- Drawing ----
    const CELL_SHORT = ['TL', 'TC', 'TR', 'ML', 'C', 'MR', 'BL', 'BC', 'BR'];

    function drawBoard() {
        // Board background
        ctx.fillStyle = '#111';
        ctx.fillRect(BX - 5, BY - 5, CELL * 3 + 10, CELL * 3 + 10);

        for (let i = 0; i < 9; i++) {
            const r = Math.floor(i / 3), c = i % 3;
            const x = BX + c * CELL, y = BY + r * CELL;

            ctx.fillStyle = '#0a0a0a';
            ctx.fillRect(x + 1, y + 1, CELL - 2, CELL - 2);
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y, CELL, CELL);

            // Pieces
            if (board[i] === 1) {
                ctx.strokeStyle = '#ff0055';
                ctx.lineWidth = 3;
                ctx.shadowBlur = 6; ctx.shadowColor = '#ff0055';
                ctx.beginPath();
                ctx.moveTo(x + 14, y + 14); ctx.lineTo(x + CELL - 14, y + CELL - 14);
                ctx.moveTo(x + CELL - 14, y + 14); ctx.lineTo(x + 14, y + CELL - 14);
                ctx.stroke();
                ctx.shadowBlur = 0;
            } else if (board[i] === 2) {
                ctx.strokeStyle = '#00e5ff';
                ctx.lineWidth = 3;
                ctx.shadowBlur = 6; ctx.shadowColor = '#00e5ff';
                ctx.beginPath();
                ctx.arc(x + CELL / 2, y + CELL / 2, CELL / 2 - 14, 0, Math.PI * 2);
                ctx.stroke();
                ctx.shadowBlur = 0;
            }
        }

        // Win line
        if (winner > 0) {
            for (const [a, b, c] of WIN_LINES) {
                if (board[a] && board[a] === board[b] && board[b] === board[c]) {
                    const ax = BX + (a % 3) * CELL + CELL / 2, ay = BY + Math.floor(a / 3) * CELL + CELL / 2;
                    const cx = BX + (c % 3) * CELL + CELL / 2, cy = BY + Math.floor(c / 3) * CELL + CELL / 2;
                    ctx.strokeStyle = winner === 1 ? '#ff0055' : '#00e5ff';
                    ctx.lineWidth = 4;
                    ctx.shadowBlur = 10; ctx.shadowColor = ctx.strokeStyle;
                    ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(cx, cy); ctx.stroke();
                    ctx.shadowBlur = 0;
                }
            }
        }

        // Status
        ctx.font = '11px Courier New';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'alphabetic';
        ctx.fillStyle = gameOver ? (winner === 1 ? '#ff0055' : winner === 2 ? '#00e5ff' : '#888') : '#888';
        ctx.fillText(statusMsg, BX + CELL * 1.5, BY + CELL * 3 + 22);
    }

    // ---- Animated MCTS Phase Visualization ----
    let phaseAnimTime = 0;
    const PHASE_DURATION = 2000; // ms per phase
    const TOTAL_CYCLE = PHASE_DURATION * 4;
    let lastAnimFrame = 0;

    // Example tree nodes for the phase diagram
    // Fixed positions for a small illustrative tree
    const exTree = {
        // Root
        root: { x: 0.5, y: 0.08 },
        // Level 1 children
        L1: [
            { x: 0.18, y: 0.36, v: 42, w: 18, label: 'A' },
            { x: 0.5, y: 0.36, v: 85, w: 45, label: 'B' },
            { x: 0.82, y: 0.36, v: 31, w: 12, label: 'C' }
        ],
        // Level 2 children (under B, the most-visited)
        L2: [
            { x: 0.35, y: 0.64, v: 30, w: 16, label: 'B1' },
            { x: 0.5, y: 0.64, v: 40, w: 22, label: 'B2' },
            { x: 0.65, y: 0.64, v: 15, w: 7, label: 'B3' }
        ],
        // The new node to expand (under B3)
        newNode: { x: 0.65, y: 0.88, v: 0, w: 0, label: '?' }
    };

    // The path for SELECT: root -> B -> B3
    const selectPath = [0, 1, 2]; // indices: root, L1[1]=B, L2[2]=B3

    function startPhaseAnim() {
        phaseAnimTime = 0;
        lastAnimFrame = performance.now();
        animatePhases();
    }

    function animatePhases() {
        const now = performance.now();
        const dt = now - lastAnimFrame;
        lastAnimFrame = now;
        phaseAnimTime = (phaseAnimTime + dt) % TOTAL_CYCLE;
        draw();
        requestAnimationFrame(animatePhases);
    }

    function drawPanel() {
        // Panel background
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(PANEL_X, 8, PANEL_W, TOP_H - 16);
        ctx.strokeStyle = '#222';
        ctx.lineWidth = 1;
        ctx.strokeRect(PANEL_X, 8, PANEL_W, TOP_H - 16);

        const activePhase = Math.floor(phaseAnimTime / PHASE_DURATION);
        const phaseProgress = (phaseAnimTime % PHASE_DURATION) / PHASE_DURATION;

        const phases = [
            { name: 'SELECT', desc: 'Follow best path down', color: '#ff0055' },
            { name: 'EXPAND', desc: 'Add a new child node', color: '#ffaa00' },
            { name: 'SIMULATE', desc: 'Play random game out', color: '#00e5ff' },
            { name: 'BACKUP', desc: 'Update scores upward', color: '#00ff88' }
        ];

        // Phase step indicators at top
        const stepY = 18;
        const phaseW = (PANEL_W - 20) / 4;
        for (let i = 0; i < 4; i++) {
            const px = PANEL_X + 10 + i * phaseW;
            const isActive = i === activePhase;

            ctx.fillStyle = phases[i].color;
            ctx.globalAlpha = isActive ? 0.3 : 0.08;
            ctx.fillRect(px + 2, stepY, phaseW - 4, 28);
            ctx.globalAlpha = 1;
            ctx.strokeStyle = phases[i].color;
            ctx.lineWidth = isActive ? 2 : 0.5;
            ctx.strokeRect(px + 2, stepY, phaseW - 4, 28);

            ctx.font = isActive ? 'bold 8px Courier New' : '7px Courier New';
            ctx.fillStyle = isActive ? phases[i].color : '#666';
            ctx.textAlign = 'center';
            ctx.fillText(phases[i].name, px + phaseW / 2, stepY + 12);

            if (isActive) {
                ctx.font = '6px Courier New';
                ctx.fillStyle = '#aaa';
                ctx.fillText(phases[i].desc, px + phaseW / 2, stepY + 22);
            }

            if (i < 3) {
                ctx.fillStyle = '#444';
                ctx.font = '9px sans-serif';
                ctx.fillText('→', px + phaseW - 1, stepY + 14);
            }
        }

        // ---- Draw the example tree ----
        const treeArea = {
            x: PANEL_X + 12,
            y: stepY + 38,
            w: PANEL_W - 24,
            h: TOP_H - stepY - 60
        };

        function tx(frac) { return treeArea.x + frac * treeArea.w; }
        function ty(frac) { return treeArea.y + frac * treeArea.h; }

        // Draw an edge
        function drawEdge(x1, y1, x2, y2, color, width, alpha) {
            ctx.strokeStyle = color;
            ctx.globalAlpha = alpha;
            ctx.lineWidth = width;
            ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
            ctx.globalAlpha = 1;
        }

        // Draw a node circle
        function drawNode(x, y, radius, fillColor, strokeColor, label, visits, glow) {
            if (glow) {
                ctx.shadowBlur = 8; ctx.shadowColor = glow;
            }
            ctx.fillStyle = fillColor;
            ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = 1.5;
            ctx.stroke();
            ctx.shadowBlur = 0;

            if (label) {
                ctx.font = 'bold 9px Courier New';
                ctx.fillStyle = '#ddd';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(label, x, y);
            }
            if (visits !== undefined) {
                ctx.font = '7px Courier New';
                ctx.fillStyle = '#888';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'alphabetic';
                ctx.fillText(visits, x, y + radius + 10);
            }
        }

        // Positions
        const rootPos = { x: tx(exTree.root.x), y: ty(exTree.root.y) };
        const l1Pos = exTree.L1.map(n => ({ x: tx(n.x), y: ty(n.y) }));
        const l2Pos = exTree.L2.map(n => ({ x: tx(n.x), y: ty(n.y) }));
        const newPos = { x: tx(exTree.newNode.x), y: ty(exTree.newNode.y) };

        // Edges: root -> L1
        for (let i = 0; i < 3; i++) {
            const isOnPath = (activePhase === 0 && i === 1) || (activePhase >= 1 && i === 1);
            const alpha = isOnPath ? 0.8 : 0.2;
            const w = isOnPath ? 2.5 : 1;
            const col = (activePhase === 0 && i === 1) ? '#ff0055' : '#00e5ff';
            drawEdge(rootPos.x, rootPos.y + 10, l1Pos[i].x, l1Pos[i].y - 10, col, w, alpha);
        }

        // Edges: B -> L2
        for (let i = 0; i < 3; i++) {
            const isOnPath = (activePhase === 0 && i === 2) || (activePhase >= 1 && i === 2);
            const alpha = isOnPath ? 0.8 : 0.2;
            const w = isOnPath ? 2.5 : 1;
            const col = (activePhase === 0 && i === 2) ? '#ff0055' : '#00e5ff';
            drawEdge(l1Pos[1].x, l1Pos[1].y + 10, l2Pos[i].x, l2Pos[i].y - 10, col, w, alpha);
        }

        // Phase-specific visuals
        if (activePhase === 0) {
            // SELECT — highlight path root -> B -> B3 with animated pulse
            const pulse = 0.6 + 0.4 * Math.sin(phaseProgress * Math.PI * 4);

            // Draw pulsing markers along the path
            const pathPoints = [rootPos, l1Pos[1], l2Pos[2]];
            const segProgress = Math.min(1, phaseProgress * 1.5); // speed up
            for (let i = 0; i < pathPoints.length - 1; i++) {
                const seg = i / (pathPoints.length - 1);
                if (segProgress > seg) {
                    const p1 = pathPoints[i], p2 = pathPoints[i + 1];
                    const t = Math.min(1, (segProgress - seg) * (pathPoints.length - 1));
                    const mx = p1.x + (p2.x - p1.x) * t;
                    const my = p1.y + (p2.y - p1.y) * t;
                    ctx.fillStyle = `rgba(255, 0, 85, ${pulse})`;
                    ctx.beginPath(); ctx.arc(mx, my, 4, 0, Math.PI * 2); ctx.fill();
                }
            }
        }

        if (activePhase === 1) {
            // EXPAND — draw edge from B3 to new node with growth animation
            const grow = Math.min(1, phaseProgress * 2);
            const ex = l2Pos[2].x + (newPos.x - l2Pos[2].x) * grow;
            const ey = l2Pos[2].y + 10 + (newPos.y - 10 - l2Pos[2].y - 10) * grow;
            drawEdge(l2Pos[2].x, l2Pos[2].y + 10, ex, ey, '#ffaa00', 2, 0.8);

            if (grow > 0.5) {
                const nodeAlpha = (grow - 0.5) * 2;
                const pulseR = 10 + Math.sin(phaseProgress * Math.PI * 6) * 3;
                ctx.globalAlpha = nodeAlpha;
                drawNode(newPos.x, newPos.y, pulseR, '#2a1a00', '#ffaa00', '?', undefined, '#ffaa00');
                ctx.globalAlpha = 1;
            }
        }

        if (activePhase === 2) {
            // SIMULATE — show new node + random rollout symbols
            drawEdge(l2Pos[2].x, l2Pos[2].y + 10, newPos.x, newPos.y - 10, '#ffaa00', 1.5, 0.5);
            drawNode(newPos.x, newPos.y, 10, '#2a1a00', '#ffaa00', '?', undefined, null);

            // Simulate random play symbols appearing below the new node
            const simY = newPos.y + 20;
            const symbols = ['X', 'O', 'X', 'O', 'X'];
            const numShow = Math.floor(phaseProgress * 5) + 1;
            for (let i = 0; i < Math.min(numShow, 5); i++) {
                ctx.font = '9px Courier New';
                ctx.fillStyle = symbols[i] === 'X' ? '#ff0055' : '#00e5ff';
                ctx.textAlign = 'center';
                ctx.globalAlpha = 0.6 + 0.4 * Math.sin(phaseProgress * Math.PI * 3 + i);
                ctx.fillText(symbols[i], newPos.x - 20 + i * 10, simY + 4);
            }
            ctx.globalAlpha = 1;

            // Result indicator
            if (phaseProgress > 0.7) {
                const resultAlpha = (phaseProgress - 0.7) / 0.3;
                ctx.globalAlpha = resultAlpha;
                ctx.font = 'bold 10px Courier New';
                ctx.fillStyle = '#00ff88';
                ctx.textAlign = 'center';
                ctx.fillText('WIN', newPos.x, simY + 18);
                ctx.globalAlpha = 1;
            }
        }

        if (activePhase === 3) {
            // BACKUP — show values propagating back up
            drawEdge(l2Pos[2].x, l2Pos[2].y + 10, newPos.x, newPos.y - 10, '#ffaa00', 1.5, 0.3);
            drawNode(newPos.x, newPos.y, 10, '#2a1a00', '#ffaa00', '?', undefined, null);

            // Animated arrows going UP from new node -> B3 -> B -> root
            const backPath = [newPos, l2Pos[2], l1Pos[1], rootPos];
            const upProgress = Math.min(1, phaseProgress * 1.3);

            for (let i = 0; i < backPath.length - 1; i++) {
                const seg = i / (backPath.length - 1);
                if (upProgress > seg) {
                    const p1 = backPath[i], p2 = backPath[i + 1];
                    const t = Math.min(1, (upProgress - seg) * (backPath.length - 1));
                    const mx = p1.x + (p2.x - p1.x) * t;
                    const my = p1.y + (p2.y - p1.y) * t;

                    // Green glow moving up
                    ctx.fillStyle = '#00ff88';
                    ctx.shadowBlur = 6; ctx.shadowColor = '#00ff88';
                    ctx.beginPath(); ctx.arc(mx, my, 5, 0, Math.PI * 2); ctx.fill();
                    ctx.shadowBlur = 0;

                    // +1 label near the moving dot
                    ctx.font = 'bold 8px Courier New';
                    ctx.fillStyle = '#00ff88';
                    ctx.textAlign = 'left';
                    ctx.fillText('+1', mx + 8, my - 2);
                }
            }
        }

        // Draw all base nodes (always visible)
        // Root
        drawNode(rootPos.x, rootPos.y, 12, '#1a1a2e', '#888',
            '⬤', 158, activePhase === 0 && phaseProgress < 0.2 ? '#ff0055' : null);

        // L1
        for (let i = 0; i < 3; i++) {
            const n = exTree.L1[i];
            const isOnPath = i === 1;
            const glow = (activePhase === 0 && isOnPath) ? '#ff0055' : null;
            drawNode(l1Pos[i].x, l1Pos[i].y, 10, '#1a1a2e',
                isOnPath ? '#00e5ff' : '#555', n.label, n.v, glow);
        }

        // L2
        for (let i = 0; i < 3; i++) {
            const n = exTree.L2[i];
            const isOnPath = i === 2;
            const glow = (activePhase === 0 && isOnPath) ? '#ff0055' : null;
            drawNode(l2Pos[i].x, l2Pos[i].y, 8, '#1a1a2e',
                isOnPath ? '#00e5ff' : '#555', n.label, n.v, glow);
        }

        // Phase description at bottom
        ctx.font = '8px Courier New';
        ctx.fillStyle = '#555';
        ctx.textAlign = 'center';
        ctx.fillText('↻ repeat × 1000', PANEL_X + PANEL_W / 2, TOP_H - 16);
    }

    // ---- Search Tree ----
    function drawTree() {
        // Divider line
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(10, TOP_H + 2); ctx.lineTo(CW - 10, TOP_H + 2); ctx.stroke();

        // Tree background
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(10, TREE_Y, CW - 20, CH - TREE_Y - 8);
        ctx.strokeStyle = '#222';
        ctx.strokeRect(10, TREE_Y, CW - 20, CH - TREE_Y - 8);

        ctx.font = 'bold 9px Courier New';
        ctx.fillStyle = '#555';
        ctx.textAlign = 'center';
        ctx.fillText('SEARCH TREE', CW / 2, TREE_Y + 16);

        if (!lastMCTSRoot || !showingAnalysis) {
            ctx.fillStyle = '#333';
            ctx.font = '10px Courier New';
            ctx.textAlign = 'center';
            ctx.fillText('Tree appears after AI moves', CW / 2, TREE_Y + (CH - TREE_Y) / 2);
            return;
        }

        const root = lastMCTSRoot;
        if (root.children.length === 0) return;

        const treeW = CW - 40;
        const treeTop = TREE_Y + 26;
        const treeH = CH - TREE_Y - 36;
        const maxVisits = Math.max(1, ...root.children.map(c => c.visits));

        // Draw a miniboard inside a tree node
        function drawMiniBoard(brd, cx, cy, size) {
            const cs = size / 3;
            for (let i = 0; i < 9; i++) {
                const mr = Math.floor(i / 3), mc = i % 3;
                const nx = cx - size / 2 + mc * cs, ny = cy - size / 2 + mr * cs;
                ctx.strokeStyle = '#444';
                ctx.lineWidth = 0.5;
                ctx.strokeRect(nx, ny, cs, cs);
                if (brd[i] === 1) {
                    ctx.strokeStyle = '#ff0055';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(nx + 2, ny + 2); ctx.lineTo(nx + cs - 2, ny + cs - 2);
                    ctx.moveTo(nx + cs - 2, ny + 2); ctx.lineTo(nx + 2, ny + cs - 2);
                    ctx.stroke();
                } else if (brd[i] === 2) {
                    ctx.strokeStyle = '#00e5ff';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.arc(nx + cs / 2, ny + cs / 2, cs / 2 - 2, 0, Math.PI * 2);
                    ctx.stroke();
                }
            }
        }

        // Root node
        const rootX = CW / 2, rootY = treeTop + 16;
        drawMiniBoard(root.board, rootX, rootY, 30);
        ctx.font = '7px Courier New';
        ctx.fillStyle = '#888';
        ctx.textAlign = 'center';
        ctx.fillText(root.visits, rootX, rootY + 22);

        // First-level children (all moves AI considered)
        const sortedL1 = root.children.slice().sort((a, b) => b.visits - a.visits);
        const showL1 = sortedL1.slice(0, Math.min(sortedL1.length, 9));
        const l1Spacing = treeW / (showL1.length + 1);
        const l1Y = rootY + 70;

        for (let i = 0; i < showL1.length; i++) {
            const child = showL1[i];
            const cx = 20 + l1Spacing * (i + 1);
            const winRate = child.visits > 0 ? child.wins / child.visits : 0;

            // Edge from root
            const edgeW = Math.max(0.5, (child.visits / maxVisits) * 4);
            const alpha = Math.max(0.15, child.visits / maxVisits);
            ctx.strokeStyle = `rgba(0, 229, 255, ${alpha})`;
            ctx.lineWidth = edgeW;
            ctx.beginPath(); ctx.moveTo(rootX, rootY + 18); ctx.lineTo(cx, l1Y - 18); ctx.stroke();

            // Node background
            const nSize = 28;
            const isChosen = child.visits === maxVisits;
            if (isChosen) {
                ctx.shadowBlur = 6; ctx.shadowColor = '#00e5ff';
                ctx.strokeStyle = '#00e5ff';
                ctx.lineWidth = 1.5;
                ctx.strokeRect(cx - nSize / 2 - 2, l1Y - nSize / 2 - 2, nSize + 4, nSize + 4);
                ctx.shadowBlur = 0;
            }

            drawMiniBoard(child.board, cx, l1Y, nSize);

            // Labels below
            ctx.font = 'bold 8px Courier New';
            ctx.textAlign = 'center';
            ctx.fillStyle = isChosen ? '#00e5ff' : '#888';
            ctx.fillText(CELL_SHORT[child.move], cx, l1Y + nSize / 2 + 10);
            ctx.font = '7px Courier New';
            ctx.fillStyle = '#777';
            ctx.fillText(`${child.visits}`, cx - 14, l1Y + nSize / 2 + 20);
            const wr = Math.floor(winRate * 100);
            const wrColor = wr > 50 ? '#4a4' : wr > 30 ? '#aa4' : '#a44';
            ctx.fillStyle = wrColor;
            ctx.fillText(`${wr}%`, cx + 14, l1Y + nSize / 2 + 20);

            // Second-level children (top 3 by visits)
            const sortedL2 = child.children.slice().sort((a, b) => b.visits - a.visits);
            const showL2 = sortedL2.slice(0, Math.min(sortedL2.length, 3));
            if (showL2.length > 0 && l1Y + 100 < CH - 20) {
                const l2Y = l1Y + 72;
                const l2Spread = l1Spacing * 0.7;
                const l2Spacing = showL2.length > 1 ? l2Spread / (showL2.length - 1) : 0;
                const l2Start = cx - l2Spread / 2;
                const childMax = Math.max(1, ...showL2.map(c => c.visits));

                for (let j = 0; j < showL2.length; j++) {
                    const gc = showL2[j];
                    const gx = showL2.length === 1 ? cx : l2Start + j * l2Spacing;
                    const gcAlpha = Math.max(0.1, gc.visits / maxVisits);
                    ctx.strokeStyle = `rgba(255, 0, 85, ${gcAlpha})`;
                    ctx.lineWidth = Math.max(0.3, (gc.visits / maxVisits) * 2);
                    ctx.beginPath(); ctx.moveTo(cx, l1Y + nSize / 2 + 2); ctx.lineTo(gx, l2Y - 10); ctx.stroke();

                    drawMiniBoard(gc.board, gx, l2Y, 20);
                    ctx.font = '6px Courier New';
                    ctx.fillStyle = '#666';
                    ctx.textAlign = 'center';
                    ctx.fillText(gc.visits, gx, l2Y + 16);
                }
            }
        }
    }

    function draw() {
        ctx.clearRect(0, 0, CW, CH);
        drawBoard();
        drawPanel();
        drawTree();
    }

    // ---- Interaction ----
    canvas.addEventListener('click', (e) => {
        if (gameOver || aiThinking || currentPlayer !== 1) return;

        const rect = canvas.getBoundingClientRect();
        const mx = (e.clientX - rect.left) * (CW / rect.width);
        const my = (e.clientY - rect.top) * (CH / rect.height);

        const col = Math.floor((mx - BX) / CELL);
        const row = Math.floor((my - BY) / CELL);
        if (col < 0 || col > 2 || row < 0 || row > 2) return;

        const idx = row * 3 + col;
        if (board[idx] !== 0) return;

        board[idx] = 1;
        showingAnalysis = false;
        lastMCTSRoot = null;
        const result = checkWin(board);
        if (result !== 0) {
            gameOver = true;
            winner = result === -1 ? 0 : result;
            statusMsg = result === -1 ? 'DRAW!' : 'YOU WIN!';
            draw();
            return;
        }

        currentPlayer = 2;
        aiThinking = true;
        statusMsg = 'AI SEARCHING...';
        draw();

        setTimeout(() => {
            lastMCTSRoot = runMCTS(board, 2, 1000);
            const aiMove = aiBestMove(lastMCTSRoot);
            board[aiMove] = 2;
            aiThinking = false;
            showingAnalysis = true;

            const result2 = checkWin(board);
            if (result2 !== 0) {
                gameOver = true;
                winner = result2 === -1 ? 0 : result2;
                statusMsg = result2 === -1 ? 'DRAW!' : 'AI WINS!';
            } else {
                currentPlayer = 1;
                statusMsg = 'YOUR TURN — CLICK A CELL';
            }
            draw();
        }, 50);
    });

    hintBtn.addEventListener('click', () => {
        if (lastMCTSRoot) {
            showingAnalysis = true;
            draw();
            return;
        }
        // Run MCTS to show analysis
        lastMCTSRoot = runMCTS(board, currentPlayer, 1000);
        showingAnalysis = true;
        draw();
    });

    resetBtn.addEventListener('click', () => {
        initGame();
        draw();
    });

    startPhaseAnim();
})();

// ==========================================
// 15. DREAMING MACHINES (REVERSE DIFFUSION)
// ==========================================
(function () {
    const canvas = document.getElementById('diffusionCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const slider = document.getElementById('diff-slider');
    const valLabel = document.getElementById('diff-val');

    const width = canvas.width, height = canvas.height;

    // 1. Create a "Clean" image procedurally (A simple landscape)
    const cleanCanvas = document.createElement('canvas');
    cleanCanvas.width = width; cleanCanvas.height = height;
    const cctx = cleanCanvas.getContext('2d');

    // Draw Night Sky
    let grad = cctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, "#0B1021");
    grad.addColorStop(1, "#3B1144");
    cctx.fillStyle = grad;
    cctx.fillRect(0, 0, width, height);

    // Draw Moon
    cctx.fillStyle = "#FFD700";
    cctx.beginPath(); cctx.arc(width * 0.75, height * 0.25, 30, 0, Math.PI * 2); cctx.fill();
    cctx.shadowBlur = 20; cctx.shadowColor = "#FFD700"; cctx.fill(); cctx.shadowBlur = 0;

    // Draw Mountains
    cctx.fillStyle = "#180A22";
    cctx.beginPath();
    cctx.moveTo(0, height);
    cctx.lineTo(0, height * 0.6);
    cctx.lineTo(width * 0.3, height * 0.4);
    cctx.lineTo(width * 0.6, height * 0.7);
    cctx.lineTo(width, height * 0.5);
    cctx.lineTo(width, height);
    cctx.fill();

    // Store clean image data
    const cleanDataElement = cctx.getImageData(0, 0, width, height);
    const cleanData = cleanDataElement.data;

    // 2. Generate static noise
    const noiseData = new Uint8ClampedArray(cleanData.length);
    for (let i = 0; i < noiseData.length; i += 4) {
        let gray = Math.random() * 255;
        noiseData[i] = gray;     // R
        noiseData[i + 1] = gray;   // G
        noiseData[i + 2] = gray;   // B
        noiseData[i + 3] = 255;    // A
    }

    // 3. Render function blending based on timestep
    const displayImageData = ctx.createImageData(width, height);
    const dData = displayImageData.data;

    function draw() {
        const noiseAmount = parseInt(slider.value) / 100; // 1 = full noise, 0 = clean

        if (noiseAmount === 1) valLabel.innerText = "100 (PURE NOISE)";
        else if (noiseAmount === 0) valLabel.innerText = "0 (CLEAN IMAGE)";
        else valLabel.innerText = parseInt(slider.value);

        // Blend clean data and noise data
        for (let i = 0; i < dData.length; i += 4) {
            dData[i] = cleanData[i] * (1 - noiseAmount) + noiseData[i] * noiseAmount;
            dData[i + 1] = cleanData[i + 1] * (1 - noiseAmount) + noiseData[i + 1] * noiseAmount;
            dData[i + 2] = cleanData[i + 2] * (1 - noiseAmount) + noiseData[i + 2] * noiseAmount;
            dData[i + 3] = 255;
        }

        ctx.putImageData(displayImageData, 0, 0);
    }

    // Auto-run diffusion animation once on load
    let autoRun = 100;
    function animateIn() {
        if (autoRun > 0) {
            autoRun -= 1;
            slider.value = autoRun;
            draw();
            requestAnimationFrame(animateIn);
        }
    }

    slider.addEventListener('input', draw);
    draw();
    // Start the denoise animation shortly after load
    setTimeout(animateIn, 1000);
})();

// ==========================================
// 20. GENERATIVE ADVERSARIAL NETWORK (1D GAN)
// ==========================================
(function () {
    const canvas = document.getElementById('ganCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const stepBtn = document.getElementById('gan-step-btn');
    const autoBtn = document.getElementById('gan-auto-btn');
    const resetBtn = document.getElementById('gan-reset-btn');

    const W = canvas.width, H = canvas.height;
    const BINS = 60;
    const X_MIN = -4, X_MAX = 4;
    const binW = (X_MAX - X_MIN) / BINS;

    // --- Real data distribution: two Gaussians ---
    function gaussianPDF(x, mu, sigma) {
        return Math.exp(-0.5 * ((x - mu) / sigma) ** 2) / (sigma * Math.sqrt(2 * Math.PI));
    }
    function realPDF(x) {
        return 0.5 * gaussianPDF(x, -1.5, 0.5) + 0.5 * gaussianPDF(x, 1.5, 0.5);
    }

    // Pre-compute real distribution histogram
    const realHist = new Float64Array(BINS);
    let realMax = 0;
    for (let i = 0; i < BINS; i++) {
        const x = X_MIN + (i + 0.5) * binW;
        realHist[i] = realPDF(x);
        if (realHist[i] > realMax) realMax = realHist[i];
    }

    // --- Simple 1-hidden-layer neural network ---
    function createNet(inSize, hidSize, outSize) {
        const he = (n) => Math.sqrt(2 / n);
        const randW = (rows, cols, scale) => {
            const m = [];
            for (let r = 0; r < rows; r++) {
                m[r] = [];
                for (let c = 0; c < cols; c++) m[r][c] = (Math.random() - 0.5) * 2 * scale;
            }
            return m;
        };
        const zeros = (n) => new Float64Array(n);
        return {
            w1: randW(inSize, hidSize, he(inSize)),
            b1: zeros(hidSize),
            w2: randW(hidSize, outSize, he(hidSize)),
            b2: zeros(outSize),
            // For Adam optimizer
            mw1: randW(inSize, hidSize, 0), vw1: randW(inSize, hidSize, 0),
            mb1: zeros(hidSize), vb1: zeros(hidSize),
            mw2: randW(hidSize, outSize, 0), vw2: randW(hidSize, outSize, 0),
            mb2: zeros(outSize), vb2: zeros(outSize),
            t: 0
        };
    }

    function forward(net, inputs) {
        // inputs: array of values, each is a 1D input
        const N = inputs.length;
        const hidSize = net.b1.length;
        const outSize = net.b2.length;
        const hidden = [];
        const output = [];
        for (let i = 0; i < N; i++) {
            const h = new Float64Array(hidSize);
            for (let j = 0; j < hidSize; j++) {
                h[j] = Math.max(0, inputs[i] * net.w1[0][j] + net.b1[j]); // ReLU
            }
            hidden.push(h);
            const o = new Float64Array(outSize);
            for (let j = 0; j < outSize; j++) {
                let sum = net.b2[j];
                for (let k = 0; k < hidSize; k++) sum += h[k] * net.w2[k][j];
                o[j] = sum;
            }
            output.push(o);
        }
        return { hidden, output };
    }

    function sigmoid(x) { return 1 / (1 + Math.exp(-Math.max(-20, Math.min(20, x)))); }

    // --- Generator and Discriminator ---
    const HIDDEN = 32;
    let G, D;
    let step = 0;
    let autoInterval = null;

    function initNetworks() {
        G = createNet(1, HIDDEN, 1);
        D = createNet(1, HIDDEN, 1);
        step = 0;
    }
    initNetworks();

    // Sample from real distribution (rejection sampling)
    function sampleReal(n) {
        const samples = [];
        while (samples.length < n) {
            const x = X_MIN + Math.random() * (X_MAX - X_MIN);
            const p = realPDF(x) / realMax;
            if (Math.random() < p) samples.push(x);
        }
        return samples;
    }

    // Generate fake samples
    function generate(n) {
        const noise = [];
        for (let i = 0; i < n; i++) noise.push(Math.random() * 2 - 1);
        const { output } = forward(G, noise);
        return { noise, fakes: output.map(o => Math.tanh(o[0]) * 4) };
    }

    // SGD update for a network (simple gradient descent with momentum)
    function sgdUpdate(net, grads, lr) {
        const beta1 = 0.5, beta2 = 0.999, eps = 1e-8;
        net.t++;
        const t = net.t;
        // w1
        for (let r = 0; r < net.w1.length; r++) {
            for (let c = 0; c < net.w1[0].length; c++) {
                net.mw1[r][c] = beta1 * net.mw1[r][c] + (1 - beta1) * grads.dw1[r][c];
                net.vw1[r][c] = beta2 * net.vw1[r][c] + (1 - beta2) * grads.dw1[r][c] ** 2;
                const mc = net.mw1[r][c] / (1 - beta1 ** t);
                const vc = net.vw1[r][c] / (1 - beta2 ** t);
                net.w1[r][c] -= lr * mc / (Math.sqrt(vc) + eps);
            }
        }
        // b1
        for (let j = 0; j < net.b1.length; j++) {
            net.mb1[j] = beta1 * net.mb1[j] + (1 - beta1) * grads.db1[j];
            net.vb1[j] = beta2 * net.vb1[j] + (1 - beta2) * grads.db1[j] ** 2;
            const mc = net.mb1[j] / (1 - beta1 ** t);
            const vc = net.vb1[j] / (1 - beta2 ** t);
            net.b1[j] -= lr * mc / (Math.sqrt(vc) + eps);
        }
        // w2
        for (let r = 0; r < net.w2.length; r++) {
            for (let c = 0; c < net.w2[0].length; c++) {
                net.mw2[r][c] = beta1 * net.mw2[r][c] + (1 - beta1) * grads.dw2[r][c];
                net.vw2[r][c] = beta2 * net.vw2[r][c] + (1 - beta2) * grads.dw2[r][c] ** 2;
                const mc = net.mw2[r][c] / (1 - beta1 ** t);
                const vc = net.vw2[r][c] / (1 - beta2 ** t);
                net.w2[r][c] -= lr * mc / (Math.sqrt(vc) + eps);
            }
        }
        // b2
        for (let j = 0; j < net.b2.length; j++) {
            net.mb2[j] = beta1 * net.mb2[j] + (1 - beta1) * grads.db2[j];
            net.vb2[j] = beta2 * net.vb2[j] + (1 - beta2) * grads.db2[j] ** 2;
            const mc = net.mb2[j] / (1 - beta1 ** t);
            const vc = net.vb2[j] / (1 - beta2 ** t);
            net.b2[j] -= lr * mc / (Math.sqrt(vc) + eps);
        }
    }

    // Train discriminator: maximize log(D(real)) + log(1 - D(fake))
    function trainD() {
        const batchSize = 64;
        const reals = sampleReal(batchSize);
        const { fakes } = generate(batchSize);

        const { hidden: hReal, output: oReal } = forward(D, reals);
        const { hidden: hFake, output: oFake } = forward(D, fakes);

        const hidSize = D.b1.length;
        const dw1 = [[...new Float64Array(hidSize)]];
        const db1 = new Float64Array(hidSize);
        const dw2 = [];
        for (let k = 0; k < hidSize; k++) dw2.push([0]);
        const db2 = new Float64Array(1);

        for (let i = 0; i < batchSize; i++) {
            // Real: maximize log(sigmoid(D(x))) → gradient = (1 - sigmoid(D(x)))
            const dReal = sigmoid(oReal[i][0]);
            const gradReal = -(1 - dReal) / batchSize;
            // Fake: maximize log(1 - sigmoid(D(G(z)))) → gradient = sigmoid(D(G(z)))
            const dFake = sigmoid(oFake[i][0]);
            const gradFake = dFake / batchSize;

            // Backprop through D for real samples
            db2[0] += gradReal;
            for (let k = 0; k < hidSize; k++) {
                dw2[k][0] += hReal[i][k] * gradReal;
                const dh = D.w2[k][0] * gradReal * (hReal[i][k] > 0 ? 1 : 0);
                dw1[0][k] += reals[i] * dh;
                db1[k] += dh;
            }

            // Backprop through D for fake samples
            db2[0] += gradFake;
            for (let k = 0; k < hidSize; k++) {
                dw2[k][0] += hFake[i][k] * gradFake;
                const dh = D.w2[k][0] * gradFake * (hFake[i][k] > 0 ? 1 : 0);
                dw1[0][k] += fakes[i] * dh;
                db1[k] += dh;
            }
        }

        sgdUpdate(D, { dw1, db1, dw2, db2 }, 0.001);
    }

    // Train generator: minimize log(1 - D(G(z))) ≈ maximize log(D(G(z)))
    function trainG() {
        const batchSize = 64;
        const noise = [];
        for (let i = 0; i < batchSize; i++) noise.push(Math.random() * 2 - 1);

        // Forward through G
        const { hidden: hG, output: oG } = forward(G, noise);
        const fakes = oG.map(o => Math.tanh(o[0]) * 4);

        // Forward through D
        const { hidden: hD, output: oD } = forward(D, fakes);

        // Backprop through G (using -log(D(G(z))) loss)
        const hidSizeG = G.b1.length;
        const hidSizeD = D.b1.length;
        const dw1 = [[...new Float64Array(hidSizeG)]];
        const db1 = new Float64Array(hidSizeG);
        const dw2 = [];
        for (let k = 0; k < hidSizeG; k++) dw2.push([0]);
        const db2 = new Float64Array(1);

        for (let i = 0; i < batchSize; i++) {
            const dScore = sigmoid(oD[i][0]);
            // Gradient of -log(D(G(z))) w.r.t. D's input = -(1-dScore)
            const dLoss_dFake = -(1 - dScore) / batchSize;

            // Gradient through D's network to get d/d(fake)
            let dLoss_dInput = 0;
            for (let k = 0; k < hidSizeD; k++) {
                const dh = D.w2[k][0] * dLoss_dFake * (hD[i][k] > 0 ? 1 : 0);
                dLoss_dInput += D.w1[0][k] * dh;
            }

            // Gradient through tanh: d/d(raw) = dLoss_dInput * 4 * (1 - tanh^2)
            const tanhVal = fakes[i] / 4;
            const dtanh = dLoss_dInput * 4 * (1 - tanhVal * tanhVal);

            // Backprop through G
            db2[0] += dtanh;
            for (let k = 0; k < hidSizeG; k++) {
                dw2[k][0] += hG[i][k] * dtanh;
                const dh = G.w2[k][0] * dtanh * (hG[i][k] > 0 ? 1 : 0);
                dw1[0][k] += noise[i] * dh;
                db1[k] += dh;
            }
        }

        sgdUpdate(G, { dw1, db1, dw2, db2 }, 0.001);
    }

    function trainStep() {
        // Train D more than G for stability
        for (let i = 0; i < 3; i++) trainD();
        trainG();
        step++;
    }

    // --- Drawing ---
    function toScreenX(x) { return ((x - X_MIN) / (X_MAX - X_MIN)) * W; }

    function draw() {
        ctx.clearRect(0, 0, W, H);

        const topH = H * 0.55; // Distribution area
        const botY = H * 0.6;  // Discriminator area
        const botH = H * 0.35;

        // --- Top: distribution histograms ---
        // Generate fake samples for histogram
        const numSamples = 500;
        const { fakes } = generate(numSamples);
        const fakeHist = new Float64Array(BINS);
        for (let i = 0; i < numSamples; i++) {
            const bin = Math.floor((fakes[i] - X_MIN) / binW);
            if (bin >= 0 && bin < BINS) fakeHist[bin]++;
        }
        // Normalize
        let fakeMax = 0;
        for (let i = 0; i < BINS; i++) { fakeHist[i] /= numSamples * binW; if (fakeHist[i] > fakeMax) fakeMax = fakeHist[i]; }
        const maxVal = Math.max(realMax, fakeMax) * 1.2;

        // Draw grid lines
        ctx.strokeStyle = '#1a1a1a';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            const y = topH - (i / 4) * (topH - 20);
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
        }

        // Bars width
        const barW = (W / BINS);

        // Real distribution (cyan, semi-transparent fill)
        for (let i = 0; i < BINS; i++) {
            const x = i * barW;
            const h = (realHist[i] / maxVal) * (topH - 30);
            ctx.fillStyle = 'rgba(0, 229, 255, 0.3)';
            ctx.fillRect(x, topH - h, barW - 1, h);
        }
        // Real distribution outline
        ctx.beginPath();
        ctx.moveTo(0, topH);
        for (let i = 0; i < BINS; i++) {
            const x = i * barW + barW / 2;
            const h = (realHist[i] / maxVal) * (topH - 30);
            ctx.lineTo(x, topH - h);
        }
        ctx.lineTo(W, topH);
        ctx.strokeStyle = '#00e5ff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Fake distribution (pink bars)
        for (let i = 0; i < BINS; i++) {
            const x = i * barW;
            const h = (fakeHist[i] / maxVal) * (topH - 30);
            ctx.fillStyle = 'rgba(255, 0, 85, 0.35)';
            ctx.fillRect(x + 1, topH - h, barW - 2, h);
        }
        // Fake distribution outline
        ctx.beginPath();
        ctx.moveTo(0, topH);
        for (let i = 0; i < BINS; i++) {
            const x = i * barW + barW / 2;
            const h = (fakeHist[i] / maxVal) * (topH - 30);
            ctx.lineTo(x, topH - h);
        }
        ctx.lineTo(W, topH);
        ctx.strokeStyle = '#ff0055';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Labels
        ctx.font = '12px Courier New';
        ctx.textAlign = 'left';
        ctx.fillStyle = '#00e5ff'; ctx.fillText('■ REAL', 10, 20);
        ctx.fillStyle = '#ff0055'; ctx.fillText('■ GENERATOR', 80, 20);
        ctx.fillStyle = '#888'; ctx.textAlign = 'right';
        ctx.fillText(`STEP: ${step}`, W - 10, 20);

        // --- Divider ---
        ctx.strokeStyle = '#333'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(0, botY - 10); ctx.lineTo(W, botY - 10); ctx.stroke();

        // --- Bottom: Discriminator curve ---
        ctx.fillStyle = '#555'; ctx.font = '11px Courier New'; ctx.textAlign = 'left';
        ctx.fillText('DISCRIMINATOR D(x)', 10, botY + 5);
        ctx.fillStyle = '#444'; ctx.textAlign = 'right';
        ctx.fillText('1.0', W - 10, botY + 5);
        ctx.fillText('0.5', W - 10, botY + botH / 2);
        ctx.fillText('0.0', W - 10, botY + botH - 5);

        // 0.5 line
        ctx.strokeStyle = '#333'; ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(0, botY + botH / 2);
        ctx.lineTo(W, botY + botH / 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // D(x) curve
        const dPoints = 100;
        ctx.beginPath();
        for (let i = 0; i <= dPoints; i++) {
            const x = X_MIN + (i / dPoints) * (X_MAX - X_MIN);
            const { output } = forward(D, [x]);
            const dVal = sigmoid(output[0][0]);
            const sx = toScreenX(x);
            const sy = botY + botH - dVal * botH;
            if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
        }
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Glow effect on the D curve
        ctx.beginPath();
        for (let i = 0; i <= dPoints; i++) {
            const x = X_MIN + (i / dPoints) * (X_MAX - X_MIN);
            const { output } = forward(D, [x]);
            const dVal = sigmoid(output[0][0]);
            const sx = toScreenX(x);
            const sy = botY + botH - dVal * botH;
            if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
        }
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.3)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.shadowBlur = 0;
    }

    // --- Controls ---
    stepBtn.addEventListener('click', () => {
        trainStep();
        draw();
    });

    let isAuto = false;
    autoBtn.addEventListener('click', () => {
        if (isAuto) {
            clearInterval(autoInterval);
            autoInterval = null;
            isAuto = false;
            autoBtn.innerText = 'AUTO-TRAIN';
            autoBtn.style.background = '#222';
        } else {
            isAuto = true;
            autoBtn.innerText = 'STOP';
            autoBtn.style.background = '#ff005533';
            autoInterval = setInterval(() => {
                trainStep();
                draw();
            }, 80);
        }
    });

    resetBtn.addEventListener('click', () => {
        if (autoInterval) { clearInterval(autoInterval); autoInterval = null; isAuto = false; autoBtn.innerText = 'AUTO-TRAIN'; autoBtn.style.background = '#222'; }
        initNetworks();
        draw();
    });

    draw();
})();

// ==========================================
// 21. VARIATIONAL AUTOENCODER (VAE)
// ==========================================
(function () {
    const canvas = document.getElementById('vaeCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const trainBtn = document.getElementById('vae-train-btn');
    const autoBtn = document.getElementById('vae-auto-btn');
    const sampleBtn = document.getElementById('vae-sample-btn');
    const resetBtn = document.getElementById('vae-reset-btn');

    const W = canvas.width, H = canvas.height;

    // --- Data: 4 clusters in 2D (like classes of shapes) ---
    const COLORS = ['#00e5ff', '#ff0055', '#00ff88', '#a855f7'];
    const CLUSTER_CENTERS = [[-2, -2], [2, -2], [-2, 2], [2, 2]];
    const CLUSTER_SPREAD = 0.6;
    const PTS_PER_CLUSTER = 20;

    let dataPoints = [];
    function generateData() {
        dataPoints = [];
        for (let c = 0; c < CLUSTER_CENTERS.length; c++) {
            for (let i = 0; i < PTS_PER_CLUSTER; i++) {
                dataPoints.push({
                    x: CLUSTER_CENTERS[c][0] + (Math.random() - 0.5) * 2 * CLUSTER_SPREAD,
                    y: CLUSTER_CENTERS[c][1] + (Math.random() - 0.5) * 2 * CLUSTER_SPREAD,
                    cls: c
                });
            }
        }
    }
    generateData();

    // --- Simple VAE: Encoder maps 2D→2D latent (mean+logvar), Decoder maps 2D→2D ---
    const HLAT = 16;

    function randMat(rows, cols, scale) {
        const m = [];
        for (let r = 0; r < rows; r++) {
            m[r] = [];
            for (let c = 0; c < cols; c++) m[r][c] = (Math.random() - 0.5) * scale;
        }
        return m;
    }
    function zeroVec(n) { return new Float64Array(n); }

    let enc, dec;
    let step = 0;
    let autoInterval = null;
    let sampledPoints = [];

    function initNetworks() {
        const s = 0.5;
        enc = {
            w1: randMat(2, HLAT, s), b1: zeroVec(HLAT),
            wMu: randMat(HLAT, 2, s), bMu: zeroVec(2),
            wLv: randMat(HLAT, 2, s), bLv: zeroVec(2)
        };
        dec = {
            w1: randMat(2, HLAT, s), b1: zeroVec(HLAT),
            w2: randMat(HLAT, 2, s), b2: zeroVec(2)
        };
        step = 0;
        sampledPoints = [];
    }
    initNetworks();

    function relu(x) { return Math.max(0, x); }

    function encode(x, y) {
        const h = new Float64Array(HLAT);
        for (let j = 0; j < HLAT; j++) h[j] = relu(x * enc.w1[0][j] + y * enc.w1[1][j] + enc.b1[j]);
        const mu = new Float64Array(2), lv = new Float64Array(2);
        for (let j = 0; j < 2; j++) {
            let sm = enc.bMu[j], sl = enc.bLv[j];
            for (let k = 0; k < HLAT; k++) { sm += h[k] * enc.wMu[k][j]; sl += h[k] * enc.wLv[k][j]; }
            mu[j] = sm; lv[j] = Math.max(-4, Math.min(4, sl));
        }
        return { h, mu, lv };
    }

    function reparameterize(mu, lv) {
        const z = new Float64Array(2);
        for (let j = 0; j < 2; j++) {
            const std = Math.exp(0.5 * lv[j]);
            z[j] = mu[j] + std * (Math.random() * 2 - 1) * 0.5;
        }
        return z;
    }

    function decode(z) {
        const h = new Float64Array(HLAT);
        for (let j = 0; j < HLAT; j++) h[j] = relu(z[0] * dec.w1[0][j] + z[1] * dec.w1[1][j] + dec.b1[j]);
        const out = new Float64Array(2);
        for (let j = 0; j < 2; j++) {
            let s = dec.b2[j];
            for (let k = 0; k < HLAT; k++) s += h[k] * dec.w2[k][j];
            out[j] = s;
        }
        return { h, out };
    }

    // --- Training step ---
    function trainStep() {
        const lr = 0.0005;
        const beta = 0.2; // KL weight

        for (const pt of dataPoints) {
            const { h: hE, mu, lv } = encode(pt.x, pt.y);
            const z = reparameterize(mu, lv);
            const { h: hD, out } = decode(z);

            // Reconstruction loss gradients
            const dOut = [2 * (out[0] - pt.x), 2 * (out[1] - pt.y)];

            // Backprop decoder
            for (let j = 0; j < 2; j++) {
                dec.b2[j] -= lr * dOut[j];
                for (let k = 0; k < HLAT; k++) {
                    dec.w2[k][j] -= lr * hD[k] * dOut[j];
                }
            }
            for (let k = 0; k < HLAT; k++) {
                let dh = 0;
                for (let j = 0; j < 2; j++) dh += dec.w2[k][j] * dOut[j];
                dh *= (hD[k] > 0 ? 1 : 0);
                dec.b1[k] -= lr * dh;
                dec.w1[0][k] -= lr * z[0] * dh;
                dec.w1[1][k] -= lr * z[1] * dh;
            }

            // Gradient through z to encoder
            const dz = new Float64Array(2);
            for (let j = 0; j < 2; j++) {
                let d = 0;
                for (let k = 0; k < HLAT; k++) {
                    let dh = 0;
                    for (let jj = 0; jj < 2; jj++) dh += dec.w2[k][jj] * dOut[jj];
                    dh *= (hD[k] > 0 ? 1 : 0);
                    d += dec.w1[j][k] * dh;
                }
                dz[j] = d;
            }

            // KL divergence gradient: d/dmu = mu, d/dlv = 0.5*(exp(lv) - 1)
            const dMu = [dz[0] + beta * mu[0], dz[1] + beta * mu[1]];
            const dLv = [
                dz[0] * (z[0] - mu[0]) * 0.5 + beta * 0.5 * (Math.exp(lv[0]) - 1),
                dz[1] * (z[1] - mu[1]) * 0.5 + beta * 0.5 * (Math.exp(lv[1]) - 1)
            ];

            // Backprop encoder
            for (let j = 0; j < 2; j++) {
                enc.bMu[j] -= lr * dMu[j];
                enc.bLv[j] -= lr * dLv[j];
                for (let k = 0; k < HLAT; k++) {
                    enc.wMu[k][j] -= lr * hE[k] * dMu[j];
                    enc.wLv[k][j] -= lr * hE[k] * dLv[j];
                }
            }
            for (let k = 0; k < HLAT; k++) {
                let dh = 0;
                for (let j = 0; j < 2; j++) {
                    dh += enc.wMu[k][j] * dMu[j];
                    dh += enc.wLv[k][j] * dLv[j];
                }
                dh *= (hE[k] > 0 ? 1 : 0);
                enc.b1[k] -= lr * dh;
                enc.w1[0][k] -= lr * pt.x * dh;
                enc.w1[1][k] -= lr * pt.y * dh;
            }
        }
        step++;
    }

    // --- Drawing ---
    const PANEL_W = W / 3;
    const PAD = 15;
    const RANGE = 4;

    function toPanel(px, py, panelIdx) {
        const ox = panelIdx * PANEL_W;
        return {
            sx: ox + PAD + ((px + RANGE) / (2 * RANGE)) * (PANEL_W - 2 * PAD),
            sy: PAD + 20 + ((RANGE - py) / (2 * RANGE)) * (H - 2 * PAD - 30)
        };
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);

        // Panel backgrounds
        for (let i = 0; i < 3; i++) {
            ctx.fillStyle = i === 1 ? 'rgba(168, 85, 247, 0.03)' : 'rgba(255,255,255,0.02)';
            ctx.fillRect(i * PANEL_W + 2, 2, PANEL_W - 4, H - 4);
            ctx.strokeStyle = '#222';
            ctx.strokeRect(i * PANEL_W, 0, PANEL_W, H);
        }

        // Labels
        ctx.font = '11px Courier New'; ctx.textAlign = 'center';
        ctx.fillStyle = '#666';
        ctx.fillText('INPUT DATA', PANEL_W / 2, 14);
        ctx.fillText('LATENT SPACE (z)', PANEL_W + PANEL_W / 2, 14);
        ctx.fillText('RECONSTRUCTION', 2 * PANEL_W + PANEL_W / 2, 14);

        ctx.fillStyle = '#444'; ctx.textAlign = 'right';
        ctx.fillText(`STEP: ${step}`, W - 10, 14);

        // Encode all data points
        const encoded = dataPoints.map(pt => {
            const { mu, lv } = encode(pt.x, pt.y);
            const z = reparameterize(mu, lv);
            const { out } = decode(z);
            return { ...pt, mu, lv, z, recon: out };
        });

        // Panel 0: Input data
        for (const pt of dataPoints) {
            const { sx, sy } = toPanel(pt.x, pt.y, 0);
            ctx.beginPath(); ctx.arc(sx, sy, 4, 0, Math.PI * 2);
            ctx.fillStyle = COLORS[pt.cls]; ctx.globalAlpha = 0.7; ctx.fill(); ctx.globalAlpha = 1;
        }

        // Panel 1: Latent space
        // Draw faint grid
        ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = 0.5;
        for (let v = -3; v <= 3; v++) {
            const { sx: sx1, sy: sy1 } = toPanel(v, -RANGE, 1);
            const { sx: sx2, sy: sy2 } = toPanel(v, RANGE, 1);
            ctx.beginPath(); ctx.moveTo(sx1, sy1); ctx.lineTo(sx2, sy2); ctx.stroke();
            const { sx: sx3, sy: sy3 } = toPanel(-RANGE, v, 1);
            const { sx: sx4, sy: sy4 } = toPanel(RANGE, v, 1);
            ctx.beginPath(); ctx.moveTo(sx3, sy3); ctx.lineTo(sx4, sy4); ctx.stroke();
        }

        // Draw encoded points as mu with uncertainty ellipses
        for (const e of encoded) {
            const { sx, sy } = toPanel(e.mu[0], e.mu[1], 1);
            // Uncertainty ellipse (from logvar)
            const rx = Math.exp(0.5 * e.lv[0]) * (PANEL_W - 2 * PAD) / (2 * RANGE) * 0.5;
            const ry = Math.exp(0.5 * e.lv[1]) * (H - 2 * PAD - 30) / (2 * RANGE) * 0.5;
            ctx.beginPath(); ctx.ellipse(sx, sy, Math.min(rx, 30), Math.min(ry, 30), 0, 0, Math.PI * 2);
            ctx.fillStyle = COLORS[e.cls].replace(')', ', 0.08)').replace('rgb', 'rgba');
            ctx.fill();
            ctx.strokeStyle = COLORS[e.cls].replace(')', ', 0.2)').replace('rgb', 'rgba');
            ctx.lineWidth = 1; ctx.stroke();

            // Point at mean
            ctx.beginPath(); ctx.arc(sx, sy, 3, 0, Math.PI * 2);
            ctx.fillStyle = COLORS[e.cls]; ctx.globalAlpha = 0.8; ctx.fill(); ctx.globalAlpha = 1;
        }

        // Draw sampled points in latent space
        for (const sp of sampledPoints) {
            const { sx, sy } = toPanel(sp.z[0], sp.z[1], 1);
            ctx.beginPath(); ctx.arc(sx, sy, 5, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(168, 85, 247, 0.6)'; ctx.fill();
            ctx.strokeStyle = '#a855f7'; ctx.lineWidth = 1.5; ctx.stroke();
        }

        // Panel 2: Reconstructed data
        for (const e of encoded) {
            const { sx, sy } = toPanel(e.recon[0], e.recon[1], 2);
            ctx.beginPath(); ctx.arc(sx, sy, 4, 0, Math.PI * 2);
            ctx.fillStyle = COLORS[e.cls]; ctx.globalAlpha = 0.7; ctx.fill(); ctx.globalAlpha = 1;
        }

        // Draw sampled point reconstructions
        for (const sp of sampledPoints) {
            const { sx, sy } = toPanel(sp.recon[0], sp.recon[1], 2);
            ctx.beginPath(); ctx.arc(sx, sy, 6, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(168, 85, 247, 0.5)'; ctx.fill();
            ctx.strokeStyle = '#a855f7'; ctx.lineWidth = 1.5; ctx.stroke();

            // Draw star marker
            ctx.beginPath();
            ctx.moveTo(sx, sy - 3); ctx.lineTo(sx, sy + 3);
            ctx.moveTo(sx - 3, sy); ctx.lineTo(sx + 3, sy);
            ctx.strokeStyle = '#fff'; ctx.lineWidth = 1; ctx.stroke();
        }

        // Encoder/Decoder arrows
        ctx.strokeStyle = '#333'; ctx.lineWidth = 2;
        // Encoder arrow
        const ax1 = PANEL_W - 5, ax2 = PANEL_W + 5, ay = H / 2;
        ctx.beginPath(); ctx.moveTo(ax1, ay); ctx.lineTo(ax2, ay); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(ax2, ay); ctx.lineTo(ax2 - 5, ay - 4); ctx.lineTo(ax2 - 5, ay + 4); ctx.fill();
        ctx.fillStyle = '#555'; ctx.font = '9px Courier New'; ctx.textAlign = 'center';
        ctx.fillText('ENC', PANEL_W, ay - 8);

        // Decoder arrow
        const bx1 = 2 * PANEL_W - 5, bx2 = 2 * PANEL_W + 5;
        ctx.strokeStyle = '#333'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(bx1, ay); ctx.lineTo(bx2, ay); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(bx2, ay); ctx.lineTo(bx2 - 5, ay - 4); ctx.lineTo(bx2 - 5, ay + 4); ctx.fillStyle = '#333'; ctx.fill();
        ctx.fillStyle = '#555'; ctx.font = '9px Courier New';
        ctx.fillText('DEC', 2 * PANEL_W, ay - 8);
    }

    // --- Controls ---
    trainBtn.addEventListener('click', () => { trainStep(); draw(); });

    let isAuto = false;
    autoBtn.addEventListener('click', () => {
        if (isAuto) {
            clearInterval(autoInterval); autoInterval = null; isAuto = false;
            autoBtn.innerText = 'AUTO-TRAIN'; autoBtn.style.background = '#222';
        } else {
            isAuto = true; autoBtn.innerText = 'STOP'; autoBtn.style.background = '#ff005533';
            autoInterval = setInterval(() => { trainStep(); draw(); }, 60);
        }
    });

    sampleBtn.addEventListener('click', () => {
        sampledPoints = [];
        for (let i = 0; i < 5; i++) {
            const z = [Math.random() * 4 - 2, Math.random() * 4 - 2];
            const { out } = decode(z);
            sampledPoints.push({ z, recon: out });
        }
        draw();
    });

    resetBtn.addEventListener('click', () => {
        if (autoInterval) { clearInterval(autoInterval); autoInterval = null; isAuto = false; autoBtn.innerText = 'AUTO-TRAIN'; autoBtn.style.background = '#222'; }
        initNetworks();
        generateData();
        draw();
    });

    draw();
})();

// ==========================================
// 13. MANIFOLDS & LATENT SPACES
// ==========================================
(function () {
    const mapCanvas = document.getElementById('latentMapCanvas');
    const outCanvas = document.getElementById('latentOutCanvas');
    if (!mapCanvas || !outCanvas) return;

    const mapCtx = mapCanvas.getContext('2d');
    const outCtx = outCanvas.getContext('2d');

    let isDragging = false;
    // Current Latent coordinate (normalized 0 to 1)
    let zx = 0.5;
    let zy = 0.5;

    // Define 4 "Concepts" at the corners of our 2D Latent Space
    // [R, G, B, Radius, Roundness (0=square, 1=circle), Rotation]
    const concepts = {
        tl: [255, 50, 50, 60, 1.0, 0],       // Red Circle (Apple)
        tr: [255, 200, 50, 40, 0.4, Math.PI / 4], // Yellow tilted ellipse (Lemon)
        bl: [50, 100, 255, 80, 0.8, 0],      // Blue large rounded rect (Watermelon)
        br: [50, 200, 50, 50, 0.2, Math.PI / 2]  // Green sharp ellipse 
    };

    function lerp(a, b, t) { return a + (b - a) * t; }

    function getInterpolatedFeature(zx, zy) {
        let f = [];
        for (let i = 0; i < 6; i++) {
            // Bilinear interpolation
            let top = lerp(concepts.tl[i], concepts.tr[i], zx);
            let bottom = lerp(concepts.bl[i], concepts.br[i], zx);
            f.push(lerp(top, bottom, zy));
        }
        return f;
    }

    function drawMap() {
        mapCtx.clearRect(0, 0, mapCanvas.width, mapCanvas.height);

        // Draw grid/background
        let grad = mapCtx.createLinearGradient(0, 0, mapCanvas.width, mapCanvas.height);
        grad.addColorStop(0, "#2a0a0a"); // Reddish
        grad.addColorStop(1, "#0a2a0a"); // Greenish
        mapCtx.fillStyle = grad;
        mapCtx.fillRect(0, 0, mapCanvas.width, mapCanvas.height);

        mapCtx.strokeStyle = 'rgba(255,255,255,0.1)';
        mapCtx.lineWidth = 1;
        for (let i = 1; i < 5; i++) {
            mapCtx.beginPath(); mapCtx.moveTo(0, i * 40); mapCtx.lineTo(200, i * 40); mapCtx.stroke();
            mapCtx.beginPath(); mapCtx.moveTo(i * 40, 0); mapCtx.lineTo(i * 40, 200); mapCtx.stroke();
        }

        // Draw Latent Point
        const px = zx * mapCanvas.width;
        const py = zy * mapCanvas.height;
        mapCtx.beginPath();
        mapCtx.arc(px, py, 6, 0, Math.PI * 2);
        mapCtx.fillStyle = '#ff0055';
        mapCtx.fill();
        mapCtx.strokeStyle = '#fff';
        mapCtx.lineWidth = 2;
        mapCtx.stroke();


    }

    // Function to draw a rounded polygon / superellipse shape
    function drawOutput() {
        outCtx.clearRect(0, 0, outCanvas.width, outCanvas.height);

        const f = getInterpolatedFeature(zx, zy);
        const [r, g, b, radius, roundness, rotation] = f;

        const cx = outCanvas.width / 2;
        const cy = outCanvas.height / 2;

        outCtx.save();
        outCtx.translate(cx, cy);
        outCtx.rotate(rotation);

        outCtx.beginPath();
        // Morph between a diamond/square (roundness 0) and a circle (roundness 1)
        const steps = 60;
        for (let i = 0; i <= steps; i++) {
            let theta = (i / steps) * Math.PI * 2;
            let cosT = Math.cos(theta);
            let sinT = Math.sin(theta);

            // Adjust radius based on roundness to morph shapes
            let x = Math.sign(cosT) * Math.pow(Math.abs(cosT), lerp(1, 0.5, roundness)) * radius;
            let y = Math.sign(sinT) * Math.pow(Math.abs(sinT), lerp(1, 0.5, roundness)) * radius;

            if (i === 0) outCtx.moveTo(x, y);
            else outCtx.lineTo(x, y);
        }
        outCtx.closePath();

        outCtx.fillStyle = `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`;
        outCtx.fill();
        outCtx.lineWidth = 3;
        outCtx.strokeStyle = '#fff';
        outCtx.stroke();

        outCtx.restore();
    }

    function update(e) {
        const rect = mapCanvas.getBoundingClientRect();
        zx = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        zy = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
        drawMap();
        drawOutput();
    }

    mapCanvas.addEventListener('mousedown', (e) => { isDragging = true; update(e); });
    window.addEventListener('mousemove', (e) => { if (isDragging) update(e); });
    window.addEventListener('mouseup', () => { isDragging = false; });

    // Touch support
    mapCanvas.addEventListener('touchstart', (e) => { isDragging = true; update(e.touches[0]); e.preventDefault(); });
    window.addEventListener('touchmove', (e) => { if (isDragging) update(e.touches[0]); });
    window.addEventListener('touchend', () => { isDragging = false; });

    drawMap();
    drawOutput();
})();

// ==========================================
// 10. MARKOV CHAIN
// ==========================================
(function () {
    const canvas = document.getElementById('markovCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const stepBtn = document.getElementById('markov-step-btn');
    const autoBtn = document.getElementById('markov-auto-btn');
    const resetBtn = document.getElementById('markov-reset-btn');

    const width = canvas.width, height = canvas.height;

    // States: Sunny, Rainy, Cloudy
    const STATES = [
        { label: 'SUNNY', emoji: '☀', color: '#fbbf24', x: 150, y: 100 },
        { label: 'RAINY', emoji: '🌧', color: '#3b82f6', x: 450, y: 100 },
        { label: 'CLOUDY', emoji: '☁', color: '#9ca3af', x: 300, y: 280 }
    ];

    // Transition matrix: P[from][to]
    const P = [
        [0.6, 0.1, 0.3],  // Sunny → ...
        [0.2, 0.5, 0.3],  // Rainy → ...
        [0.3, 0.3, 0.4]   // Cloudy → ...
    ];

    let current = 0;
    let visits = [0, 0, 0];
    let totalSteps = 0;
    let autoInterval = null;
    let history = [0];

    function sampleNext(state) {
        const r = Math.random();
        let cum = 0;
        for (let i = 0; i < P[state].length; i++) {
            cum += P[state][i];
            if (r < cum) return i;
        }
        return P[state].length - 1;
    }

    function drawArrow(fromX, fromY, toX, toY, prob, isSelf, stateIdx) {
        if (prob < 0.01) return;
        const alpha = 0.3 + prob * 0.7;
        const lw = 1 + prob * 5;

        if (isSelf) {
            // Self-loop: draw a small arc above/below the node
            const loopRadius = 25;
            const angles = [-Math.PI / 2, -Math.PI / 2, Math.PI / 4]; // different angles for each state
            const baseAngle = stateIdx === 2 ? Math.PI / 2 : -Math.PI / 2;
            const loopCX = fromX + Math.cos(baseAngle) * 40;
            const loopCY = fromY + Math.sin(baseAngle) * 40;

            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.6})`;
            ctx.lineWidth = lw;
            ctx.beginPath();
            ctx.arc(loopCX, loopCY, loopRadius, 0, Math.PI * 1.7);
            ctx.stroke();

            // Probability label
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.font = '11px Courier New';
            ctx.textAlign = 'center';
            ctx.fillText(prob.toFixed(1), loopCX, loopCY + (stateIdx === 2 ? loopRadius + 14 : -loopRadius - 4));
            return;
        }

        const nodeRadius = 28;
        // Calculate direction
        const dx = toX - fromX, dy = toY - fromY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const ux = dx / dist, uy = dy / dist;

        // Perpendicular offset to prevent overlapping bidirectional arrows
        const perpX = -uy * 8, perpY = ux * 8;

        const startX = fromX + ux * nodeRadius + perpX;
        const startY = fromY + uy * nodeRadius + perpY;
        const endX = toX - ux * (nodeRadius + 8) + perpX;
        const endY = toY - uy * (nodeRadius + 8) + perpY;

        ctx.strokeStyle = `rgba(0, 229, 255, ${alpha})`;
        ctx.lineWidth = lw;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Arrowhead
        const arrowSize = 6 + prob * 4;
        const angle = Math.atan2(endY - startY, endX - startX);
        ctx.fillStyle = `rgba(0, 229, 255, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(endX - Math.cos(angle - 0.4) * arrowSize, endY - Math.sin(angle - 0.4) * arrowSize);
        ctx.lineTo(endX - Math.cos(angle + 0.4) * arrowSize, endY - Math.sin(angle + 0.4) * arrowSize);
        ctx.closePath();
        ctx.fill();

        // Prob label at midpoint
        const midX = (startX + endX) / 2 + perpX * 0.8;
        const midY = (startY + endY) / 2 + perpY * 0.8;
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.font = '11px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText(prob.toFixed(1), midX, midY - 4);
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);

        // Draw transition arrows
        for (let from = 0; from < 3; from++) {
            for (let to = 0; to < 3; to++) {
                drawArrow(
                    STATES[from].x, STATES[from].y,
                    STATES[to].x, STATES[to].y,
                    P[from][to],
                    from === to, from
                );
            }
        }

        // Draw state nodes
        STATES.forEach((s, i) => {
            const isActive = (i === current);
            const r = 28;

            // Glow for active state
            if (isActive) {
                ctx.beginPath();
                ctx.arc(s.x, s.y, r + 8, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${hexToRgb(s.color)}, 0.15)`;
                ctx.fill();
                ctx.strokeStyle = s.color;
                ctx.lineWidth = 2;
                ctx.stroke();
            }

            // Fill circle
            ctx.beginPath();
            ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
            ctx.fillStyle = isActive ? '#1a1a1a' : '#0f0f0f';
            ctx.fill();
            ctx.strokeStyle = isActive ? s.color : '#444';
            ctx.lineWidth = isActive ? 2.5 : 1.5;
            ctx.stroke();

            if (isActive) {
                ctx.shadowBlur = 12;
                ctx.shadowColor = s.color;
                ctx.stroke();
                ctx.shadowBlur = 0;
            }

            // Emoji
            ctx.font = '20px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(s.emoji, s.x, s.y - 1);

            // Label below
            ctx.fillStyle = isActive ? '#fff' : '#888';
            ctx.font = `${isActive ? 'bold ' : ''}11px Courier New`;
            ctx.textBaseline = 'top';
            ctx.fillText(s.label, s.x, s.y + r + 6);
        });

        // Visit histogram (right side)
        const histX = 30, histW = width - 60, histY = height - 55, histH = 30;
        ctx.fillStyle = '#888'; ctx.font = '11px Courier New'; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
        ctx.fillText(`Step: ${totalSteps}`, width / 2, histY - 8);

        if (totalSteps > 0) {
            const barGap = 6;
            const barW = (histW - barGap * 2) / 3;
            for (let i = 0; i < 3; i++) {
                const frac = visits[i] / totalSteps;
                const bx = histX + i * (barW + barGap);
                const bh = frac * histH;

                // Bar background
                ctx.fillStyle = '#1a1a1a';
                ctx.fillRect(bx, histY, barW, histH);

                // Filled bar
                ctx.fillStyle = STATES[i].color;
                ctx.globalAlpha = 0.7;
                ctx.fillRect(bx, histY + histH - bh, barW, bh);
                ctx.globalAlpha = 1;

                // Percentage label
                ctx.fillStyle = '#fff';
                ctx.font = '10px Courier New';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
                ctx.fillText(`${(frac * 100).toFixed(0)}%`, bx + barW / 2, histY - 1);
            }
        }

        // Sequence trail (last few states)
        const trailLen = Math.min(history.length, 20);
        if (trailLen > 0) {
            ctx.font = '12px sans-serif';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            let tx = 20;
            const ty = histY - 25;
            ctx.fillStyle = '#555';
            ctx.font = '10px Courier New';
            ctx.fillText('TRACE:', tx, ty);
            tx += 50;
            const start = Math.max(0, history.length - 15);
            for (let i = start; i < history.length; i++) {
                const op = 0.3 + (i - start) / (history.length - start) * 0.7;
                ctx.globalAlpha = op;
                ctx.font = '14px sans-serif';
                ctx.fillText(STATES[history[i]].emoji, tx, ty);
                tx += 18;
            }
            ctx.globalAlpha = 1;
        }
    }

    function hexToRgb(hex) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `${r}, ${g}, ${b}`;
    }

    function step() {
        const next = sampleNext(current);
        current = next;
        visits[current]++;
        totalSteps++;
        history.push(current);
        draw();
    }

    stepBtn.addEventListener('click', step);

    autoBtn.addEventListener('click', function () {
        if (autoInterval) {
            clearInterval(autoInterval);
            autoInterval = null;
            this.innerText = 'AUTO-WALK';
            this.style.color = '#00e5ff';
        } else {
            this.innerText = 'STOP';
            this.style.color = '#ff0055';
            autoInterval = setInterval(step, 250);
        }
    });

    resetBtn.addEventListener('click', () => {
        if (autoInterval) {
            clearInterval(autoInterval);
            autoInterval = null;
            autoBtn.innerText = 'AUTO-WALK';
            autoBtn.style.color = '#00e5ff';
        }
        current = 0;
        visits = [0, 0, 0];
        totalSteps = 0;
        history = [0];
        draw();
    });

    draw();
})();

// ==========================================
// 11. RNN WORLD MODEL
// ==========================================
(function () {
    const canvas = document.getElementById('rnnCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const leftBtn = document.getElementById('rnn-left-btn');
    const rightBtn = document.getElementById('rnn-right-btn');
    const autoBtn = document.getElementById('rnn-auto-btn');
    const resetBtn = document.getElementById('rnn-reset-btn');

    const CW = canvas.width, CH = canvas.height;
    const GRID_SIZE = 10;
    const HIDDEN_SIZE = 6;

    // State
    let agentPos = 4;
    let hiddenState = new Array(HIDDEN_SIZE).fill(0);
    let predictedPos = -1;
    let history = []; // {pos, action, nextPos}
    let correct = 0;
    let total = 0;
    let autoWalking = false;
    let autoTimer = null;
    let animOffset = 0;
    let lastPredictionCorrect = null;

    // Simple learned weights (simulate RNN learning)
    // The "model" learns a simple pattern: action -1 → pos decrements, action +1 → pos increments
    let weights = { actionToHidden: new Array(HIDDEN_SIZE).fill(0), posToHidden: new Array(HIDDEN_SIZE).fill(0) };
    let bias = 0;
    let learnRate = 0.12;

    function resetModel() {
        agentPos = 4;
        hiddenState = new Array(HIDDEN_SIZE).fill(0);
        predictedPos = -1;
        history = [];
        correct = 0;
        total = 0;
        lastPredictionCorrect = null;
        weights.actionToHidden = new Array(HIDDEN_SIZE).fill(0).map(() => (Math.random() - 0.5) * 0.3);
        weights.posToHidden = new Array(HIDDEN_SIZE).fill(0).map(() => (Math.random() - 0.5) * 0.3);
        bias = 0;
        draw();
    }

    function sigmoid(x) {
        return 1 / (1 + Math.exp(-Math.max(-10, Math.min(10, x))));
    }

    function rnnStep(pos, action) {
        // Update hidden state
        for (let i = 0; i < HIDDEN_SIZE; i++) {
            const input = pos / GRID_SIZE * weights.posToHidden[i] + action * weights.actionToHidden[i] + hiddenState[i] * 0.5;
            hiddenState[i] = Math.tanh(input);
        }

        // Predict next position from hidden state
        let prediction = 0;
        for (let i = 0; i < HIDDEN_SIZE; i++) {
            prediction += hiddenState[i];
        }
        prediction = pos + Math.round(prediction / HIDDEN_SIZE * 2);
        return Math.max(0, Math.min(GRID_SIZE - 1, prediction));
    }

    function learn(pos, action, actualNext) {
        // Simple gradient: push weights toward correct mapping
        const error = actualNext - predictedPos;
        if (Math.abs(error) > 0) {
            for (let i = 0; i < HIDDEN_SIZE; i++) {
                weights.actionToHidden[i] += learnRate * error * action * 0.1;
                weights.posToHidden[i] += learnRate * error * (pos / GRID_SIZE) * 0.05;
            }
        }
    }

    function step(action) {
        const oldPos = agentPos;

        // Get prediction BEFORE moving
        predictedPos = rnnStep(oldPos, action);

        // Actually move
        const newPos = Math.max(0, Math.min(GRID_SIZE - 1, oldPos + action));
        agentPos = newPos;

        // Score
        total++;
        lastPredictionCorrect = predictedPos === newPos;
        if (lastPredictionCorrect) correct++;

        // Learn from this step
        learn(oldPos, action, newPos);

        history.push({ pos: oldPos, action, nextPos: newPos });
        if (history.length > 30) history.shift();

        draw();
    }

    function draw() {
        animOffset = (animOffset + 0.02) % (Math.PI * 2);
        ctx.clearRect(0, 0, CW, CH);

        // Background
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, CW, CH);

        // Title labels
        ctx.font = '9px Courier New';
        ctx.fillStyle = '#555';
        ctx.textAlign = 'left';
        ctx.fillText('WORLD MODEL', 20, 18);

        ctx.textAlign = 'right';
        ctx.fillText('RNN PREDICTION', CW - 20, 18);

        // === GRID (top area) ===
        const gridY = 40;
        const cellW = (CW - 80) / GRID_SIZE;
        const cellH = 42;
        const gridX = 40;

        ctx.font = '8px Courier New';
        ctx.fillStyle = '#333';
        ctx.textAlign = 'left';
        ctx.fillText('ENVIRONMENT', gridX, gridY - 6);

        for (let i = 0; i < GRID_SIZE; i++) {
            const x = gridX + i * cellW;
            ctx.fillStyle = '#111';
            ctx.strokeStyle = '#222';
            ctx.lineWidth = 1;
            ctx.fillRect(x, gridY, cellW - 2, cellH);
            ctx.strokeRect(x, gridY, cellW - 2, cellH);

            // Cell index
            ctx.font = '8px Courier New';
            ctx.fillStyle = '#333';
            ctx.textAlign = 'center';
            ctx.fillText(i, x + cellW / 2 - 1, gridY + cellH + 12);
        }

        // Prediction ghost (draw before agent so agent renders on top)
        if (predictedPos >= 0 && total > 0) {
            const px = gridX + predictedPos * cellW + cellW / 2 - 1;
            const py = gridY + cellH / 2;
            ctx.save();
            ctx.globalAlpha = 0.35 + 0.15 * Math.sin(animOffset * 3);
            ctx.beginPath();
            ctx.arc(px, py, 14, 0, Math.PI * 2);
            const predColor = lastPredictionCorrect ? '#00ff88' : '#ff6b6b';
            ctx.fillStyle = predColor;
            ctx.fill();
            ctx.restore();

            // Label
            ctx.font = '8px Courier New';
            ctx.fillStyle = lastPredictionCorrect ? '#00ff88' : '#ff6b6b';
            ctx.textAlign = 'center';
            ctx.fillText(lastPredictionCorrect ? 'PREDICTED ✓' : 'PREDICTED ✗', px, py - 20);
        }

        // Agent
        const ax = gridX + agentPos * cellW + cellW / 2 - 1;
        const ay = gridY + cellH / 2;
        ctx.beginPath();
        ctx.arc(ax, ay, 12, 0, Math.PI * 2);
        ctx.fillStyle = '#00e5ff';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00e5ff';
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.font = 'bold 9px Courier New';
        ctx.fillStyle = '#000';
        ctx.textAlign = 'center';
        ctx.fillText('A', ax, ay + 3);

        // === HIDDEN STATE (middle area) ===
        const hsY = gridY + cellH + 38;
        const hsCellW = 70;
        const hsCellH = 36;
        const hsX = (CW - HIDDEN_SIZE * hsCellW) / 2;

        ctx.font = '8px Courier New';
        ctx.fillStyle = '#333';
        ctx.textAlign = 'left';
        ctx.fillText('HIDDEN STATE h(t)', hsX, hsY - 6);

        // Connection lines from grid to hidden
        ctx.strokeStyle = '#151515';
        ctx.lineWidth = 0.5;
        for (let i = 0; i < HIDDEN_SIZE; i++) {
            ctx.beginPath();
            ctx.moveTo(ax, gridY + cellH);
            ctx.lineTo(hsX + i * hsCellW + hsCellW / 2, hsY);
            ctx.stroke();
        }

        for (let i = 0; i < HIDDEN_SIZE; i++) {
            const x = hsX + i * hsCellW;
            const val = hiddenState[i];
            const absVal = Math.abs(val);

            // Cell background with activation color
            const r = val < 0 ? Math.floor(absVal * 200) : 0;
            const g = val > 0 ? Math.floor(absVal * 200) : 0;
            const b = 30;
            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            ctx.fillRect(x, hsY, hsCellW - 4, hsCellH);

            // Glow for strong activations
            if (absVal > 0.3) {
                ctx.strokeStyle = val > 0 ? `rgba(0, ${Math.floor(absVal * 255)}, 0, 0.5)` : `rgba(${Math.floor(absVal * 255)}, 0, 0, 0.5)`;
                ctx.lineWidth = 1.5;
                ctx.strokeRect(x, hsY, hsCellW - 4, hsCellH);
            } else {
                ctx.strokeStyle = '#222';
                ctx.lineWidth = 1;
                ctx.strokeRect(x, hsY, hsCellW - 4, hsCellH);
            }

            // Value label
            ctx.font = '10px Courier New';
            ctx.fillStyle = '#888';
            ctx.textAlign = 'center';
            ctx.fillText(val.toFixed(2), x + hsCellW / 2 - 2, hsY + hsCellH / 2 + 4);
        }

        // Recurrence arrow
        const arrowY = hsY + hsCellH + 6;
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 3]);
        ctx.beginPath();
        ctx.moveTo(hsX + HIDDEN_SIZE * hsCellW - 4, hsY + hsCellH / 2);
        ctx.lineTo(hsX + HIDDEN_SIZE * hsCellW + 16, hsY + hsCellH / 2);
        ctx.lineTo(hsX + HIDDEN_SIZE * hsCellW + 16, hsY + hsCellH + 16);
        ctx.lineTo(hsX - 16, hsY + hsCellH + 16);
        ctx.lineTo(hsX - 16, hsY + hsCellH / 2);
        ctx.lineTo(hsX, hsY + hsCellH / 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Arrow head
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.moveTo(hsX, hsY + hsCellH / 2);
        ctx.lineTo(hsX - 6, hsY + hsCellH / 2 - 4);
        ctx.lineTo(hsX - 6, hsY + hsCellH / 2 + 4);
        ctx.fill();

        ctx.font = '8px Courier New';
        ctx.fillStyle = '#fbbf24';
        ctx.textAlign = 'center';
        ctx.fillText('h(t) → h(t+1)', CW / 2, arrowY + 20);

        // === ACCURACY (bottom area) ===
        const accY = arrowY + 38;
        const barW = CW - 80;
        const barH = 16;
        const accPct = total > 0 ? correct / total : 0;

        ctx.font = '9px Courier New';
        ctx.fillStyle = '#555';
        ctx.textAlign = 'left';
        ctx.fillText('PREDICTION ACCURACY', 40, accY - 4);

        // Bar
        ctx.fillStyle = '#111';
        ctx.fillRect(40, accY, barW, barH);
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.strokeRect(40, accY, barW, barH);

        if (accPct > 0) {
            const grad = ctx.createLinearGradient(40, 0, 40 + barW * accPct, 0);
            grad.addColorStop(0, '#00e5ff33');
            grad.addColorStop(1, '#00e5ff');
            ctx.fillStyle = grad;
            ctx.fillRect(41, accY + 1, (barW - 2) * accPct, barH - 2);
        }

        ctx.font = 'bold 10px Courier New';
        ctx.textAlign = 'right';
        ctx.fillStyle = accPct > 0.7 ? '#00ff88' : (accPct > 0.4 ? '#fbbf24' : '#888');
        ctx.fillText(`${correct}/${total} (${(accPct * 100).toFixed(0)}%)`, 40 + barW - 4, accY + 12);

        // === STEP HISTORY (bottom strip) ===
        const histY = accY + barH + 20;
        ctx.font = '8px Courier New';
        ctx.fillStyle = '#333';
        ctx.textAlign = 'left';
        ctx.fillText('RECENT ACTIONS', 40, histY);

        const maxShow = Math.min(history.length, 20);
        const startIdx = history.length - maxShow;
        for (let i = 0; i < maxShow; i++) {
            const h = history[startIdx + i];
            const x = 40 + i * 26;
            ctx.fillStyle = h.action > 0 ? '#00e5ff' : '#ff6b6b';
            ctx.font = '11px Courier New';
            ctx.textAlign = 'center';
            ctx.fillText(h.action > 0 ? '→' : '←', x + 13, histY + 14);
        }
    }

    leftBtn.addEventListener('click', () => step(-1));
    rightBtn.addEventListener('click', () => step(1));

    autoBtn.addEventListener('click', () => {
        autoWalking = !autoWalking;
        autoBtn.textContent = autoWalking ? 'STOP' : 'AUTO-WALK';
        autoBtn.style.borderColor = autoWalking ? '#ff6b6b' : '#00e5ff';
        autoBtn.style.color = autoWalking ? '#ff6b6b' : '#00e5ff';

        if (autoWalking) {
            let pattern = 0; // oscillating pattern
            autoTimer = setInterval(() => {
                // Simple oscillating walk pattern
                if (agentPos >= GRID_SIZE - 2) pattern = -1;
                else if (agentPos <= 1) pattern = 1;
                else if (Math.random() < 0.15) pattern = -pattern; // occasional reversal
                if (pattern === 0) pattern = 1;
                step(pattern);
            }, 350);
        } else {
            clearInterval(autoTimer);
        }
    });

    resetBtn.addEventListener('click', () => {
        if (autoWalking) {
            autoWalking = false;
            clearInterval(autoTimer);
            autoBtn.textContent = 'AUTO-WALK';
            autoBtn.style.borderColor = '#00e5ff';
            autoBtn.style.color = '#00e5ff';
        }
        resetModel();
    });

    resetModel();
})();

// ==========================================
// 20. CHAIN OF THOUGHT (DeepSeek R1)
// ==========================================
(function () {
    const canvas = document.getElementById('cotCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const runBtn = document.getElementById('cot-run-btn');
    const nextBtn = document.getElementById('cot-next-btn');

    const CW = canvas.width, CH = canvas.height;

    const prompts = [
        {
            question: 'What is 17 × 24?',
            thoughts: [
                'Break this into parts...',
                '17 × 20 = 340',
                '17 × 4 = 68',
                '340 + 68 = ...',
                'Wait, let me verify:',
                '68 + 340 = 408 ✓'
            ],
            answer: '408',
            correct: true
        },
        {
            question: 'Is 97 prime?',
            thoughts: [
                'Check divisibility...',
                '97 / 2 = 48.5, no',
                '97 / 3 = 32.3, no',
                '97 / 5 = 19.4, no',
                '97 / 7 = 13.8, no',
                '√97 ≈ 9.8, done checking'
            ],
            answer: 'Yes, 97 is prime',
            correct: true
        },
        {
            question: 'Sum of 1 to 100?',
            thoughts: [
                'Pair numbers from ends...',
                '1 + 100 = 101',
                '2 + 99 = 101',
                'There are 50 such pairs',
                'Hmm, so 50 × 101 = ...',
                'Wait: 50 × 100 = 5000',
                '50 × 1 = 50',
                '5000 + 50 = 5050 ✓'
            ],
            answer: '5050',
            correct: true
        },
        {
            question: 'What day follows the day before yesterday if today is Wednesday?',
            thoughts: [
                'Today is Wednesday...',
                'Day before yesterday = Monday',
                'Hmm, "follows" Monday...',
                'Wait, re-read carefully:',
                'The day that follows Monday',
                'That would be Tuesday ✓'
            ],
            answer: 'Tuesday',
            correct: true
        }
    ];

    let currentPrompt = 0;
    let visibleTokens = 0;
    let showAnswer = false;
    let animating = false;
    let rewardProgress = 0;
    let animFrame = null;

    // Character-level streaming state
    let charIndex = 0;
    let lastCharTime = 0;
    const CHAR_DELAY = 35; // ms between characters

    function getPrompt() { return prompts[currentPrompt]; }

    function drawStatic() {
        ctx.clearRect(0, 0, CW, CH);

        const p = getPrompt();

        // Background
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, CW, CH);

        // Prompt box
        ctx.fillStyle = '#111';
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        const promptBoxH = 42;
        ctx.fillRect(20, 12, CW - 40, promptBoxH);
        ctx.strokeRect(20, 12, CW - 40, promptBoxH);

        ctx.font = 'bold 11px Courier New';
        ctx.fillStyle = '#888';
        ctx.textAlign = 'left';
        ctx.fillText('PROMPT:', 32, 30);
        ctx.fillStyle = '#fff';
        ctx.font = '14px Courier New';
        ctx.fillText(p.question, 110, 30);

        // Label
        ctx.font = '9px Courier New';
        ctx.fillStyle = '#555';
        ctx.textAlign = 'right';
        ctx.fillText('CHAIN OF THOUGHT', CW - 30, 48);

        // Think tag area
        const thinkY = 64;
        const thinkH = 200;
        ctx.fillStyle = '#0d0d0d';
        ctx.strokeStyle = '#1a1a1a';
        ctx.fillRect(20, thinkY, CW - 40, thinkH);
        ctx.strokeRect(20, thinkY, CW - 40, thinkH);

        // <think> tag
        ctx.font = 'bold 11px Courier New';
        ctx.textAlign = 'left';
        ctx.fillStyle = '#fbbf24';
        ctx.fillText('<think>', 30, thinkY + 18);

        // Thought tokens with character-level streaming
        const lineH = 22;
        const startY = thinkY + 38;

        // Calculate total characters up to charIndex
        let charsRemaining = charIndex;
        for (let i = 0; i < p.thoughts.length; i++) {
            const thought = p.thoughts[i];
            if (charsRemaining <= 0) break;

            const displayChars = Math.min(charsRemaining, thought.length);
            const displayText = thought.substring(0, displayChars);
            charsRemaining -= displayChars;

            const y = startY + i * lineH;

            // Determine color based on content
            const isReflection = thought.includes('Wait') || thought.includes('Hmm') || thought.includes('re-read');
            const isVerify = thought.includes('✓') || thought.includes('verify');

            if (isReflection) {
                ctx.fillStyle = '#ff6b6b';
                ctx.font = 'italic 12px Courier New';
            } else if (isVerify) {
                ctx.fillStyle = '#00ff88';
                ctx.font = '12px Courier New';
            } else {
                ctx.fillStyle = '#888';
                ctx.font = '12px Courier New';
            }
            ctx.textAlign = 'left';
            ctx.fillText('  ' + displayText, 32, y);

            // Blinking cursor at end of current line
            if (displayChars < thought.length && displayChars > 0) {
                const textW = ctx.measureText('  ' + displayText).width;
                const blink = Math.floor(Date.now() / 400) % 2;
                if (blink) {
                    ctx.fillStyle = '#fbbf24';
                    ctx.fillRect(34 + textW, y - 10, 7, 14);
                }
            }
        }

        // Closing think tag
        let totalChars = p.thoughts.reduce((s, t) => s + t.length, 0);
        if (charIndex >= totalChars) {
            const closingY = startY + p.thoughts.length * lineH;
            ctx.font = 'bold 11px Courier New';
            ctx.fillStyle = '#fbbf24';
            ctx.textAlign = 'left';
            ctx.fillText('</think>', 30, closingY);
        }

        // Answer area
        const answerY = thinkY + thinkH + 14;
        if (showAnswer) {
            ctx.fillStyle = '#111';
            ctx.strokeStyle = '#00e5ff33';
            ctx.lineWidth = 1;
            ctx.fillRect(20, answerY, CW - 40, 34);
            ctx.strokeRect(20, answerY, CW - 40, 34);

            ctx.font = 'bold 11px Courier New';
            ctx.fillStyle = '#555';
            ctx.textAlign = 'left';
            ctx.fillText('ANSWER:', 32, answerY + 22);
            ctx.fillStyle = '#00e5ff';
            ctx.font = 'bold 14px Courier New';
            ctx.shadowBlur = 6; ctx.shadowColor = '#00e5ff';
            ctx.fillText(p.answer, 110, answerY + 22);
            ctx.shadowBlur = 0;
        }

        // Reward bar
        const barY = answerY + 44;
        const barW = CW - 80;
        const barH = 16;
        const barX = 40;

        ctx.font = '9px Courier New';
        ctx.fillStyle = '#555';
        ctx.textAlign = 'left';
        ctx.fillText('REWARD', barX, barY - 4);

        // Bar background
        ctx.fillStyle = '#111';
        ctx.fillRect(barX, barY, barW, barH);
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.strokeRect(barX, barY, barW, barH);

        // Bar fill
        if (rewardProgress > 0) {
            const grad = ctx.createLinearGradient(barX, 0, barX + barW * rewardProgress, 0);
            grad.addColorStop(0, '#00ff8833');
            grad.addColorStop(1, '#00ff88');
            ctx.fillStyle = grad;
            ctx.fillRect(barX + 1, barY + 1, (barW - 2) * rewardProgress, barH - 2);

            // Glow effect
            if (rewardProgress >= 1) {
                ctx.shadowBlur = 8; ctx.shadowColor = '#00ff88';
                ctx.strokeStyle = '#00ff88';
                ctx.lineWidth = 1.5;
                ctx.strokeRect(barX, barY, barW, barH);
                ctx.shadowBlur = 0;
            }
        }

        // Reward label
        ctx.font = 'bold 10px Courier New';
        ctx.textAlign = 'right';
        ctx.fillStyle = rewardProgress >= 1 ? '#00ff88' : '#555';
        ctx.fillText(rewardProgress >= 1 ? '+1.0 CORRECT ✓' : (rewardProgress > 0 ? `+${rewardProgress.toFixed(1)}` : '0.0'), barX + barW - 4, barY + 12);

        // GRPO label when fully done
        if (rewardProgress >= 1) {
            ctx.font = '9px Courier New';
            ctx.fillStyle = '#fbbf24';
            ctx.textAlign = 'center';
            ctx.fillText('GRPO: reinforce this reasoning trace', CW / 2, barY + barH + 14);
        }
    }

    function animate() {
        const p = getPrompt();
        const totalChars = p.thoughts.reduce((s, t) => s + t.length, 0);
        const now = Date.now();

        if (charIndex < totalChars) {
            // Stream characters
            if (now - lastCharTime > CHAR_DELAY) {
                charIndex++;
                lastCharTime = now;
            }
            drawStatic();
            animFrame = requestAnimationFrame(animate);
        } else if (!showAnswer) {
            // Show answer after a brief pause
            showAnswer = true;
            drawStatic();
            // Start reward fill
            animFrame = requestAnimationFrame(animateReward);
        }
    }

    function animateReward() {
        if (rewardProgress < 1) {
            rewardProgress = Math.min(1, rewardProgress + 0.025);
            drawStatic();
            animFrame = requestAnimationFrame(animateReward);
        } else {
            drawStatic();
            animating = false;
        }
    }

    runBtn.addEventListener('click', () => {
        if (animating) return;
        animating = true;
        charIndex = 0;
        visibleTokens = 0;
        showAnswer = false;
        rewardProgress = 0;
        lastCharTime = Date.now();
        animate();
    });

    nextBtn.addEventListener('click', () => {
        if (animFrame) cancelAnimationFrame(animFrame);
        animating = false;
        currentPrompt = (currentPrompt + 1) % prompts.length;
        charIndex = 0;
        visibleTokens = 0;
        showAnswer = false;
        rewardProgress = 0;
        drawStatic();
    });

    drawStatic();
})();
