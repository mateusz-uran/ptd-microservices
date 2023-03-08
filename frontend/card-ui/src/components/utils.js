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