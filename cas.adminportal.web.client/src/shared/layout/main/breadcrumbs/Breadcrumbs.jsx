import { Fragment } from "react";
import { useLocation } from "react-router-dom";
import clsx from "clsx";

// // Providers
import { useMenus } from "@app/providers";
import { useMenuBreadcrumbs } from "@shared/components/menu/hooks/useMenuBreadcrumbs";

const Breadcrumbs = () => {
    const { pathname } = useLocation();
    const { getMenuConfig } = useMenus();
    const menuConfig = getMenuConfig("primary");
    const items = useMenuBreadcrumbs(pathname, menuConfig);

    const mainItem = items?.[items.length - 1];

    const renderBreadcrumbTrail = (items) =>
        items.map((item, index) => {
            const last = index === items.length - 1;
            return (
                <Fragment key={`breadcrumb-${index}`}>
                    <span
                        className={clsx(
                            "transition-colors",
                            item.active
                                ? "text-black dark:text-white"
                                : "text-gray-400"
                        )}
                    >
                        {item.title}
                    </span>
                    {!last && "-"}
                </Fragment>
            );
        });

    return (
        <div className="px-5 py-4 lg:mb-0 space-y-0.5 bg-white dark:bg-[--tw-page-bg-dark]">
            <div className="text-primary text-sm sm:text-base font-semibold leading-tight">
                {mainItem?.title}
            </div>

            <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-gray-400">
                {renderBreadcrumbTrail(items)}
            </div>
        </div>
    );
};

export { Breadcrumbs };
