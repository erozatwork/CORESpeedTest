// import coreIcon from "@shared/_core_icons/img/core-icon.png";

const ScreenLoader = () => {
  return (
    <div className="flex flex-col items-center gap-2 justify-center fixed inset-0 z-50 bg-light transition-opacity duration-700 ease-in-out text-black">
      <img
        className="h-[40px] max-w-none"
        src="https://cdn.onecoredevit.com/logos/core-icon.svg"
        alt="logo"
      />
      <div className="text-gray-500 font-medium text-sm">Loading...</div>
    </div>
  );
};
export { ScreenLoader };
