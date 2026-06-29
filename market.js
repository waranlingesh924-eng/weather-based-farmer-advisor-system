// Market Module - Display market prices and trends

// Load market page
document.addEventListener('DOMContentLoaded', function() {
    loadPopularCrops();
    loadPriceTrends();
});

// Fetch Market Price
function fetchMarketPrice() {
    const crop = document.getElementById('marketCrop').value;
    const state = document.getElementById('marketState').value;

    if (!crop || !state) {
        alert('⚠️ Please select both crop and state');
        return;
    }

    const container = document.getElementById('marketResults');
    container.innerHTML = `
        <div class="loading-card" style="text-align: center; padding: 2rem;">
            <i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: #2d5a3d;"></i>
            <p>Fetching market prices...</p>
        </div>
    `;

    setTimeout(() => {
        const price = getMarketPriceData(crop, state);
        displayMarketPrice(price);
    }, 1000);
}

// Get Market Price Data
function getMarketPriceData(crop, state) {
    const basePrices = {
        'Wheat': 1200,
        'Rice': 1500,
        'Cotton': 5000,
        'Sugarcane': 3000,
        'Maize': 1800,
        'Potato': 800,
        'Tomato': 600,
        'Onion': 700,
        'Chilli': 2000,
        'Cabbage': 400,
        'Bajra': 1500,
        'Jowar': 1600,
        'Groundnut': 4000,
        'Soybean': 3500
    };

    const base = basePrices[crop] || 1000;
    const variation = Math.floor(Math.random() * 300) - 150;
    const min = base - 80 + variation;
    const max = base + 150 + variation;
    const avg = Math.round((min + max) / 2);
    const demand = ['Low', 'Moderate', 'High', 'Very High'][Math.floor(Math.random() * 4)];
    
    // Generate trend data
    const trend = [];
    for (let i = 30; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        trend.push({
            date: date.toISOString().split('T')[0],
            price: Math.round(base + (Math.random() - 0.5) * 200)
        });
    }

    return {
        crop,
        state,
        min: Math.round(min),
        max: Math.round(max),
        average: avg,
        demand,
        unit: 'per quintal',
        lastUpdated: new Date().toLocaleDateString(),
        trend
    };
}

// Display Market Price
function displayMarketPrice(price) {
    const container = document.getElementById('marketResults');
    
    container.innerHTML = `
        <div class="market-result-card">
            <h3><i class="fas fa-chart-bar"></i> Market Price for ${price.crop}</h3>
            <p style="color: #666;">${price.state} | Last updated: ${price.lastUpdated}</p>
            
            <div class="price-grid">
                <div class="price-item">
                    <span class="price-label">Minimum</span>
                    <span class="price-value" style="color: #dc3545;">₹${price.min}</span>
                </div>
                <div class="price-item">
                    <span class="price-label">Average</span>
                    <span class="price-value" style="color: #28a745;">₹${price.average}</span>
                </div>
                <div class="price-item">
                    <span class="price-label">Maximum</span>
                    <span class="price-value" style="color: #007bff;">₹${price.max}</span>
                </div>
                <div class="price-item">
                    <span class="price-label">Demand</span>
                    <span class="price-value" style="color: ${price.demand === 'High' || price.demand === 'Very High' ? '#28a745' : '#ffc107'};">${price.demand}</span>
                </div>
            </div>
            
            <div style="margin-top: 1rem; padding: 0.5rem; background: #f8faf8; border-radius: 8px;">
                <p style="font-size: 0.9rem; color: #666;">
                    <i class="fas fa-info-circle"></i> Price per ${price.unit} | Market rates may vary
                </p>
            </div>
        </div>
    `;
}

// Load Popular Crops
function loadPopularCrops() {
    const crops = [
        { name: '