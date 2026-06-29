// Advisory Module - All logic for generating reports

// Generate Advisory Report
function generateAdvisory() {
    // Get form values
    const userName = document.getElementById('userName').value || 'Farmer';
    const state = document.getElementById('state').value;
    const district = document.getElementById('district').value;
    const village = document.getElementById('village').value;
    const climate = document.getElementById('climate').value;
    const weather = document.getElementById('weather').value;
    const cropName = document.getElementById('cropName').value;
    const plantingSeason = document.getElementById('plantingSeason').value || 'Not specified';
    const soilType = document.getElementById('soilType').value;

    // Validate required fields
    if (!state || !district || !village || !cropName) {
        alert('⚠️ Please fill in all required fields (State, District, Village, Crop Name)');
        return;
    }

    // Show loading
    document.getElementById('resultsContainer').innerHTML = `
        <div class="loading-card">
            <i class="fas fa-spinner fa-spin" style="font-size: 3rem; color: #2d5a3d;"></i>
            <h3 style="margin-top: 1rem;">Generating Advisory Report...</h3>
            <p style="color: #666;">Please wait while we analyze your data</p>
        </div>
    `;

    // Hide any previous thank you
    document.getElementById('thankYouContainer').style.display = 'none';

    // Simulate processing delay
    setTimeout(() => {
        // Generate the report
        const report = generateCompleteReport(
            userName, state, district, village, 
            climate, weather, cropName, plantingSeason, soilType
        );
        
        // Display results
        displayCompleteReport(report);
        
        // Show thank you
        document.getElementById('thankYouContainer').style.display = 'block';
        document.getElementById('thankYouContainer').scrollIntoView({ behavior: 'smooth' });
        
        // Save to history
        saveToHistory(report);
    }, 1500);
}

