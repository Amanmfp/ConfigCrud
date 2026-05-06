import { lazy } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  useParams,
} from "react-router-dom";
import { Toaster } from "sonner";
import AdminLayout from "./components/layout/AdminLayout";
import NotFound from "./pages/NotFound";
const ListPage = lazy(() => import("./pages/model/ListPage"));
const CreatePage = lazy(() => import("./pages/model/CreatePage"));
const EditPage = lazy(() => import("./pages/model/EditPage"));
const DetailPage = lazy(() => import("./pages/model/DetailPage"));
const ModelBuilderPage = lazy(() => import("./pages/ModelBuilderPage"));
const ModelFormBuilderPage = lazy(() => import("./pages/ModelFormBuilderPage"));

const AppError = ({ message }: { message: string }) => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="text-center space-y-3">
      <p className="text-red-500 font-medium">Failed to load admin panel</p>
      <p className="text-sm text-gray-400">{message}</p>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
      >
        Retry
      </button>
    </div>
  </div>
);

const RootLayout = AdminLayout;

const ModelListPage = () => {
  const { model } = useParams<{ model: string }>();
  return model ? <ListPage model={model} /> : null;
};

const ModelCreatePage = () => {
  const { model } = useParams<{ model: string }>();
  return model ? <CreatePage model={model} /> : null;
};

const ModelEditPage = () => {
  const { model, id } = useParams<{ model: string; id: string }>();
  return model && id ? <EditPage model={model} id={id} /> : null;
};

const ModelDetailPage = () => {
  const { model, id } = useParams<{ model: string; id: string }>();
  return model && id ? <DetailPage model={model} id={id} /> : null;
};

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <AppError message="Something went wrong. Please refresh." />,
    children: [
      {
        index: true,
        element: <Navigate to="/builder" replace />,
      },
      {
        path: "builder",
        element: <ModelBuilderPage />,
      },
      {
        path: "builder/create",
        element: <ModelFormBuilderPage mode="create" />,
      },
      {
        path: "builder/:modelName/edit",
        element: <ModelFormBuilderPage mode="edit" />,
      },
      {
        path: ":model",
        element: <ModelListPage />,
      },
      {
        path: ":model/create",
        element: <ModelCreatePage />,
      },
      {
        path: ":model/:id/edit",
        element: <ModelEditPage />,
      },
      {
        path: ":model/:id",
        element: <ModelDetailPage />,
      },
      {
        path: "*",
        element: <NotFound />,
      }
    ],
  },
]);

const App = () => (
  <>
    <RouterProvider router={router} />
    <Toaster position="bottom-right" richColors closeButton duration={4000} />
  </>
);

export default App;
