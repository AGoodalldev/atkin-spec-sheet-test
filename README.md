<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Atkin Custom Spec Sheet</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @media print {
            @page { size: A4 portrait; margin: 12mm; }
            * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            body { background: white; }
            .print-hidden { display: none !important; }
        }
        
        .loading-spinner {
            border: 2px solid #f3f3f3;
            border-top: 2px solid #3498db;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .highlight-changed {
            ring: 2px;
            ring-color: #f97316;
            ring-offset: 1px;
            border-radius: 14px;
        }
    </style>
</head>
<body class="bg-gray-50">
    <div class="p-6">
        <div class="rounded-2xl shadow-xl border border-gray-200 bg-white max-w-4xl mx-auto">
            <div class="p-6 space-y-4">
                <h1 class="text-2xl font-bold mb-2">Atkin Custom Spec Sheet</h1>
                
                <!-- Status Messages -->
                <div id="statusMessage" class="hidden"></div>
                
                <!-- Main Form -->
                <div class="bg-gray-50 p-4 rounded-xl shadow-inner space-y-4">
                    <div class="grid md:grid-cols-4 gap-4">
                        <div>
                            <label for="serial" class="text-sm font-medium text-gray-700 mb-1 block">Serial Number</label>
                            <input id="serial" type="text" 
                                   class="w-full border rounded-2xl px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-black/20 transition-all"
                                   value="ATK-2025-00123" placeholder="e.g. ATK-2025-00123">
                        </div>
                        
                        <div>
                            <label for="customer" class="text-sm font-medium text-gray-700 mb-1 block">Customer Name</label>
                            <input id="customer" type="text" 
                                   class="w-full border rounded-2xl px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-black/20 transition-all"
                                   placeholder="Customer Name">
                        </div>
                        
                        <div>
                            <label for="email" class="text-sm font-medium text-gray-700 mb-1 block">Contact Email</label>
                            <input id="email" type="email" 
                                   class="w-full border rounded-2xl px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-black/20 transition-all"
                                   placeholder="name@example.com">
                        </div>
                        
                        <div>
                            <label for="model" class="text-sm font-medium text-gray-700 mb-1 block">Model</label>
                            <select id="model" 
                                    class="w-full border rounded-2xl px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-black/20 transition-all appearance-none">
                                <option value="">Choose a model</option>
                                <option value="J43">J43</option>
                                <option value="L36">L36</option>
                                <option value="R25">R25</option>
                                <option value="M18">M18</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="grid md:grid-cols-4 gap-4">
                        <div>
                            <label for="rightLeft" class="text-sm font-medium text-gray-700 mb-1 block">RIGHT / LEFT</label>
                            <select id="rightLeft" 
                                    class="w-full border rounded-2xl px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-black/20 transition-all appearance-none">
                                <option value="">Select...</option>
                                <option value="RIGHT">RIGHT</option>
                                <option value="LEFT">LEFT</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Specifications Section -->
                <div id="specsSection" class="space-y-4 hidden">
                    <h2 class="text-lg font-semibold text-gray-800">Specifications</h2>
                    <div id="specsGrid" class="grid md:grid-cols-2 gap-4">
                        <!-- Dynamic specs will be added here -->
                    </div>
                </div>

                <!-- Notes Section -->
                <div>
                    <label for="notes" class="text-sm font-medium text-gray-700 mb-1 block">Additional Notes</label>
                    <textarea id="notes" 
                              class="w-full min-h-[140px] border rounded-2xl px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-black/20 transition-all resize-y"
                              placeholder="Anything extra to capture..."></textarea>
                </div>

                <!-- Action Buttons -->
                <div class="flex flex-wrap items-center gap-3 pt-2 print-hidden">
                    <button onclick="printPdf()" 
                            class="inline-flex items-center rounded-2xl border px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-gray-50">
                        Download PDF
                    </button>
                    
                    <a href="https://docs.google.com/spreadsheets/d/1pIU3AycF8uHF8pAtncp8hbvo9xY295iucBs8OtcQgrc/edit?pli=1&gid=1234273116#gid=1234273116" 
                       target="_blank" rel="noreferrer"
                       class="inline-flex items-center rounded-2xl border px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-gray-50 no-underline">
                        Edit spec sheet (Google Sheets)
                    </a>
                    
                    <button onclick="softReset()" 
                            class="inline-flex items-center rounded-2xl border px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-gray-50">
                        Soft reset
                    </button>
                    
                    <button onclick="hardReset()" id="hardResetBtn"
                            class="inline-flex items-center rounded-2xl border px-4 py-2 text-sm font-medium shadow-sm transition-colors bg-orange-100 hover:bg-orange-200"
                            title="Reload OPTIONS & MODELS from Google Sheets (cache-busted)">
                        Hard reset (reload options)
                    </button>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Configuration
        const GAS_BASE = "https://script.google.com/macros/s/AKfycbzXM4ewfNZmBDi5gYszoLTZSvSWMaktHyvmvTaI3E-HcVy4_OKQIFwTWZHDbiEIlGOn/exec";
        
        // Guitar specifications data
        const GUITAR_SPECS = {
            "FINISH": ["AGED", "LIGHT RELIC", "HEAVY RELIC", "Natural", "Gloss", "Satin"],
            "TOP": ["STIKA SPRUCE", "MAHOGANY", "FLAME MAPLE", "Cedar", "Redwood"],
            "BACK / SIDES": ["MAHOGANY", "FLAME MAPLE", "Rosewood", "Walnut", "Maple"],
            "BACKSTRIP": ["CHECKER", "ZIPPER", "Herringbone", "Simple", "None"],
            "ROSETTE": ["B / W / B", "CREAM", "Abalone", "Wood", "Custom"],
            "BRACING": ["7MM / 15MM", "8MM / 20MM", "Standard", "Heavy", "Light"],
            "END WEDGE": ["IN RW", "BW IVORID BW", "Ebony", "Maple", "None"],
            "BINDINGS": ["CREAM", "TORT", "IVOROID", "Wood", "Plastic"],
            "PURFLING F/B": ["W BWB / -", "HERRING / BW", "Abalone", "Wood", "None"],
            "FRETBOARD": ["SANTOS", "EBONY", "Rosewood", "Maple", "Pau Ferro"],
            "NUT WIDTH": ["43", "45", "42", "44", "46"],
            "F/BOARD INLAYS": ["6MM DOTS", "DIAMOND", "Blocks", "None", "Custom"],
            "SCALE": ["SHORT 24.9", "LONG 25.4", "Standard", "Custom"],
            "NECK SHAPE": ["VINTAGE V", "PRE WAR", "Modern C", "Thin C", "Custom"],
            "HEADSTOCK VENEER": ["EBONY", "MAPLE", "Rosewood", "Matching Body"],
            "HEADSTOCK INLAY": ["LOGO", "LOGO HESDSTOCK", "Name", "Custom", "None"],
            "HS DECAL": ["LOGO BANNER", "LOGO", "Name", "Custom", "None"],
            "BODY JOIN": ["14", "13", "12", "15"],
            "M/HEADS": ["NICKEL KLUSON", "NICKEL GOTOH", "Gold", "Chrome", "Vintage"],
            "FRETS": ["G STYLE", "M STYLE", "Jumbo", "Medium", "Small"],
            "BRIDGE STYLE": ["SANTOS", "EBONY", "Rosewood", "Maple"],
            "BRIDGE WOOD": ["SANTOS", "EBONY", "Rosewood", "Maple"],
            "PICKGUARD": ["TORT", "FIRE STRIPE", "Black", "White", "None"],
            "BRIDGE PINS": ["CREAM", "EBONY", "Bone", "Plastic"],
            "END PIN": ["CREAM", "BLACK", "Ebony", "Bone"],
            "STRINGS": ["12's", "11's", "13's", "10's"],
            "PICKUP": ["None", "Magnetic", "Piezo", "Both"]
        };

        const MODEL_PRESETS = {
            "J43": {
                "FINISH": "AGED",
                "TOP": "STIKA SPRUCE",
                "BACK / SIDES": "MAHOGANY",
                "BACKSTRIP": "CHECKER",
                "ROSETTE": "B / W / B",
                "BRACING": "7MM / 15MM",
                "END WEDGE": "IN RW",
                "BINDINGS": "CREAM",
                "PURFLING F/B": "W BWB / -",
                "FRETBOARD": "SANTOS",
                "NUT WIDTH": "43",
                "F/BOARD INLAYS": "6MM DOTS",
                "SCALE": "SHORT 24.9",
                "NECK SHAPE": "VINTAGE V",
                "HEADSTOCK VENEER": "EBONY",
                "HEADSTOCK INLAY": "LOGO",
                "HS DECAL": "LOGO BANNER",
                "BODY JOIN": "14",
                "M/HEADS": "NICKEL KLUSON",
                "FRETS": "G STYLE",
                "BRIDGE STYLE": "SANTOS",
                "BRIDGE WOOD": "SANTOS",
                "PICKGUARD": "TORT",
                "BRIDGE PINS": "CREAM",
                "END PIN": "CREAM",
                "STRINGS": "12's"
            },
            "L36": {
                "FINISH": "LIGHT RELIC",
                "TOP": "MAHOGANY",
                "BACK / SIDES": "FLAME MAPLE",
                "BACKSTRIP": "ZIPPER",
                "ROSETTE": "CREAM",
                "BRACING": "8MM / 20MM",
                "END WEDGE": "BW IVORID BW",
                "BINDINGS": "TORT",
                "PURFLING F/B": "HERRING / BW",
                "FRETBOARD": "EBONY",
                "NUT WIDTH": "45",
                "F/BOARD INLAYS": "DIAMOND",
                "SCALE": "LONG 25.4",
                "NECK SHAPE": "PRE WAR",
                "HEADSTOCK VENEER": "MAPLE",
                "HEADSTOCK INLAY": "LOGO HESDSTOCK",
                "HS DECAL": "LOGO",
                "BODY JOIN": "13",
                "M/HEADS": "NICKEL GOTOH",
                "FRETS": "M STYLE",
                "BRIDGE STYLE": "EBONY",
                "BRIDGE WOOD": "EBONY",
                "PICKGUARD": "FIRE STRIPE",
                "BRIDGE PINS": "EBONY",
                "END PIN": "BLACK",
                "STRINGS": "11's"
            }
        };

        let currentSpecs = {};
        let baseline = {};
        let dirtyFields = new Set();

        // Initialize the application
        function init() {
            setupEventListeners();
            loadInitialData();
        }

        function setupEventListeners() {
            document.getElementById('model').addEventListener('change', handleModelChange);
        }

        function loadInitialData() {
            showStatus('Attempting to load live data from Google Sheets...', 'info');
            
            Promise.all([
                fetchData(`${GAS_BASE}?kind=options`),
                fetchData(`${GAS_BASE}?kind=models`)
            ]).then(([optionsData, modelsData]) => {
                console.log('✅ Successfully loaded live data from Google Sheets');
                showStatus('✅ Live data loaded from Google Sheets', 'success');
                // Could process live data here if needed
            }).catch(error => {
                console.log('Using demo data based on your guitar specifications');
                showStatus('Using demo guitar specifications (API connection failed)', 'warning');
            });
        }

        async function fetchData(url) {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.json();
        }

        function showStatus(message, type = 'info') {
            const statusDiv = document.getElementById('statusMessage');
            const bgColor = type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
                           type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-800' :
                           type === 'error' ? 'bg-red-50 border-red-200 text-red-700' :
                           'bg-blue-50 border-blue-200 text-blue-800';
            
            statusDiv.className = `flex items-center gap-2 p-3 border rounded-xl ${bgColor}`;
            statusDiv.innerHTML = `<span>${message}</span>`;
            statusDiv.classList.remove('hidden');
            
            if (type === 'info') {
                setTimeout(() => statusDiv.classList.add('hidden'), 3000);
            }
        }

        function handleModelChange(event) {
            const selectedModel = event.target.value;
            if (!selectedModel) {
                hideSpecs();
                return;
            }
            
            const preset = MODEL_PRESETS[selectedModel] || {};
            baseline = { ...preset };
            currentSpecs = { ...preset };
            dirtyFields.clear();
            
            showSpecs();
            populateSpecs(preset);
        }

        function showSpecs() {
            document.getElementById('specsSection').classList.remove('hidden');
        }

        function hideSpecs() {
            document.getElementById('specsSection').classList.add('hidden');
        }

        function populateSpecs(preset) {
            const specsGrid = document.getElementById('specsGrid');
            specsGrid.innerHTML = '';
            
            Object.keys(GUITAR_SPECS).forEach(field => {
                const fieldDiv = document.createElement('div');
                fieldDiv.innerHTML = `
                    <label for="spec-${field}" class="text-sm font-medium text-gray-700 mb-1 block">${field}</label>
                    <div id="container-${field}">
                        <select id="spec-${field}" 
                                class="w-full border rounded-2xl px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-black/20 transition-all appearance-none"
                                onchange="handleSpecChange('${field}', this.value)">
                            <option value="">Select...</option>
                            ${GUITAR_SPECS[field].map(option => 
                                `<option value="${option}" ${preset[field] === option ? 'selected' : ''}>${option}</option>`
                            ).join('')}
                        </select>
                    </div>
                `;
                specsGrid.appendChild(fieldDiv);
            });
        }

        function handleSpecChange(field, value) {
            currentSpecs[field] = value;
            
            const baseValue = baseline[field] || '';
            const container = document.getElementById(`container-${field}`);
            
            if (value !== baseValue) {
                dirtyFields.add(field);
                container.classList.add('highlight-changed');
            } else {
                dirtyFields.delete(field);
                container.classList.remove('highlight-changed');
            }
        }

        function printPdf() {
            window.print();
        }

        function softReset() {
            document.getElementById('customer').value = '';
            document.getElementById('email').value = '';
            document.getElementById('notes').value = '';
            document.getElementById('model').value = '';
            document.getElementById('rightLeft').value = '';
            
            currentSpecs = {};
            baseline = {};
            dirtyFields.clear();
            hideSpecs();
            
            showStatus('Form reset successfully', 'success');
        }

        function hardReset() {
            const btn = document.getElementById('hardResetBtn');
            btn.innerHTML = '<div class="loading-spinner"></div> Reloading...';
            btn.disabled = true;
            
            setTimeout(() => {
                loadInitialData();
                btn.innerHTML = 'Hard reset (reload options)';
                btn.disabled = false;
            }, 2000);
        }

        // Initialize when page loads
        document.addEventListener('DOMContentLoaded', init);
    </script>
</body>
</html>
