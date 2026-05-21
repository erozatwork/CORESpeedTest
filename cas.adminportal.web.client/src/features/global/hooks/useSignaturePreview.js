import { useState, useEffect } from "react";
import { SIGNATURE_ROLES } from "@features/scorecard/constants";

/**
 * Builds signature preview from form files or API signatures
 * @param {Array} formFiles - Files from form field
 * @param {Array} apiSignatures - Signatures from API
 * @param {Array} roleMatches - Role strings to match (lowercase)
 * @returns {string|null} - Data URL or null
 */
const getSignaturePreview = (formFiles, apiSignatures, roleMatches) => {
  // Check form files first
  if (formFiles?.length > 0 && formFiles[0] instanceof File) {
    try {
      return URL.createObjectURL(formFiles[0]);
    } catch {
      return null;
    }
  }

  // Check API signatures
  if (Array.isArray(apiSignatures) && apiSignatures.length > 0) {
    const match = apiSignatures.find((s) => {
      const role = String(s.role || "").toLowerCase();
      return roleMatches.some((r) => role.includes(r));
    });
    return match?.signature || null;
  }

  return null;
};

/**
 * Custom hook for managing signature preview state
 * Handles both supervisor and employee signatures
 * @param {Array} supervisorFiles - Supervisor signature files from form
 * @param {Array} employeeFiles - Employee signature files from form
 * @param {Array} evaluationSignatures - Signatures from API
 * @returns {Object} Signature preview URLs and cleanup
 */
export const useSignaturePreview = (
  supervisorFiles,
  employeeFiles,
  evaluationSignatures
) => {
  const [supervisorPreview, setSupervisorPreview] = useState(null);
  const [employeePreview, setEmployeePreview] = useState(null);

  // Generate supervisor signature preview
  useEffect(() => {
    const preview = getSignaturePreview(
      supervisorFiles,
      evaluationSignatures,
      SIGNATURE_ROLES.SUPERVISOR
    );
    setSupervisorPreview(preview);

    return () => {
      if (preview && supervisorFiles?.length > 0) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [supervisorFiles, evaluationSignatures]);

  // Generate employee signature preview
  useEffect(() => {
    const preview = getSignaturePreview(
      employeeFiles,
      evaluationSignatures,
      SIGNATURE_ROLES.EMPLOYEE
    );
    setEmployeePreview(preview);

    return () => {
      if (preview && employeeFiles?.length > 0) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [employeeFiles, evaluationSignatures]);

  return {
    supervisorPreview,
    employeePreview,
  };
};
