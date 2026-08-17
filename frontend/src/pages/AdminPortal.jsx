import { useEffect, useState } from "react";
import { adminDeleteUser, adminListUsers, adminUpdateUser } from "../api";
import { useAuth } from "../context/useAuth";
import "./AdminPortal.css";

function AdminPortal() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(() => Boolean(user?.is_admin));
  const [error, setError] = useState("");
  const [busyUserId, setBusyUserId] = useState(null);

  const isAdmin = Boolean(user?.is_admin);

  useEffect(() => {
    if (!isAdmin) return;

    let isMounted = true;
    adminListUsers()
      .then((data) => {
        if (isMounted) setUsers(data);
      })
      .catch((err) => {
        if (isMounted) setError(err.message || "Could not load users.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isAdmin]);

  const runAction = async (userId, updates) => {
    setBusyUserId(userId);
    setError("");
    try {
      const updated = await adminUpdateUser(userId, updates);
      setUsers((current) => current.map((item) => (item.id === userId ? updated : item)));
    } catch (err) {
      setError(err.message || "Could not update that user.");
    } finally {
      setBusyUserId(null);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Delete this user permanently?")) return;
    setBusyUserId(userId);
    setError("");
    try {
      await adminDeleteUser(userId);
      setUsers((current) => current.filter((item) => item.id !== userId));
    } catch (err) {
      setError(err.message || "Could not delete that user.");
    } finally {
      setBusyUserId(null);
    }
  };

  if (!isAdmin) {
    return (
      <main className="admin-page">
        <div className="admin-container">
          <section className="admin-hero admin-denied">
            <h1>Admin access required</h1>
            <p>You need an admin account to view this page.</p>
          </section>
        </div>
      </main>
    );
  }

  const totalUsers = users.length;
  const adminCount = users.filter((item) => item.is_admin).length;
  const avgProgress = totalUsers
    ? Math.round(users.reduce((sum, item) => sum + (item.progress || 0), 0) / totalUsers)
    : 0;

  return (
    <main className="admin-page">
      <div className="admin-container">

        <section className="admin-hero">
          <span className="eyebrow">✦ ADMIN PORTAL</span>
          <h1>Manage users</h1>
          <p>View every registered account, promote admins, and keep track of progress.</p>
        </section>

        <div className="admin-summary">
          <div className="admin-summary-card">
            <span>TOTAL USERS</span>
            <strong>{totalUsers}</strong>
          </div>
          <div className="admin-summary-card">
            <span>ADMINS</span>
            <strong>{adminCount}</strong>
          </div>
          <div className="admin-summary-card">
            <span>AVERAGE PROGRESS</span>
            <strong>{avgProgress}%</strong>
          </div>
        </div>

        <section className="admin-card">
          <h2>All Users</h2>

          {loading && <p className="admin-loading">Loading users...</p>}
          {error && <p className="admin-error">{error}</p>}

          {!loading && !error && users.length === 0 && (
            <p className="admin-empty">No users yet.</p>
          )}

          {!loading && users.length > 0 && (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Progress</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((item) => {
                  const isSelf = item.id === user?.id;
                  const isBusy = busyUserId === item.id;

                  return (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.email}</td>
                      <td>
                        <span className={`admin-badge ${item.is_admin ? "admin" : "member"}`}>
                          {item.is_admin ? "Admin" : "Member"}
                        </span>
                      </td>
                      <td>
                        {item.is_active ? (
                          <span className="admin-badge member">Active</span>
                        ) : (
                          <span className="admin-badge disabled">Disabled</span>
                        )}
                      </td>
                      <td>
                        <div className="admin-mini-progress">
                          <div className="admin-mini-track">
                            <div className="admin-mini-fill" style={{ width: `${item.progress}%` }} />
                          </div>
                          <span>{item.progress}%</span>
                        </div>
                      </td>
                      <td>{new Date(item.created_at).toLocaleDateString()}</td>
                      <td>
                        <div className="admin-actions">
                          <button
                            type="button"
                            className="admin-action-btn"
                            disabled={isBusy || isSelf}
                            onClick={() => runAction(item.id, { is_admin: !item.is_admin })}
                          >
                            {item.is_admin ? "Revoke admin" : "Make admin"}
                          </button>

                          <button
                            type="button"
                            className="admin-action-btn"
                            disabled={isBusy || isSelf}
                            onClick={() => runAction(item.id, { is_active: !item.is_active })}
                          >
                            {item.is_active ? "Disable" : "Enable"}
                          </button>

                          <button
                            type="button"
                            className="admin-action-btn danger"
                            disabled={isBusy || isSelf}
                            onClick={() => handleDelete(item.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </section>

      </div>
    </main>
  );
}

export default AdminPortal;