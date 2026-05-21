import {
    Breadcrumb as UIBreadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@shared/components/ui/breadcrumb";

const Breadcrumb = ({ component }) => {
    return (
        <>
            <UIBreadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/core/components">
                            Components
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>{component}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </UIBreadcrumb>
        </>
    );
};

export { Breadcrumb };
