// import icon from "@shared/_core_icons/svgs/_redirects/404.svg";

export const Error403 = () => {
  return (
    <>
      <h1 className="font-extrabold text-xl md:text-3xl text-red-500 uppercase pb-5">
        Access denied!{" "}
      </h1>

      <span className="font-semibold text-xs sm:text-sm text-gray-500 uppercase pb-5">
        You do not have permission to view this page. If you think this is a
        mistake, please contact the SysDev team or submit a ticket through the
        ticketing portal.
      </span>
      {/* <img src={icon} className="w-full max-h-[400px]" alt="" /> */}
    </>
  );
};
