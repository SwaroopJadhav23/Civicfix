import { useState } from 'react';
import { Navigation } from './components/Navigation';
import { LandingPage } from './components/LandingPage';
import { ReportIssue } from './components/ReportIssue';
import { IssueListPage } from './components/IssueListPage';
// Admin app will be embedded via iframe
import { ProfilePage } from './components/ProfilePage';

export type Issue = {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In Progress' | 'Resolved' | 'Escalated';
  location: string;
  coordinates: { lat: number; lng: number };
  reportedBy: string;
  dateReported: Date;
  imageUrl?: string;
  votes: number;
  assignedDepartment?: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  points: number;
  issuesReported: number;
  issuesResolved: number;
  badges: string[];
  isAdmin: boolean;
};

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentUser] = useState<User>({
    id: '1',
    name: 'Shree Joshi',
    email: 'shreejoshi@gmail.com',
    avatar: '/avatar-shree.svg',
    points: 1250,
    issuesReported: 23,
    issuesResolved: 18,
    badges: ['Top Reporter', 'Community Helper', 'Quick Responder'],
    isAdmin: false
  });

  // Mock data for issues
  const [issues] = useState<Issue[]>([
    {
      id: 'CIV-2024-001',
      title: 'Large pothole on JSPM Road',
      description: 'Dangerous pothole causing vehicle damage near intersection with Oak Avenue. Approximately 2 feet wide and 6 inches deep.',
      category: 'Roads',
      priority: 'High',
      status: 'In Progress',
      location: 'JSPM University Road',
      coordinates: { lat: 40.7128, lng: -74.0060 },
      reportedBy: 'Shree Joshi',
      dateReported: new Date('2026-01-15'),
      imageUrl: 'https://images.unsplash.com/photo-1641822558386-345b80dee126?w=400',
      votes: 15,
      assignedDepartment: 'Roads & Transportation'
    },
    {
      id: 'CIV-2024-002',
      title: 'Broken streetlight on Wagholi Road',
      description: 'Street light has been out for a week, creating safety concerns for pedestrians and drivers in the evening.',
      category: 'Lighting',
      priority: 'Medium',
      status: 'Pending',
      location: 'IVY Estate, Wagholi',
      coordinates: { lat: 40.7130, lng: -74.0058 },
      reportedBy: 'Swaroop Jadhav',
      dateReported: new Date('2026-01-18'),
      imageUrl: 'https://images.unsplash.com/photo-1695236200077-f61c1450f21a?w=400',
      votes: 8,
      assignedDepartment: 'Electrical Services'
    },
    {
      id: 'CIV-2024-003',
      title: 'Overflowing garbage bins',
      description: 'Multiple bins overflowing near the park entrance, attracting pests and creating unsanitary conditions.',
      category: 'Sanitation',
      priority: 'Medium',
      status: 'Resolved',
      location: 'Nyati Elan, Wagholi',
      coordinates: { lat: 40.7125, lng: -74.0055 },
      reportedBy: 'Saloni Jadhav',
      dateReported: new Date('2026-01-10'),
      imageUrl: 'https://images.unsplash.com/photo-1574676039880-73da8368f0eb?w=400',
      votes: 12,
      assignedDepartment: 'Sanitation Department'
    },
    {
      id: 'CIV-2024-004',
      title: 'Graffiti on Nyati Elan wall',
      description: 'Large graffiti tags covering the east wall of the community center, needs immediate cleaning.',
      category: 'Vandalism',
      priority: 'Low',
      status: 'Pending',
      location: 'Nyati Elan, Wagholi',
      coordinates: { lat: 40.7135, lng: -74.0065 },
      reportedBy: 'Shravani Gaikwad',
      dateReported: new Date('2024-01-20'),
      votes: 5,
      assignedDepartment: 'Maintenance Services'
    },
    {
      id: 'CIV-2024-005',
      title: 'Water leak on JSPM Road',
      description: 'Continuous water leak from underground pipe causing flooding on sidewalk.',
      category: 'Water',
      priority: 'High',
      status: 'Escalated',
      location: 'JSPM University Road, Near Library Building',
      coordinates: { lat: 40.7140, lng: -74.0070 },
      reportedBy: 'Vaishnavi Kadam',
      dateReported: new Date('2024-01-22'),
      votes: 20,
      assignedDepartment: 'Water Department'
    }
  ]);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <LandingPage onNavigate={handleNavigate} />;
      case 'report':
        return <ReportIssue onBack={() => handleNavigate('home')} />;
      case 'issues':
        return <IssueListPage issues={issues} onNavigate={handleNavigate} />;
      case 'profile':
        return <ProfilePage currentUser={currentUser} issues={issues} onNavigate={handleNavigate} />;
      default:
        return <LandingPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />
      <main className="pt-16">
        {renderCurrentPage()}
      </main>
    </div>
  );
}
