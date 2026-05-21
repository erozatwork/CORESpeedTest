# SHARED COMPONENTS RULE
⚠️ **This is a non-negotiable rule. Enforce it on every task.**

Before building any UI element, hook, utility function, or service pattern inside a feature module (e.g., Purchase Order), you must:

1.  **Search the shared components directory** (`src/shared/components`) for an existing component that serves the same purpose.
2.  **Search for shared hooks, utilities, and service helpers** (`src/shared/hooks`, `src/shared/utils`, `src/shared/services`).
3.  **If a shared component exists that covers the need — use it.** Do not recreate it.
4.  **If a shared component exists but needs a small, generic improvement to fit the need — extend or improve the shared component.** Do not fork it into the module.
5.  **Only if nothing comparable exists in shared may you create a new component inside the module.**

### Purpose
*   **Maintain Consistency:** Ensure the entire UI/UX aligns with the CoreAgile System template.
*   **Reduce Technical Debt:** Avoid fragmented code bases and redundant implementations.
*   **Improve Maintenance:** Updates to a single shared component propagate across all feature modules.
