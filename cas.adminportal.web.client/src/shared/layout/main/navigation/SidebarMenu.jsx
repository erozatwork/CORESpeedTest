import clsx from "clsx";
import { RenderCoreIcon } from "@shared/core_icons/CoreIcons";
import {
  Menu,
  MenuArrow,
  MenuBadge,
  MenuHeading,
  MenuIcon,
  MenuItem,
  MenuLabel,
  MenuLink,
  MenuSub,
  MenuTitle,
} from "@shared/components/menu";
import { useMenus } from "@app/providers";
import { Circle, CaretDown, CaretUp } from "@phosphor-icons/react";
import { memo, useCallback } from "react";

/* -------------------------------------------------------------------------- */
/*                                   CONSTS                                   */
/* -------------------------------------------------------------------------- */
const PL = "ps-[10px]";
const PR = "pe-[15px]";
const PY = "py-[10px]";
const SUB_PY = "py-[8px]";
const GAP_CHILD = "gap-[14px]";
const ICON_W = "w-[20px]";
const ICON_SIZE = "text-xl";
const RIGHT_OFFSET = "me-[-10px]";

const gapByLevel = (level) => (level === 0 ? GAP_CHILD : "gap-[5px]");
const plByLevel = () => "ps-[22px]";

/* -------------------------------------------------------------------------- */
/*                                SUBCOMPONENTS                               */
/* -------------------------------------------------------------------------- */
const ArrowIcon = memo(() => (
  <MenuArrow
    className={clsx(
      "text-gray-800 w-[20px] shrink-0 justify-end ms-1",
      RIGHT_OFFSET
    )}
  >
    <CaretDown
      size={15}
      className="text-2xs menu-item-show:hidden menu-link-hover:!text-primary"
    />
    <CaretUp
      size={15}
      className="text-2xs hidden menu-item-show:inline-flex menu-link-hover:!text-primary"
    />
  </MenuArrow>
));
ArrowIcon.displayName = "ArrowIcon";

const SoonBadge = () => (
  <MenuBadge className={RIGHT_OFFSET}>
    <span className="badge badge-xs">Soon</span>
  </MenuBadge>
);

const Bullet = () => (
  <Circle
    size={8}
    weight="fill"
    className="text-gray-600 menu-item-active:text-primary menu-link-hover:!text-primary"
  />
);

/* -------------------------------------------------------------------------- */
/*                                  MAIN MENU                                 */
/* -------------------------------------------------------------------------- */
const SidebarMenu = () => {
  const { getMenuConfig } = useMenus();
  const menuConfig = getMenuConfig("primary") || [];

  /**
   * Generate a stable, unique React key for each node even when id/title/path are absent.
   * We include the array index as a last‑ditch fallback to guarantee uniqueness.
   */

  const buildKey = (item, level, idx) =>
    item.id ?? `${level}-${idx}-${item.title ?? "nt"}-${item.path ?? "np"}`;

  const renderItem = useCallback((item, level = 0, idx = 0) => {
    const key = buildKey(item, level, idx);

    /* ------------------------------ HEADINGS ------------------------------ */

    if (item.heading) {
      return (
        <MenuItem key={key} className="mb-2 mt-7">
          <MenuHeading
            className={clsx(
              "tracking-wider uppercase text-2sm mb-2 font-semibold text-black"
            )}
          >
            {item.heading}
          </MenuHeading>
        </MenuItem>
      );
    }

    /* ------------------------------ DISABLED ------------------------------ */
    if (item.disabled) {
      return (
        <MenuItem key={key}>
          <MenuLabel
            className={clsx(
              "border border-transparent",
              gapByLevel(level),
              level === 0 ? PY : SUB_PY,
              PL,
              PR
            )}
          >
            {item.icon && (
              <MenuIcon
                className={clsx(
                  "items-start text-gray-500 dark:text-gray-400",
                  ICON_W
                )}
              >
                <RenderCoreIcon
                  weight="duotone"
                  name={item.icon}
                  className={ICON_SIZE}
                />
              </MenuIcon>
            )}
            <MenuTitle className="tracking-wider text-2sm font-medium text-gray-800">
              {item.title}
            </MenuTitle>
            <SoonBadge />
          </MenuLabel>
        </MenuItem>
      );
    }

    /* ---------------------------- WITH CHILDREN --------------------------- */

    if (item.children?.length) {
      return (
        <MenuItem
          key={key}
          {...(item.toggle && { toggle: item.toggle })}
          {...(item.trigger && { trigger: item.trigger })}
          className={clsx(item.collapse && "flex-col-reverse")}
        >
          <MenuLink
            path={item.path}
            className={clsx(
              "flex items-center grow cursor-pointer border border-transparent",
              level === 0 ? PY : SUB_PY,
              gapByLevel(level),
              level === 0 ? PL : "ps-[10px]",
              PR
            )}
          >
            {level === 0 ? (
              <MenuIcon
                className={clsx(
                  "items-start text-gray-600 dark:text-gray-400",
                  ICON_W
                )}
              >
                {item.icon && (
                  <RenderCoreIcon
                    weight="duotone"
                    name={item.icon}
                    className={ICON_SIZE}
                  />
                )}
              </MenuIcon>
            ) : (
              <Bullet />
            )}
            {item.collapse ? (
              <MenuTitle className="tracking-wider text-2sm font-medium bg-red-200 text-gray-800 dark:text-gray-500">
                <span className="hidden menu-item-show:!flex">
                  {item.collapseTitle}
                </span>
                <span className="flex menu-item-show:hidden">
                  {item.expandTitle}
                </span>
              </MenuTitle>
            ) : (
              <MenuTitle className="tracking-wider text-2sm font-medium text-gray-800 menu-item-active:text-primary menu-link-hover:!text-primary">
                {item.title}
              </MenuTitle>
            )}
            <ArrowIcon />
          </MenuLink>

          <MenuSub className={clsx(gapByLevel(level), plByLevel(level))}>
            {item.children.map((child, childIdx) =>
              renderItem(child, item.collapse ? level : level + 1, childIdx)
            )}
          </MenuSub>
        </MenuItem>
      );
    }

    /* --------------------------- LEAF NAV ITEM ---------------------------- */

    return (
      <MenuItem key={key}>
        <MenuLink
          path={item.path}
          className={clsx(
            "mb-0.5 border border-transparent items-center grow menu-item-active:bg-gray-200 menu-item-active:rounded-lg hover:bg-gray-200 hover:rounded-lg",
            gapByLevel(level),
            level === 0 ? PY : SUB_PY,
            level === 0 ? PL : "ps-[10px]",
            PR
          )}
        >
          {level === 0 ? (
            <MenuIcon
              className={clsx(
                "items-start text-gray-600 dark:text-gray-500",
                ICON_W
              )}
            >
              {item.icon && (
                <RenderCoreIcon
                  weight="duotone"
                  name={item.icon}
                  className={ICON_SIZE}
                />
              )}
            </MenuIcon>
          ) : (
            <Bullet />
          )}
          <MenuTitle className="tracking-wider text-2sm font-medium text-gray-800 menu-item-active:text-primary menu-link-hover:!text-primary">
            {item.title}
          </MenuTitle>
        </MenuLink>
      </MenuItem>
    );
  }, []);

  if (!menuConfig.length) return null;

  return (
    <>
      <Menu
        highlight
        multipleExpand={false}
        className={clsx("flex flex-col grow")}
      >
        {menuConfig.map((item, idx) => renderItem(item, 0, idx))}
      </Menu>
    </>
  );
};

export { SidebarMenu };
