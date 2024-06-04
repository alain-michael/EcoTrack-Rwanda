import React from 'react';
import { Outlet } from 'react-router-dom';

function MapLayout() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

export default MapLayout;
