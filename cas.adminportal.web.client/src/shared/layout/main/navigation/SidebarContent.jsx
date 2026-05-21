import { SidebarMenu } from "./SidebarMenu";

const SidebarContent = ({ defaultThemeLayout = "horizontal", height = 0 }) => {
  if (defaultThemeLayout === "horizontal") {
    return (
      <div className="sidebar-content flex grow shrink-0 pe-2">
        <div
          className="scrollable-y-hover grow shrink-0 flex ps-2 lg:ps-5 pe-1 lg:pe-3"
          style={{
            ...(height > 0 && {
              height: `${height}px`,
            }),
          }}
        >
          <SidebarMenu />
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-stretch grow shrink-0 justify-center">
      <div
        className="scrollable-y-auto light:[--tw-scrollbar-thumb-color:var(--tw-content-scrollbar-color)] grow px-3"
        style={{
          ...(height > 0 && {
            height: `${height}px`,
          }),
        }}
      >
        <SidebarMenu />
      </div>
    </div>
  );
};
export { SidebarContent };
