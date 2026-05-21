import { useDataStore } from "@shared/api";
// Helper to get store actions
const getStoreActions = () => {
  const { actionSelect, actionCreate, actionUpdate } = useDataStore.getState();
  return { actionSelect, actionCreate, actionUpdate };
};

export async function getHomeMenuCount() {
  const { actionSelect } = getStoreActions();
  return await actionSelect("/api/Home/home_menu_count");
}
