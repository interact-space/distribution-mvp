export default function Sidebar({ currentPage, onNavigate }) {
  const items = [
    { key: "dashboard", label: "Dashboard" },
    { key: "projects", label: "Projects" },
  ];

  return (
    <div className="flex h-full min-h-screen w-64 flex-col border-r border-neutral-200 bg-white p-4">
      <div className="mb-8 flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-500 text-2xl font-bold text-white">
          sy
        </div>
        <div>
          <div className="font-semibold">Passive Growth OS</div>
          <div className="text-sm text-neutral-500">B2B Marketing MVP</div>
        </div>
      </div>

      <div className="space-y-2">
        {items.map((item) => {
          const active = currentPage === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                active
                  ? "bg-neutral-900 text-white"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}