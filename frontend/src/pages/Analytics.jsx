import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useProjectStore } from "../store/useProjectStore";
import { useUserStore } from "../store/useUserStore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  TrendingUp,
  Users,
  MessageSquare,
  Bookmark,
  Eye,
  Heart,
} from "lucide-react";

const Analytics = () => {
  const { user } = useAuthStore();
  const { projects, fetchProjects } = useProjectStore();
  const { getUserProjects } = useUserStore();
  const [userProjects, setUserProjects] = useState([]);

  useEffect(() => {
    if (user) {
      const loadUserData = async () => {
        try {
          const userProjectsData = await getUserProjects(user._id);
          setUserProjects(userProjectsData || []);
        } catch (error) {
          console.error("Failed to load user data:", error);
          setUserProjects([]);
        }
      };
      loadUserData();
    }
    fetchProjects();
  }, [user, getUserProjects, fetchProjects]);

  useEffect(() => {
    if (user) {
      getUserProjects(user._id).then(setUserProjects);
    }
  }, [projects, user, getUserProjects]);

  const totalLikes = userProjects.reduce(
    (sum, project) => sum + (project.likes?.length || 0),
    0
  );
  const totalComments = userProjects.reduce(
    (sum, project) => sum + (project.comments?.length || 0),
    0
  );
  const totalBookmarks = userProjects.reduce(
    (sum, project) => sum + (project.bookmarks?.length || 0),
    0
  ); // Count bookmarks on user's projects
  const totalViews = userProjects.reduce(
    (sum, project) => sum + (project.views || 0),
    0
  );

  const topProjects = projects
    .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
    .slice(0, 5)
    .map((project) => ({
      name: project.title.substring(0, 20) + "...",
      likes: project.likes?.length || 0,
      comments: project.comments?.length || 0,
      bookmarks: project.bookmarks?.length || 0,
    }));

  const categoryData = [
    { name: "Web Development", value: 35, color: "#3B82F6" },
    { name: "Mobile Apps", value: 25, color: "#10B981" },
    { name: "Data Analysis", value: 20, color: "#F59E0B" },
    { name: "AI", value: 15, color: "#EF4444" },
    { name: "Others", value: 5, color: "#8B5CF6" },
  ];

  const monthlyData = [
    { month: "Jan", projects: 4, likes: 45, comments: 23 },
    { month: "Feb", projects: 6, likes: 67, comments: 34 },
    { month: "Mar", projects: 8, likes: 89, comments: 45 },
    { month: "Apr", projects: 5, likes: 78, comments: 56 },
    { month: "May", projects: 9, likes: 123, comments: 67 },
    { month: "Jun", projects: 7, likes: 98, comments: 43 },
  ];

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600">
            Track your project performance and engagement metrics
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Projects"
            value={userProjects.length}
            icon={TrendingUp}
            color="bg-blue-500"
            subtitle="Published projects"
          />
          <StatCard
            title="Total Likes"
            value={totalLikes}
            icon={Heart}
            color="bg-red-500"
            subtitle="Across all projects"
          />
          <StatCard
            title="Total Comments"
            value={totalComments}
            icon={MessageSquare}
            color="bg-green-500"
            subtitle="Community engagement"
          />
          <StatCard
            title="Total Bookmarks"
            value={totalBookmarks}
            icon={Bookmark}
            color="bg-purple-500"
            subtitle="On your projects"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Top 5 Most Liked Projects
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topProjects}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Bar dataKey="likes" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Project Categories
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-2">
              {categoryData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full mr-2`}
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Monthly Growth
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="projects"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    dot={{ fill: "#3B82F6" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="likes"
                    stroke="#10B981"
                    strokeWidth={3}
                    dot={{ fill: "#10B981" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Engagement Metrics
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topProjects}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Bar
                    dataKey="comments"
                    fill="#10B981"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="bookmarks"
                    fill="#8B5CF6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
