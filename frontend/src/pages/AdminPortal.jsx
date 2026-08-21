import { useEffect, useState } from "react";
import { adminDeleteUser, adminGetUser, adminListUsers, adminUpdateUser } from "../api";
import { useAuth } from "../context/useAuth";
import "./AdminPortal.css";

function AdminPortal() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(() => Boolean(user?.is_admin));
  const [error, setError] = useState("");
  const [busyUserId, setBusyUserId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

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

  const showUserDetails = async (userId) => {
    setDetailsLoading(true);
    setError("");
    try {
      setSelectedUser(await adminGetUser(userId));
    } catch (err) {
      setError(err.message || "Could not load user details.");
    } finally {
      setDetailsLoading(false);
    }
  };

  const formatDate = (date) => (date ? new Date(date).toLocaleString() : "Not available");
  const formatPracticeTime = (minutes) => {
    if (!minutes) return "0 mins";
    return minutes < 60 ? `${minutes} mins` : `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
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
                            disabled={isBusy}
                            onClick={() => showUserDetails(item.id)}
                          >
                            View details
                          </button>
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

        {(detailsLoading || selectedUser) && (
          <section className="admin-card admin-details" aria-live="polite">
            {detailsLoading && <p className="admin-loading">Loading full user details...</p>}
            {selectedUser && !detailsLoading && (
              <>
                <div className="admin-details-header">
                  <div>
                    <span className="eyebrow">USER INSPECTOR</span>
                    <h2>{selectedUser.name}</h2>
                    <p>{selectedUser.email} · Joined {formatDate(selectedUser.created_at)}</p>
                  </div>
                  <button type="button" className="admin-action-btn" onClick={() => setSelectedUser(null)}>Close</button>
                </div>

                <div className="admin-detail-grid">
                  <div><span>Account status</span><strong>{selectedUser.is_active ? "Active" : "Disabled"}</strong></div>
                  <div><span>Role</span><strong>{selectedUser.is_admin ? "Admin" : "Member"}</strong></div>
                  <div><span>Target role</span><strong>{selectedUser.target_role || "Not set"}</strong></div>
                  <div><span>Progress</span><strong>{selectedUser.progress}%</strong></div>
                  <div><span>XP</span><strong>{selectedUser.xp ?? 0}</strong></div>
                  <div><span>Practice time</span><strong>{formatPracticeTime(selectedUser.practice_minutes)}</strong></div>
                  <div><span>Completed interviews</span><strong>{selectedUser.completed_interviews}</strong></div>
                  <div><span>Scheduled interviews</span><strong>{selectedUser.scheduled_interviews}</strong></div>
                  <div><span>Average score</span><strong>{selectedUser.average_interview_score ?? "—"}{selectedUser.average_interview_score !== null && "%"}</strong></div>
                  <div><span>Best score</span><strong>{selectedUser.best_interview_score ?? "—"}{selectedUser.best_interview_score !== null && "%"}</strong></div>
                  <div><span>Resources solved</span><strong>{selectedUser.solved_resources}</strong></div>
                  <div><span>Challenges solved</span><strong>{selectedUser.solved_challenges}</strong></div>
                  <div><span>Unread alerts</span><strong>{selectedUser.unread_notifications}</strong></div>
                </div>

                <div className="admin-detail-copy">
                  <div><span>Bio</span><p>{selectedUser.bio || "No bio added."}</p></div>
                  <div><span>Skills</span><p>{selectedUser.skills || "No skills added."}</p></div>
                </div>

                <h3>Recent interviews</h3>
                {selectedUser.recent_interviews.length === 0 ? (
                  <p className="admin-empty">No interview activity yet.</p>
                ) : (
                  <div className="admin-interview-list">
                    {selectedUser.recent_interviews.map((interview) => (
                      <div key={interview.id} className="admin-interview-row">
                        <strong>{interview.company} · {interview.role}</strong>
                        <span>{interview.status} · {interview.score || "No score"} · {interview.date || "No date"}</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </section>
        )}

      </div>
    </main>
  );
}

export default AdminPortal;
