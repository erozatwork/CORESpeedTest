import { createContext, useContext, useState } from "react";

const initialProps = {
    configs: new Map(),
    setMenuConfig: () => {},
    getMenuConfig: () => null,
    setCurrentMenuItem: () => {},
    getCurrentMenuItem: () => null,
};
const MenuContext = createContext(initialProps);

const useMenus = () => useContext(MenuContext);

const MenusProvider = ({ children }) => {
    const [currentMenuItem, setCurrentMenuItem] = useState(null);

    const [isMenuReady, setIsMenuReady] = useState(false);

    const configs = initialProps.configs;
    const setMenuConfig = (name, config) => {
        configs.set(name, config);
    };
    const getCurrentMenuItem = () => {
        return currentMenuItem;
    };
    const getMenuConfig = (name) => {
        return configs.get(name) ?? null;
    };

    return (
        <MenuContext.Provider
            value={{
                configs,
                isMenuReady,
                setIsMenuReady,
                setMenuConfig,
                getMenuConfig,
                setCurrentMenuItem,
                getCurrentMenuItem,
            }}
        >
            {children}
        </MenuContext.Provider>
    );
};

export { MenusProvider, useMenus };
