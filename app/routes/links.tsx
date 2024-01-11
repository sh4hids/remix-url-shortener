import { Outlet } from "@remix-run/react";

export default function Links() {
  return (
    <div className="container mx-auto py-6">
      <Outlet />
    </div>
  );
}
