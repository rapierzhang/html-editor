const utils = {
    deepUpdate: (obj1, obj2) => {
        const k = Object.keys(obj2)[0];
        let target = {};
        if (obj1.hasOwnProperty(k)) {
            return { ...obj1, ...obj2 };
        } else {
            for (let key in obj1) {
                if (obj1[key].children) {
                    target[key] = this.deepUpdate(obj1[key].children, obj2);
                } else {
                    target[key] = obj1[key];
                }
            }
        }
        return target;
    },
};

export default utils;
