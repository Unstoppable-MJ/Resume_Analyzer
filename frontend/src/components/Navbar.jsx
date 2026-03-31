import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Cpu, User, LogOut, Upload, Home } from 'lucide-react';

const Navbar = ({ user, setUser }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/login');
    };

    return (
        <nav className="glass sticky top-4 mx-4 my-2 z-50 px-6 py-4 flex items-center justify-between shadow-2xl">
            <Link to="/" className="flex items-center gap-2 group">
                <div className="bg-indigo-600 p-2 rounded-lg group-hover:rotate-12 transition-transform">
                    <Cpu className="text-white" size={24} />
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-400">
                    Career Copilot
                </span>
            </Link>

            <div className="flex items-center gap-6">
                <Link to="/" className="hover:text-indigo-400 flex items-center gap-1 transition-colors">
                    <Home size={18} />
                    <span>Home</span>
                </Link>
                <Link to="/upload" className="hover:text-indigo-400 flex items-center gap-1 transition-colors">
                    <Upload size={18} />
                    <span>Upload</span>
                </Link>
                {user ? (
                    <div className="flex items-center gap-4">
                        <span className="text-sm opacity-70">Hi, {user.username}</span>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors"
                        >
                            <LogOut size={18} />
                            <span>Logout</span>
                        </button>
                    </div>
                ) : (
                    <Link to="/login" className="bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20 transition-all">
                        Login
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
