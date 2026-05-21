import { memo } from "react";

import { ModalBody, ModalHeader, Modal as MuiModal } from "@shared/components/modal";
// custom
import { ModalContent } from "./ModalContent";
import { ModalFooter } from "@shared/components/modal/ModalFooter";
import FormProvider from "../hook-form/FormProvider";
import { Button } from "@shared/components/ui/button";

const Modal = memo(
    ({
        isDefault = false,
        open = false,
        onCloseModal,
        maxWidth,
        modalTitle,
        component,
        children,
        methods,
        onSubmit,
        isSubmitting,
        Header,
        Footer,
        ...props
    }) => {
        const IsFooter = () => {
            if (!!Footer) return Footer;

            return (
                <Button
                    onClick={onCloseModal}
                    className={`flex justify-center items-center text-sm font-semibold leading-6 w-fit bg-dark`}
                >
                    Back
                </Button>
            );
        };

        const IsHeader = () => {
            if (!!Header) return Header;

            return <> {modalTitle}</>;
        };
        return (
            <MuiModal open={open} onClose={onCloseModal}>
                <ModalContent maxWidth={maxWidth} {...props}>
                    <ModalHeader className="font-semibold">
                        <IsHeader />
                    </ModalHeader>
                    {open && !isDefault && (
                        <FormProvider methods={methods} onSubmit={onSubmit}>
                            <ModalBody>{children}</ModalBody>
                        </FormProvider>
                    )}
                    {open && isDefault && <ModalBody>{children}</ModalBody>}
                    <ModalFooter className="flex flex-row items-end justify-end gap-2">
                        {open && !isDefault && (
                            <>
                                <Button
                                    onClick={onCloseModal}
                                    className={`flex justify-center items-center text-sm font-semibold leading-6 w-fit bg-dark dark:hover:bg-gray-300`}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={onSubmit}
                                    className={`flex justify-center items-center text-sm font-semibold leading-6 w-fit hover:bg-primary-active`}
                                >
                                    {!isSubmitting && <span>Submit</span>}
                                    {isSubmitting && (
                                        <span className="flex items-center">
                                            Please wait...
                                            <div className="w-4 h-4 border-2 border-t-2 border-gray-300 border-t-transparent rounded-full animate-spin ml-2"></div>
                                        </span>
                                    )}
                                </Button>
                            </>
                        )}
                        {open && isDefault && (
                            <>
                                <IsFooter />
                            </>
                        )}
                    </ModalFooter>
                </ModalContent>
            </MuiModal>
        );
    }
);

Modal.displayName = "Modal";

export { Modal };
