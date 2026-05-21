import { useState } from "react";

const useModalState = () => {

    const [modalState, setModalState] = useState({
        isOpen: false,
        isHiding: false,
        isDeleting: false,
        method: null,
        key: null
    });

    const changeModalState = (method, key) => {
        switch(method){
            case "Create":
                setModalState({
                    isOpen: !modalState.isOpen,
                    method: method,
                    key: null
                });
                break;
            case "Edit":
                setModalState({
                    isOpen: !modalState.isOpen,
                    method: method,
                    key: key,
                });
                break;
            case "Hide":
                setModalState({
                    isHiding: !modalState.isHiding,
                    method: method,
                    key: key,
                });
                break;
            case "Delete":
                setModalState({
                    isDeleting: !modalState.isDeleting,
                    method: method,
                    key: key,
                });
                break;
            default:
               setModalState((prev) => ({
                    ...prev,
                    isOpen: false,
                    isDeleting: false,
                    isHiding: false,
                }));

                // Refresh State
                setTimeout(() => {
                    setModalState({
                        isOpen: false,
                        isDeleting: false,
                        isHiding: false,
                        method: null,
                        key: null
                    });
                }, 300)
                break;  
        };
    }

    return { modalState, changeModalState }
}

export { useModalState }