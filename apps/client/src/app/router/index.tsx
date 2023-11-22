import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home, Roller, Settings, Profile } from '../pages';

export const routes = [
  {
    path: '/',
    name: 'home',
    icon: 'dice',
    element: <Roller />,
  },
  {
    path: '/settings',
    name: 'settings',
    icon: 'cogs',
    element: <Settings />,
  },
  {
    path: '/profile',
    name: 'profile',
    icon: 'astronaut',
    element: <Profile />,
  },
];

const Router: React.FC = () => {
  return (
    <Routes>
      {routes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}
    </Routes>
  );
};

export default Router;
