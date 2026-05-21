import { Link } from "react-router-dom";

// import bgDark from "@shared/_core_icons/img/template-background.png";

import { Error404 } from "@features/error/components/Error404";
import { Error403 } from "@features/error/components/Error403";

export default function HttpErrorPage({ err }) {
  const HttpError = () => {
    if (err === "404") {
      return <Error404 />;
    }
    if (err === "403") {
      return <Error403 />;
    }
  };

  return (
    <>
      <div
        className="h-dvh w-full flex items-center justify-center bg-black p-6 bg-cover bg-no-repeat"
        // style={{
        //   backgroundImage: `url(${bgDark})`,
        // }}
      >
        <div className="text-center bg-white w-full max-w-[900px] rounded-lg space-y-6 p-6 lg:p-12">
          <img
            src="https://cdn.onecoredevit.com/logos/core-icon.png"
            className="w-26 max-h-12 m-auto"
            alt=""
          />

          <HttpError />

          <div>
            <Link
              to="/dashboard"
              className="px-4 py-3 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
