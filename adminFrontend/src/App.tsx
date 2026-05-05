// import { Routes, Route, Navigate, useParams } from "react-router-dom";
// import { Toaster } from "sonner";
// import AdminLayout from "./components/layout/AdminLayout";
// import ListPage from "./pages/model/ListPage";
// import CreatePage from "./pages/model/CreatePage";
// import EditPage from "./pages/model/EditPage";
// import DetailPage from "./pages/model/DetailPage";
// import { registeredModels } from "./configs/modelRegistry";
// import ModelBuilderPage from "./pages/ModelBuilderPage";
// import ModelFormBuilderPage from "./pages/ModelFormBuilderPage";

// // Wrapper components that pull :model and :id from URL params
// // and connect them to the relevant page component

// const ListPageWrapper = () => {
//   const { model } = useParams<{ model: string }>();
//   if (!model) return null;
//   return <ListPage model={model} />;
// };

// const CreatePageWrapper = () => {
//   const { model } = useParams<{ model: string }>();
//   if (!model) return null;
//   return <CreatePage model={model} />;
// };

// const EditPageWrapper = () => {
//   const { model, id } = useParams<{ model: string; id: string }>();
//   if (!model || !id) return null;
//   return <EditPage model={model} id={Number(id)} />;
// };

// const DetailPageWrapper = () => {
//   const { model, id } = useParams<{ model: string; id: string }>();
//   if (!model || !id) return null;
//   return <DetailPage model={model} id={Number(id)} />;
// };

// const App = () => (
//   <>
//     <AdminLayout>
//       <Routes>
//         {/* Default redirect to first model */}
//         <Route path="/" element={<Navigate to={`/${registeredModels[0].name}`} replace />} />

//         {/* Add these routes inside <Routes>: */}
//         <Route path="/builder" element={<ModelBuilderPage />} />
//         <Route path="/builder/create" element={<ModelFormBuilderPage mode="create" />} />
//         <Route path="/builder/:modelName/edit" element={<ModelFormBuilderPage mode="edit" />} />

//         {/* Model routes */}
//         <Route path="/:model" element={<ListPageWrapper />} />
//         <Route path="/:model/create" element={<CreatePageWrapper />} />
//         <Route path="/:model/:id" element={<DetailPageWrapper />} />
//         <Route path="/:model/:id/edit" element={<EditPageWrapper />} />

//         {/* 404 fallback */}
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </AdminLayout>

//     <Toaster position="bottom-right" richColors closeButton duration={4000} />
//   </>
// );

// export default App;

// App.tsx

import { Routes, Route, Navigate, useParams } from "react-router-dom";
import { Toaster } from "sonner";
import AdminLayout          from "./components/layout/AdminLayout";
import ListPage             from "./pages/model/ListPage";
import CreatePage           from "./pages/model/CreatePage";
import EditPage             from "./pages/model/EditPage";
import DetailPage           from "./pages/model/DetailPage";
import ModelBuilderPage     from "./pages/ModelBuilderPage";
import ModelFormBuilderPage from "./pages/ModelFormBuilderPage";
import { useModels }        from "./hooks/useModels";

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
  return <EditPage model={model} id={id} />;
};

const DetailPageWrapper = () => {
  const { model, id } = useParams<{ model: string; id: string }>();
  if (!model || !id) return null;
  // return <DetailPage model={model} id={id} />;
  return;
};

const AppRoutes = () => {
  const { data: models = [], isLoading } = useModels();

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading admin panel...</p>
        </div>
      </div>
    );

  const firstModel = models[0]?.name ?? "builder";

  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Navigate to={`/${firstModel}`} replace />} />
        <Route path="/builder"                 element={<ModelBuilderPage />} />
        <Route path="/builder/create"          element={<ModelFormBuilderPage mode="create" />} />
        <Route path="/builder/:modelName/edit" element={<ModelFormBuilderPage mode="edit" />} />
        <Route path="/:model"          element={<ListPageWrapper />} />
        <Route path="/:model/create"   element={<CreatePageWrapper />} />
        <Route path="/:model/:id"      element={<DetailPageWrapper />} />
        <Route path="/:model/:id/edit" element={<EditPageWrapper />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AdminLayout>
  );
};

const App = () => (
  <>
    <AppRoutes />
    <Toaster position="bottom-right" richColors closeButton duration={4000} />
  </>
);

export default App;
