import { Helmet } from "react-helmet-async";
import { Outlet } from "react-router-dom";

import { Container } from "@shared/components/container";

import { Header } from "./header/Header";
import { BOX } from "@shared/config/theme.config";

const MainLayout = () => {
    return (
        <>
            <Helmet>
                <title>All Components | One Core Dev IT</title>
            </Helmet>
            <Header />

            <main
                className={`flex grow`}
                style={{
                    paddingTop: `${BOX.H_MAIN_DESKTOP_MD}px`,
                }}
            >
                <Outlet />
            </main>
        </>
    );
};

export { MainLayout };
