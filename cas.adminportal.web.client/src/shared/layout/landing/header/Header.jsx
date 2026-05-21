import clsx from "clsx";

// Config
import { HEADER } from "@shared/config/theme.config";

// Components
import { Container } from "@shared/components/container";

// Hooks
import { useOffSetTop } from "@shared/hooks";

// Items
import { HeaderLogo } from "./HeaderLogo";
import { HeaderTopbar } from "./HeaderTopbar";
import { HeaderAuth } from "./HeaderAuth";

const Header = () => {
  const isOffset = useOffSetTop(HEADER.H_MAIN_DESKTOP);

  return (
    <header
      className={clsx(
        `header fixed top-0 z-10 start-0 end-0 shrink-0 calc(${
          HEADER.H_MAIN_DESKTOP - 16
        }) ${isOffset && `backdrop-blur-lg bg-white/30`}`
        // headerSticky && "shadow-sm"
      )}
    >
      <Container className="flex justify-between items-center lg:gap-4 m-auto max-w-[1400px] p-4">
        <HeaderLogo />
        <HeaderTopbar />
        <HeaderAuth />
      </Container>
    </header>
  );
};

export { Header };

// "header fixed top-0 z-10 start-0 end-0 flex items-stretch shrink-0 bg-[--tw-page-bg] dark:bg-[--tw-page-bg-dark]";
