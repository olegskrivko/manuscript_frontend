import { BrowserRouter, Route, Routes} from 'react-router-dom';
import LayoutWithSidebar from './components/LayoutWithSidebar';

import JournalsPage from './pages/JournalsPage';
import JournalDetailsPage from './pages/JournalDetailsPage';
import JournalCreatePage from './pages/JournalCreatePage';

import SubmissionPage from './pages/SubmissionsPage';
import SubmissionDetailsPage from './pages/SubmissionDetailsPage';

import ProfilePage from './pages/ProfilePage';
import LandingSplash from './pages/LandingSplash';
import UsersPage from './pages/UsersPage';

import { CssBaseline } from '@mui/material';
import './App.css'

function App() {

  return (
    <>
    <CssBaseline />
    <BrowserRouter>
      <Routes>
        {/* No sidebar */}
          <Route path="/" element={<LandingSplash />} />
        {/* App Pages - With sidebar */}
        <Route path="/" element={<LayoutWithSidebar />}>
          <Route path="users" element={<UsersPage />} />
          <Route path="users/:userId" element={<ProfilePage />} />
          <Route path="submissions" element={<SubmissionPage />} />
          <Route path="submissions/:submissionId" element={<SubmissionDetailsPage />} />
          <Route path="journals" element={<JournalsPage />} />
          <Route path="journals/create" element={<JournalCreatePage />} />
          <Route path="journals/:journalId" element={<JournalDetailsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
