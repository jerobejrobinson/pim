/**
 * Used to convert a JSON str into a class instantance will mainly be used for the Item class
 * @param {Class} c - Pass the class to copy str into
 * @param {String} str - get json str from database
 * @returns new istantance of class with str passed into it
 */
function jsonToClass(c, str) {
    const t = new c()
    return Object.assign(t, JSON.parse(str))
}

export default jsonToClass;