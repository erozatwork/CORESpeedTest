import { createContext, useContext, useState } from "react";

/**
 * ChecklistContext
 * Provides global state for checklist data accessible from sidebar and main page
 */
const ChecklistContext = createContext({
  checklistState: null,
  setChecklistState: () => {},
});

export const useChecklistContext = () => {
  const context = useContext(ChecklistContext);
  if (!context) {
    throw new Error("useChecklistContext must be used within ChecklistProvider");
  }
  return context;
};

export const ChecklistProvider = ({ children }) => {
  const [checklistState, setChecklistState] = useState({
    downloadSpeed: 0,
    uploadSpeed: 0,
    latitude: null,
    longitude: null,
    address: null,
    publicIp: null,
    deviceStatus: "online",
    signal: "strong",
    cameraStatus: "offline",
    lastSync: null,
    battery: 74,
  });

  return (
    <ChecklistContext.Provider value={{ checklistState, setChecklistState }}>
      {children}
    </ChecklistContext.Provider>
  );
};
