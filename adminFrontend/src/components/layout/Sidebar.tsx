
// import type { JSX } from "react/jsx-runtime";
// import type { RegisteredModel } from "../../configs/modelRegistry";

// type Props = {
//   models: readonly RegisteredModel[];  // ← readonly, matches "as const" array
//   activeModel: string;
//   onSelect: (model: string) => void;
//   isCollapsed: boolean;
//   onToggleCollapse: () => void;
// };

// const icons: Record<string, (active: boolean) => JSX.Element> = {
//   users: (active) => (
//     <svg className={`w-5 h-5 ${active ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-600"}`}
//       fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
//         d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
//     </svg>
//   ),
//   package: (active) => (
//     <svg className={`w-5 h-5 ${active ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-600"}`}
//       fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
//         d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
//     </svg>
//   ),
//   shopping: (active) => (
//     <svg className={`w-5 h-5 ${active ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-600"}`}
//       fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
//         d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
//     </svg>
//   ),
// };

// const Sidebar = ({ models, activeModel, onSelect, isCollapsed, onToggleCollapse }: Props) => (
//   <aside
//     className={`relative h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out
//       ${isCollapsed ? "w-16" : "w-60"}`}
//   >
//     {/* Logo */}
//     <div className={`h-16 flex items-center border-b border-gray-100 shrink-0
//       ${isCollapsed ? "justify-center px-0" : "px-5 gap-3"}`}
//     >
//       <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0">
//         <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//             d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
//         </svg>
//       </div>
//       {!isCollapsed && (
//         <span className="text-sm font-bold text-gray-900 tracking-tight">Admin Panel</span>
//       )}
//     </div>

//     {/* Nav items */}
//     <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
//       {!isCollapsed && (
//         <p className="px-3 mb-2 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
//           Models
//         </p>
//       )}
//       {models.map((model) => {
//         const active = activeModel === model.name;
//         return (
//           <button
//             key={model.name}
//             onClick={() => onSelect(model.name)}
//             title={isCollapsed ? model.label : undefined}
//             className={`group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
//               font-medium transition-all duration-150 text-left
//               ${active
//                 ? "bg-indigo-50 text-indigo-700"
//                 : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
//               }`}
//           >
//             <span className="shrink-0">{icons[model.icon]?.(active)}</span>
//             {!isCollapsed && (
//               <span className="truncate">{model.label}</span>
//             )}
//             {/* Active indicator bar */}
//             {active && (
//               <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-l-full bg-indigo-600" />
//             )}
//           </button>
//         );
//       })}
//        <div className="border-t border-gray-100 pt-2 mt-2">
//         <button
//           onClick={() => onSelect("__builder__")}
//           className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
//        text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition"
//         >
//           <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
//               d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//           </svg>
//           {!isCollapsed && <span>Model Builder</span>}
//         </button>
//       </div>
//     </nav>

//     {/* Collapse toggle */}
//     <div className="shrink-0 border-t border-gray-100 p-2">
//       <button
//         onClick={onToggleCollapse}
//         className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg
//           text-xs text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition"
//       >
//         <svg
//           className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`}
//           fill="none" stroke="currentColor" viewBox="0 0 24 24"
//         >
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
//         </svg>
//         {!isCollapsed && <span>Collapse</span>}
//       </button>
//     </div>
//   </aside>
// );

// export default Sidebar;

import type { JSX } from "react/jsx-runtime";
import type { ModelMeta } from "../../hooks/useModels"; // ← dynamic type
 
type Props = {
  models:           ModelMeta[];    // ← no longer readonly RegisteredModel[]
  activeModel:      string;
  onSelect:         (model: string) => void;
  isCollapsed:      boolean;
  onToggleCollapse: () => void;
  isLoading?:       boolean;        // ← show skeleton while fetching
};
 
// Icon map — keyed by icon string from backend
// Backend sends { icon: "users" | "package" | "shopping" | ... }
// Any unknown icon falls back to DefaultIcon
const icons: Record<string, (active: boolean) => JSX.Element> = {
  users: (active) => (
    <svg className={`w-5 h-5 ${active ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-600"}`}
      fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  package: (active) => (
    <svg className={`w-5 h-5 ${active ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-600"}`}
      fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  shopping: (active) => (
    <svg className={`w-5 h-5 ${active ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-600"}`}
      fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  ),
};
 
// Fallback icon for any model without a matching icon key
const DefaultIcon = ({ active }: { active: boolean }) => (
  <svg className={`w-5 h-5 ${active ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-600"}`}
    fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
      d="M4 6h16M4 10h16M4 14h16M4 18h7" />
  </svg>
);
 
const Sidebar = ({
  models,
  activeModel,
  onSelect,
  isCollapsed,
  onToggleCollapse,
  isLoading,
}: Props) => (
  <aside
    className={`relative h-screen bg-white border-r border-gray-200 flex flex-col
      transition-all duration-300 ease-in-out
      ${isCollapsed ? "w-16" : "w-60"}`}
  >
    {/* Logo */}
    <div className={`h-16 flex items-center border-b border-gray-100 shrink-0
      ${isCollapsed ? "justify-center px-0" : "px-5 gap-3"}`}
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
 
    {/* Nav items */}
    <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
      {!isCollapsed && (
        <p className="px-3 mb-2 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
          Models
        </p>
      )}
 
      {/* Loading skeleton — shown while useModels() fetches */}
      {isLoading ? (
        Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={`h-10 rounded-lg bg-gray-100 animate-pulse mx-1
              ${isCollapsed ? "w-10" : "w-full"}`}
          />
        ))
      ) : (
        <>
          {/* Dynamic model items from backend */}
          {models.map((model) => {
            const active  = activeModel === model.name;
            const IconFn  = icons[model.icon ?? ""] ?? ((a: boolean) => <DefaultIcon active={a} />);
 
            return (
              <button
                key={model.name}
                onClick={() => onSelect(model.name)}
                title={isCollapsed ? model.label : undefined}
                className={`group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                  text-sm font-medium transition-all duration-150 text-left
                  ${active
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
              >
                <span className="shrink-0">{IconFn(active)}</span>
                {!isCollapsed && (
                  <span className="truncate">{model.label}</span>
                )}
                {active && (
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-l-full bg-indigo-600" />
                )}
              </button>
            );
          })}
 
          {/* Model Builder link — always at bottom of model list */}
          <div className="border-t border-gray-100 pt-2 mt-2">
            <button
              onClick={() => onSelect("__builder__")}
              title={isCollapsed ? "Model Builder" : undefined}
              className={`group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                text-sm font-medium transition-all duration-150 text-left
                ${activeModel === "builder"
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
            >
              <svg
                className={`w-5 h-5 shrink-0 ${activeModel === "builder" ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-600"}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {!isCollapsed && <span>Model Builder</span>}
              {activeModel === "builder" && (
                <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-l-full bg-indigo-600" />
              )}
            </button>
          </div>
        </>
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
 
export default Sidebar;
