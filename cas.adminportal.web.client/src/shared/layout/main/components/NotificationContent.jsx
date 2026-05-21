import { BellSimpleRinging, X } from "@phosphor-icons/react";

import { useMenu } from "@shared/components/_custom/menu/useMenu";
import { useNotif } from "@shared/components/_custom/notification";

import { DropdownMenuSub } from "@shared/components/ui/dropdown-menu";

import { Button } from "@shared/components/ui/button";
import { useEffect } from "react";

import { NotifMock } from "@shared/mock/NotifMock";

const NotificationContent = () => {
    const { ViewMenu } = useMenu();

    const { notification, setAsNotif, Content } = useNotif();

    const NotifContent = ({ close }) => (
        <>
            <DropdownMenuSub>
                <Content close={close} />
            </DropdownMenuSub>
        </>
    );

    useEffect(() => {
        setAsNotif(NotifMock);
    }, [notification]);

    return (
        <>
            <ViewMenu
                buttonWeight="thin"
                buttonVariant="ghost"
                buttonClass="text-dark rounded-lg [&_svg:not([class*='size-'])]:size-5 w-8"
                icon={
                    <BellSimpleRinging
                        size={32}
                        weight="duotone"
                        className={`${
                            notification.some((item) => item.isRead === false)
                                ? `text-red-600 animate-shake-with-delay`
                                : `text-white`
                        }`}
                    />
                }
                label={
                    <div className="flex justify-between items-center gap-4 w-full">
                        <span className="text-base font-medium">
                            Notifications
                        </span>
                        <Button
                            weight="thin"
                            variant="ghost"
                            className="text-dark rounded-lg [&_svg:not([class*='size-'])]:size-5 w-5 h-5"
                        >
                            <X size={32} weight="duotone" />
                        </Button>
                    </div>
                }
                className="w-96 backdrop-blur-lg bg-white/80 dark:bg-[#141A21]/60"
            >
                <NotifContent />
            </ViewMenu>
        </>
    );
};

export { NotificationContent };