// Generate Complete Report
function generateCompleteReport(userName, state, district, village, climate, weather, crop, plantingSeason, soil) {
    // Crop Database
    const cropDatabase = {
        'Wheat': {
            suitableSoils: ['Loamy', 'Clay', 'Alluvial'],
            suitableClimates: ['Winter', 'Spring'],
            suitableWeather: ['Sunny', 'Cloudy'],
            growingDays: 120,
            waterRequirement: 'Medium',
            temperatureRange: '10-25°C',
            yield: 25
        },
        'Rice': {
            suitableSoils: ['Clay', 'Alluvial', 'Laterite'],
            suitableClimates: ['Rainy', 'Summer'],
            suitableWeather: ['Rainy', 'Cloudy'],
            growingDays: 140,
            waterRequirement: 'High',
            temperatureRange: '20-35°C',
            yield: 30
        },
        'Cotton': {
            suitableSoils: ['Black', 'Red', 'Sandy'],
            suitableClimates: ['Summer', 'Rainy'],
            suitableWeather: ['Sunny', 'Windy'],
            growingDays: 180,
            waterRequirement: 'Medium',
            temperatureRange: '25-35°C',
            yield: 15
        },
        'Sugarcane': {
            suitableSoils: ['Loamy', 'Alluvial', 'Black'],
            suitableClimates: ['Summer', 'Rainy'],
            suitableWeather: ['Sunny', 'Cloudy'],
            growingDays: 365,
            waterRequirement: 'High',
            temperatureRange: '20-35°C',
            yield: 45
        },
        'Maize': {
            suitableSoils: ['Sandy', 'Loamy', 'Red'],
            suitableClimates: ['Summer', 'Spring'],
            suitableWeather: ['Sunny', 'Windy'],
            growingDays: 90,
            waterRequirement: 'Medium',
            temperatureRange: '18-30°C',
            yield: 35
        },
        'Potato': {
            suitableSoils: ['Sandy', 'Loamy', 'Alluvial'],
            suitableClimates: ['Winter', 'Spring'],
            suitableWeather: ['Cloudy', 'Sunny'],
            growingDays: 80,
            waterRequirement: 'Medium',
            temperatureRange: '15-20°C',
            yield: 20
        },
        'Tomato': {
            suitableSoils: ['Loamy', 'Red', 'Alluvial'],
            suitableClimates: ['Summer', 'Spring'],
            suitableWeather: ['Sunny', 'Cloudy'],
            growingDays: 75,
            waterRequirement: 'Medium',
            temperatureRange: '20-30°C',
            yield: 18
        },
        'Onion': {
            suitableSoils: ['Sandy', 'Loamy', 'Alluvial'],
            suitableClimates: ['Winter', 'Spring'],
            suitableWeather: ['Sunny', 'Windy'],
            growingDays: 100,
            waterRequirement: 'Low',
            temperatureRange: '15-25°C',
            yield: 22
        }
    };

    // Get crop info
    const cropInfo = cropDatabase[crop] || {
        suitableSoils: ['Loamy', 'Alluvial'],
        suitableClimates: ['Summer', 'Winter'],
        suitableWeather: ['Sunny', 'Cloudy'],
        growingDays: 100,
        waterRequirement: 'Medium',
        temperatureRange: '20-30°C',
        yield: 20
    };

    // Analyze suitability
    const isSoilSuitable = cropInfo.suitableSoils.includes(soil);
    const isClimateSuitable = cropInfo.suitableClimates.includes(climate);
    const isWeatherSuitable = cropInfo.suitableWeather.includes(weather);
    const isSuitable = isSoilSuitable && isClimateSuitable && isWeatherSuitable;

    let suitabilityReason = '';
    let suggestedCrop = null;

    if (!isSuitable) {
        const issues = [];
        if (!isSoilSuitable) issues.push('Soil type');
        if (!isClimateSuitable) issues.push('Climate');
        if (!isWeatherSuitable) issues.push('Weather');
        suitabilityReason = `⚠️ Not suitable: ${issues.join(', ')} mismatch`;
        
        // Find alternative
        for (let [cropName, info] of Object.entries(cropDatabase)) {
            if (cropName === crop) continue;
            if (info.suitableSoils.includes(soil) && 
                info.suitableClimates.includes(climate) && 
                info.suitableWeather.includes(weather)) {
                suggestedCrop = cropName;
                break;
            }
        }
        if (!suggestedCrop) suggestedCrop = 'Wheat';
    } else {
        suitabilityReason = '✅ Perfect match for current conditions!';
    }

    // Predict diseases
    const diseases = predictDiseases(crop, weather, climate, soil);

    // Get recommendations
    const recommendations = getRecommendations(crop, diseases);

    // Get market price
    const price = getMarketPrice(state, crop);

    // Calculate yield
    let yieldEstimate = cropInfo.yield || 20;
    if (soil === 'Loamy') yieldEstimate *= 1.3;
    else if (soil === 'Clay') yieldEstimate *= 1.1;
    else if (soil === 'Sandy') yieldEstimate *= 0.8;
    else if (soil === 'Black') yieldEstimate *= 1.2;
    
    // Climate adjustment
    if (climate === 'Spring') yieldEstimate *= 1.2;
    else if (climate === 'Winter') yieldEstimate *= 1.1;
    else if (climate === 'Rainy') yieldEstimate *= 0.9;

    yieldEstimate = Math.round(yieldEstimate * 10) / 10;

    return {
        user: userName,
        cropName: crop,
        location: { state, district, village },
        climate,
        weather,
        soilType: soil,
        plantingSeason,
        cropInfo: {
            growingDays: cropInfo.growingDays,
            waterRequirement: cropInfo.waterRequirement,
            temperatureRange: cropInfo.temperatureRange
        },
        suitability: {
            isSuitable,
            reason: suitabilityReason,
            suggestedCrop,
            details: {
                soil: isSoilSuitable,
                climate: isClimateSuitable,
                weather: isWeatherSuitable
            }
        },
        diseases,
        recommendations,
        marketPrice: price,
        yieldEstimate,
        generatedAt: new Date().toLocaleString()
    };
}

