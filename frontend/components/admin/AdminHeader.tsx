export default function AdminHeader() {
  return (
    <div className="h-16 bg-white border-b flex items-center justify-between px-6">
      <h1 className="font-bold text-xl">
        HairsUp Admin
      </h1>

      <div className="flex items-center gap-4">
        <span>Admin</span>
      </div>
    </div>
  );
}