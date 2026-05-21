import clsx from "clsx";
import { useMainLayout } from "@app/layouts/main/provider/LayoutProvider";

import { Breadcrumbs } from "@shared/layout/main/breadcrumbs/Breadcrumbs";

// Components
import { Container } from "@shared/components/container";

// Items
import { HeaderLogo } from "./HeaderLogo";
import { HeaderTopbar } from "./HeaderTopBar";

import { useOffSetTop } from "@shared/hooks";

import { HEADER } from "@shared/config/theme.config";

const Header = () => {
  const isOffset = useOffSetTop(HEADER.H_DASHBOARD_DESKTOP);

  const { headerSticky } = useMainLayout();

  // calc(${HEADER.H_DASHBOARD_DESKTOP - 16}) ${isOffset && `backdrop-blur-lg bg-white/30`}

  return (
    <header
      className={clsx(
        `header fixed top-0 z-10 start-0 end-0 flex items-stretch shrink-0  dark:bg-[--tw-page-bg-dark] border-l border-gray-400`,
        headerSticky && "shadow-sm"
      )}
    >
      <Container className="flex justify-between lg:justify-end items-center lg:gap-4 p-4">
        <HeaderLogo />
        <HeaderTopbar />
      </Container>
    </header>
  );
};

export { Header };
