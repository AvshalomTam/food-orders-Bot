const mapManaToNum = (orderName) => {
    switch (orderName) {
        case "pizza":
            return 1
        case "toast":
            return 2
        case "fallafel":
            return 3
    }
}

const mapNumToMana = (num) => {
    switch (num) {
        case 1:
            return "pizza"
        case 2:
            return "toast"
        case 3:
            return "fallafel"
    }
}

module.exports = {
    mapManaToNum,
    mapNumToMana
}