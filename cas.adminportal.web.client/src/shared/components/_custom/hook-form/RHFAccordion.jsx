import PropTypes from "prop-types";
import { useFormContext, Controller } from "react-hook-form";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@shared/components/ui/accordion";

export const RHFAccordion = ({ name, trigger, content, ...other }) => {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem
                        value={name}
                        {...other}
                        className="rounded-2xl border px-4 shadow-md bg-white my-4"
                    >
                        <div className="flex justify-between items-start">
                            <div className="w-full">
                                <AccordionTrigger className="font-semibold hover:no-underline flex items-center">
                                    {trigger}
                                </AccordionTrigger>

                                <AccordionContent className="pt-2 text-sm text-muted-foreground border-t-2">
                                    {content}
                                </AccordionContent>
                            </div>
                        </div>
                    </AccordionItem>
                </Accordion>
            )}
        />
    );
};

RHFAccordion.propTypes = {
    name: PropTypes.string.isRequired,
    trigger: PropTypes.node.isRequired,
    content: PropTypes.node.isRequired,
};
