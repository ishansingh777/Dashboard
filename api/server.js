const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());

// Load dummy data
const loadData = () => {
    const dataPath = path.join(__dirname, '../PulseSales/data');
    return {
        sales: JSON.parse(fs.readFileSync(path.join(dataPath, 'sales.json'))),
        orders: JSON.parse(fs.readFileSync(path.join(dataPath, 'orders.json'))),
        customers: JSON.parse(fs.readFileSync(path.join(dataPath, 'customers.json'))),
        products: JSON.parse(fs.readFileSync(path.join(dataPath, 'products.json'))),
        destinations: JSON.parse(fs.readFileSync(path.join(dataPath, 'destinations.json')))
    };
};

app.get('/api/dashboard', (req, res) => {
    const date = req.query.date;
    const data = loadData();
    
    // Create a copy of the metrics to modify
    let responseData = {
        sales: { ...data.sales, metrics: { ...data.sales.metrics } },
        orders: data.orders.slice(0, 15),
        customers: data.customers.slice(0, 15),
        products: data.products.slice(0, 10),
        destinations: data.destinations.slice(0, 10)
    };

    if (date) {
        // Simple logic to mock dynamic data based on date selection
        // Let's generate a pseudo-random multiplier based on the date string
        // so that the data changes whenever the date changes, but is consistent for the same date.
        let seed = 0;
        for (let i = 0; i < date.length; i++) {
            seed += date.charCodeAt(i);
        }
        
        // Multiplier between 0.8 and 1.2
        const multiplier = 0.8 + ((seed % 40) / 100);

        // Modify KPIs
        responseData.sales.metrics.total_revenue = parseFloat((responseData.sales.metrics.total_revenue * multiplier).toFixed(2));
        responseData.sales.metrics.gross_volume = parseFloat((responseData.sales.metrics.gross_volume * multiplier).toFixed(2));
        responseData.sales.metrics.today_sales = parseFloat((responseData.sales.metrics.today_sales * multiplier).toFixed(2));
        responseData.sales.metrics.total_orders = Math.floor(responseData.sales.metrics.total_orders * multiplier);
        responseData.sales.metrics.customers = Math.floor(responseData.sales.metrics.customers * multiplier);
        
        // Update the date inside the response so frontend can show it
        responseData.selectedDate = date;
    } else {
        responseData.selectedDate = "All Time";
    }

    res.json(responseData);
});

app.listen(port, () => {
    console.log(`API server running at http://localhost:${port}`);
});
