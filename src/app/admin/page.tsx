"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/lib/types";
import { ArrowLeft, UserPlus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export default function AdminPage() {
  const { user, registerUser } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>("user");
  const [users, setUsers] = useState<any[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any | null>(null);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  if (user?.role !== "admin") {
    return (
      <div className="p-6 text-center">
        <h1 className="text-destructive font-bold">Access Denied</h1>
        <Link href="/" className="text-primary mt-4 block">
          Go Home
        </Link>
      </div>
    );
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password || !name) return;

    const success = await registerUser({
      username,
      password,
      name,
      role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
    });

    if (success) {
      setUsername("");
      setPassword("");
      setName("");
      setRole("user");
      fetch("/api/users")
        .then((res) => res.json())
        .then((data) => setUsers(data));
    } else {
      // noop
    }
  };

  const promptDelete = (u: any) => {
    setUserToDelete(u);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    await fetch(`/api/users/${userToDelete.id}`, { method: "DELETE" });
    setConfirmOpen(false);
    setUserToDelete(null);
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  };

  const cancelDelete = () => {
    setConfirmOpen(false);
    setUserToDelete(null);
  };

  return (
    <div className="p-6 space-y-6">
      <header className="flex items-center space-x-4">
        <Link href="/">
          <ArrowLeft className="text-muted-foreground" />
        </Link>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </header>

      <section className="bg-card p-6 rounded-2xl shadow-sm border border-border">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-primary" />
          Register New User
        </h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 bg-muted border border-input rounded-lg outline-none focus:ring-2 focus:ring-ring text-foreground"
              placeholder="John Doe"
              required
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 bg-muted border border-input rounded-lg outline-none focus:ring-2 focus:ring-ring text-foreground"
              placeholder="johndoe"
              required
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Password
            </label>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-muted border border-input rounded-lg outline-none focus:ring-2 focus:ring-ring text-foreground"
              placeholder="secret123"
              required
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full p-3 bg-muted border border-input rounded-lg outline-none focus:ring-2 focus:ring-ring text-foreground"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium">
            Create User
          </button>
        </form>
      </section>

      <section>
        <h2 className="text-lg font-bold mb-4">Existing Users</h2>
        <div className="space-y-3">
          {users.map((u) => (
            <div
              key={u.id}
              className="flex items-center justify-between p-4 bg-card rounded-xl border border-border"
            >
              <div className="flex items-center gap-3">
                <img
                  src={u.avatar}
                  className="w-10 h-10 rounded-full bg-muted"
                  alt="avatar"
                />
                <div>
                  <p className="font-semibold">{u.name}</p>
                  <p className="text-xs text-muted-foreground">
                    @{u.username} • {u.role}
                  </p>
                </div>
              </div>
              {u.role !== "admin" && (
                <button
                  onClick={() => promptDelete(u)}
                  className="px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors bg-destructive/10 text-destructive hover:bg-destructive/20"
                >
                  <Trash2 size={16} /> Delete
                </button>
              )}
            </div>
          ))}
        </div>
      </section>
      <ConfirmDialog
        open={confirmOpen}
        title="Delete user?"
        description={
          userToDelete
            ? `This will remove @${userToDelete.username} and all related data.`
            : ""
        }
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}
