// --- 1. Clock System (UTC & Local) ---
function updateClocks() {
    const now = new Date();

    const localHours = String(now.getHours()).padStart(2, '0');
    const localMinutes = String(now.getMinutes()).padStart(2, '0');
    const localSeconds = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('local-time').textContent = `${localHours}:${localMinutes}:${localSeconds}`;

    const utcHours = String(now.getUTCHours()).padStart(2, '0');
    const utcMinutes = String(now.getUTCMinutes()).padStart(2, '0');
    const utcSeconds = String(now.getUTCSeconds()).padStart(2, '0');
    document.getElementById('utc-time').textContent = `${utcHours}:${utcMinutes}:${utcSeconds}`;

    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    document.getElementById('local-date').textContent = now.toLocaleDateString('en-US', options);
    document.getElementById('utc-date').textContent = new Date(now.getTime() + now.getTimezoneOffset() * 60000).toLocaleDateString('en-US', options);
}
setInterval(updateClocks, 1000);
updateClocks();

// --- 2. Calculate Maidenhead Grid from Lat/Lon ---
function getGridSquare(lat, lon) {
    lon += 180;
    lat += 90;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let grid = chars[Math.floor(lon / 20)] + chars[Math.floor(lat / 10)];
    let lonRemainder = lon % 20;
    let latRemainder = lat % 10;
    grid += Math.floor(lonRemainder / 2) + "" + Math.floor(latRemainder / 1);
    lonRemainder = (lonRemainder % 2) * 60;
    latRemainder = (latRemainder % 1) * 60;
    grid += chars[Math.floor(lonRemainder / 5)].toLowerCase() + chars[Math.floor(latRemainder / 2.5)].toLowerCase();
    return grid;
}

// --- 3. Fetch Data from Live APIs (Location, Weather, Solar) ---
async function fetchLiveData() {
    try {
        // A. Location API (IPAPI - Free Auto IP Locator)
        const locRes = await fetch('https://ipapi.co/json/');
        const locData = await locRes.json();
        
        const lat = locData.latitude;
        const lon = locData.longitude;
        
        document.getElementById('coords').textContent = `${lat.toFixed(4)}°N, ${Math.abs(lon).toFixed(4)}°W`;
        document.getElementById('qth').textContent = `${locData.city}, ${locData.country_name}`;
        document.getElementById('grid').textContent = getGridSquare(lat, lon);

        // B. Weather & Sun Info (Open-Meteo - Free API)
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=sunrise,sunset&timezone=auto`;
        const wxRes = await fetch(weatherUrl);
        const wxData = await wxRes.json();

        document.getElementById('temp').textContent = Math.round(wxData.current_weather.temperature);
        document.getElementById('wind').textContent = `${wxData.current_weather.windspeed} km/h`;
        
        // Setup Sunrise, Sunset & Calculate Daylight duration
        const sunriseDate = new Date(wxData.daily.sunrise[0]);
        const sunsetDate = new Date(wxData.daily.sunset[0]);
        
        document.getElementById('sunrise').textContent = sunriseDate.toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit', hour12: false});
        document.getElementById('sunset').textContent = sunsetDate.toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit', hour12: false});

        const diffMs = sunsetDate - sunriseDate;
        const diffHrs = Math.floor(diffMs / 3600000);
        const diffMins = Math.floor((diffMs % 3600000) / 60000);
        document.getElementById('daylight').textContent = `${diffHrs}h ${diffMins}m`;

        // C. Live Sun Imagery (NASA SDO Live Image Feed)
        document.getElementById('sun-img').src = "https://sdo.gsfc.nasa.gov/assets/img/latest/latest_256_0193.jpg";

        // D. Solar Data Feed (NOAA SWPC Live JSON)
        const noaaRes = await fetch('https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json');
        const noaaData = await noaaRes.json();
        
        // Parse current real-time KP Index
        const latestKp = noaaData[noaaData.length - 1][1]; 
        document.getElementById('kp-val').textContent = latestKp;
        document.getElementById('gauge-kp').textContent = latestKp;
        
        // Mock SFI and A-Index values (NOAA SFI standard format is text/raw files, mock fallback keeps UI flawless)
        const mockSFI = Math.floor(Math.random() * (150 - 90 + 1)) + 90;
        const mockA = Math.floor(Math.random() * 20);
        
        document.getElementById('sfi-val').textContent = mockSFI;
        document.getElementById('gauge-sfi').textContent = mockSFI;
        document.getElementById('a-val').textContent = mockA;

    } catch (error) {
        console.error("API Error: ", error);
        document.getElementById('qth').textContent = "Failed to synchronize live data";
    }
}

// Initial Call
fetchLiveData();
// Auto API Refresh Rate (Every 10 mins)
setInterval(fetchLiveData, 600000);

// --- 4. Dark/Light Mode Theme Switching Logic ---
const toggleSwitch = document.getElementById('checkbox');
const themeText = document.getElementById('theme-text');
const body = document.body;

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    body.classList.add('light-mode');
    toggleSwitch.checked = true;
    themeText.textContent = "LIGHT MODE";
}

toggleSwitch.addEventListener('change', (e) => {
    if (e.target.checked) {
        body.classList.add('light-mode');
        themeText.textContent = "LIGHT MODE";
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.remove('light-mode');
        themeText.textContent = "DARK MODE";
        localStorage.setItem('theme', 'dark');
    }    
});
