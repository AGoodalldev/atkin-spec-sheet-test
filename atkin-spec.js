// Configuration
const GAS_BASE = "https://script.google.com/macros/s/AKfycbzXM4ewfNZmBDi5gYszoLTZSvSWMaktHyvmvTaI3E-HcVy4_OKQIFwTWZHDbiEIlGOn/exec";

// Global data storage
let MODEL_PRESETS = {};
let GUITAR_SPECS = {}; // This will store the OPTIONS data
let currentSpecs = {};
let baseline = {};
let dirtyFields = new Set();
let dataLoaded = false;

// Initialize the application
function init() {
    console.log("🚀 Starting Atkin Spec Sheet...");
    setupEventListeners();
    loadAllData(); // Load both models and options
}

function setupEventListeners() {
    const modelSelect = document.getElementById('model');
    if (modelSelect) {
        modelSelect.addEventListener('change', handleModelChange);
    }
}

// Load both models and options data
async function loadAllData() {
    console.log("📡 Loading data from Google Sheets...");
    showStatus('Loading guitar data from Google Sheets...', 'info');
    
    try {
        // Load both models and options in parallel
        const [modelsData, optionsData] = await Promise.all([
            loadModelsData(),
            loadOptionsData()
        ]);
        
        console.log("✅ All data loaded successfully!");
        dataLoaded = true;
        
        const modelCount = Object.keys(MODEL_PRESETS).length;
        const optionFields = Object.keys(GUITAR_SPECS).length;
        showStatus(`✅ Loaded ${modelCount} models and ${optionFields} specification fields`, 'success');
        
    } catch (error) {
        console.error("❌ Error loading data:", error);
        showStatus(`❌ Failed to load data: ${error.message}`, 'error');
    }
}

// Load models data
async function loadModelsData() {
    console.log("📡 Loading models...");
    
    const url = `${GAS_BASE}?kind=models&_cb=${Date.now()}`;
    console.log("🔗 Fetching models:", url);
    
    const response = await fetch(url);
    const data = await response.json();
    
    console.log("📦 Models API response:", data);
    
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
        
        // Populate the dropdown
        populateModelDropdown();
        
        return data;
    } else {
        throw new Error("Invalid models response format");
    }
}

// Load options data
async function loadOptionsData() {
    console.log("📡 Loading specification options...");
    
    const url = `${GAS_BASE}?kind=options&_cb=${Date.now()}`;
    console.log("🔗 Fetching options:", url);
    
    const response = await fetch(url);
    const data = await response.json();
    
    console.log("📦 Options API response:", data);
    
    if (data.ok && data.data) {
        GUITAR_SPECS = data.data;
        
        const fieldCount = Object.keys(GUITAR_SPECS).length;
        console.log(`✅ Loaded ${fieldCount} specification fields!`);
        console.log("🎯 Available spec fields:", Object.keys(GUITAR_SPECS));
        
        return data;
    } else {
        throw new Error("Invalid options response format");
    }
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
}

function showStatus(message, type = 'info') {
    const statusDiv = document.getElementById('statusMessage');
    if (!statusDiv) return;
    
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
    const specsSection = document.getElementById('specsSection');
    if (specsSection) {
        specsSection.classList.remove('hidden');
    }
}

function hideSpecs() {
    const specsSection = document.getElementById('specsSection');
    if (specsSection) {
        specsSection.classList.add('hidden');
    }
}

