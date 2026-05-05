// // components/layout/AdminLayout.tsx

// import { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import Sidebar from "./Sidebar";
// import Header  from "./Header";
// import { registeredModels } from "../../configs/modelRegistry";

// type Props = {
//   children: React.ReactNode;
// };

// const AdminLayout = ({ children }: Props) => {
//   const navigate  = useNavigate();
//   const location  = useLocation();
//   const [isCollapsed, setIsCollapsed] = useState(false);

//   // pathname is "/:model", "/:model/create", "/:model/:id/edit" etc.
//   // first segment is always the model name
//   const modelFromPath = location.pathname.split("/")[1];

//   const activeModel =
//     registeredModels.find((m) => m.name === modelFromPath)?.name ??
//     registeredModels[0].name;

//   const handleModelSelect = (model: string) => {
//     if (model === "__builder__") { navigate("/builder"); return; }
//     navigate(`/${model}`);
//   };

//   return (
//     <div className="flex h-screen bg-gray-50 overflow-hidden">
//       <Sidebar
//         models={registeredModels}
//         activeModel={activeModel}
//         onSelect={handleModelSelect}
//         isCollapsed={isCollapsed}
//         onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
//       />
//       <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
//         <Header activeModel={activeModel} />
//         <main className="flex-1 overflow-y-auto">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// };

// export default AdminLayout;

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header  from "./Header";
import { useModels } from "../../hooks/useModels";
 
type Props = {
  children: React.ReactNode;
};
 
const AdminLayout = ({ children }: Props) => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
 
  // ← fetch models from backend, not hardcoded array
  const { data: models = [], isLoading } = useModels();
 
  const modelFromPath = location.pathname.split("/")[1];
 
  // active model — match against dynamic list from backend
  const activeModel =
    models.find((m) => m.name === modelFromPath)?.name ??
    modelFromPath; // fallback to path segment (handles /builder etc.)
 
  const handleModelSelect = (model: string) => {
    if (model === "__builder__") { navigate("/builder"); return; }
    navigate(`/${model}`);
  };
 
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar
        models={models}             // ← dynamic from backend
        activeModel={activeModel}
        onSelect={handleModelSelect}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
        isLoading={isLoading}       // ← show skeleton while loading
      />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header activeModel={activeModel} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
 
export default AdminLayout;
 