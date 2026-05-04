import { useState } from "react";
import { Toaster } from "sonner";
import AdminLayout from "./components/layout/AdminLayout";
import ModelPage from "./pages/ModelPage";
import { registeredModels } from "./configs/modelRegistry";
 
const App = () => {
  // ← explicitly typed as string, not the literal "users"
  const [activeModel, setActiveModel] = useState<string>(registeredModels[0].name);
 
  return (
    <>
      <AdminLayout
        activeModel={activeModel}
        onModelSelect={setActiveModel}
      >
        <ModelPage key={activeModel} model={activeModel} />
      </AdminLayout>
 
      <Toaster position="bottom-right" richColors closeButton duration={4000} />
    </>
  );
};
 
export default App;
 