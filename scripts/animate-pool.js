// The source is the generated, text-free image. Never pass the private book PDF.
// Usage: node scripts/animate-pool.js /absolute/path/to/text-free-pool.png
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const source = process.argv[2];
if (!source || !/\.(png|webp)$/i.test(source)) throw new Error('Pass a text-free PNG or WebP source image.');
const radius = 'sqrt((X-W/2)^2+(Y-H*0.53)^2)';
const displacement = `1.5*sin(2*PI*T/6)*sin(${radius}/43-2*PI*T/6)`;
const sampleX = `X+(${displacement})*(X-W/2)/(${radius}+1)`;
const sampleY = `Y+(${displacement})*(Y-H*0.53)/(${radius}+1)`;
const channels = ['r','g','b'].map(c => `${c}='${c}(${sampleX},${sampleY})'`).join(':');
const filter = `scale=640:-2,format=gbrp,geq=${channels},split[a][b];[a]palettegen=max_colors=64:reserve_transparent=0[p];[b][p]paletteuse=dither=bayer:bayer_scale=4`;
const dest = path.resolve('assets/media/pool-ripple.gif');
const result = spawnSync('ffmpeg', ['-hide_banner','-loglevel','error','-y','-loop','1','-framerate','8','-t','6','-i',source,'-filter_complex',filter,'-loop','0',dest], { stdio: 'inherit' });
if (result.status !== 0) process.exit(result.status || 1);
console.log(`Generated ${dest} (${(fs.statSync(dest).size / 1024 / 1024).toFixed(2)} MB).`);
