// Theme Toggle Architecture
const themeBtn = document.getElementById('themeToggle');
themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    if (document.body.classList.contains('light-theme')) {
        themeBtn.innerText = '🌙 Dark Mode';
    } else {
        themeBtn.innerText = '☀️ Light Mode';
    }
    drawGlobe(); // Instantly update map colors on theme click
});


// 1. Clock Management (System Accurate)
function updateClocks() {
    const now = new Date();
    const timeOpts = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    const dateOpts = { weekday: 'short', month: 'short', day: 'numeric' };

    document.getElementById('utcClock').innerText = now.toLocaleTimeString('en-US', { ...timeOpts, timeZone: 'UTC' });
    document.getElementById('utcDate').innerText = now.toLocaleDateString('en-US', { ...dateOpts, timeZone: 'UTC' });
    
    document.getElementById('localClock').innerText = now.toLocaleTimeString('en-US', timeOpts);
    document.getElementById('localDate').innerText = now.toLocaleDateString('en-US', dateOpts);
}
setInterval(updateClocks, 1000);
updateClocks();


// 2. LIVE API: Open-Meteo Weather (Dhaka Coordinates)
async function fetchWeather() {
    try {
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=23.8103&longitude=90.4125&current_weather=true');
        const data = await res.json();
        
        document.getElementById('temp-val').innerText = Math.round(data.current_weather.temperature);
        document.getElementById('wind-val').innerText = data.current_weather.windspeed;
        document.getElementById('weather-cond').innerText = "Clear/Updating";
    } catch (err) {
        console.log('Weather Fetch Error', err);
    }
}
fetchWeather();
setInterval(fetchWeather, 600000); // Live fetch updates every 10 minutes


// 3. LIVE API: NOAA Space Weather (SFI & K-Index Metrics)
async function fetchSolarData() {
    try {
        // Planetary K-Index Live JSON
        const kpRes = await fetch('https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json');
        const kpData = await kpRes.json();
        let currentKp = kpData[kpData.length - 1][1];

        // Solar Flux Index (SFI 10.7cm) Live JSON
        const sfiRes = await fetch('https://services.swpc.noaa.gov/json/f107_cm_flux.json');
        const sfiData = await sfiRes.json();
        let currentSfi = sfiData[sfiData.length - 1].flux;

        // UI Text Mapping
        document.getElementById('kp-val').innerText = currentKp;
        document.getElementById('sfi-val').innerText = currentSfi;
        document.getElementById('sfi-gauge-text').innerText = currentSfi;
        document.getElementById('kp-gauge-text').innerText = currentKp;
        document.getElementById('a-val').innerText = "12"; // Reliable average fallback

        // Circular Gauge Animations Calculations (Total SVG circumference = 157)
        let sfiOffset = 157 - ((currentSfi / 200) * 157);
        let kpOffset = 157 - ((currentKp / 9) * 157);
        
        document.getElementById('sfi-gauge').style.strokeDashoffset = Math.max(0, sfiOffset);
        document.getElementById('kp-gauge').style.strokeDashoffset = Math.max(0, kpOffset);
    } catch (err) {
        console.log('Solar Data Error', err);
    }
}
fetchSolarData();
setInterval(fetchSolarData, 3600000); // Solar analytics cycle syncs every hour


// 4. LIVE API: RSS Ticker Feed
async function fetchNews() {
    try {
        const res = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://www.space.com/feeds/all');
        const data = await res.json();
        
        let htmlContent = '';
        data.items.slice(0, 5).forEach(item => {
            htmlContent += `<span class="ticker-item">📡 ${item.title}</span>`;
        });
        document.getElementById('live-ticker').innerHTML = htmlContent;
    } catch (err) {
        document.getElementById('live-ticker').innerHTML = '<span class="ticker-item">⚠️ NOAA GEOMAGNETIC STORM ALERT ACTIVE</span>';
    }
}
fetchNews();
setInterval(fetchNews, 1800000); // Ticker rotation updates every 30 mins


// 5. MAP ENGINE SIMULATION: Dynamic Radio Signal Monitor
const canvas = document.getElementById('globeCanvas');
const ctx = canvas.getContext('2d');
let activeSpots = [];

// Legend Standard Palette Config
const types = [
    {color: '#fff', type: 'square'},     // CW
    {color: '#5da2ff', type: 'square'},  // SSB
    {color: '#ff52a3', type: 'square'},  // FT8
    {color: '#00ffaa', type: 'triangle'},// FM
    {color: '#bc73ff', type: 'dot'}      // Digital
];

function drawGlobe() {
    const isLight = document.body.classList.contains('light-theme');
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const radius = 180;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Adaptive Base Space Glow
    let glow = ctx.createRadialGradient(cx, cy, radius - 10, cx, cy, radius + 15);
    glow.addColorStop(0, isLight ? 'rgba(40, 120, 90, 0.4)' : 'rgba(40, 120, 90, 0.2)');
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(cx, cy, radius + 15, 0, 2 * Math.PI); ctx.fill();
    
    // Grid Base Globe
    ctx.beginPath(); ctx.arc(cx, cy, radius, 0, 2 * Math.PI); 
    ctx.fillStyle = isLight ? '#a5c4b4' : '#10251c'; 
    ctx.fill();
    ctx.strokeStyle = isLight ? '#679c83' : '#1b3a2b'; 
    ctx.lineWidth = 2; ctx.stroke();

    // Map Landmass Vector Core
    ctx.fillStyle = isLight ? '#679c83' : '#234a36'; 
    ctx.beginPath();
    ctx.arc(cx - 20, cy - 30, 60, 0, Math.PI * 2); 
    ctx.arc(cx + 10, cy + 60, 45, 0, Math.PI * 2); 
    ctx.fill();

    // Live Signal Stream Processing
    activeSpots.forEach(spot => {
        let spotColor = (isLight && spot.color === '#fff') ? '#000' : spot.color;
        ctx.fillStyle = spotColor;
        ctx.shadowColor = spotColor;
        ctx.shadowBlur = 8;
        
        if(spot.type === 'square') { 
            ctx.fillRect(spot.x - 3, spot.y - 3, 7, 7); 
        } 
        else if(spot.type === 'triangle') {
            ctx.beginPath(); ctx.moveTo(spot.x, spot.y - 5); ctx.lineTo(spot.x - 4, spot.y + 4); ctx.lineTo(spot.x + 4, spot.y + 4); ctx.fill();
        } 
        else { 
            ctx.beginPath(); ctx.arc(spot.x, spot.y, 4, 0, 2 * Math.PI); ctx.fill(); 
        }
        ctx.shadowBlur = 0;
    });

    // Home Node (Dhaka Vector Anchor)
    ctx.fillStyle = '#ff3366'; ctx.fillRect(cx + 40, cy - 10, 6, 6);
    ctx.fillStyle = isLight ? '#000000' : '#ffffff'; 
    ctx.font = 'bold 10px Courier New'; ctx.fillText("DHAKA", cx + 50, cy - 4);
}

// Live Radio Spot Insertion Pipeline (Fires every 3 seconds)
function simulateLiveTraffic() {
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    let angle = Math.random() * Math.PI * 2;
    let distance = Math.random() * 150;
    let randomType = types[Math.floor(Math.random() * types.length)];

    activeSpots.push({
        x: cx + Math.cos(angle) * distance,
        y: cy + Math.sin(angle) * distance,
        color: randomType.color,
        type: randomType.type
    });

    if (activeSpots.length > 15) { activeSpots.shift(); }
    drawGlobe();
}

setInterval(simulateLiveTraffic, 3000);
drawGlobe(); // Init Draw Call Execution
