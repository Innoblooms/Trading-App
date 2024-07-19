import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Admin.css'

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    throw new Error('No token found. Please log in again.');
                }
                                        
                const response = await fetch('http://localhost:8081/user/allUser', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to fetch users');
                }

                const data = await response.json();
                setUsers(data);
                setError(null);

            } catch (err) {
                setError(err.message);
                console.error('Fetch error:', err); 
            }
        };

        fetchUsers();

    }, []);

    const baseUrl = 'http://localhost:8081/';

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-3 sidebar">
                    <h2>Admin Dashboard</h2>
                    <ul className="list-group">
                        <li className="list-group-item"><a href="#">Update</a></li>
                        <li className="list-group-item"><a href="#">Delete</a></li>
                        <li className="list-group-item"><a href="#">Find Users</a></li>
                    </ul>
                </div>
                <div className="col-md-9 main-content">
                    <h2>User Details</h2>
                    {error && <p className="text-danger">{error}</p>}
                    <div className="card user-details">
                        <div className="card-body">
                            {users.length > 0 ? (
                                <div className="image-container">
                                    {users.map(user => (
                                        <div key={user.id} className="user-image">
                                            <p className="card-text"><strong>User Name:</strong> {user.name}</p>
                                            <p className="card-text"><strong>Email:</strong> {user.email}</p>
                                            <p className="card-text"><strong>Age:</strong> {user.age}</p>
                                            <p className="card-text"><strong>Role:</strong> {user.role}</p>
                                            <div>
                                                <strong>Aadhaar Image:</strong>
                                                <img 
                                                    src={`${baseUrl}${user.adhaarImage}`} 
                                                    alt="Aadhaar" 
                                                />
                                            </div>
                                            <div>
                                                <strong>PAN Image:</strong>
                                                <img 
                                                    src={`${baseUrl}${user.panImage}`} 
                                                    alt="PAN" 
                                                />
                                            </div>
                                            <div>
                                                <strong>Bank Statements:</strong>
                                                <img 
                                                    src={`${baseUrl}${user.bank_statements}`} 
                                                    alt="BANK" 
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>No users found</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
