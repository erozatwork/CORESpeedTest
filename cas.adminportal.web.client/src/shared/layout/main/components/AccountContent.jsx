import { Key, SignOut, UserRectangle } from "@phosphor-icons/react";
import { useMenu } from "@shared/components/_custom/menu/useMenu";
import {
  DropdownMenuSub,
  DropdownMenuSeparator,
} from "@shared/components/ui/dropdown-menu";
import { Button } from "@shared/components/ui/button";
import { useAuthContext } from "@features/auth/useAuthContext";

const getInitials = (u) => {
  if (!u) return "?";
  const first = u.firstName || u.FirstName || "";
  const last = u.lastName || u.LastName || "";
  if (first || last) {
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
  }
  const full = u.fullName || u.FullName || "";
  if (full.trim()) {
    return full
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
  const email = u.email || u.Email || "";
  return email.charAt(0).toUpperCase() || "?";
};

const getFullName = (u) => {
  if (!u) return "User";
  const first = u.firstName || u.FirstName || "";
  const last = u.lastName || u.LastName || "";
  const full = `${first} ${last}`.trim();
  return full || u.fullName || u.FullName || u.email || u.Email || "User";
};

/** Simple avatar circle — does NOT use Radix AvatarImage to avoid the
 *  src="" onLoad bug that hides AvatarFallback */
const UserAvatar = ({ initials, size = "sm" }) => {
  const dim = size === "lg" ? "h-10 w-10 text-sm" : "h-8 w-8 text-xs";
  return (
    <div
      className={`inline-flex items-center justify-center rounded-full bg-primary text-white font-semibold shrink-0 ${dim}`}
    >
      {initials}
    </div>
  );
};

const AccountContent = () => {
  const { ViewMenu } = useMenu();
  const { user, logout } = useAuthContext();

  // Fallback to localStorage if context user is null
  const effectiveUser = user || (() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  })();

  const initials = getInitials(effectiveUser);
  const fullName = getFullName(effectiveUser);
  const email = effectiveUser?.email || effectiveUser?.Email || "";

  const Content = () => (
    <>
      <DropdownMenuSub>
        <div className="flex gap-2 p-2">
          <Button
            variant="ghost"
            className="bg-smoke rounded-lg w-full dark:bg-dark"
          >
            <UserRectangle size={40} weight="duotone" />
            View my Profile
          </Button>
        </div>
      </DropdownMenuSub>
      <DropdownMenuSub>
        <div className="flex gap-2 p-2">
          <Button
            variant="ghost"
            className="bg-smoke rounded-lg w-full dark:bg-dark"
          >
            <Key size={32} weight="duotone" />
            Change Password
          </Button>
        </div>
        <DropdownMenuSeparator />
      </DropdownMenuSub>
    </>
  );

  return (
    <>
      <ViewMenu
        icon={<UserAvatar initials={initials} size="sm" />}
        label={
          <div className="flex items-center gap-3">
            <UserAvatar initials={initials} size="lg" />
            <div className="flex flex-col">
              <span className="text-sm font-semibold">{fullName}</span>
              <span className="text-xs text-muted-foreground">{email}</span>
            </div>
          </div>
        }
        buttonClass="rounded-full bg-transparent p-0 h-9 w-9 flex items-center justify-center"
        className="w-72 backdrop-blur-lg bg-white/80 dark:bg-[#141A21]/60"
      >
        <Content />
        <div className="flex gap-2 p-2">
          <Button
            onClick={() => logout()}
            className="bg-primary rounded-lg w-full hover:bg-primary-active"
          >
            <SignOut size={32} weight="duotone" />
            Sign Out
          </Button>
        </div>
      </ViewMenu>
    </>
  );
};

export { AccountContent };
