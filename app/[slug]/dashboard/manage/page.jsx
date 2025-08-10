"use client";
import { useRouter } from "next/router";

const ManagePage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const restaurant = { slug }; // Assuming restaurant data is fetched or passed here

  return (
    <div>
      <h1>Manage Dashboard</h1>
      <div>
        <h2>Settings</h2>
        <p>Your restaurant URL:</p>
        <code className="block mt-2 p-2 bg-gray-100 rounded text-sm">
          https://cq-menu.com/{restaurant.slug}
        </code>
        <p>Your dashboard URL:</p>
        <code className="block mt-2 p-2 bg-gray-100 rounded text-sm">
          https://cq-menu.com/{restaurant.slug}/dashboard/manage
        </code>
      </div>
      {/* rest of code here */}
    </div>
  );
};

export default ManagePage;
