export function getCurrentMonth() {
    const current = new Date();
    return current.getMonth() + 1;
}

export function getCurrentYear() {
    const current = new Date();
    return current.getFullYear();
}

export function getCurrentDay() {
    const current = new Date();
    return current.getDate();
}

export function fillArrayWithPassedYears(defaultYear) {
    const passedYears = [];
    let currentYear = getCurrentYear();

    let arrRange = currentYear - defaultYear;
    while (defaultYear <= currentYear && passedYears.length < arrRange + 1) {
        passedYears.push(defaultYear);
        defaultYear = defaultYear + 1;
    }
    return passedYears;
}

export function fillArrayWithMonthsNumbersAndNames() {
    const months = Array.from({ length: 12 }, (item, i) => {
        const monthName = new Date(0, i).toLocaleString('en-US', { month: 'long' });
        return { name: monthName, number: i + 1 };
    });
    return months;
}