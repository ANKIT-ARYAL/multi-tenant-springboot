import { useState } from 'react';

export default function Home() {
    const [token, setToken] = useState('');
    const [tenantId, setTenantId] = useState('tenant-a');
    const [username, setUsername] = useState('ankit');
    const [role, setRole] = useState('ROLE_ADMIN');
    const [loading, setLoading] = useState(false);

    const [customers, setCustomers] = useState([]);
    const [form, setForm] = useState({ name: '', email: '', phone: '', company: '' });

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('http://localhost:4200/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password: 'password', tenantId, role })
            });
            const data = await res.json();
            if (data.token) {
                setToken(data.token);
                await fetchCustomers(data.token);
            } else {
                alert('Login failed');
            }
        } catch (err) {
            alert('Error connecting to backend API');
        } finally {
            setLoading(false);
        }
    };

    const fetchCustomers = async (jwt) => {
        const activeToken = jwt || token;
        if (!activeToken) return;
        const res = await fetch('http://localhost:4200/api/customers', {
            headers: { 'Authorization': `Bearer ${activeToken}` }
        });
        if (res.ok) {
            const data = await res.json();
            setCustomers(data);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        const res = await fetch('http://localhost:4200/api/customers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(form)
        });
        if (res.ok) {
            setForm({ name: '', email: '', phone: '', company: '' });
            fetchCustomers();
        }
    };

    const handleDelete = async (id) => {
        const res = await fetch(`http://localhost:4200/api/customers/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            fetchCustomers();
        } else {
            alert('Delete failed (Admin role required)');
        }
    };

    if (!token) {
        return (
            <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif' }}>
                <div style={{ background: '#ffffff', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)', width: '100%', maxWidth: '420px', border: '1px solid #e2e8f0' }}>
                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 8px 0' }}>CRM Workspace</h2>
                        <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Multi-tenant cloud platform login</p>
                    </div>

                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', color: '#475569', marginBottom: '6px' }}>Username:</label>
                            <input
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', color: '#475569', marginBottom: '6px' }}>Tenant ID:</label>
                            <input
                                value={tenantId}
                                onChange={e => setTenantId(e.target.value)}
                                placeholder="e.g. tenant-a or tenant-b"
                                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', color: '#475569', marginBottom: '6px' }}>Role:</label>
                            <select
                                value={role}
                                onChange={e => setRole(e.target.value)}
                                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', background: '#fff', outline: 'none', boxSizing: 'border-box' }}
                            >
                                <option value="ROLE_ADMIN">ROLE_ADMIN</option>
                                <option value="ROLE_MEMBER">ROLE_MEMBER</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{ marginTop: '8px', padding: '12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '14px', cursor: 'pointer', transition: 'background 0.2s' }}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '40px 20px', fontFamily: 'system-ui, sans-serif' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>

                {/* Header Navbar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', padding: '20px 24px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                    <div>
                        <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>CRM Dashboard</h1>
                        <span style={{ display: 'inline-block', marginTop: '4px', fontSize: '12px', background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '4px', fontWeight: '500' }}>
                            Tenant: {tenantId} | Role: {role}
                        </span>
                    </div>
                    <button
                        onClick={() => setToken('')}
                        style={{ background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '6px', fontWeight: '500', cursor: 'pointer', fontSize: '13px' }}
                    >
                        Logout
                    </button>
                </div>

                {/* Add Customer Panel */}
                <div style={{ background: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', marginTop: 0, marginBottom: '16px' }}>Add New Customer Record</h3>
                    <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                        <input placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required style={{ padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }} />
                        <input placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required style={{ padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }} />
                        <input placeholder="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} style={{ padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }} />
                        <input placeholder="Company" value={form.company} onChange={e => setForm({...form, company: e.target.value})} style={{ padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }} />
                        <button type="submit" style={{ gridColumn: '1 / -1', padding: '10px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '600', fontSize: '14px', cursor: 'pointer', marginTop: '4px' }}>
                            + Create Customer
                        </button>
                    </form>
                </div>

                {/* Records Listing Table Panel */}
                <div style={{ background: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', marginTop: 0, marginBottom: '16px' }}>Tenant Isolated Records</h3>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                            <thead>
                            <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#475569', background: '#f8fafc' }}>
                                <th style={{ padding: '12px' }}>ID</th>
                                <th style={{ padding: '12px' }}>Name</th>
                                <th style={{ padding: '12px' }}>Email</th>
                                <th style={{ padding: '12px' }}>Company</th>
                                <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {customers.map(c => (
                                <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '12px', color: '#64748b' }}>{c.id}</td>
                                    <td style={{ padding: '12px', fontWeight: '500', color: '#0f172a' }}>{c.name}</td>
                                    <td style={{ padding: '12px', color: '#334155' }}>{c.email}</td>
                                    <td style={{ padding: '12px', color: '#334155' }}>{c.company || '—'}</td>
                                    <td style={{ padding: '12px', textAlign: 'right' }}>
                                        <button
                                            onClick={() => handleDelete(c.id)}
                                            style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: '500', fontSize: '12px', cursor: 'pointer' }}
                                            title="Requires Admin Role"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {customers.length === 0 && (
                                <tr>
                                    <td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
                                        No records found for this tenant workspace.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}