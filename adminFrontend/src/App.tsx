import { Routes, Route, Navigate, useParams } from "react-router-dom";
import { Toaster } from "sonner";
import AdminLayout from "./components/layout/AdminLayout";
import ListPage   from "./pages/model/ListPage";
import CreatePage from "./pages/model/CreatePage";
import EditPage   from "./pages/model/EditPage";
import DetailPage from "./pages/model/DetailPage";
import { registeredModels } from "./configs/modelRegistry";
 
// Wrapper components that pull :model and :id from URL params
// and connect them to the relevant page component
 
const ListPageWrapper = () => {
  const { model } = useParams<{ model: string }>();
  if (!model) return null;
  return <ListPage model={model} />;
};
 
const CreatePageWrapper = () => {
  const { model } = useParams<{ model: string }>();
  if (!model) return null;
  return <CreatePage model={model} />;
};
 
const EditPageWrapper = () => {
  const { model, id } = useParams<{ model: string; id: string }>();
  if (!model || !id) return null;
  return <EditPage model={model} id={Number(id)} />;
};
 
const DetailPageWrapper = () => {
  const { model, id } = useParams<{ model: string; id: string }>();
  if (!model || !id) return null;
  return <DetailPage model={model} id={Number(id)} />;
};
 
const App = () => (
  <>
    <AdminLayout>
      <Routes>
        {/* Default redirect to first model */}
        <Route path="/" element={<Navigate to={`/${registeredModels[0].name}`} replace />} />
 
        {/* Model routes */}
        <Route path="/:model"             element={<ListPageWrapper />} />
        <Route path="/:model/create"      element={<CreatePageWrapper />} />
        <Route path="/:model/:id"         element={<DetailPageWrapper />} />
        <Route path="/:model/:id/edit"    element={<EditPageWrapper />} />
 
        {/* 404 fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AdminLayout>
 
    <Toaster position="bottom-right" richColors closeButton duration={4000} />
  </>
);
 
export default App;
 