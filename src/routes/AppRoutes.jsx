import { useRoutes } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../Client.js";

import AddCreator from "../Layouts/pages/Creators/AddCreator";
import EditCreator from "../Layouts/pages/Creators/EditCreator";
import ShowCreators from "../Layouts/pages/Creators/ShowCreators";
import ViewCreators from "../Layouts/pages/Creators/ViewCreators.jsx";
import DeleteCreator from "../Layouts/pages/Creators/DeleteCreator.jsx";

import Home from "../Layouts/pages/Home";
import Login from "../Layouts/pages/Auth/Login";
import Signup from "../Layouts/pages/Auth/signup";

import ProtectedRoute from "../Components/ProtectedRoute.jsx";
import MainLayout from "../Layouts/MainLayout.jsx";
import Profile from "../Layouts/pages/Creators/Profile.jsx";



const AppRoutes = () => {

  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user || null);
    });
  }, []);


  let element = useRoutes([
    {
      path: "/",
      element: <MainLayout />,   
      children: [
        { index: true, element: <Home /> },

        { path: "login", element: <Login /> },
        { path: "signup", element: <Signup /> },

        {
          path: "profile",
          element: (
            <ProtectedRoute>
              <Profile user={user} />
            </ProtectedRoute>
          ),
        },

        {
          path: "creators",
          children: [
            { 
              index: true, 
              element: (
                <ProtectedRoute>
                  <ShowCreators user={user} />
                </ProtectedRoute>
              )
            },
            { 
              path: "add", 
              element: (
                <ProtectedRoute>
                  <AddCreator user={user} />
                </ProtectedRoute>
              )
            },
            { 
              path: "edit/:id", 
              element: (
                <ProtectedRoute>
                  <EditCreator user={user} />
                </ProtectedRoute>
              )
            },
            { 
              path: ":id", 
              element: (
                <ProtectedRoute>
                  <ViewCreators user={user} />
                </ProtectedRoute>
              )
            },
            { 
              path: "delete/:id", 
              element: (
                <ProtectedRoute>
                  <DeleteCreator user={user} />
                </ProtectedRoute>
              )
            },
            { 
              path: "profile/:creatorId", 
              element: (
                <ProtectedRoute>
                  <Profile user={user} />
                </ProtectedRoute>
              )
            },
          ],
        },
      ],
    },

    { path: "*", element: <div>404 - Page Not Found</div> },
  ]);

  return element;
};

export default AppRoutes;
