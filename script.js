function calculateCost() {
    // Get the values from the form
    const bedrooms = parseInt(document.getElementById('bedrooms').value);
    const flights = parseInt(document.getElementById('flights').value);
    const truckNeeded = document.getElementById('truck').checked;

    // Determine the number of movers based on the number of bedrooms
    let movers;
    if (bedrooms === 1) {
        movers = 1; // 1 mover for 1 bedroom
    } else if (bedrooms === 2 || bedrooms === 3) {
        movers = 3; // 3 movers for 2 or 3 bedrooms
    } else {
        movers = 4; // 4 movers for 4 or more bedrooms
    }

    // Calculate time based on bedrooms
    let time = 0;
    switch (bedrooms) {
        case 1: time += 5; break;
        case 2: time += 7; break;
        case 3: time += 9; break;
        case 4: time += 11; break;
        case 5: time += 12; break;
    }

    // Calculate time based on flights of stairs
    time += flights * 0.25; // 15 minutes per flight

    // Calculate time based on specialty items
    const specialtyItems = document.querySelectorAll('input[name="specialtyItems"]:checked');
    specialtyItems.forEach(item => {
        time += parseInt(item.value) / 60; // Convert minutes to hours
    });

    // Calculate hourly rate based on movers and whether a truck is needed
    let hourlyRate = 0;
    if (truckNeeded) {
        switch (movers) {
            case 1: hourlyRate = 175; break;
            case 3: hourlyRate = 225; break;
            case 4: hourlyRate = 275; break;
        }
    } else {
        switch (movers) {
            case 1: hourlyRate = 100; break;
            case 3: hourlyRate = 150; break;
            case 4: hourlyRate = 200; break;
        }
    }
    const totalCost = time * hourlyRate;

    // Calculate protection price only if the checkbox is checked
    let protectionPrice = 0;
    const protectionCheckbox = document.getElementById('fullProtection');
    if (protectionCheckbox.checked) {
        switch (bedrooms) {
            case 1: protectionPrice = 110; break;
            case 2: protectionPrice = 155; break;
            case 3: protectionPrice = 225; break;
            case 4: protectionPrice = 290; break;
            case 5: protectionPrice = 335; break;
        }
    }

    // Calculate additional services cost
    const additionalServices = document.querySelectorAll('input[name="additionalServices"]:checked');
    let additionalServicesCost = 0;
    additionalServices.forEach(service => {
        additionalServicesCost += parseInt(service.value);
    });

    // Add protection price to additional services cost if protection plan is selected
    if (protectionCheckbox.checked) {
        additionalServicesCost += protectionPrice;
    }

    // Update the UI with results
    document.getElementById('totalTime').innerText = `${time.toFixed(2)} hours`;
    document.getElementById('totalCost').innerText = `$${totalCost.toFixed(2)}`;
    document.getElementById('hourlyCost').innerText = `$${hourlyRate.toFixed(2)}`;
    document.getElementById('additionalServicesCost').innerText = `$${additionalServicesCost.toFixed(2)}`;
    document.getElementById('protectionPrice').innerText = `$${protectionPrice.toFixed(2)}`;
}
