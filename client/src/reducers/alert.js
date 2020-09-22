// const initialState = [
//     {
//         id: 1,
//         msg: 'Please log in',
//         alertType: 'success'
//     }
// ]

import { SET_ALERT, REMOVE_ALERT } from '../actions/types';
const initialState = [];

export default function(state = initialState, action)
{
    const { type, payload } = action;

    switch(type)
    {
        case SET_ALERT:
            return [...state, payload];
        case REMOVE_ALERT:
            return state.filter(alert => alert.id !== payload); // Will return all alerts except the one with the same payload
        default:
            return state;
        
    }
};