// Predict Diseases
function predictDiseases(crop, weather, climate, soil) {
    const diseases = [];
    const c = crop.toLowerCase();

    const diseaseMap = {
        'wheat': [
            { condition: (weather === 'Rainy' || climate === 'Rainy'), 
              name: 'Wheat Rust', 
              symptoms: 'Orange/brown pustules on leaves, stunted growth',
              severity: 'High',
              treatment: 'Tilt (Propiconazole) 2ml/liter water' },
            { condition: (weather === 'Windy' && climate === 'Spring'),
              name: 'Powdery Mildew',
              symptoms: 'White powdery spots on leaves, yellowing',
              severity: 'Medium',
              treatment: 'Sulfur dust 3kg/acre' },
            { condition: (soil === 'Sandy'),
              name: 'Wheat Root Rot',
              symptoms: 'Wilting, brown roots, poor tillering',
              severity: 'Medium',
              treatment: 'Soil drench with Carbendazim' }
        ],
        'rice': [
            { condition: (weather === 'Rainy' || climate === 'Rainy'),
              name: 'Rice Blast',
              symptoms: 'Diamond-shaped lesions on leaves, collar rot',
              severity: 'High',
              treatment: 'Tricyclazole or Isoprothiolane spray' },
            { condition: (climate === 'Rainy' && weather === 'Cloudy'),
              name: 'Sheath Blight',
              symptoms: 'Irregular greenish-grey spots on leaf sheath',
              severity: 'High',
              treatment: 'Validamycin or Carbendazim' }
        ],
        'cotton': [
            { condition: (weather === 'Rainy'),
              name: 'Boll Rot',
              symptoms: 'Cotton bolls rot, lint discoloured',
              severity: 'High',
              treatment: 'Copper oxychloride spray' },
            { condition: (climate === 'Summer' && weather === 'Windy'),
              name: 'Aphid Attack',
              symptoms: 'Curling leaves, sticky honeydew',
              severity: 'Medium',
              treatment: 'Imidacloprid or Dimethoate' }
        ]
    };

    const cropDiseases = diseaseMap[c] || [];
    cropDiseases.forEach(d => {
        if (d.condition) {
            diseases.push({
                name: d.name,
                symptoms: d.symptoms,
                severity: d.severity,
                treatment: d.treatment
            });
        }
    });

    // If no diseases found, add a general one
    if (diseases.length === 0) {
        diseases.push({
            name: 'General Fungal Disease',
            symptoms: 'Leaf spots, reduced vigour, stunted growth',
            severity: 'Low',
            treatment: 'Apply broad-spectrum fungicide'
        });
    }

    return diseases.slice(0, 3);
}

// Get Recommendations
function getRecommendations(crop, diseases) {
    const fertilizers = {
        'Wheat': ['DAP (18:46:0) - 50 kg/acre', 'Urea (46% N) - 40 kg/acre', 'Potash - 20 kg/acre'],
        'Rice': ['Urea - 60 kg/acre in 3 splits', 'SSP - 40 kg/acre', 'MOP - 30 kg/acre'],
        'Cotton': ['DAP - 40 kg/acre', 'Urea - 50 kg/acre in 2 splits', 'Potash - 25 kg/acre'],
        'Sugarcane': ['Urea - 80 kg/acre', 'DAP - 50 kg/acre', 'Potash - 40 kg/acre'],
        'Maize': ['DAP - 40 kg/acre', 'Urea - 50 kg/acre', 'Potash - 20 kg/acre'],
        'Potato': ['Urea - 50 kg/acre', 'DAP - 40 kg/acre', 'MOP - 30 kg/acre'],
        'Tomato': ['Urea - 40 kg/acre', 'SSP - 35 kg/acre', 'Potash - 25 kg/acre'],
        'Onion': ['Urea - 35 kg/acre', 'DAP - 40 kg/acre', 'MOP - 25 kg/acre']
    };

    const preventiveMeasures = [
        '🌱 Use disease-free certified seeds',
        '💧 Maintain proper drainage in fields',
        '🔄 Practice crop rotation every season',
        '🌡️ Monitor weather conditions regularly',
        '🧪 Conduct soil testing before planting',
        '🌿 Apply organic mulch to maintain soil moisture',
        '⚠️ Early detection and treatment of diseases',
        '💚 Maintain optimal plant spacing',
        '🌾 Remove and destroy infected plant parts',
        '🧑‍🌾 Use integrated pest management (IPM)'
    ];

    return {
        fertilizers: fertilizers[crop] || ['Balanced NPK (10:10:10) - 40 kg/acre', 'Organic manure - 2 tonnes/acre'],
        pesticides: diseases.map(d => d.treatment || 'Neem oil based spray - 5ml/liter water'),
        preventiveMeasures
    };
}

// Get Market Price
function getMarketPrice(state, crop) {
    const basePrices = {
        'Wheat': 1200,
        'Rice': 1500,
        'Cotton': 5000,
        'Sugarcane': 3000,
        'Maize': 1800,
        'Potato': 800,
        'Tomato': 600,
        'Onion': 700
    };

    const base = basePrices[crop] || 1000;
    const variation = Math.floor(Math.random() * 200) - 100;
    const min = base - 50 + variation;
    const max = base + 100 + variation;
    const avg = Math.round((min + max) / 2);
    const demand = ['Low', 'Moderate', 'High', 'Very High'][Math.floor(Math.random() * 4)];

    return { min: Math.round(min), max: Math.round(max), average: avg, demand };
}

