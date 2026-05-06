// components/layout/AdminLayout.tsx — senior level optimised
 
import { useState, useCallback, useMemo } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header  from "./Header";
import { useModels } from "../../hooks/useModels";
import { Suspense } from "react";
 
// ── Constants ─────────────────────────────────────────────────────
// Avoids magic string "__builder__" scattered across components
const BUILDER_KEY = "__builder__" as const;

const PageSpinner = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
  </div>
);
 
// ── Component ─────────────────────────────────────────────────────
// No children prop — uses <Outlet /> since migrated to RR v7
const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
 
  const { data: models = [], isLoading } = useModels();
 
  // useMemo — only recomputes when pathname changes, not every render
  const activeModel = useMemo(() => {
    const segment = location.pathname.split("/")[1];
    // match against backend model list, fallback to raw segment
    // handles /builder, /users, /products etc. correctly
    return models.find((m) => m.name === segment)?.name ?? segment;
  }, [location.pathname, models]);
 
  // useCallback — stable reference, prevents Sidebar re-render on every keystroke
  const handleModelSelect = useCallback(
    (model: string) => {
      if (model === BUILDER_KEY) {
        navigate("/builder");
        return;
      }
      navigate(`/${model}`);
    },
    [navigate]
  );
 
  // useCallback — stable reference for toggle handler
  const handleToggleCollapse = useCallback(
    () => setIsCollapsed((prev) => !prev),
    []
  );
 
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar
        models={models}
        activeModel={activeModel}
        onSelect={handleModelSelect}
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
        isLoading={isLoading}
      />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header activeModel={activeModel} />
        <main className="flex-1 overflow-y-auto">
          <Suspense fallback={<PageSpinner />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
};
 
export default AdminLayout;
 