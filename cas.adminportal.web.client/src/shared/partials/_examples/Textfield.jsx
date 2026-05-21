import { Breadcrumb } from "@shared/components/_examples/custom/breadcrumb/Breadcrumb";
import { TextField as MUITextField } from "@shared/components/_examples/custom/fields/TextField";

export const TextField = ({ component }) => {
    return (
        <>
            <section className="space-y-8">
                <header className="space-y-1">
                    <h5 className="text-xl font-bold">{component}</h5>
                    <Breadcrumb component={component} />
                </header>

                <MUITextField />
            </section>
        </>
    );
};
