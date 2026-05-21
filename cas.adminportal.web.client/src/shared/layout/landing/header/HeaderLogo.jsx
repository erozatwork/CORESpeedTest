import { Link } from "react-router-dom";
import { toAbsoluteUrl } from "@shared/utils";

const HeaderLogo = () => {
  return (
    <div className="flex gap-1 items-center -ms-1 font-bold">
      <Link to="/" className="shrink-0 flex">
        <img
          src="https://cdn.onecoredevit.com/logos/core-icon.svg"
          className="max-h-[25px] w-[25px]" //172.16.254.4/auth
          alt="mini-logo"
        />
        <span className="font-medium ml-1">OneCore</span>
      </Link>
    </div>
  );
};
export { HeaderLogo };
