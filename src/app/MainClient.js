"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Dashboard/Sidebar";
import Topbar from "@/components/Dashboard/Topbar";
// Tabs
import Dashboard from "@/components/Dashboard/Tabs/Dashboard";
import toast from "react-hot-toast";
import MachineManager from "@/components/Dashboard/Tabs/MachineManager";
import Doctors from "@/components/Dashboard/Tabs/Doctors";
import Employees from "@/components/Dashboard/Tabs/Employees";
import PatientsPage from "@/components/Dashboard/Tabs/Patient";
import { useSearchParams } from "next/navigation";


export default function AdminPage() {
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    // const [currentTab, setCurrentTab] = useState("dashboard");
    const searchParams = useSearchParams();
    const currentTab = searchParams.get("tab") || "dashboard";
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                router.replace("/login");
                return;
            }

            try {
                const res = await fetch("/api/auth/verify-token", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
                    },
                });

                const data = await res.json();

                if (!data.success) {
                    localStorage.removeItem("token");
                    router.replace("/login");
                    return;
                }

                const role = data.user.role;
                setUser(data.user);

                // 🔥 ROLE BASED REDIRECT
                if (role === "Admin1") {
                    router.replace("/");
                } else if (role === "employee") {
                    router.replace("/employee");
                } else {
                    localStorage.removeItem("token");
                    router.replace("/login");
                }

            } catch (err) {
                // console.log("Token verify error:", err);
                localStorage.removeItem("token");
                router.replace("/login");
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [router]);

    const handleLogout = async () => {

        localStorage.removeItem("token");
        window.location.reload()
        toast.success("logged out!")


    };


    const renderContent = () => {
        switch (currentTab) {
            case "dashboard":
                return <Dashboard user={user} />;
            case "machines":
                return <MachineManager />;
            case 'doctors':
                return <Doctors />
            case "employees":
                return <Employees />;
            case "patient":
                return <PatientsPage />;
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-100">
                <p className="text-gray-600">Checking authentication...</p>
            </div>
        );
    }




    return (
        user && user?.role === "Admin1" && (
            <div className="flex min-h-screen bg-gray-100">
                {/* Sidebar */}
                <Sidebar
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    currentTab={currentTab}
                    // setCurrentTab={setCurrentTab}
                    logout={handleLogout}
                    user={user}
                />

                {/* Main content */}
                <main className="flex-1 flex flex-col ">

                    <Topbar
                        setSidebarOpen={setSidebarOpen}
                        logout={handleLogout}

                    />
                    <div className="max-h-screen overflow-y-auto">{renderContent()}</div>
                </main>
            </div>
        )
    );

}
