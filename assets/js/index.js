document.addEventListener("DOMContentLoaded", function() {
    // Elements
    const elements = {
        carType: document.getElementById("car-types"),
        carValueRange: document.getElementById("car-value-range"),
        carValueText: document.getElementById("car-value-text"),
        leasePeriodRange: document.getElementById("lease-period-range"),
        leasePeriodText: document.getElementById("lease-period-text"),
        downPaymentRange: document.getElementById("down-payment-range"),
        downPaymentText: document.getElementById("down-payment-text"),
        totalLeasingCost: document.getElementById("total-leasing-cost"),
        downPaymentResult: document.getElementById("down-payment-result"),
        interestRate: document.getElementById("interest-rate"),
        monthlyInstallment: document.getElementById("monthly-installment")
    };

    function updateInputValue(rangeInput, textInput, validationFn, callback) {
        textInput.value = rangeInput.value;
        updateInputStyle(textInput, validationFn(textInput.value));
        if (callback) callback();
    }

    function validateInput(value, min, max) {
        value = value.replace(/\D/g, '');
        const numValue = parseFloat(value);
        return numValue >= min && numValue <= max;
    }

    function updateInputStyle(input, isValid) {
        if (isValid) {
            input.style.borderColor = "";
            input.style.boxShadow = "";
        } else {
            input.style.borderColor = "#E9260C";
            input.style.boxShadow = "0 0 5px #AE1C09";
        }
    }

    function handleCarValueRange() {
        updateInputValue(elements.carValueRange, elements.carValueText, value => validateInput(value, 10000, 200000), calculateDownPayment);
    }

    function handleCarValueText() {
        updateInputValue(elements.carValueText, elements.carValueRange, value => validateInput(value, 10000, 200000), calculateDownPayment);
    }

    function handleLeasePeriodRange() {
        updateInputValue(elements.leasePeriodRange, elements.leasePeriodText, value => validateInput(value, 12, 60), calculateMonthlyInstallment);
    }

    function handleLeasePeriodText() {
        updateInputValue(elements.leasePeriodText, elements.leasePeriodRange, value => validateInput(value, 12, 60), calculateMonthlyInstallment);
    }

    function handleDownPaymentRange() {
        updateInputValue(elements.downPaymentRange, elements.downPaymentText, value => validateInput(value, 10, 50), calculateDownPayment);
    }

    function handleDownPaymentText() {
        updateInputValue(elements.downPaymentText, elements.downPaymentRange, value => validateInput(value, 10, 50), calculateDownPayment);
    }

    function calculateDownPayment() {
        const carValue = parseFloat(elements.carValueText.value);
        const downPaymentPercentage = parseFloat(elements.downPaymentText.value);
        const downPaymentAmount = carValue * (downPaymentPercentage / 100);
        elements.downPaymentResult.textContent = "€" + downPaymentAmount.toFixed(2);
        calculateTotalLeasing();
    }

    function setInterestRate() {
        const rate = elements.carType.value.toLowerCase() === "brand-new" ? 2.99 : 3.7;
        elements.interestRate.value = rate;
        elements.interestRate.textContent = rate + "%";
        calculateMonthlyInstallment();
        calculateTotalLeasing();
    }

    function calculateMonthlyInstallment() {
        const carValue = parseFloat(elements.carValueText.value);
        const downPayment = parseFloat(elements.downPaymentResult.textContent.replace("€", "").trim());
        const annualInterestRate = parseFloat(elements.interestRate.textContent.replace("%", "").trim()) / 100.0;
        const numberOfMonths = parseFloat(elements.leasePeriodText.value);

        const netCost = carValue - downPayment;
        const monthlyInterestRate = annualInterestRate / 12.0;
        const monthlyInstallment = netCost * monthlyInterestRate / (1 - Math.pow((1 + monthlyInterestRate), -numberOfMonths));

        elements.monthlyInstallment.textContent = "€" + monthlyInstallment.toFixed(2);
        calculateTotalLeasing();
    }

    function calculateTotalLeasing() {
        const monthlyInstallmentValue = parseFloat(elements.monthlyInstallment.textContent.replace("€", "").trim());
        const leasePeriodValue = parseFloat(elements.leasePeriodText.value);
        const downPaymentValue = parseFloat(elements.downPaymentResult.textContent.replace("€", "").trim());

        const totalLeasingCost = (monthlyInstallmentValue * leasePeriodValue) + downPaymentValue;
        elements.totalLeasingCost.textContent = "€" + totalLeasingCost.toFixed(2);
    }

    elements.carValueRange.addEventListener("input", handleCarValueRange);
    elements.carValueText.addEventListener("input", handleCarValueText);
    elements.leasePeriodRange.addEventListener("input", handleLeasePeriodRange);
    elements.leasePeriodText.addEventListener("input", handleLeasePeriodText);
    elements.downPaymentRange.addEventListener("input", handleDownPaymentRange);
    elements.downPaymentText.addEventListener("input", handleDownPaymentText);
    elements.carType.addEventListener("change", setInterestRate);

    setInterestRate();
    calculateDownPayment();
    calculateMonthlyInstallment();
    calculateTotalLeasing();
});
