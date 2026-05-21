import React from "react";

// import icons from "@shared/_core_icons/config/icons"; // File doesn't exist
const icons = {}; // Placeholder - this component appears to be unused

// import { getLayoutFromLocalStorage } from "../../layout/core";

// const KTIcon = ({ className = "", iconType, iconName }) => {
//     if (!iconType) {
//         iconType = getLayoutFromLocalStorage().main?.iconType;
//     }
//     return (
//         <i
//             className={`ki-${iconType} ki-${iconName} ${className ? " " + className : ""}`}
//         >
//             {iconType === "duotone" &&
//                 [...Array(icons[iconName])].map((_, i) => (
//                     <span
//                         key={`${iconType}-${iconName}-${className}-path-${i + 1}`}
//                         className={`path${i + 1}`}
//                     ></span>
//                 ))}
//         </i>
//     );
// };

const OneIcon = ({ className = "", iconType, iconName }) => {
  if (!iconType) {
    // iconType = getLayoutFromLocalStorage().main?.iconType;
    iconType = "duotone";
  }

  return (
    <i
      className={`ki-${iconType} ki-${iconName} ${
        className ? " " + className : ""
      }`}
    >
      {iconType === "duotone" &&
        [...Array(icons[iconName])].map((_, i) => (
          <span
            key={`${iconType}-${iconName}-${className}-path-${i + 1}`}
            className={`path${i + 1}`}
          ></span>
        ))}
    </i>
  );
};

export { OneIcon };
