import { ELEMENT_UPDATE } from './action-types';


const editorInfo = {
    elements: {},
};

export default (state = editorInfo, action) => {
    switch (action.type) {
        case ELEMENT_UPDATE:
            return Object.assign({}, state, {
                elements: action.elements
            });
        default:
            return state;
    }
};
