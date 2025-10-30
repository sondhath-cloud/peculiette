// Simple Aurora gradient waves effect
// Exposes window.initHeroEffect(containerId)
(function(window){
  if (window.AuroraEffectInitialized) return;
  window.AuroraEffectInitialized = true;

  window.initHeroEffect = function(containerId){
    const container = document.getElementById(containerId);
    if (!container) return;

    const canvas = document.createElement('canvas');
    canvas.className = 'effect-canvas';
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    function resize(){
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    let t = 0;
    function lerp(a,b,u){ return a + (b-a)*u; }
    function draw(){
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0,0,w,h);
      // background gradient
      const bg = ctx.createLinearGradient(0,0,w,h);
      bg.addColorStop(0,'#00111a');
      bg.addColorStop(1,'#120016');
      ctx.fillStyle = bg;
      ctx.fillRect(0,0,w,h);

      // layered translucent waves
      for (let layer=0; layer<4; layer++){
        const yBase = h*lerp(0.2,0.8,layer/3);
        const amp = lerp(20, 120, layer/3);
        const speed = lerp(0.002, 0.006, layer/3);
        ctx.beginPath();
        ctx.moveTo(0, yBase + Math.sin(t*speed)*amp);
        for (let x=0; x<=w; x+=8){
          const y = yBase + Math.sin(x*0.01 + t*speed*60 + layer)*amp;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        const g = ctx.createLinearGradient(0, yBase-amp, 0, yBase+amp*2);
        const hue = 180 + layer*40;
        g.addColorStop(0, `hsla(${hue}, 90%, 60%, 0.15)`);
        g.addColorStop(1, `hsla(${hue+30}, 90%, 50%, 0.05)`);
        ctx.fillStyle = g;
        ctx.fill();
      }
      t += 1;
      requestAnimationFrame(draw);
    }
    draw();
  };
}(window));


