import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { registeredModels } from "../../configs/modelRegistry";
 
type Props = {
  activeModel: string;
  onModelSelect: (model: string) => void;
  children: React.ReactNode;
};
 
const AdminLayout = ({ activeModel, onModelSelect, children }: Props) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
 
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        models={registeredModels}
        activeModel={activeModel}
        onSelect={onModelSelect}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
      />
 
      {/* Main content */}
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