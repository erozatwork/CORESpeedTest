/* elements.jsx */
import { Suspense, lazy } from "react";
import { ProgressBarLoader } from "@shared/components/loaders/ProgressBarLoader";
import FallbackProvider from "@app/providers/FallbackProvider";
import { ChecklistProvider } from "@features/checklist/context/ChecklistContext";

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
export const Checklist = (props) => (
  <ChecklistProvider>
    {Loadable(lazy(() => import("@features/checklist/pages/ChecklistPage")))(props)}
  </ChecklistProvider>
);

export const Monitoring = Loadable(lazy(() => import("@features/monitoring/pages/MonitoringPage")));

/** Error Pages */
export const HttpErrorPage = Loadable(
  lazy(() => import("@features/error/pages/HttpErrorPage"))
);
