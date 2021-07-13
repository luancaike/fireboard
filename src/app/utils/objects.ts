export const GetValueByKeyArray = (key: string, result: { [key: string]: any }): boolean | { [key: string]: any } => {
    const isArrayIndex = key.match(/\[(\d+)]/g);
    if (isArrayIndex && isArrayIndex.length) {
        const index = +isArrayIndex[0].replace('[', '').replace(']', '');
        const keyArray = key.replace(isArrayIndex[0], '');
        if (Array.isArray(result[keyArray])) {
            return result[keyArray][index];
        }
    }
    return false;
};

export const GetValueObjectByPath = (object: { [key: string]: any }, path: string): { [key: string]: any } => {
    const pathArray = path.split('.');
    return pathArray.reduce((result, key) => {
        const getArray = GetValueByKeyArray(key, result);
        if (getArray) {
            return getArray;
        }
        return result[key];
    }, object);
};

export const SetValueObjectByPath = (
    object: { [key: string]: any },
    path = '',
    value: unknown
): { [key: string]: any } => {
    const pathArray = path.split('.');
    pathArray.reduce((result, key, i) => {
        const getArray = GetValueByKeyArray(key, result);
        if (getArray) {
            return getArray;
        }
        if (i === pathArray.length - 1) {
            result[key] = value;
        }
        return result[key];
    }, object);
    return object;
};
