const time = new Date();

const generateDate = () => {
    const y = time.getFullYear();
    const m = time.getMonth() + 1;
    const d = time.getDate();

    const dateToSave = `${d}.${m}.${y}`;
    return dateToSave;
}

module.exports = {
    generateDate
}