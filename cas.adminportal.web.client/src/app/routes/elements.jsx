/* elements.jsx */
import { Suspense, lazy } from "react";
import { ProgressBarLoader } from "@shared/components/loaders/ProgressBarLoader";
import FallbackProvider from "@app/providers/FallbackProvider";

const Loadable = (Component) => (props) =>
(
  <FallbackProvider>
    <Suspense fallback={<ProgressBarLoader />}>
      <Component {...props} />
    </Suspense>
  </FallbackProvider>
);

/** General Pages */
export const Dashboard = Loadable(lazy(() => import("@features/dashboard/pages/Home")));

/** Error Pages */
export const HttpErrorPage = Loadable(
  lazy(() => import("@features/error/pages/HttpErrorPage"))
);
