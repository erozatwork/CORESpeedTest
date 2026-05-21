import { createContext, useContext, useState } from "react";
import { ScreenLoader } from "@shared/components/loaders/ScreenLoader";
import { ProgressBarLoader } from "@shared/components/loaders/ProgressBarLoader";

const initialProps = {
    contentLoader: false,
    setContentLoader: (state) => {},
    progressBarLoader: false,
    setProgressBarLoader: (state) => {},
    screenLoader: false,
    setScreenLoader: (state) => {},
};

const LoadersContext = createContext(initialProps);
const useLoaders = () => useContext(LoadersContext);
const LoadersProvider = ({ children }) => {
    const [contentLoader, setContentLoader] = useState(false);
    const [progressBarLoader, setProgressBarLoader] = useState(false);
    const [screenLoader, setScreenLoader] = useState(false);

    return (
        <LoadersContext.Provider
            value={{
                contentLoader,
                setContentLoader,
                progressBarLoader,
                setProgressBarLoader,
                screenLoader,
                setScreenLoader,
            }}
        >
            {children}
            {progressBarLoader && <ProgressBarLoader />}
            {screenLoader && <ScreenLoader />}
        </LoadersContext.Provider>
    );
};
export { LoadersProvider, useLoaders };
