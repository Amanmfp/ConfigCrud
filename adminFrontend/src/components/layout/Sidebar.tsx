import { memo, useCallback }       from "react";
import type { ModelMeta }          from "../../hooks/useModels";

const BUILDER_KEY   = "__builder__" as const;
const SKELETON_ROWS = 4;

type Props = {
  models:           ModelMeta[];
  activeModel:      string;
  onSelect:         (model: string) => void;
  isCollapsed:      boolean;
  onToggleCollapse: () => void;
  isLoading?:       boolean;
};

type IconProps = { active: boolean };

const iconClass = (active: boolean) =>
  `w-5 h-5 ${active ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-600"}`;

const UsersIcon   = ({ active }: IconProps) => (
  <svg className={iconClass(active)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const PackageIcon = ({ active }: IconProps) => (
  <svg className={iconClass(active)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const ShoppingIcon = ({ active }: IconProps) => (
  <svg className={iconClass(active)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

const DefaultIcon  = ({ active }: IconProps) => (
  <svg className={iconClass(active)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
      d="M4 6h16M4 10h16M4 14h16M4 18h7" />
  </svg>
);

// Maps icon key 
const ICON_MAP: Record<string, React.ComponentType<IconProps>> = {
  users:    UsersIcon,
  package:  PackageIcon,
  shopping: ShoppingIcon,
};

const getIcon = (iconKey?: string): React.ComponentType<IconProps> =>
  ICON_MAP[iconKey ?? ""] ?? DefaultIcon;

const ActiveBar = () => (
  <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-l-full bg-indigo-600" />
);

// ── Skeleton loader ───────────────────────────────────────────────
const SkeletonNav = ({ isCollapsed }: { isCollapsed: boolean }) => (
  <>
    {Array.from({ length: SKELETON_ROWS }, (_, i) => (
      <div
        key={i}
        className={`h-10 rounded-lg bg-gray-100 animate-pulse mx-1 ${
          isCollapsed ? "w-10" : "w-full"
        }`}
      />
    ))}
  </>
);

// ── NavButton ─────────────────────────────────────────────────────
type NavButtonProps = {
  name:        string;
  label:       string;
  icon?:       string;
  active:      boolean;
  isCollapsed: boolean;
  onClick:     () => void;
};

const NavButton = memo(({
  label, icon, active, isCollapsed, onClick,
}: NavButtonProps) => {
  const Icon = getIcon(icon);
  return (
    <button
      onClick={onClick}
      title={isCollapsed ? label : undefined}
      className={`group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
        text-sm font-medium transition-all duration-150 text-left
        ${active
          ? "bg-indigo-50 text-indigo-700"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        }`}
    >
      <span className="shrink-0"><Icon active={active} /></span>
      {!isCollapsed && <span className="truncate">{label}</span>}
      {active && <ActiveBar />}
    </button>
  );
});

// ── Sidebar ───────────────────────────────────────────────────────
const Sidebar = memo(({
  models,
  activeModel,
  onSelect,
  isCollapsed,
  onToggleCollapse,
  isLoading,
}: Props) => {

  const handleBuilderClick = useCallback(
    () => onSelect(BUILDER_KEY),
    [onSelect]
  );

  return (
    <aside
      className={`relative h-screen bg-white border-r border-gray-200 flex flex-col
        transition-all duration-300 ease-in-out
        ${isCollapsed ? "w-16" : "w-60"}`}
    >
      {/* Logo */}
      <div className={`h-16 flex items-center border-b border-gray-100 shrink-0
        ${isCollapsed ? "justify-center" : "px-5 gap-3"}`}
      >
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        </div>
        {!isCollapsed && (
          <span className="text-sm font-bold text-gray-900 tracking-tight">Admin Panel</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        <div className="border-b border-gray-100 pb-2 mb-2">
          <NavButton
            name="builder"
            label="Model Builder"
            icon="builder"
            active={activeModel === "builder"}
            isCollapsed={isCollapsed}
            onClick={handleBuilderClick}
          />
        </div>

        {!isCollapsed && (
          <p className="px-3 pb-1 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
            Models
          </p>
        )}

        {/* Model list or skeleton */}
        {isLoading ? (
          <SkeletonNav isCollapsed={isCollapsed} />
        ) : (
          models.map((model) => (
            <NavButton
              key={model.name}
              name={model.name}
              label={model.label}
              icon={model.icon}
              active={activeModel === model.name}
              isCollapsed={isCollapsed}
              onClick={() => onSelect(model.name)}
            />
          ))
        )}
      </nav>

      {/* Collapse toggle */}
      <div className="shrink-0 border-t border-gray-100 p-2">
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg
            text-xs text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition"
        >
          <svg
            className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
          {!isCollapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
});

export default Sidebar;