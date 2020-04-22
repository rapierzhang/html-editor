import { ELEMENT_UPDATE } from './action-types';

export const elementsUpdate = elements => dispatch => {
    dispatch({
        type: ELEMENT_UPDATE,
        elements
    });
};