function populateSpecs(modelData) {
    const specsGrid = document.getElementById('specsGrid');
    if (!specsGrid) return;
    
    specsGrid.innerHTML = '';
    
    console.log("🔧 Populating specs for model:", modelData);
    console.log("🎯 Using OPTIONS data:", Object.keys(GUITAR_SPECS).length, "fields available");
    console.log("📄 Model data fields:", Object.keys(modelData));
    console.log("📄 OPTIONS data fields:", Object.keys(GUITAR_SPECS));
    
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
    
    let fieldOptions = {};
    
    // Use the loaded OPTIONS data
    if (GUITAR_SPECS && Object.keys(GUITAR_SPECS).length > 0) {
        console.log("🎯 Using OPTIONS tab data for spec dropdowns");
        
        Object.keys(GUITAR_SPECS).forEach(field => {
            const options = GUITAR_SPECS[field];
            if (Array.isArray(options) && options.length > 0) {
                fieldOptions[field] = options.filter(opt => opt && opt.trim() !== '' && opt !== '-');
                console.log(`📋 Field "${field}": ${fieldOptions[field].length} options`);
            }
        });
    } else {
        console.log("⚠️ OPTIONS data not available - falling back to model scanning");
        
        // Fallback: scan all models for unique values
        Object.values(MODEL_PRESETS).forEach(model => {
            Object.keys(model).forEach(field => {
                if (!fieldOptions[field]) fieldOptions[field] = [];
                if (model[field] && model[field] !== '-' && model[field].trim() !== '') {
                    if (!fieldOptions[field].includes(model[field])) {
                        fieldOptions[field].push(model[field]);
                    }
                }
            });
        });
        
        // Sort the fallback options
        Object.keys(fieldOptions).forEach(field => {
            fieldOptions[field].sort();
        });
    }
    
    console.log("🔍 Available spec fields:", Object.keys(fieldOptions));
    
    // Create dropdowns for each field that has options
    Object.keys(fieldOptions).forEach(field => {
        if (fieldOptions[field] && fieldOptions[field].length > 0) {
            const fieldDiv = document.createElement('div');
            const options = fieldOptions[field];
            
            // Try to get a display name from fieldMapping, otherwise use the field name
            const displayName = fieldMapping[field] || field;
            
            // Look for the model value - try exact match first, then case-insensitive
            let currentValue = modelData[field] || '';
            if (!currentValue) {
                // Try to find a case-insensitive match
                const modelFieldKeys = Object.keys(modelData);
                const matchingKey = modelFieldKeys.find(key => 
                    key.toLowerCase() === field.toLowerCase()
                );
                if (matchingKey) {
                    currentValue = modelData[matchingKey];
                    console.log(`🔄 Field name mapping: "${field}" → "${matchingKey}" = "${currentValue}"`);
                }
            }
            
            // Check if the baseline value exists in the options
            const baselineExists = currentValue && options.includes(currentValue);
            
            console.log(`📋 Creating field "${displayName}" (${field}) with ${options.length} options, baseline value: "${currentValue}"`);
            
            fieldDiv.innerHTML = `
                <label for="spec-${field}" class="text-sm font-medium text-gray-700 mb-1 block">${displayName}</label>
                <div id="container-${field}">
                    <select id="spec-${field}" 
                            class="w-full border rounded-2xl px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-black/20 transition-all appearance-none"
                            onchange="handleSpecChange('${field}', this.value)">
                        <option value="">Select...</option>
                        ${options.map(option => {
                            const isBaseline = option === currentValue;
                            const selected = isBaseline ? 'selected' : '';
                            return `<option value="${option}" ${selected}>${option}</option>`;
                        }).join('')}
                        ${!baselineExists && currentValue ? `<option value="${currentValue}" selected>${currentValue}</option>` : ''}
                    </select>
                </div>
            `;
            specsGrid.appendChild(fieldDiv);
            
            // Set the current value in our tracking
            currentSpecs[field] = currentValue;
        }
    });
    
    const dataSource = GUITAR_SPECS && Object.keys(GUITAR_SPECS).length > 0 ? 'OPTIONS tab' : 'model scanning';
    console.log(`✅ Created ${specsGrid.children.length} specification fields using data from ${dataSource}`);
}

function handleSpecChange(field, value) {
    currentSpecs[field] = value;
    
    const baseValue = baseline[field] || '';
    const selectElement = document.getElementById(`spec-${field}`);
    
    console.log(`🔧 Spec changed: ${field} = "${value}" (baseline: "${baseValue}")`);
    
    if (selectElement) {
        if (value !== baseValue && value !== '') {
            // Field was changed from baseline - highlight it
            dirtyFields.add(field);
            selectElement.classList.add('highlight-changed');
            console.log(`🟡 Highlighted field: ${field}`);
        } else {
            // Field matches baseline or is empty - remove highlight
            dirtyFields.delete(field);
            selectElement.classList.remove('highlight-changed');
            console.log(`⚪ Removed highlight from field: ${field}`);
        }
    }
}

