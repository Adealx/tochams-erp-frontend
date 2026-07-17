export default function ReportFilters() {
  return (
    <div className="bg-white rounded-xl shadow p-4 flex gap-4 items-center mt-6">

      <select className="border rounded-lg px-4 py-2">
        <option>Today</option>
        <option>This Week</option>
        <option>This Month</option>
        <option>This Year</option>
      </select>

      <select className="border rounded-lg px-4 py-2">
        <option>All Departments</option>
      </select>

      <button className="ml-auto bg-blue-600 text-white px-5 py-2 rounded-lg">
        Export
      </button>

    </div>
  );
}