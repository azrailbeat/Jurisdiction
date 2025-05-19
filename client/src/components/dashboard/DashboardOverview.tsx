import React from "react";
import RecentDocuments from "./RecentDocuments";
import RecentActivity from "./RecentActivity";
import VerificationQueue from "./VerificationQueue";

const DashboardOverview: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <RecentDocuments />
      <RecentActivity />
      <VerificationQueue />
    </div>
  );
};

export default DashboardOverview;
