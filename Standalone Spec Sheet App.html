<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
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
                            <input id="serial" type="text" class="w-full border rounded-2xl px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-black/20 transition-all" value="ATK-2025-00123" placeholder="e.g. ATK-2025-00123" />
                        </div>
                        
                        <div>
                            <label for="customer" class="text-sm font-medium text-gray-700 mb-1 block">Customer Name</label>
                            <input id="customer" type="text" class="w-full border rounded-2xl px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-black/20 transition-all" placeholder="Customer Name" />
                        </div>
                        
                        <div>
                            <label for="email" class="text-sm font-medium text-gray-700 mb-1 block">Contact Email</label>
                            <input id="email" type="email" class="w-full border rounded-2xl px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-black/20 transition-all" placeholder="name@example.com" />
                        </div>
                        
                        <div>
                            <label for="model" class="text-sm font-medium text-gray-700 mb-1 block">Model</label>
                            <select id="model" class="w-full border rounded-2xl px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-black/20 transition-all appearance-none">
                                <option value="">🔄 Loading models...</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="grid md:grid-cols-4 gap-4">
                        <div>
                            <label for="rightLeft" class="text-sm font-medium text-gray-700 mb-1 block">RIGHT / LEFT</label>
                            <select id="rightLeft" class="w-full border rounded-2xl px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-black/20 transition-all appearance-none">
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
                    <textarea id="notes" class="w-full min-h-[140px] border rounded-2xl px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-black/20 transition-all resize-y" placeholder="Anything extra to capture..."></textarea>
                </div>

                <!-- Action Buttons -->
                <div class="flex flex-wrap items-center gap-3 pt-2 print-hidden">
                    <button onclick="printPdf()" class="inline-flex items-center rounded-2xl border px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-gray-50">
                        Download PDF
                    </button>
                    
                    <a href="https://docs.google.com/spreadsheets/d/1pIU3AycF8uHF8pAtncp8hbvo9xY295iucBs8OtcQgrc/edit?pli=1&gid=1234273116#gid=1234273116" target="_blank" rel="noreferrer" class="inline-flex items-center rounded-2xl border px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-gray-50 no-underline">
                        Edit spec sheet (Google Sheets)
                    </a>
                    
                    <button onclick="softReset()" class="inline-flex items-center rounded-2xl border px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-gray-50">
                        Soft reset
                    </button>
                    
                    <button onclick="hardReset()" id="hardResetBtn" class="inline-flex items-center rounded-2xl border px-4 py-2 text-sm font-medium shadow-sm transition-colors bg-orange-100 hover:bg-orange-200" title="Reload OPTIONS & MODELS from Google Sheets (cache-busted)">
                        Hard reset (reload options)
                    </button>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Configuration
        const GAS_BASE = "https://script.google.com/macros/s/AKfycbzXM4ewfNZmBDi5gYszoLTZSvSWMaktHyvmvTaI3E-HcVy4_OKQIFwTWZHDbiEIlGOn/exec";
        
        // Global data storage - start completely fresh
        let MODEL_PRESETS = {};
        let currentSpecs = {};
        let baseline = {};
        let dirtyFields = new Set();
        let dataLoaded = false;

        // Initialize the application
        function init() {
            console.log("🚀 Starting Atkin Spec Sheet...");
            setupEventListeners();
            loadModelsData();
        }

        function setupEventListeners() {
            const modelSelect = document.getElementById('model');
            if (modelSelect) {
                modelSelect.addEventListener('change', handleModelChange);
            }
        }

        function loadModelsData() {
            console.log("📡 Loading models from Google Sheets...");
            showStatus('Loading guitar models from Google Sheets...', 'info');
            
            const url = `${GAS_BASE}?kind=models&_cb=${Date.now()}`;
            console.log("🔗 Fetching:", url);
            
            fetch(url)
                .then(response => {
                    console.log("📥 Response status:", response.status);
                    return response.json();
                })
                .then(data => {
                    console.log("📦 Raw API response:", data);
                    
                    if (data.ok && data.data) {
                        // Clear and populate models
                        MODEL_PRESETS = {};
                        
                        // Copy all models except 'NA'
                        let modelCount = 0;
                        for (const [modelName, modelData] of Object.entries(data.data)) {
                            if (modelName && modelName !== 'NA' && modelName.trim() !== '') {
                                MODEL_PRESETS[modelName] = modelData;
                                modelCount++;
                            }
                        }
                        
                        console.log(`✅ Loaded ${modelCount} models successfully!`);
                        console.log("🎸 First 10 models:", Object.keys(MODEL_PRESETS).slice(0, 10));
                        console.log("🎸 Sample model data:", Object.keys(MODEL_PRESETS)[0], MODEL_PRESETS[Object.keys(MODEL_PRESETS)[0]]);
                        
                        // Populate the dropdown
                        populateModelDropdown();
                        
                        dataLoaded = true;
                        showStatus(`✅ Loaded ${modelCount} guitar models from Google Sheets`, 'success');
                        
                    } else {
                        throw new Error("Invalid response format");
                    }
                })
                .catch(error => {
                    console.error("❌ Error loading models:", error);
                    showStatus(`❌ Failed to load models: ${error.message}`, 'error');
                    
                    // Fallback models
                    MODEL_PRESETS = {
                        "J43": {"SCALE": "24.9", "NUT WIDTH": "43", "TOP": "STIKA SPRUCE"},
                        "L36": {"SCALE": "24.9", "NUT WIDTH": "43", "TOP": "STIKA SPRUCE"}
                    };
                    populateModelDropdown();
                });
        }

        function populateModelDropdown() {
            const modelSelect = document.getElementById('model');
            if (!modelSelect) {
                console.error("❌ Model select element not found!");
                return;
            }
            
            console.log("🔄 Populating model dropdown...");
            
            // Clear existing options
            modelSelect.innerHTML = '';
            
            // Add default option
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Choose a model';
            modelSelect.appendChild(defaultOption);
            
            // Add all models in alphabetical order
            const modelNames = Object.keys(MODEL_PRESETS).sort();
            console.log(`📋 Adding ${modelNames.length} models to dropdown`);
            
            modelNames.forEach((modelName, index) => {
                const option = document.createElement('option');
                option.value = modelName;
                option.textContent = modelName;
                modelSelect.appendChild(option);
                
                if (index < 5) {
                    console.log(`   ✓ Added: ${modelName}`);
                }
            });
            
            console.log(`✅ Model dropdown populated with ${modelNames.length} models`);
            
            // Verify the dropdown was populated
            setTimeout(() => {
                const optionCount = modelSelect.options.length - 1; // minus the default option
                console.log(`🔍 Verification: Dropdown now has ${optionCount} model options`);
                if (optionCount !== modelNames.length) {
                    console.warn("⚠️ Mismatch between expected and actual dropdown options!");
                }
            }, 100);
        }

        async function fetchData(url) {
            console.log('🔄 Fetching:', url);
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            console.log('📦 Response:', data);
            return data;
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
            
            if (type === 'info' || type === 'success') {
                setTimeout(() => statusDiv.classList.add('hidden'), 4000);
            }
        }

        function handleModelChange(event) {
            const selectedModel = event.target.value;
            console.log(`🎸 Model selected: ${selectedModel}`);
            
            if (!selectedModel) {
                hideSpecs();
                return;
            }
            
            const modelData = MODEL_PRESETS[selectedModel];
            if (!modelData) {
                console.error(`❌ No data found for model: ${selectedModel}`);
                console.log("Available models:", Object.keys(MODEL_PRESETS));
                showStatus(`❌ No data found for model: ${selectedModel}`, 'error');
                hideSpecs();
                return;
            }
            
            console.log(`✅ Model data found:`, modelData);
            baseline = { ...modelData };
            currentSpecs = { ...modelData };
            dirtyFields.clear();
            
            showSpecs();
            populateSpecs(modelData);
        }

        function showSpecs() {
            document.getElementById('specsSection').classList.remove('hidden');
        }

        function hideSpecs() {
            document.getElementById('specsSection').classList.add('hidden');
        }

        function populateSpecs(modelData) {
            const specsGrid = document.getElementById('specsGrid');
            specsGrid.innerHTML = '';
            
            console.log("🔧 Populating specs for model:", modelData);
            
            // Field mapping for better display names
            const fieldMapping = {
                'SCALE': 'Scale Length',
                'NUT WIDTH': 'Nut Width', 
                'NECK SHAPE': 'Neck Shape',
                'HEADSTOCK VENEER': 'Headstock Veneer',
                'HS DECAL': 'Headstock Decal',
                'HEADSTOCK INLAY': 'Headstock Inlay',
                'FRETBOARD': 'Fretboard',
                'F / BOARD INLAYS': 'Fretboard Inlays',
                'BRIDGE STYLE': 'Bridge Style',
                'BRIDGE WOOD': 'Bridge Wood',
                'TOP': 'Top Wood',
                'BACK / SIDES': 'Back & Sides',
                'BINDINGS': 'Bindings',
                'PURFLING F / B': 'Purfling',
                'BACKSTRIP': 'Backstrip',
                'END WEDGE': 'End Wedge',
                'FRETS': 'Frets',
                'BRACING': 'Bracing',
                'ROSETTE': 'Rosette',
                'MACHINEHEADS': 'Machine Heads',
                'PICKGUARD': 'Pickguard',
                'BRIDGE PINS': 'Bridge Pins',
                'END PIN': 'End Pin',
                'STRINGS': 'Strings',
                'BODY JOIN': 'Body Join'
            };
            
            // Get all unique values for each field from all models
            const fieldOptions = {};
            Object.values(MODEL_PRESETS).forEach(model => {
                Object.keys(model).forEach(field => {
                    if (!fieldOptions[field]) fieldOptions[field] = new Set();
                    if (model[field] && model[field] !== '-' && model[field].trim() !== '') {
                        fieldOptions[field].add(model[field]);
                    }
                });
            });
            
            // Create dropdowns for each field that has options
            Object.keys(fieldMapping).forEach(field => {
                if (fieldOptions[field] && fieldOptions[field].size > 0) {
                    const fieldDiv = document.createElement('div');
                    const options = Array.from(fieldOptions[field]).sort();
                    const displayName = fieldMapping[field];
                    const currentValue = modelData[field] || '';
                    
                    fieldDiv.innerHTML = `
                        <label for="spec-${field}" class="text-sm font-medium text-gray-700 mb-1 block">${displayName}</label>
                        <div id="container-${field}">
                            <select id="spec-${field}" 
                                    class="w-full border rounded-2xl px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-black/20 transition-all appearance-none"
                                    onchange="handleSpecChange('${field}', this.value)">
                                <option value="">Select...</option>
                                ${options.map(option => 
                                    `<option value="${option}" ${currentValue === option ? 'selected' : ''}>${option}</option>`
                                ).join('')}
                            </select>
                        </div>
                    `;
                    specsGrid.appendChild(fieldDiv);
                }
            });
            
            console.log(`✅ Created ${specsGrid.children.length} specification fields`);
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
            
            // Clear all data
            MODEL_PRESETS = {};
            currentSpecs = {};
            baseline = {};
            dirtyFields.clear();
            hideSpecs();
            
            setTimeout(() => {
                loadModelsData();
                btn.innerHTML = 'Hard reset (reload options)';
                btn.disabled = false;
            }, 1000);
        }

        // Initialize when page loads
        document.addEventListener('DOMContentLoaded', init);
    </script>
</body>
</html>
