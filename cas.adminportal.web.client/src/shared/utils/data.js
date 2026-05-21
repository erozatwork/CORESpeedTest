export const deepMerge = (obj1, obj2) => {
    const output = Object.assign({}, obj1);
    for (const key in obj2) {
        if (Object.prototype.hasOwnProperty.call(obj2, key)) {
            if (typeof obj2[key] === 'object' && obj2[key] !== null && obj1[key]) {
                output[key] = deepMerge(obj1[key], obj2[key]);
            } else {
                output[key] = obj2[key];
            }
        }
    }
    return output;
};

export function uniqueID() {
    return (Date.now() + Math.floor(Math.random() * 1000)).toString();
}