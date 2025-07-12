import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users2, Ban, Undo2, Search } from "lucide-react";
import { axiosInstance } from "@/lib/axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import toast from "react-hot-toast";

type User = {
  _id: string;
  fullName: string;
  email: string;
  imageUrl?: string;
  banned: boolean;
};

const UsersTabContent = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState("");
  const [confirmAction, setConfirmAction] = useState<{ type: 'ban' | 'unban', userId: string } | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axiosInstance.get<User[]>("/users");
      setUsers(res.data);
    } catch (e) {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleBan = async (userId: string) => {
    setConfirmAction({ type: 'ban', userId });
  };

  const handleUnban = async (userId: string) => {
    setConfirmAction({ type: 'unban', userId });
  };

  const confirmActionHandler = async () => {
    if (!confirmAction) return;
    
    const { type, userId } = confirmAction;
    setActionLoading(userId);
    
    try {
      const endpoint = type === 'ban' ? `/users/ban/${userId}` : `/users/unban/${userId}`;
      await axiosInstance.patch(endpoint);
      
      setUsers((prev) => prev.map(u => u._id === userId ? { ...u, banned: type === 'ban' } : u));
      toast.success(`User ${type === 'ban' ? 'banned' : 'unbanned'} successfully`);
    } catch (e) {
      toast.error(`Failed to ${type} user`);
    } finally {
      setActionLoading("");
      setConfirmAction(null);
    }
  };

  const filteredUsers = users.filter(u => u.fullName.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users2 className="size-5 text-sky-500" />
              Users
            </CardTitle>
            <CardDescription>Manage users (ban/unban, search)</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Search className="size-4 text-zinc-400" />
            <Input
              placeholder="Search users..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-48 bg-zinc-800 border-none"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-zinc-400 py-8 text-center">Loading users...</div>
        ) : error ? (
          <div className="text-red-400 py-8 text-center">{error}</div>
        ) : (
          <div className="max-h-[400px] overflow-auto w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Avatar</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map(user => (
                  <TableRow key={user._id} className={user.banned ? "bg-red-950/30" : ""}>
                    <TableCell>
                      <img src={user.imageUrl || "/default-avatar.png"} alt={user.fullName} className="size-10 rounded-full object-cover" />
                    </TableCell>
                    <TableCell className="font-medium">{user.fullName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.banned ? <span className="text-red-400 font-semibold">Banned</span> : <span className="text-green-400">Active</span>}
                    </TableCell>
                    <TableCell className="text-right">
                      {user.banned ? (
                        <Button size="sm" variant="ghost" disabled={actionLoading === user._id} onClick={() => handleUnban(user._id)}>
                          <Undo2 className="size-4 mr-1" /> Unban
                        </Button>
                      ) : (
                        <Button size="sm" variant="ghost" disabled={actionLoading === user._id} onClick={() => handleBan(user._id)}>
                          <Ban className="size-4 mr-1" /> Ban
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      
      {/* Confirmation Dialog */}
      <Dialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmAction?.type === 'ban' ? 'Ban User' : 'Unban User'}
            </DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to {confirmAction?.type} this user?
            {confirmAction?.type === 'ban' && ' They will not be able to access the platform.'}
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmAction(null)}>Cancel</Button>
            <Button 
              variant={confirmAction?.type === 'ban' ? 'destructive' : 'default'}
              onClick={confirmActionHandler}
            >
              {confirmAction?.type === 'ban' ? 'Ban' : 'Unban'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
export default UsersTabContent; 