// Display Complete Report
function displayCompleteReport(report) {
    const container = document.getElementById('resultsContainer');
    
    let html = `
        <div class="results-card">
            <h3><i class="fas fa-file-alt" style="color: #2d5a3d;"></i> Complete Advisory Report</h3>
            <p style="color: #666; margin-bottom: 1rem;">Generated on: ${report.generatedAt}</p>
            
            <!-- Module 1: Location Details -->
            <div style="background: #f8faf8; padding: 1rem; border-radius: 10px; margin-bottom: 1rem;">
                <h4 style="color: #1a3b2e;"><i class="fas fa-user"></i> User & Location Details</h4>
                <div class="results-grid">
                    <div class="results-item"><strong>User:</strong> ${report.user}</div>
                    <div class="results-item"><strong>State:</strong> ${report.location.state}</div>
                    <div class="results-item"><strong>District:</strong> ${report.location.district}</div>
                    <div class="results-item"><strong>Village:</strong> ${report.location.village}</div>
                </div>
            </div>

            <!-- Module 2: Crop Details -->
            <div style="background: #f8faf8; padding: 1rem; border-radius: 10px; margin-bottom: 1rem;">
                <h4 style="color: #1a3b2e;"><i class="fas fa-seedling"></i> Crop Details</h4>
                <div class="results-grid">
                    <div class="results-item"><strong>Crop:</strong> ${report.cropName}</div>
                    <div class="results-item"><strong>Planting Season:</strong> ${report.plantingSeason}</div>
                    <div class="results-item"><strong>Growing Days:</strong> ${report.cropInfo.growingDays} days</div>
                    <div class="results-item"><strong>Water Requirement:</strong> ${report.cropInfo.waterRequirement}</div>
                    <div class="results-item"><strong>Temperature Range:</strong> ${report.cropInfo.temperatureRange}</div>
                </div>
            </div>

            <!-- Module 3: Soil Type -->
            <div style="background: #f8faf8; padding: 1rem; border-radius: 10px; margin-bottom: 1rem;">
                <h4 style="color: #1a3b2e;"><i class="fas fa-earth-asia"></i> Soil & Environment</h4>
                <div class="results-grid">
                    <div class="results-item"><strong>Soil Type:</strong> ${report.soilType}</div>
                    <div class="results-item"><strong>Climate:</strong> ${report.climate}</div>
                    <div class="results-item"><strong>Weather:</strong> ${report.weather}</div>
                    <div class="results-item"><strong>Estimated Yield:</strong> ${report.yieldEstimate} quintals/acre</div>
                </div>
            </div>

            <!-- Module 4: Crop Suitability -->
            <div style="background: ${report.suitability.isSuitable ? '#d4edda' : '#f8d7da'}; padding: 1rem; border-radius: 10px; margin-bottom: 1rem; border-left: 4px solid ${report.suitability.isSuitable ? '#28a745' : '#dc3545'};">
                <h4 style="color: #1a3b2e;"><i class="fas fa-check-circle"></i> Crop Suitability Analysis</h4>
                <p><strong>Status:</strong> ${report.suitability.reason}</p>
                ${report.suitability.suggestedCrop ? `<p><strong>Suggested Crop:</strong> <span style="background: #28a745; color: white; padding: 0.2rem 0.8rem; border-radius: 20px;">${report.suitability.suggestedCrop}</span></p>` : ''}
                <div style="margin-top: 0.5rem;">
                    <span style="background: ${report.suitability.details.soil ? '#28a745' : '#dc3545'}; color: white; padding: 0.2rem 0.8rem; border-radius: 20px; font-size: 0.8rem;">Soil: ${report.suitability.details.soil ? '✓ Suitable' : '✗ Not Suitable'}</span>
                    <span style="background: ${report.suitability.details.climate ? '#28a745' : '#dc3545'}; color: white; padding: 0.2rem 0.8rem; border-radius: 20px; font-size: 0.8rem; margin-left: 0.5rem;">Climate: ${report.suitability.details.climate ? '✓ Suitable' : '✗ Not Suitable'}</span>
                    <span style="background: ${report.suitability.details.weather ? '#28a745' : '#dc3545'}; color: white; padding: 0.2rem 0.8rem; border-radius: 20px; font-size: 0.8rem; margin-left: 0.5rem;">Weather: ${report.suitability.details.weather ? '✓ Suitable' : '✗ Not Suitable'}</span>
                </div>
            </div>

            <!-- Module 5: Disease Prediction -->
            <div style="background: #f8faf8; padding: 1rem; border-radius: 10px; margin-bottom: 1rem;">
                <h4 style="color: #1a3b2e;"><i class="fas fa-bug"></i> Disease Prediction</h4>
                ${report.diseases.map(d => `
                    <div class="results-item" style="margin-bottom: 0.5rem; background: ${d.severity === 'High' ? '#f8d7da' : d.severity === 'Medium' ? '#fff3cd' : '#d4edda'}; border-left: 4px solid ${d.severity === 'High' ? '#dc3545' : d.severity === 'Medium' ? '#ffc107' : '#28a745'};">
                        <strong>${d.name}</strong>
                        <p><strong>Symptoms:</strong> ${d.symptoms}</p>
                        <p><strong>Severity:</strong> <span style="background: ${d.severity === 'High' ? '#dc3545' : d.severity === 'Medium' ? '#ffc107' : '#28a745'}; color: white; padding: 0.2rem 0.8rem; border-radius: 20px; font-size: 0.8rem;">${d.severity}</span></p>
                        <p><strong>Treatment:</strong> ${d.treatment || 'Consult local agricultural officer'}</p>
                    </div>
                `).join('')}
            </div>

            <!-- Module 6: Fertilizer & Pesticide -->
            <div style="background: #f8faf8; padding: 1rem; border-radius: 10px; margin-bottom: 1rem;">
                <h4 style="color: #1a3b2e;"><i class="fas fa-flask"></i> Fertilizer & Pesticide Recommendations</h4>
                <div class="results-item">
                    <strong>Fertilizers:</strong>
                    <ul style="margin-top: 0.5rem;">${report.recommendations.fertilizers.map(f => `<li>${f}</li>`).join('')}</ul>
                </div>
                <div class="results-item" style="margin-top: 0.5rem;">
                    <strong>Pesticides:</strong>
                    <ul style="margin-top: 0.5rem;">${report.recommendations.pesticides.map(p => `<li>${p}</li>`).join('')}</ul>
                </div>
                <div class="results-item" style="margin-top: 0.5rem;">
                    <strong>Preventive Measures:</strong>
                    <ul style="margin-top: 0.5rem;">${report.recommendations.preventiveMeasures.map(m => `<li>${m}</li>`).join('')}</ul>
                </div>
            </div>

            <!-- Module 7: Market Price -->
            <div style="background: #f8faf8; padding: 1rem; border-radius: 10px; margin-bottom: 1rem;">
                <h4 style="color: #1a3b2e;"><i class="fas fa-chart-line"></i> Current Market Price</h4>
                <div class="results-grid">
                    <div class="results-item"><strong>Minimum:</strong> ₹${report.marketPrice.min}</div>
                    <div class="results-item"><strong>Maximum:</strong> ₹${report.marketPrice.max}</div>
                    <div class="results-item"><strong>Average:</strong> ₹${report.marketPrice.average}</div>
                    <div class="results-item"><strong>Demand:</strong> ${report.marketPrice.demand}</div>
                </div>
                <p style="margin-top: 0.5rem; font-size: 0.9rem; color: #666;">Price per quintal | State: ${report.location.state}</p>
            </div>
        </div>
    `;

    container.innerHTML = html;
}

// Save to History
function saveToHistory(report) {
    let history = JSON.parse(localStorage.getItem('advisoryHistory') || '[]');
    history.unshift({
        id: Date.now(),
        ...report,
        savedAt: new Date().toISOString()
    });
    // Keep only last 50 reports
    if (history.length > 50) history = history.slice(0, 50);
    localStorage.setItem('advisoryHistory', JSON.stringify(history));
}

// Reset Form
function resetForm() {
    document.getElementById('resultsContainer').innerHTML = '';
    document.getElementById('thankYouContainer').style.display = 'none';
    document.getElementById('cropName').value = 'Wheat';
    document.getElementById('plantingSeason').value = '';
    // Don't reset location fields to save time
    window.scrollTo({ top: 0, behavior: 'smooth' });
}