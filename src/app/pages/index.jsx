import Layout from "./Layout.jsx";

import Home from "./Home";

import Sessions from "./Sessions";

import Blog from "./Blog";

import Contact from "./Contact";

import Dashboard from "./Dashboard";

import About from "./About";

import AdminDashboard from "./AdminDashboard";

import AdminSessions from "./AdminSessions";

import AdminBlogs from "./AdminBlogs";

import AdminPayments from "./AdminPayments";

import AdminContacts from "./AdminContacts";

import AdminSettings from "./AdminSettings";

import AdminLogin from "./AdminLogin";

import SessionDetails from "./SessionDetails";

import checkout from "./checkout";

import AdminPurchases from "./AdminPurchases";

import SessionPlayer from "./SessionPlayer";

import BlogPost from "./BlogPost";

import Home_backup from "./Home_backup";

import TeamDashboard from "./TeamDashboard";

import TeamSessions from "./TeamSessions";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Home: Home,
    
    Sessions: Sessions,
    
    Blog: Blog,
    
    Contact: Contact,
    
    Dashboard: Dashboard,
    
    About: About,
    
    AdminDashboard: AdminDashboard,
    
    AdminSessions: AdminSessions,
    
    AdminBlogs: AdminBlogs,
    
    AdminPayments: AdminPayments,
    
    AdminContacts: AdminContacts,
    
    AdminSettings: AdminSettings,
    
    AdminLogin: AdminLogin,
    
    SessionDetails: SessionDetails,
    
    checkout: checkout,
    
    AdminPurchases: AdminPurchases,
    
    SessionPlayer: SessionPlayer,
    
    BlogPost: BlogPost,
    
    Home_backup: Home_backup,
    
    TeamDashboard: TeamDashboard,
    
    TeamSessions: TeamSessions,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Home />} />
                
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/Sessions" element={<Sessions />} />
                
                <Route path="/Blog" element={<Blog />} />
                
                <Route path="/Contact" element={<Contact />} />
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/About" element={<About />} />
                
                <Route path="/AdminDashboard" element={<AdminDashboard />} />
                
                <Route path="/AdminSessions" element={<AdminSessions />} />
                
                <Route path="/AdminBlogs" element={<AdminBlogs />} />
                
                <Route path="/AdminPayments" element={<AdminPayments />} />
                
                <Route path="/AdminContacts" element={<AdminContacts />} />
                
                <Route path="/AdminSettings" element={<AdminSettings />} />
                
                <Route path="/AdminLogin" element={<AdminLogin />} />
                
                <Route path="/SessionDetails" element={<SessionDetails />} />
                
                <Route path="/checkout" element={<checkout />} />
                
                <Route path="/AdminPurchases" element={<AdminPurchases />} />
                
                <Route path="/SessionPlayer" element={<SessionPlayer />} />
                
                <Route path="/BlogPost" element={<BlogPost />} />
                
                <Route path="/Home_backup" element={<Home_backup />} />
                
                <Route path="/TeamDashboard" element={<TeamDashboard />} />
                
                <Route path="/TeamSessions" element={<TeamSessions />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}