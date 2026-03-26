// =============================================
//  sketch.js  —  p5.js canvas
//  Layers: paper texture · pencil trail · cursor
//  · ambient dust particles · doodle decorations
// =============================================

new p5(function(p) {

  // ---- CONFIG ----
  const CFG = {
    paperColor:    [255, 255, 255],   // pure white
    grainAlpha:    8,
    grainScale:    0.035,

    // Pencil trail
    trailMaxLen:   90,
    trailFadeLen:  60,
    pencilColor:   [20, 20, 20],      // near-black graphite
    pencilWidth:   [0.5, 1.8],
    pencilJitter:  1.0,
    pencilStrands: 4,
    inkPerPixel:   0.012,

    // Ambient dust
    dustCount:     28,
    dustColor:     [180, 180, 180],

    // Cursor — larger and more visible
    cursorSize:    58,                // body length
  };

  // ---- STATE ----
  let paperBuffer;           // static: drawn once
  let trailPoints = [];      // { x, y, px, py, pressure }
  let dustParticles = [];
  let decorDoodles = [];     // static background doodles
  let mouseDrawing = false;
  let lastMX = 0, lastMY = 0;
  let isDrawing = false;

  // ---- SETUP ----
  p.setup = function() {
    const cnv = p.createCanvas(p.windowWidth, p.windowHeight);
    cnv.parent('canvas-container');
    cnv.style('position', 'fixed');
    cnv.style('top', '0');
    cnv.style('left', '0');
    cnv.style('z-index', '1');

    p.pixelDensity(Math.min(p.pixelDensity(), 2));

    // Draw static paper texture into buffer (heavy op — only once)
    paperBuffer = p.createGraphics(p.width, p.height);
    drawPaperTexture(paperBuffer);

    // Draw static background doodles into same buffer
    drawBackgroundDoodles(paperBuffer);

    // Spawn dust particles
    for (let i = 0; i < CFG.dustCount; i++) {
      dustParticles.push(makeDustParticle(true));
    }

    p.frameRate(60);
  };

  // ---- DRAW ----
  p.draw = function() {
    p.clear();

    // Layer 1: paper + static doodles
    p.image(paperBuffer, 0, 0);

    // Layer 2: ambient dust
    updateDust();

    // Layer 3: pencil trail
    if (isDrawing) addTrailPoint();
    drawTrail();
    decayTrail();

    // Layer 4: custom cursor
    drawCursor(p.mouseX, p.mouseY);
  };

  // ================================================
  //  PAPER TEXTURE
  // ================================================
  function drawPaperTexture(g) {
    g.background(CFG.paperColor[0], CFG.paperColor[1], CFG.paperColor[2]);
    g.noSmooth();

    // Perlin noise grain — subtle grey on white
    g.loadPixels();
    for (let x = 0; x < g.width; x += 2) {
      for (let y = 0; y < g.height; y += 2) {
        let n  = p.noise(x * CFG.grainScale, y * CFG.grainScale);
        let n2 = p.noise(x * 0.008, y * 0.008);
        // Brightness shift: very subtle on white paper
        let brightness = p.map(n, 0, 1, -12, 8) + p.map(n2, 0, 1, -5, 5);
        let v = p.constrain(CFG.paperColor[0] + brightness, 228, 255);

        let idx = 4 * (y * g.width + x);
        g.pixels[idx]   = v;
        g.pixels[idx+1] = v;
        g.pixels[idx+2] = v;
        g.pixels[idx+3] = 255;
        if (x + 1 < g.width) {
          g.pixels[idx+4] = v; g.pixels[idx+5] = v; g.pixels[idx+6] = v; g.pixels[idx+7] = 255;
        }
        if (y + 1 < g.height) {
          let idx2 = 4 * ((y+1) * g.width + x);
          g.pixels[idx2] = v; g.pixels[idx2+1] = v; g.pixels[idx2+2] = v; g.pixels[idx2+3] = 255;
        }
      }
    }
    g.updatePixels();

    // Very soft grey vignette on edges
    let steps = 40;
    for (let i = 0; i < steps; i++) {
      let alpha = p.map(i, 0, steps, 18, 0);
      let inset = i * 3;
      g.noFill();
      g.stroke(80, 80, 80, alpha);
      g.strokeWeight(3);
      g.rect(inset, inset, g.width - inset*2, g.height - inset*2);
    }
  }

  // ================================================
  //  BACKGROUND DOODLES (drawn into paper buffer)
  //  Decorative margin sketches — redrawn on resize
  // ================================================
  function drawBackgroundDoodles(g) {
    g.push();
    g.noFill();
    g.strokeCap(p.ROUND);
    g.strokeJoin(p.ROUND);

    const ink = (alpha) => g.stroke(60, 60, 60, alpha);

    // ---- corner bracket marks ----
    const corners = [
      [60, 70], [p.width - 60, 70],
      [60, p.height - 70], [p.width - 60, p.height - 70]
    ];
    corners.forEach(([cx, cy]) => {
      ink(30);
      g.strokeWeight(1.5);
      let s = 20;
      g.line(cx - s, cy, cx, cy);
      g.line(cx, cy, cx, cy + s);
    });

    // ---- scattered small stars ----
    ink(22);
    g.strokeWeight(1);
    const starPositions = [
      [80, 200], [p.width - 90, 300], [50, p.height/2],
      [p.width - 60, p.height/2 + 80], [120, p.height - 150],
      [p.width/2 + 200, 110], [p.width/2 - 180, p.height - 120],
    ];
    starPositions.forEach(([sx, sy]) => {
      drawSketchStar(g, sx + p.random(-5,5), sy + p.random(-5,5), 8 + p.random(4), ink, 22);
    });

    // ---- wavy ruled lines (notebook feel) ----
    ink(10);
    g.strokeWeight(0.7);
    let lineY = 140;
    let lineSpacing = 34;
    let lx0 = 320, lx1 = p.width - 40;
    while (lineY < p.height - 60) {
      g.beginShape();
      for (let lx = lx0; lx <= lx1; lx += 8) {
        let wy = lineY + p.noise(lx * 0.02, lineY * 0.01) * 3 - 1.5;
        g.curveVertex(lx, wy);
      }
      g.endShape();
      lineY += lineSpacing;
    }

    // ---- grey margin line (no red) ----
    g.stroke(160, 160, 160, 18);
    g.strokeWeight(1.5);
    g.line(300, 80, 300, p.height - 80);

    // ---- subtle arrow hint ----
    ink(18);
    g.strokeWeight(1.2);
    sketchArrow(g, 40, p.height * 0.45, 80, p.height * 0.45);

    g.pop();
  }

  function drawSketchStar(g, cx, cy, r, inkFn, alpha) {
    inkFn(alpha);
    g.strokeWeight(1);
    for (let i = 0; i < 5; i++) {
      let angle = (p.TWO_PI / 5) * i - p.HALF_PI;
      let x2 = cx + p.cos(angle) * r + p.random(-1, 1);
      let y2 = cy + p.sin(angle) * r + p.random(-1, 1);
      let x3 = cx + p.cos(angle + p.TWO_PI/10) * r*0.4 + p.random(-0.5,0.5);
      let y3 = cy + p.sin(angle + p.TWO_PI/10) * r*0.4 + p.random(-0.5,0.5);
      g.line(cx, cy, x2, y2);
      g.line(cx, cy, x3, y3);
    }
  }

  function sketchArrow(g, x1, y1, x2, y2) {
    g.line(x1, y1, x2, y2);
    let angle = p.atan2(y2-y1, x2-x1);
    let ah = 8;
    g.line(x2, y2, x2 - ah*p.cos(angle-0.4), y2 - ah*p.sin(angle-0.4));
    g.line(x2, y2, x2 - ah*p.cos(angle+0.4), y2 - ah*p.sin(angle+0.4));
  }

  // ================================================
  //  PENCIL TRAIL
  // ================================================
  function addTrailPoint() {
    let mx = p.mouseX, my = p.mouseY;
    let d  = p.dist(mx, my, lastMX, lastMY);
    if (d < 2) return;       // skip if barely moved

    let pressure = p.constrain(p.map(d, 0, 20, 0.3, 1.0), 0.2, 1.0);
    trailPoints.push({
      x: mx, y: my,
      px: lastMX, py: lastMY,
      pressure,
      age: 0,
    });

    lastMX = mx; lastMY = my;

    // Keep trail length capped
    if (trailPoints.length > CFG.trailMaxLen) {
      trailPoints.shift();
    }

    // Fill ink meter via ui.js
    if (typeof addInk === 'function') addInk(d * CFG.inkPerPixel);
  }

  function drawTrail() {
    p.push();
    p.strokeCap(p.ROUND);

    trailPoints.forEach((pt, i) => {
      let alphaFactor = p.map(i, 0, trailPoints.length, 0.05, 1.0);
      let baseAlpha = 160 * alphaFactor * pt.pressure;

      for (let s = 0; s < CFG.pencilStrands; s++) {
        let jx1 = pt.px + p.random(-CFG.pencilJitter, CFG.pencilJitter);
        let jy1 = pt.py + p.random(-CFG.pencilJitter, CFG.pencilJitter);
        let jx2 = pt.x  + p.random(-CFG.pencilJitter, CFG.pencilJitter);
        let jy2 = pt.y  + p.random(-CFG.pencilJitter, CFG.pencilJitter);

        let w = p.random(CFG.pencilWidth[0], CFG.pencilWidth[1]) * pt.pressure;
        let a = baseAlpha * p.random(0.4, 1.0);

        p.stroke(
          CFG.pencilColor[0] + p.random(-12, 12),
          CFG.pencilColor[1] + p.random(-8, 8),
          CFG.pencilColor[2] + p.random(-4, 4),
          a
        );
        p.strokeWeight(w);
        p.line(jx1, jy1, jx2, jy2);
      }
    });

    p.pop();
  }

  function decayTrail() {
    // Age points and remove fully-faded ones
    trailPoints.forEach(pt => { pt.age += 0.5; pt.pressure *= 0.995; });
    trailPoints = trailPoints.filter(pt => pt.age < CFG.trailMaxLen * 1.5);
  }

  // ---- Mouse events ----
  p.mousePressed = function() {
    if (p.mouseButton === p.LEFT) {
      isDrawing = true;
      lastMX = p.mouseX;
      lastMY = p.mouseY;
    }
    return false;
  };

  p.mouseDragged = function() {
    return false;
  };

  p.mouseReleased = function() {
    isDrawing = false;
  };

  // Expose clear function globally so ui.js can call it via keyboard shortcut / button
  window.clearPencilTrail = function() {
    trailPoints = [];
  };

  // ================================================
  //  DUST PARTICLES (ambient floating paper dust)
  // ================================================
  function makeDustParticle(randomY) {
    return {
      x:    p.random(p.width),
      y:    randomY ? p.random(p.height) : p.height + 10,
      vy:   p.random(-0.08, -0.25),
      vx:   p.random(-0.15, 0.15),
      size: p.random(1.2, 3.5),
      alpha: p.random(15, 55),
      life: p.random(0.996, 0.9992),
    };
  }

  function updateDust() {
    p.push();
    p.noStroke();

    dustParticles.forEach((d, i) => {
      d.x  += d.vx + p.noise(d.x * 0.005, d.y * 0.005, p.frameCount * 0.003) * 0.3 - 0.15;
      d.y  += d.vy;
      d.alpha *= d.life;

      p.fill(CFG.dustColor[0], CFG.dustColor[1], CFG.dustColor[2], d.alpha);
      p.ellipse(d.x, d.y, d.size, d.size * 0.6);

      // Respawn off-screen particles
      if (d.y < -10 || d.alpha < 3) {
        dustParticles[i] = makeDustParticle(false);
      }
    });

    p.pop();
  }

  // ================================================
  //  CUSTOM PENCIL CURSOR — larger, clearly visible
  // ================================================
  function drawCursor(mx, my) {
    p.push();

    const W      = 18;               // body width (wider = more visible)
    const BODY   = CFG.cursorSize;   // 58px body
    const TIP    = 22;               // graphite cone
    const WOOD   = 16;               // sharpened wood zone
    const BAND   = 8;                // ferrule metal band
    const ERASER = 16;               // eraser block

    const TOTAL_H = TIP + WOOD + BODY + BAND + ERASER;

    p.translate(mx, my);
    p.rotate(-0.65);                 // natural pencil tilt; tip at origin

    // --- Drop shadow for visibility over any background ---
    p.noStroke();
    p.fill(0, 0, 0, 38);
    // Shadow is the whole pencil silhouette, offset slightly
    p.push();
    p.translate(3, 3);
    p.beginShape();
    p.vertex(-W/2, -TIP - WOOD - BODY - BAND - ERASER);
    p.vertex( W/2, -TIP - WOOD - BODY - BAND - ERASER);
    p.vertex( W/2, -TIP);
    p.vertex(  0,    0);
    p.vertex(-W/2, -TIP);
    p.endShape(p.CLOSE);
    p.pop();

    // --- Graphite tip (dark triangle) ---
    p.noStroke();
    p.fill(15, 15, 15, 255);
    p.triangle(-W/2, -TIP, W/2, -TIP, 0, 0);

    // --- Wood sharpened cone (light grey) ---
    p.fill(225, 225, 225, 255);
    p.rect(-W/2, -TIP - WOOD, W, WOOD);

    // --- Main body (mid grey) ---
    p.fill(175, 175, 175, 255);
    p.rect(-W/2, -TIP - WOOD - BODY, W, BODY);

    // --- Left highlight stripe ---
    p.fill(248, 248, 248, 200);
    p.rect(-W/2 + 2, -TIP - WOOD - BODY, 4, BODY + WOOD);

    // --- Right shadow stripe ---
    p.fill(110, 110, 110, 140);
    p.rect(W/2 - 4, -TIP - WOOD - BODY, 3, BODY + WOOD);

    // --- Ferrule (dark metal band) ---
    p.fill(80, 80, 80, 255);
    p.rect(-W/2, -TIP - WOOD - BODY - BAND, W, BAND);
    // Highlight rim on ferrule
    p.fill(180, 180, 180, 200);
    p.rect(-W/2, -TIP - WOOD - BODY - BAND, W, 2.5);

    // --- Eraser (light grey — no pink, keeping monochrome) ---
    p.fill(215, 215, 215, 255);
    p.rect(-W/2, -TIP - WOOD - BODY - BAND - ERASER, W, ERASER);
    // Eraser top cap (slightly darker)
    p.fill(185, 185, 185, 255);
    p.rect(-W/2, -TIP - WOOD - BODY - BAND - ERASER, W, 4);

    // --- Crisp outlines over everything ---
    p.noFill();
    p.strokeWeight(1.8);
    p.stroke(15, 15, 15, 240);
    // Outer body rect
    p.rect(-W/2, -TIP - WOOD - BODY - BAND - ERASER, W, TOTAL_H - TIP);
    // Internal division lines
    p.strokeWeight(1.2);
    p.stroke(40, 40, 40, 180);
    p.line(-W/2, -TIP - WOOD,                   W/2, -TIP - WOOD);
    p.line(-W/2, -TIP - WOOD - BODY,             W/2, -TIP - WOOD - BODY);
    p.line(-W/2, -TIP - WOOD - BODY - BAND,      W/2, -TIP - WOOD - BODY - BAND);

    // --- Tip outline ---
    p.strokeWeight(1.8);
    p.stroke(10, 10, 10, 255);
    p.line(-W/2, -TIP, 0, 0);
    p.line( W/2, -TIP, 0, 0);

    // --- Hotspot dot: crisp dot at exact tip ---
    p.noStroke();
    p.fill(0, 0, 0, 255);
    p.ellipse(0, 0, 5, 5);

    p.pop();
  }

  // ================================================
  //  RESIZE
  // ================================================
  p.windowResized = function() {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    paperBuffer = p.createGraphics(p.width, p.height);
    drawPaperTexture(paperBuffer);
    drawBackgroundDoodles(paperBuffer);
  };

});
