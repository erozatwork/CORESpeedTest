import { useDataStore } from "@shared/api";

// Helper to get store actions
const getStoreActions = () => {
  const { actionSelect, actionCreate, actionUpdate } = useDataStore.getState();
  return { actionSelect, actionCreate, actionUpdate };
};

const mapEmployeeOption = (d) => {
  const departmentId = d.departmentId ?? d.DepartmentId ?? d.deptId ?? d.DeptId;
  const departmentName =
    d.departmentName ??
    d.DepartmentName ??
    d.department ??
    d.Department ??
    d.departmentLabel ??
    d.DepartmentLabel;

  return {
    label: d.name,
    value: d.id != null ? String(d.id) : null,
    departmentId:
      departmentId != null && departmentId !== ""
        ? String(departmentId)
        : null,
    departmentName:
      departmentName != null && String(departmentName).trim() !== ""
        ? String(departmentName)
        : null,
  };
};

const mapDepartmentOption = (d) => {
  const label = d.name ?? d.Name ?? d.label ?? d.Label;
  const value = d.id ?? d.Id ?? d.value ?? d.Value;

  return {
    label: label != null ? String(label) : null,
    value: value != null ? String(value) : null,
  };
};

const normalizeDepartmentResponse = (res) => {
  const fromGlobal = Array.isArray(res?.departments) ? res.departments : null;
  const fromAssetMonitoring = Array.isArray(res?.data) ? res.data : null;
  const source = fromGlobal ?? fromAssetMonitoring ?? [];

  return source
    .map(mapDepartmentOption)
    .filter((o) => o.label != null && o.value != null);
};

/**
 * Get department dropdown options
 * @returns {Promise<Array>} Department options
 */
export async function getDepartments() {
  const { actionSelect } = getStoreActions();
  try {
    const res = await actionSelect("/api/Global/department_dropdown");
    const normalized = normalizeDepartmentResponse(res);
    if (normalized.length > 0) return normalized;
  } catch {
    // Fallback below.
  }

  try {
    const fallbackRes = await actionSelect("/api/AssetMonitoring/Departments");
    return normalizeDepartmentResponse(fallbackRes);
  } catch (error) {
    console.error("Error fetching departments:", error);
    return [];
  }
}

/**
 * Get team/business unit dropdown options for a department
 * @param {string} departmentId - Department ID
 * @returns {Promise<Array>} Team options
 */
export async function getTeams(departmentId) {
  const { actionSelect } = getStoreActions();
  const res = await actionSelect(`/api/Global/team_dropdown/${departmentId}`);
  return res.teams
    .map((d) => ({
      label: d.name,
      value: d.id != null ? String(d.id) : null,
    }))
    .filter((o) => o.value != null);
}

/**
 * Get team/business unit dropdown options for multiple departments
 * @param {Array<string|number>} departmentIds - Array of Department IDs
 * @returns {Promise<Array>} Team options
 */
export async function getMultipleTeams(departmentIds) {
  const { actionSelect } = getStoreActions();

  console.log(
    "[API] getMultipleTeams called with departmentIds:",
    departmentIds
  );

  // Validate input
  if (
    !departmentIds ||
    !Array.isArray(departmentIds) ||
    departmentIds.length === 0
  ) {
    console.warn("[API] Invalid or empty departmentIds, returning empty array");
    return [];
  }

  // Convert to numbers and filter out invalid values (NaN, null, undefined, 0)
  const ids = departmentIds
    .map((id) => {
      const num = Number(id);
      return !isNaN(num) && num > 0 ? num : null;
    })
    .filter((id) => id !== null);

  if (ids.length === 0) {
    console.warn(
      "[API] No valid department IDs after filtering, returning empty array"
    );
    return [];
  }

  const queryString = ids.map((id) => `departmentId=${id}`).join("&");

  console.log("[API] Query string:", queryString);
  console.log(
    "[API] Calling URL:",
    `/api/Global/multiple_team_dropdown?${queryString}`
  );

  const res = await actionSelect(
    `/api/Global/multiple_team_dropdown?${queryString}`
  );
  console.log("[API] Response received:", res);

  return res.teams
    .map((d) => ({
      label: d.name,
      value: d.id != null ? String(d.id) : null,
    }))
    .filter((o) => o.value != null);
}

/**
 * Get employee dropdown options for a department (optionally filtered by team)
 * @param {string} departmentId - Department ID
 * @param {string|number} teamId - Optional team ID
 * @returns {Promise<Array>} Employee options
 */
export async function getEmployees(departmentId, teamId) {
  const { actionSelect } = getStoreActions();
  const params = {};
  if (teamId != null && teamId !== "") params.teamId = Number(teamId);

  const res = await actionSelect(
    `/api/Global/employees_dropdown/${departmentId}`,
    params
  );
  return res.employees
    .map(mapEmployeeOption)
    .filter((o) => o.value != null);
}

/**
 * Get employee dropdown options for multiple departments (optionally filtered by teams)
 * @param {Array<string|number>} departmentIds - Array of Department IDs
 * @param {Array<string|number>} teamIds - Optional array of Team IDs
 * @returns {Promise<Array>} Employee options
 */
export async function getMultipleEmployees(departmentIds, teamIds) {
  const { actionSelect } = getStoreActions();

  console.log(
    "[API] getMultipleEmployees called with departmentIds:",
    departmentIds,
    "teamIds:",
    teamIds
  );

  // Validate input
  if (
    !departmentIds ||
    !Array.isArray(departmentIds) ||
    departmentIds.length === 0
  ) {
    console.warn("[API] Invalid or empty departmentIds, returning empty array");
    return [];
  }

  // Build query string manually for array parameters
  // Convert to numbers and filter out invalid values (NaN, null, undefined, 0)
  const deptIds = departmentIds
    .map((id) => {
      const num = Number(id);
      return !isNaN(num) && num > 0 ? num : null;
    })
    .filter((id) => id !== null);

  if (deptIds.length === 0) {
    console.warn(
      "[API] No valid department IDs after filtering, returning empty array"
    );
    return [];
  }

  let queryString = deptIds.map((id) => `departmentId=${id}`).join("&");

  // Add team IDs if provided
  if (teamIds && Array.isArray(teamIds) && teamIds.length > 0) {
    const tIds = teamIds
      .map((id) => {
        const num = Number(id);
        return !isNaN(num) && num > 0 ? num : null;
      })
      .filter((id) => id !== null);

    if (tIds.length > 0) {
      const teamQuery = tIds.map((id) => `teamId=${id}`).join("&");
      queryString += `&${teamQuery}`;
    }
  }

  console.log("[API] Query string:", queryString);
  console.log(
    "[API] Calling URL:",
    `/api/Global/multiple_employees_dropdown?${queryString}`
  );

  const res = await actionSelect(
    `/api/Global/multiple_employees_dropdown?${queryString}`
  );
  console.log("[API] Response received:", res);

  return res.employees
    .map(mapEmployeeOption)
    .filter((o) => o.value != null);
}
/**
 * Get all employee dropdown options (no department filter)
 * @returns {Promise<Array>} All employee options
 */
export async function getAllEmployees() {
  const { actionSelect } = getStoreActions();
  try {
    const res = await actionSelect("/api/Global/employees_dropdown/0");
    return res.employees
      .map(mapEmployeeOption)
      .filter((o) => o.value != null);
  } catch (error) {
    console.error("Error fetching all employees:", error);
    return [];
  }
}
