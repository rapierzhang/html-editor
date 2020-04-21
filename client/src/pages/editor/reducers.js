import { ELEMENT_UPDATE } from './action-types';


const EditorInfo = {
    elements: {},
};

export default (state = EditorInfo, action) => {
    console.log(111, action)
    switch (action.type) {
        case ELEMENT_UPDATE:
            return Object.assign({}, state, {
                elements: action.data
            });
        default:
            return state;
    }
};
