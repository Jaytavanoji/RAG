import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Search from './pages/Search';
import Viewer from './pages/Viewer';
import Analytics from './pages/Analytics';
import History from './pages/History';
import Profile from './pages/Profile';
import Archive from './pages/Archive';
import Audit from './pages/Audit';
import Ingest from './pages/Ingest';
import Settings from './pages/Settings';
import Support from './pages/Support';
import Notifications from './pages/Notifications';
import EntityMap from './pages/EntityMap';
import Terminal from './pages/Terminal';
import RaiseTicket from './pages/RaiseTicket';
import TicketStatus from './pages/TicketStatus';
import Admin from './pages/Admin';
import NodeConsole from './pages/NodeConsole';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/search" element={<Search />} />
            <Route path="/viewer/:id" element={<Viewer />} />
            <Route path="/viewer" element={<Viewer />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/history" element={<History />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/archive" element={<Archive />} />
            <Route path="/audit" element={<Audit />} />
            <Route path="/ingest" element={<Ingest />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/support" element={<Support />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/entity-map" element={<EntityMap />} />
            <Route path="/terminal" element={<Terminal />} />
            <Route path="/raise-ticket" element={<RaiseTicket />} />
            <Route path="/ticket-status/:id?" element={<TicketStatus />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/node-console" element={<NodeConsole />} />
          </Route>
        </Route>
        
        {/* 404 Fallback */}
        <Route element={<AppLayout />}>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
