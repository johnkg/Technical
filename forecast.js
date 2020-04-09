function CheckFormValidity() {
    let form = document.querySelector('form');
    
    if (!form.checkValidity()) {
        // Create a temporary button, click and remove it
        var tempSubmit = document.createElement('button');
        form.appendChild(tempSubmit);
        tempSubmit.click();
        form.removeChild(tempSubmit);
    } else {
        CreateForecast();
    }
}

function CreateForecast() {
    let forecastData = GenerateForecastData();
    InitializeTable(forecastData);
    let table = document.querySelector('table');
    GenerateTable(table, forecastData);
    GenerateTableHead(table);
}

function GenerateForecastData() {
    let noOfStudies = document.getElementById('noOfStudies').value;
    let growthRate = document.getElementById('growthRate').value;
    let monthsToForecast = document.getElementById('monthsToForecast').value;

    let gbRamCostPerMonthPerStudy = GetRamCostPerMonthPerStudy();
    let storageCostPerMonthPerStudy = GetStorageCostPerMonthPerStudy();

    let dateObj = new Date();
    let forecast = [];
    let totalCost = 0;

    for (var monthCounter = 0; monthCounter < monthsToForecast; monthCounter++) {
        monthName = dateObj.toLocaleString(undefined, { month: 'long', year: 'numeric' });
        noOfStudies *= (1 + growthRate / 100);
        totalCost = (gbRamCostPerMonthPerStudy + storageCostPerMonthPerStudy) * noOfStudies;
        forecast.push({
            monthYear: monthName,
            numberOfStudies: noOfStudies,
            costForecasted: totalCost
        });
        dateObj = new Date(dateObj.setMonth(dateObj.getMonth() + 1));
    }
    return forecast;
}

function GetRamCostPerMonthPerStudy() {
    let gbToMbConversion = 1000; // assuming 1000 MB = 1GB
    let gbRamCostPerHour = 0.00553;
    let hoursInDay = 24;
    let daysInMonth = 30; // assuming fixed 30 days per month
    let mbPerStudy = 0.5 * 1 / gbToMbConversion; // in gb
    let gbRamCostPerMonth = gbRamCostPerHour * hoursInDay * daysInMonth;
    let gbRamCostPerMonthPerStudy = gbRamCostPerMonth * mbPerStudy;

    return gbRamCostPerMonthPerStudy;
}

function GetStorageCostPerMonthPerStudy() {
    let gbToMbConversion = 1000; // assuming 1000 MB = 1GB
    let gbStorageCostPerMonth = 0.1; // in usd
    let storagePerMonthPerStudy = 10 * 1 / gbToMbConversion;  // in gb
    let storageCostPerMonthPerStudy = storagePerMonthPerStudy * gbStorageCostPerMonth;

    return storageCostPerMonthPerStudy;
}

function InitializeTable(forecastData) {
    let doc = document.getElementById('divTable');
    doc.innerHTML = ''; // always delete the table to avoid duplicate tables when forecast button is clicked
    if (forecastData.length <= 0) return;
    let newTable = document.createElement('table');
    newTable.setAttribute('class', 'table table-hover table-md w-50')
    doc.appendChild(newTable);
}

function GenerateTableHead(table) {
    let thead = table.createTHead();
    thead.setAttribute('class', 'thead-dark');
    let row = thead.insertRow();

    let headerFields = ['Month Year', 'Number of Studies', 'Cost Forecasted'];

    for (let key of headerFields) {
        let th = document.createElement('th');
        let text = document.createTextNode(key);
        th.appendChild(text);
        row.appendChild(th);
    }
}

function GenerateTable(table, data) {
    for (let element of data) {
        let row = table.insertRow();
        for (key in element) {
            let cell = row.insertCell();
            let text = document.createTextNode(element[key]);
            cell.appendChild(text);
        }
    }
}