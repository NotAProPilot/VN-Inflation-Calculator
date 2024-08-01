// Ensure the DOM is fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
    // Event listener for the calculate button
    document.getElementById('calculate').addEventListener('click', function() {
        const amount = parseFloat(document.getElementById('amount').value);
        const year1 = parseInt(document.getElementById('year1').value);
        const year2 = parseInt(document.getElementById('year2').value);

        // Validate input values
        if (isNaN(amount) || isNaN(year1) || isNaN(year2)) {
            alert('Please enter valid input values.');
            return;
        }

        // Fetch the inflation data from the JSON file
        fetch('inflation.json')
            .then(response => response.json())
            .then(data => {
                const validYears = data.map(entry => parseInt(entry.Year));
                // Check if the input years are within the valid range
                if (!validYears.includes(year1) || !validYears.includes(year2)) {
                    alert('Data is only available for the years between 1995 and 2024.');
                    return;
                }

                // Calculate the cumulative inflation rate
                const inflationRate = calculateCumulativeInflation(year1, year2, data);
                if (inflationRate !== null) {
                    const result = amount * (1 + inflationRate / 100);
                    // Display the results dynamically
                    document.getElementById('display-amount').textContent = amount + ' ₫';
                    document.getElementById('display-year1').textContent = year1;
                    document.getElementById('display-year2').textContent = year2;
                    document.getElementById('display-result').textContent = result.toLocaleString() + ' ₫';
                    document.getElementById('display-cpi').textContent = inflationRate.toFixed(1) + '%';
                    document.getElementById('result-container').style.display = 'block';
                } else {
                    alert('An error occurred while calculating the inflation rate.');
                }
            })
            .catch(error => {
                console.error('Error fetching inflation data:', error);
            });
    });
});

/**
 * Calculate the cumulative inflation rate between two years.
 * @param {number} startYear - The starting year for the calculation.
 * @param {number} endYear - The ending year for the calculation.
 * @param {Array} data - The inflation data.
 * @returns {number|null} The cumulative inflation rate or null if an error occurs.
 */
function calculateCumulativeInflation(startYear, endYear, data) {
    let startCPI = null;
    let endCPI = null;

    // Iterate through the data to find the CPI for the start and end years
    data.forEach(entry => {
        const year = parseInt(entry.Year);
        const annualRate = parseFloat(entry.Annual);

        if (year === startYear) {
            startCPI = annualRate;
        }
        if (year === endYear) {
            endCPI = annualRate;
        }
    });

    // Validate that we have the CPI values for both years
    if (startCPI === null || endCPI === null) {
        return null;
    }

    // Calculate the cumulative inflation rate
    const inflationRate = ((endCPI - startCPI) / startCPI) * 100;

    return inflationRate;
}
