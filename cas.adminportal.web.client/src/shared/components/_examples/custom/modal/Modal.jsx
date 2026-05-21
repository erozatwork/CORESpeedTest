import { ModalBody, ModalHeader, Modal as MuiModal } from "@shared/components/modal";
// custom
import { ModalContent } from "./ModalContent";

const Modal = ({
    open,
    onCloseModal,
    maxWidth,
    component,
    children,
    ...props
}) => {
    return (
        <MuiModal open={open} onClose={onCloseModal}>
            <ModalContent maxWidth={maxWidth} {...props}>
                <ModalBody>{children}</ModalBody>
            </ModalContent>
        </MuiModal>
    );
};
export { Modal };
