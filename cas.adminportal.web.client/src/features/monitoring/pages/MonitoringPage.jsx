import { useEffect, useMemo, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Card, CardHeader, CardTitle } from "@shared/components/ui/card";
import { Button } from "@shared/components/ui/button";
import { RHFDatepicker } from "@shared/components/_custom/hook-form";
import { useAuthContext } from "@features/auth/useAuthContext";
import { useMonitoring } from "../hooks/useMonitoring";
import { fPhilippinesDateKey, fPhilippinesDateTime } from "@shared/utils/formatTime";

/**
 * Sanitize and format a single monitoring row for clean display.
 * - Trims whitespace from string fields
 * - Formats speed values to 2 decimal places
 * - Replaces null/undefined/empty values with "—"
 */
const cleanRow = (row) => {
  const trimOrDash = (value) => {
    if (value == null) return "—";
    const trimmed = String(value).trim();
    return trimmed.length > 0 ? trimmed : "—";
  };

  const formatSpeed = (value) => {
    if (value == null || value === "" || value === "-") return "—";
    const num = Number(value);
    return isNaN(num) ? "—" : num.toFixed(2);
  };

  return {
    ...row,
    employeeId: trimOrDash(row.employeeId),
    employeeName: trimOrDash(row.employeeName),
    department: trimOrDash(row.department),
    location: trimOrDash(row.location),
    ipAddress: trimOrDash(row.ipAddress),
    downloadSpeed: formatSpeed(row.downloadSpeed),
    uploadSpeed: formatSpeed(row.uploadSpeed),
    formattedDate: fPhilippinesDateTime(row.createdAtUtc) || "—",
  };
};

export default function MonitoringPage() {
  const { isInitialized, isAuthenticated } = useAuthContext();
  const { monitoringData, pendingMonitoringData, isLoading, error, fetchAll, fetchStats, fetchPendingToday } = useMonitoring();
  const didLoadRef = useRef(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dateFilterForm = useForm({
    defaultValues: { filterDate: undefined },
  });
  const filterDateValue = dateFilterForm.watch("filterDate");
  const selectedDate = filterDateValue ? String(filterDateValue).split("T")[0] : "";

  const filteredMonitoringData = useMemo(() => {
    const records = Array.isArray(monitoringData) ? monitoringData : [];
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const filtered = records.filter((row) => {
      const createdDate = fPhilippinesDateKey(row.createdAtUtc);
      const matchesDate = selectedDate ? createdDate === selectedDate : true;

      if (!normalizedSearch) {
        return matchesDate;
      }

      const haystack = [
        row.employeeId,
        row.employeeName,
        row.department,
        row.location,
        row.ipAddress,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesDate && haystack.includes(normalizedSearch);
    });

    return filtered.map(cleanRow);
  }, [monitoringData, searchTerm, selectedDate]);

  useEffect(() => {
    if (!isInitialized || didLoadRef.current) {
      return;
    }

    const hasSession =
      isAuthenticated ||
      (import.meta.env.DEV &&
        Boolean(localStorage.getItem("accessToken") && localStorage.getItem("user")));

    if (!hasSession) {
      return;
    }

    didLoadRef.current = true;

    fetchAll(1, 200).catch(() => {});
    fetchStats().catch(() => {});
    fetchPendingToday().catch(() => {});
  }, [isInitialized, isAuthenticated, fetchAll, fetchStats, fetchPendingToday]);

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between w-full">
            <div>
              <CardTitle className="text-2xl">Monitoring</CardTitle>
            </div>
            <div>
              <Button onClick={() => fetchAll(1, 200)} disabled={isLoading}>
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <div className="p-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Employee Logs</h3>
            <p className="text-sm text-gray-500">Search by employee, department, location, or IP. Filter the log table by checklist date.</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <label className="flex flex-col gap-1 text-sm text-gray-600">
              <span>Search</span>
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search employee logs"
                className="min-w-[220px] rounded-md border px-3 py-2 text-sm outline-none focus:border-red-400"
              />
            </label>

            <FormProvider {...dateFilterForm}>
              <div className="min-w-[220px]">
                <RHFDatepicker
                  name="filterDate"
                  label="Date"
                  isNotRequired
                  placeholder="Filter by date"
                />
              </div>
            </FormProvider>
          </div>
        </div>
      </Card>

      <Card>
        <div className="p-4 overflow-x-auto">
          <table className="min-w-full table-auto text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500">
                <th className="px-3 py-2">Date & time (PH)</th>
                <th className="px-3 py-2">Employee ID</th>
                <th className="px-3 py-2">Employee</th>
                <th className="px-3 py-2">Department</th>
                <th className="px-3 py-2">Location</th>
                <th className="px-3 py-2">Download (Mbps)</th>
                <th className="px-3 py-2">Upload (Mbps)</th>
                <th className="px-3 py-2">IP</th>
              </tr>
            </thead>
            <tbody>
              {filteredMonitoringData && filteredMonitoringData.length > 0 ? (
                filteredMonitoringData.map((row) => (
                  <tr key={row.id} className="border-t">
                    <td className="px-3 py-2">{row.formattedDate}</td>
                    <td className="px-3 py-2">{row.employeeId}</td>
                    <td className="px-3 py-2">{row.employeeName}</td>
                    <td className="px-3 py-2">{row.department}</td>
                    <td className="px-3 py-2">{row.location}</td>
                    <td className="px-3 py-2">{row.downloadSpeed}</td>
                    <td className="px-3 py-2">{row.uploadSpeed}</td>
                    <td className="px-3 py-2">{row.ipAddress}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-3 py-6 text-center text-gray-500">
                    {isLoading ? "Loading..." : error ? error : "No monitoring records found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <div className="p-4 overflow-x-auto space-y-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Pending Employees</h3>
            <p className="text-sm text-gray-500">Employees who have not submitted a checklist for today yet.</p>
          </div>

          <table className="min-w-full table-auto text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500">
                <th className="px-3 py-2">Employee ID</th>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Department</th>
              </tr>
            </thead>
            <tbody>
              {pendingMonitoringData && pendingMonitoringData.length > 0 ? (
                pendingMonitoringData.map((row) => (
                  <tr key={row.employeeId} className="border-t">
                    <td className="px-3 py-2">{row.employeeId ?? "—"}</td>
                    <td className="px-3 py-2">{(row.name && String(row.name).trim()) || "—"}</td>
                    <td className="px-3 py-2">{(row.department && String(row.department).trim()) || "—"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-3 py-6 text-center text-gray-500">
                    {isLoading ? "Loading..." : "No pending WFH employees for today"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
