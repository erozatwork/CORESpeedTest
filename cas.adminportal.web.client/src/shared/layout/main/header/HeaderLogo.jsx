import { CoreIcons } from "@shared/core_icons/CoreIcons";

import { useMainLayout } from "@app/layouts/main/provider/LayoutProvider";

const HeaderLogo = () => {
  const { setMobileSidebarOpen, setMobileMegaMenuOpen, megaMenuEnabled } =
    useMainLayout();
  const handleSidebarOpen = () => {
    setMobileSidebarOpen(true);
  };
  const handleMegaMenuOpen = () => {
    setMobileMegaMenuOpen(true);
  };

  return (
    <div className="flex lg:hidden items-center ms-1">
      <div className="flex items-center">
        <button
          type="button"
          className="btn btn-icon bg-gray-300 btn-sm hover:!bg-black/30"
          onClick={handleSidebarOpen}
        >
          <CoreIcons icon="List" className="text-gray-800" size={18} />
        </button>
        {megaMenuEnabled && (
          <button
            type="button"
            className="btn btn-icon btn-red btn-sm text-white hover:!bg-black/30"
            onClick={handleMegaMenuOpen}
          >
            <CoreIcons icon="burger-menu-2" className="text-white" />
          </button>
        )}
      </div>
    </div>
  );
};
export { HeaderLogo };
