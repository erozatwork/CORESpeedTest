import { forwardRef } from "react";
// Forwarding ref to ensure this component can hold a ref
const ModalFooter = forwardRef(({ className, children }, ref) => {
    return (
        <div ref={ref} className={`modal-footer ${className}`}>
            {children}
        </div>
    );
});
export { ModalFooter };
