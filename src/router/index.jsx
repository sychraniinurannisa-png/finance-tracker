import { createBrowserRouter } from "react-router-dom";

import { Dashboard } from "../pages/Dashboard";
import { Income } from "../pages/Income";
import { Expense } from "../pages/Expense";
import { Category } from "../pages/Category";
import { Profile } from "../pages/Profile";
import { Login } from "../pages/Login";

const router = createBrowserRouter([
  {
    path: "login",
    element: <Login/>,
  },
  {
    path: "/",
    element: <Dashboard/>,
  },
  {
    path: "/pemasukan",
    element: <Income/>,
  },
  {
    path: "/pengeluaran",
    element: <Expense/>,
  },
  {
    path: "/kategori",
    element: <Category/>,
  },
  {
    path: "/profil",
    element: <Profile/>,
  },
]);

export default router;