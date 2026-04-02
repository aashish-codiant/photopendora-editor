import {
  Home,
  Login,
  Assets,
  Orders,
  Designs,
  Products,
  NotFound,
  ProductDetail,
} from "./pages";
import { Routes, Route } from "react-router";
import MainLayout from "./layouts/MainLayout";
import EditorPage from "./features/editor/Editor";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/editor" element={<EditorPage mode="customize" />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="assets" element={<Assets />} />
          <Route path="orders" element={<Orders />} />
          <Route path="designs" element={<Designs />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:id" element={<ProductDetail />} />

          {/* Admin Editor routes */}
          <Route path="editor">
            <Route path="create" element={<EditorPage mode="create" />} />
            <Route path=":id" element={<EditorPage mode="edit" />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
    </Routes>
  );
}
