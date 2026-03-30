export default function Topbar({ setSidebarOpen, logout }) {
    return (
        <header className="flex items-center justify-between bg-white p-4 shadow lg:hidden">
            <button
                onClick={() => setSidebarOpen(true)}
                className="text-indigo-700 focus:outline-none text-2xl"
            >
                ☰
            </button>

            <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            >
                Logout
            </button>
        </header>
    );
}
