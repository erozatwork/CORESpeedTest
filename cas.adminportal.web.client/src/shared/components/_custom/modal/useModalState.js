import { useReducer } from 'react';

const defaultModalState = {
    isDefault: false,
    isOpen: false,
    isHiding: false,
    isDeleting: false,
    method: null,
    key: null,
};

const modalReducer = (state, action) => {
    const { id, method, key } = action;
    const current = state[id] || defaultModalState;

    switch (method) {
        case 'Create':
            return {
                ...state,
                [id]: {
                ...current,
                isOpen: true,
                method: 'Create',
                key: null,
                },
            };
        case 'Edit':
            return {
                ...state,
                [id]: {
                ...current,
                isOpen: true,
                method: 'Edit',
                key,
                },
        };
        case 'Hide':
            return {
                ...state,
                [id]: {
                ...current,
                isHiding: true,
                method: 'Hide',
                key,
                },
        };
        case 'Delete':
            return {
                ...state,
                [id]: {
                ...current,
                isDeleting: true,
                method: 'Delete',
                key,
                },
            };
        case 'Default':
            return {
                ...state,
                [id]: {
                ...current,
                isDefault: true,
                method: 'Default',
                key,
                },
            };
        case 'Close':
            return {
                ...state,
                [id]: defaultModalState,
            };
            default:
        return state;
    }
};

const useModalState = () => {
    const [modalState, dispatch] = useReducer(modalReducer, {});

    const changeModalState = (id, method, key = null) => {
        dispatch({ id, method, key });
    };

    const closeModal = (id) => {
        dispatch({ id, method: 'Close' });
    };

    return { modalState, changeModalState, closeModal };
};

export { useModalState };
