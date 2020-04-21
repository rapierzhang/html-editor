import { ELEMENT_UPDATE } from './action-types';

export const elementsUpdate = data => dispatch => {
    console.error(555, data);
    dispatch({
        type: ELEMENT_UPDATE,
        data,
    });
};
