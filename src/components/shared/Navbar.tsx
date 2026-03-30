import { Link, useLocation } from "react-router";
import { useState, useEffect } from "react";
import { ExternalLink, LogOut, Menu, X, Rocket, LayoutDashboard, Image as ImageIcon, ShoppingCart } from 'lucide-react';
import { cn } from "../../lib/utils";

export default function Navbar({ handleLogout }: { handleLogout: () => void }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    // Handle scroll effect for glassmorphism
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close menu on navigation
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location.pathname]);

    const navLinks = [
        { name: "Products", path: "/products", icon: Rocket },
        { name: "Designs", path: "/designs", icon: LayoutDashboard },
        { name: "Assets", path: "/assets", icon: ImageIcon },
        { name: "Orders", path: "/orders", icon: ShoppingCart },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav
            className={cn(
                "sticky top-0 z-50 transition-all duration-300 w-full",
                scrolled
                    ? "bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm py-2"
                    : "bg-white border-b border-transparent py-4"
            )}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-12">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform duration-200">
                                <ImageIcon className="text-white w-6 h-6" />
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                                PhotoPandora
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2",
                                    isActive(link.path)
                                        ? "bg-indigo-50 text-indigo-600"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-indigo-600"
                                )}
                            >
                                <link.icon className={cn("w-4 h-4", isActive(link.path) ? "text-indigo-600" : "text-gray-400")} />
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link
                            to="/editor"
                            target="_blank"
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                        >
                            <ExternalLink className="w-4 h-4" />
                            Open Editor
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-950 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-all shadow-sm active:scale-95"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="md:hidden flex items-center gap-2">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div
                className={cn(
                    "fixed inset-0 bg-black/20 backdrop-blur-sm z-[-1] transition-opacity duration-300 md:hidden",
                    isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={() => setIsMenuOpen(false)}
            />

            {/* Mobile Menu */}
            <div
                className={cn(
                    "absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-xl transition-all duration-300 md:hidden overflow-hidden",
                    isMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                )}
            >
                <div className="px-4 pt-2 pb-6 space-y-2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors",
                                isActive(link.path)
                                    ? "bg-indigo-50 text-indigo-600"
                                    : "text-gray-600 hover:bg-gray-50"
                            )}
                        >
                            <link.icon className={cn("w-5 h-5", isActive(link.path) ? "text-indigo-600" : "text-gray-400")} />
                            {link.name}
                        </Link>
                    ))}

                    <div className="pt-4 mt-4 border-t border-gray-100 space-y-2">
                        <Link
                            to="/editor"
                            target="_blank"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-gray-600 hover:bg-gray-50"
                        >
                            <ExternalLink className="w-5 h-5 text-gray-400" />
                            Open Editor
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-red-600 hover:bg-red-50 transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}

