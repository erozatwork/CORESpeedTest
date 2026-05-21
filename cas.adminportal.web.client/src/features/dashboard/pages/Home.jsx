import { useState } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@shared/components/ui/card";
import { useAuthContext } from "@features/auth/useAuthContext";
import { useDataStore } from "@shared/api";

export default function BlankPage() {
  const { user } = useAuthContext();
  const { actionSelect } = useDataStore();
  const [dashboardCounts, setDashboardCounts] = useState({
    policiesCount: 0,
    scorecardCount: 0,
    coachingCount: 0,
  });


  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className={"uppercase"}>
            Welcome Back {user.firstName}!
          </CardTitle>
          <CardDescription className={" text-lg font-medium"}>
            Get started.
          </CardDescription>
        </CardHeader>
      </Card>
      
    </>
  );
}
