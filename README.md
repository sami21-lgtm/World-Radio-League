# 📡 WRL Command Center — Live API Edition

A real-time, interactive ham radio and space weather dashboard featuring adaptive telemetry tracking, live atmospheric data fetching, and an automated radio traffic simulator. Built using modern frontend architectures with structural glassmorphism principles and dynamic theme-switching capabilities.

---

## 🚀 Key Features

* **Dual-Clock Telemetry Matrix:** Real-time synchronization of **UTC** and **Local** system clocks updating down to the millisecond for precise scheduling.
* **Live Weather Tracking API:** Native integration with the *Open-Meteo API* to fetch hyper-localized weather conditions (temperature, wind velocity, and climate updates) for **Dhaka, Bangladesh**.
* **NOAA Space Weather Core:** Dynamically hooks into the *National Oceanic and Atmospheric Administration (NOAA)* servers to parse live **Solar Flux Index (SFI)** and **Planetary K-Index** telemetry.
* **Animated Propagation Gauges:** Utilizes pure SVG coordinate logic to render real-time vector gauges representing ionospheric stabilization indexes.
* **Dynamic Map Traffic Simulator:** An active HTML5 Canvas global tracking interface that renders randomized simulated radio traffic nodes categorized by distinct transmission mode signatures (CW, SSB, FT8, FM, Digital).
* **Live DX Alerts & News Ticker:** Integrated asynchronous RSS-to-JSON stream pipelining space weather anomalies and breaking news directly from global networks via a continuous marquee animation.
* **Bi-Phasic Theme Controller:** Instantaneous visual inversion layer between **Cyberpunk Dark Mode** and **Clean Minimalist Light Mode** with recursive canvas re-rendering triggers.

---

## 🛠️ Built With

* **HTML5:** Semantic architecture with canvas anchoring and asynchronous structural layouts.
* **CSS3 Custom Properties:** Engineered with adaptive root variables (`:root`), absolute alignment mechanics, flexbox grids, and fluid hardware-accelerated animations.
* **Asynchronous Vanilla JavaScript:** Built without external heavy frameworks using native `fetch()` promises, intervals, modular canvas path rendering, and structural DOM mutations.

---

## 📂 File Structure

```text
├── index.html          # Core structural elements, semantic nodes, and data hooks
├── style.css           # Reactive custom theme layouts, responsive grids, and animation matrices
└── script.js           # API polling services, canvas engine, clocks, and event-handling pipelines
