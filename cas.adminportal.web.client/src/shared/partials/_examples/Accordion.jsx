import { Breadcrumb } from "@shared/components/_examples/custom/breadcrumb/Breadcrumb";

import {
    Accordion as ShadAccordion,
    AccordionItem,
} from "@shared/components/accordion";

export const Accordion = ({ component }) => {
    const items = [
        {
            title: "What is included in each subscription tier?",
            text: "Each plan offers a unique set of features tailored to different business needs—from basic access for small teams to advanced tools and priority support for enterprises.",
        },
        {
            title: "Can I upgrade or downgrade my plan at any time?",
            text: "Yes, you can easily switch between plans at any point through your account settings. Changes take effect immediately or at the start of the next billing cycle, depending on your preference.",
        },
        {
            title: "Is customer support available for all users?",
            text: "All plans include access to our standard support channels, while premium users benefit from prioritized responses and dedicated account managers.",
        },
        {
            title: "Do you offer a free trial or demo version?",
            text: "Yes, we offer a 14-day free trial that includes access to all premium features, allowing you to fully evaluate the platform before committing.",
        },
        {
            title: "How do I cancel my subscription?",
            text: "You can cancel your subscription at any time from your billing dashboard. Once canceled, you'll retain access until the end of the current billing cycle.",
        },
        {
            title: "Are my data and privacy protected?",
            text: "Absolutely. We follow industry best practices and comply with global privacy regulations to ensure your data remains secure and confidential.",
        },
    ];

    const generateItems = () => {
        return (
            <ShadAccordion allowMultiple={false}>
                {items.map((item, index) => (
                    <AccordionItem key={index} title={item.title}>
                        {item.text}
                    </AccordionItem>
                ))}
            </ShadAccordion>
        );
    };

    return (
        <>
            <section className="space-y-8">
                <header className="space-y-1">
                    <h5 className="text-xl font-bold">{component}</h5>
                    <Breadcrumb component={component} />
                </header>

                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">FAQ</h3>
                    </div>
                    <div className="card-body py-3">{generateItems()}</div>
                </div>
            </section>
        </>
    );
};