function printPdf() {
    // Show all specs before printing (if a model is selected)
    const selectedModel = document.getElementById('model').value;
    if (selectedModel) {
        showSpecs();
    }
    
    // Brief delay to ensure layout is ready
    setTimeout(() => {
        // Add date to title for print
        const originalTitle = document.querySelector('h1').textContent;
        const printDate = new Date().toLocaleDateString();
        document.querySelector('h1').textContent = `${originalTitle} - Generated: ${printDate}`;
        
        // Print the page
        window.print();
        
        // Restore original title after print dialog
        setTimeout(() => {
            document.querySelector('h1').textContent = originalTitle;
        }, 500);
    }, 100);
}

function softReset() {
    console.log("🔄 Starting soft reset...");
    
    // Clear form fields
    const fields = ['serial', 'customer', 'email', 'notes'];
    fields.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.value = '';
            element.setAttribute('value', '');
        }
    });
    
    // Reset select elements
    const modelSelect = document.getElementById('model');
    if (modelSelect) {
        modelSelect.innerHTML = '<option value="">Choose a model</option>';
        modelSelect.value = '';
    }
    
    const rightLeftSelect = document.getElementById('rightLeft');
    if (rightLeftSelect) {
        rightLeftSelect.innerHTML = `
            <option value="">Select...</option>
            <option value="RIGHT">RIGHT</option>
            <option value="LEFT">LEFT</option>
        `;
        rightLeftSelect.value = '';
    }
    
    // Clear all specification dropdowns and highlights
    const allSelects = document.querySelectorAll('select[id^="spec-"]');
    allSelects.forEach(select => {
        select.classList.remove('highlight-changed');
        select.value = '';
        if (select.options.length > 0) {
            select.selectedIndex = 0;
        }
    });
    
    // Clear tracking data
    currentSpecs = {};
    baseline = {};
    dirtyFields.clear();
    hideSpecs();
    
    console.log("✅ Soft reset completed");
}

function hardReset() {
    console.log("🔄 Starting hard reset...");
    
    const btn = document.getElementById('hardResetBtn');
    if (btn) {
        btn.innerHTML = '<div class="loading-spinner"></div> Reloading...';
        btn.disabled = true;
    }
    
    // Clear all form fields
    const fields = ['serial', 'customer', 'email', 'notes'];
    fields.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.value = '';
            element.setAttribute('value', '');
            element.removeAttribute('value');
        }
    });
    
    // Reset dropdowns
    const modelSelect = document.getElementById('model');
    if (modelSelect) {
        modelSelect.innerHTML = '<option value="">🔄 Loading models...</option>';
        modelSelect.value = '';
    }
    
    const rightLeftSelect = document.getElementById('rightLeft');
    if (rightLeftSelect) {
        rightLeftSelect.innerHTML = `
            <option value="">Select...</option>
            <option value="RIGHT">RIGHT</option>
            <option value="LEFT">LEFT</option>
        `;
        rightLeftSelect.value = '';
    }
    
    // Clear all specification dropdowns and highlights
    const allSelects = document.querySelectorAll('select[id^="spec-"]');
    allSelects.forEach(select => {
        select.classList.remove('highlight-changed');
        select.value = '';
        if (select.options.length > 0) {
            select.selectedIndex = 0;
        }
    });
    
    // Clear all data
    MODEL_PRESETS = {};
    GUITAR_SPECS = {};
    currentSpecs = {};
    baseline = {};
    dirtyFields.clear();
    hideSpecs();
    
    setTimeout(() => {
        console.log("🔄 Reloading data...");
        loadAllData();
        if (btn) {
            btn.innerHTML = 'Hard reset (reload options)';
            btn.disabled = false;
        }
        console.log("✅ Hard reset completed");
    }, 1000);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', init);
