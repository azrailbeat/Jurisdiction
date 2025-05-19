import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Document, VerificationIssue } from "@/types";

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState("30days");
  
  const { data: documents } = useQuery<Document[]>({
    queryKey: ["/api/documents"],
  });

  const { data: issues } = useQuery<VerificationIssue[]>({
    queryKey: ["/api/verification/issues"],
  });

  // Status Distribution (Document Status)
  const documentStatusData = React.useMemo(() => {
    if (!documents) return [];
    const statuses: Record<string, number> = {};
    
    documents.forEach((doc) => {
      statuses[doc.status] = (statuses[doc.status] || 0) + 1;
    });
    
    return Object.entries(statuses).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
    }));
  }, [documents]);

  // Issue Distribution (Verification Issues)
  const issueStatusData = React.useMemo(() => {
    if (!issues) return [];
    const statuses: Record<string, number> = {};
    
    issues.forEach((issue) => {
      statuses[issue.status] = (statuses[issue.status] || 0) + 1;
    });
    
    return Object.entries(statuses).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
    }));
  }, [issues]);

  // Issue Severity Distribution
  const issueSeverityData = React.useMemo(() => {
    if (!issues) return [];
    const severities: Record<string, number> = {};
    
    issues.forEach((issue) => {
      severities[issue.severity] = (severities[issue.severity] || 0) + 1;
    });
    
    return Object.entries(severities).map(([severity, count]) => ({
      name: severity.charAt(0).toUpperCase() + severity.slice(1),
      value: count,
    }));
  }, [issues]);

  // Document Activity Data (mocked data for example)
  const activityData = [
    { month: 'Jan', creations: 4, updates: 12, verifications: 8 },
    { month: 'Feb', creations: 3, updates: 9, verifications: 7 },
    { month: 'Mar', creations: 5, updates: 15, verifications: 10 },
    { month: 'Apr', creations: 2, updates: 8, verifications: 5 },
    { month: 'May', creations: 6, updates: 18, verifications: 12 },
    { month: 'Jun', creations: 4, updates: 14, verifications: 9 },
  ];

  // Verification Trend Data (mocked data for example)
  const verificationTrendData = [
    { date: '2023-01-01', issues: 12, resolved: 8 },
    { date: '2023-02-01', issues: 15, resolved: 10 },
    { date: '2023-03-01', issues: 18, resolved: 14 },
    { date: '2023-04-01', issues: 14, resolved: 11 },
    { date: '2023-05-01', issues: 13, resolved: 10 },
    { date: '2023-06-01', issues: 19, resolved: 12 },
  ];

  // Color schemes
  const COLORS = ['#0078d4', '#107c10', '#5c2d91', '#a4262c', '#ca5010'];
  const STATUS_COLORS = {
    'Active': '#107c10',  // Secondary/success
    'Draft': '#605e5c',   // Neutral
    'Review': '#ca5010',  // Warning
    'Archived': '#a19f9d', // Neutral lighter
  };
  
  const ISSUE_STATUS_COLORS = {
    'Open': '#ca5010',     // Warning
    'Resolved': '#107c10', // Success
    'Ignored': '#605e5c',  // Neutral
  };
  
  const SEVERITY_COLORS = {
    'Error': '#a4262c',    // Error
    'Warning': '#ca5010',  // Warning
    'Info': '#0078d4',     // Primary
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Time Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 Days</SelectItem>
            <SelectItem value="30days">Last 30 Days</SelectItem>
            <SelectItem value="90days">Last 90 Days</SelectItem>
            <SelectItem value="year">Last Year</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Document Overview</CardTitle>
            <CardDescription>Total documents by status</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={documentStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {documentStatusData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={STATUS_COLORS[entry.name as keyof typeof STATUS_COLORS] || COLORS[index % COLORS.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Verification Issues</CardTitle>
            <CardDescription>Issues by status</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={issueStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {issueStatusData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={ISSUE_STATUS_COLORS[entry.name as keyof typeof ISSUE_STATUS_COLORS] || COLORS[index % COLORS.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Issue Severity</CardTitle>
            <CardDescription>Distribution by severity level</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={issueSeverityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {issueSeverityData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={SEVERITY_COLORS[entry.name as keyof typeof SEVERITY_COLORS] || COLORS[index % COLORS.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Document Activity</CardTitle>
            <CardDescription>Document operations over time</CardDescription>
          </CardHeader>
          <CardContent className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={activityData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="creations" name="Created" fill="#0078d4" />
                <Bar dataKey="updates" name="Updated" fill="#5c2d91" />
                <Bar dataKey="verifications" name="Verified" fill="#107c10" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Verification Trend</CardTitle>
            <CardDescription>Issues identified vs. resolved over time</CardDescription>
          </CardHeader>
          <CardContent className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={verificationTrendData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="issues"
                  name="Issues Identified"
                  stroke="#ca5010"
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="resolved"
                  name="Issues Resolved"
                  stroke="#107c10"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Analytics;
