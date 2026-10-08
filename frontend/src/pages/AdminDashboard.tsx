import {
  GraduationCap,
  Users,
  ClipboardCheck,
  IndianRupee,
} from "lucide-react";

import StatCard from "../components/StatCard";

function AdminDashboard() {
  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome to School ERP
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Here is an overview of your school.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Students"
          value="1,248"
          subtitle="Currently enrolled"
          icon={GraduationCap}
        />

        <StatCard
          title="Total Teachers"
          value="86"
          subtitle="Active teachers"
          icon={Users}
        />

        <StatCard
          title="Today's Attendance"
          value="94%"
          subtitle="Student attendance"
          icon={ClipboardCheck}
        />

        <StatCard
          title="Fee Collection"
          value="₹8.4L"
          subtitle="This academic year"
          icon={IndianRupee}
        />
      </div>

      {/* Overview */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Attendance */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800">
            Attendance Overview
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            This week's student attendance
          </p>

          <div className="mt-6 space-y-4">
            {[
              { day: "Monday", value: 94 },
              { day: "Tuesday", value: 91 },
              { day: "Wednesday", value: 96 },
              { day: "Thursday", value: 89 },
              { day: "Friday", value: 93 },
            ].map((item) => (
              <div key={item.day}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.day}
                  </span>

                  <span className="font-medium text-gray-800">
                    {item.value}%
                  </span>
                </div>

                <div className="h-2 rounded-full bg-gray-100">
                  <div
                    className="h-2 rounded-full bg-[#27348b]"
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fees */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800">
            Fee Collection
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Current academic year
          </p>

          <div className="mt-6">
            <p className="text-sm text-gray-500">
              Total Collected
            </p>

            <p className="mt-1 text-3xl font-bold text-gray-800">
              ₹8,40,000
            </p>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">
                Collected
              </span>

              <span className="font-semibold text-green-600">
                ₹8.4L
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-gray-600">
                Pending
              </span>

              <span className="font-semibold text-orange-500">
                ₹2.1L
              </span>
            </div>

            <div className="h-3 rounded-full bg-gray-100">
              <div
                className="h-3 rounded-full bg-[#27348b]"
                style={{ width: "80%" }}
              />
            </div>

            <p className="text-xs text-gray-500">
              80% of expected fees collected
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;