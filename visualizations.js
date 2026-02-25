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
// 2. THE HINGE (WIRE-FRAME 3D)
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
// 5. THE SYNTHESIS (TRIANGLE)
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
// 10. THE MEMORIZATION PROBLEM (OVERFITTING)
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
// 13. DREAMING MACHINES (REVERSE DIFFUSION)
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

        // Corner labels
        mapCtx.font = '14px serif';
        mapCtx.fillStyle = 'rgba(255,255,255,0.5)';
        mapCtx.fillText('🔴', 4, 16);        // Top-left: Red Circle
        mapCtx.fillText('🟡', 180, 16);       // Top-right: Yellow
        mapCtx.fillText('🔵', 4, 196);        // Bottom-left: Blue
        mapCtx.fillText('🟢', 180, 196);      // Bottom-right: Green
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
