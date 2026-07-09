function DashboardCard({ title, value }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">

      <h2 className="text-gray-500 text-lg">
        {title}
      </h2>

      <h1 className="text-4xl font-bold mt-3 text-blue-600">
        {value}
      </h1>

    </div>
  );
}

export default DashboardCard;