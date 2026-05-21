import { Link } from "react-router-dom";
import { toAbsoluteUrl } from "@shared/utils";
import { Button } from "@shared/components/ui/button";

const HeaderAuth = () => {
  return (
    <div className="flex gap-1 items-center -ms-1">
      <Button type="submit">
        <span>Login</span>
      </Button>
    </div>
  );
};
export { HeaderAuth };
