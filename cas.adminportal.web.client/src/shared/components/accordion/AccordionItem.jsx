import clsx from "clsx";
import { memo } from "react";
import Collapse from "@mui/material/Collapse";
import { CoreIcons } from "@shared/core_icons/CoreIcons";

const AccordionItemComponent = ({
  title,
  indicator,
  children,
  isOpen,
  onClick,
}) => {
  const buildIndicator = () => {
    return (
      indicator || (
        <span className="accordion-indicator">
          {isOpen ? (
            <CoreIcons icon="minus" className="text-gray-600 text-sm" />
          ) : (
            <CoreIcons icon="plus" className="text-gray-600 text-sm" />
          )}
        </span>
      )
    );
  };
  return (
    <div
      className={clsx(
        "accordion-item [&:not(:last-child)]:border-b border-b-gray-200",
        isOpen && "active"
      )}
    >
      <button
        type="button"
        className="accordion-toggle py-4 cursor-pointer"
        onClick={onClick}
      >
        <span className="text-base text-gray-900"> {title} </span>
        {buildIndicator()}
      </button>
      <Collapse in={isOpen}>
        <div className="accordion-content">
          <div className="text-gray-700 text-md pb-4">{children}</div>
        </div>
      </Collapse>
    </div>
  );
};

const AccordionItem = memo(AccordionItemComponent);

export { AccordionItem };
