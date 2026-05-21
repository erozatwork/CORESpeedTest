import { useReducer } from 'react';

const defaultPopOverState = {
    isOpen: false,
    anchorEl: null,
};

const popoverReducer = (state, action) => {
    const { id, anchorEl } = action;
    const current = state[id] || defaultPopOverState;

    switch (action.type) {
        case 'Open':
            return {
                ...state,
                [id]: {
                    ...current,
                    isOpen: true,
                    anchorEl,
                },
            };
        case 'Close':
            return {
                ...state,
                [id]: {
                    ...current,
                    isOpen: false,
                    anchorEl: null,
                },
            };
        default:
            return state;
    }
};

const usePopoverState = () => {
    const [popState, dispatch] = useReducer(popoverReducer, {});

    const openPopover = (id, anchorEl) => {
        dispatch({ type: 'Open', id, anchorEl });
    };

    const closePopover = (id) => {
        dispatch({ type: 'Close', id });
    };

    return { popState, openPopover, closePopover };
};

export { usePopoverState };
