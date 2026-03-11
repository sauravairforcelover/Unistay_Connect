"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface Stats {
  totalUsers: number;
  totalProperties: number;
  totalReports: number;
}

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalProperties: 0,
    totalReports: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [usersRes, statsRes] = await Promise.all([
          fetch("/api/users"),
          fetch("/api/admin/stats"),
        ]);

        if (usersRes.ok) {
          const data = await usersRes.json();
          setUsers(data);
        }

        if (statsRes.ok) {
          const data = await statsRes.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <>
      <div className="layout-content-container flex flex-col w-80">
        <div className="flex h-full min-h-[700px] flex-col justify-between bg-white p-4">
          <div className="flex flex-col gap-4">
            <Link href="/" className="text-[#111418] text-base font-medium leading-normal">
              UniStayConnect
            </Link>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-[#f0f2f4]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M224,115.55V208a16,16,0,0,1-16,16H168a16,16,0,0,1-16-16V168a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v40a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V115.55a16,16,0,0,1,5.17-11.78l80-75.48.11-.11a16,16,0,0,1,21.53,0,1.14,1.14,0,0,0,.11.11l80,75.48A16,16,0,0,1,224,115.55Z"></path>
                </svg>
                <p className="text-[#111418] text-sm font-medium leading-normal">Dashboard</p>
              </div>
              <div className="flex items-center gap-3 px-3 py-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.7a8,8,0,0,1-11.07-2.33A79.83,79.83,0,0,0,172,168a8,8,0,0,1,0-16,44,44,0,1,0-16.34-84.87,8,8,0,1,1-5.94-14.85,60,60,0,0,1,55.53,105.64,95.83,95.83,0,0,1,47.22,37.71A8,8,0,0,1,250.14,206.7Z"></path>
                </svg>
                <p className="text-[#111418] text-sm font-medium leading-normal">Manage Users</p>
              </div>
              <div className="flex items-center gap-3 px-3 py-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M240,208H224V96a16,16,0,0,0-16-16H144V32a16,16,0,0,0-24.88-13.32L39.12,72A16,16,0,0,0,32,85.34V208H16a8,8,0,0,0,0,16H240a8,8,0,0,0,0-16ZM208,96V208H144V96ZM48,85.34,128,32V208H48ZM112,112v16a8,8,0,0,1-16,0V112a8,8,0,1,1,16,0Zm-32,0v16a8,8,0,0,1-16,0V112a8,8,0,1,1,16,0Zm0,56v16a8,8,0,0,1-16,0V168a8,8,0,0,1,16,0Zm32,0v16a8,8,0,0,1-16,0V168a8,8,0,0,1,16,0Z"></path>
                </svg>
                <p className="text-[#111418] text-sm font-medium leading-normal">Manage Properties</p>
              </div>
              <div className="flex items-center gap-3 px-3 py-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M239.2,97.29a16,16,0,0,0-13.81-11L166,81.17,142.72,25.81h0a15.95,15.95,0,0,0-29.44,0L90.07,81.17,30.61,86.32a16,16,0,0,0-9.11,28.06L66.61,153.8,53.09,212.34a16,16,0,0,0,23.84,17.34l51-31,51.11,31a16,16,0,0,0,23.84-17.34l-13.51-58.6,45.1-39.36A16,16,0,0,0,239.2,97.29Z"></path>
                </svg>
                <p className="text-[#111418] text-sm font-medium leading-normal">Manage Reviews</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <Link href="/" className="flex items-center gap-3 px-3 py-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path>
              </svg>
              <p className="text-[#111418] text-sm font-medium leading-normal">Back to App</p>
            </Link>
          </div>
        </div>
      </div>
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
        <div className="flex flex-wrap justify-between gap-3 p-4">
          <p className="text-[#111418] tracking-light text-[32px] font-bold leading-tight min-w-72">Admin Dashboard</p>
        </div>
        <h3 className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Overview</h3>
        {loading ? (
          <div className="px-4 py-3">
            <p className="text-[#617589]">Loading stats...</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-4 p-4">
            <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 border border-[#dbe0e6]">
              <p className="text-[#111418] text-base font-medium leading-normal">Total Users</p>
              <p className="text-[#111418] tracking-light text-2xl font-bold leading-tight">{stats.totalUsers.toLocaleString()}</p>
            </div>
            <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 border border-[#dbe0e6]">
              <p className="text-[#111418] text-base font-medium leading-normal">Properties</p>
              <p className="text-[#111418] tracking-light text-2xl font-bold leading-tight">{stats.totalProperties.toLocaleString()}</p>
            </div>
            <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 border border-[#dbe0e6]">
              <p className="text-[#111418] text-base font-medium leading-normal">Reports</p>
              <p className="text-[#111418] tracking-light text-2xl font-bold leading-tight">{stats.totalReports.toLocaleString()}</p>
            </div>
          </div>
        )}
        <h3 className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Manage</h3>
        <div className="pb-3">
          <div className="flex border-b border-[#dbe0e6] px-4 gap-8">
            <div className="flex flex-col items-center justify-center border-b-[3px] border-b-[#111418] text-[#111418] pb-[13px] pt-4">
              <p className="text-[#111418] text-sm font-bold leading-normal tracking-[0.015em]">Manage Users</p>
            </div>
            <div className="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-[#617589] pb-[13px] pt-4">
              <p className="text-[#617589] text-sm font-bold leading-normal tracking-[0.015em]">Manage Properties</p>
            </div>
            <div className="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-[#617589] pb-[13px] pt-4">
              <p className="text-[#617589] text-sm font-bold leading-normal tracking-[0.015em]">Manage Reviews</p>
            </div>
          </div>
        </div>
        {loading ? (
          <div className="px-4 py-3">
            <p className="text-[#617589]">Loading users...</p>
          </div>
        ) : (
          <div className="px-4 py-3 @container">
            <div className="flex overflow-hidden rounded-xl border border-[#dbe0e6] bg-white">
              <table className="flex-1">
                <thead>
                  <tr className="bg-white">
                    <th className="px-4 py-3 text-left text-[#111418] w-[400px] text-sm font-medium leading-normal">User</th>
                    <th className="px-4 py-3 text-left text-[#111418] w-[400px] text-sm font-medium leading-normal">Email</th>
                    <th className="px-4 py-3 text-left text-[#111418] w-60 text-sm font-medium leading-normal">Role</th>
                    <th className="px-4 py-3 text-left text-[#111418] w-60 text-sm font-medium leading-normal">Status</th>
                    <th className="px-4 py-3 text-left text-[#111418] w-60 text-[#617589] text-sm font-medium leading-normal">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-t border-t-[#dbe0e6]">
                      <td className="h-[72px] px-4 py-2 w-[400px] text-[#111418] text-sm font-normal leading-normal">
                        {user.name}
                      </td>
                      <td className="h-[72px] px-4 py-2 w-[400px] text-[#617589] text-sm font-normal leading-normal">
                        {user.email}
                      </td>
                      <td className="h-[72px] px-4 py-2 w-60 text-sm font-normal leading-normal">
                        <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 px-4 bg-[#f0f2f4] text-[#111418] text-sm font-medium leading-normal w-full">
                          <span className="truncate capitalize">{user.role}</span>
                        </button>
                      </td>
                      <td className="h-[72px] px-4 py-2 w-60 text-sm font-normal leading-normal">
                        <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 px-4 bg-[#f0f2f4] text-[#111418] text-sm font-medium leading-normal w-full">
                          <span className="truncate">Active</span>
                        </button>
                      </td>
                      <td className="h-[72px] px-4 py-2 w-60 text-[#617589] text-sm font-bold leading-normal tracking-[0.015em]">
                        View
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
