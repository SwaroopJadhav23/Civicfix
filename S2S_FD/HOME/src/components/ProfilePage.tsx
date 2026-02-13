import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  User, 
  MapPin, 
  Calendar, 
  CheckCircle,
  ThumbsUp,
  ArrowLeft,
  Edit,
  Bell,
  Crown,
  Trophy
} from 'lucide-react';
import type { Issue, User as UserType } from '../App';

interface ProfilePageProps {
  currentUser: UserType;
  issues: Issue[];
  onNavigate: (page: string) => void;
}

const initialNotifications = [
  {
    id: '1',
    title: 'Issue Update: Pothole on Main Street',
    message: 'Your reported issue has been assigned to Roads & Transportation department.',
    date: new Date('2024-01-20'),
    read: false,
    type: 'update' as const
  },
  {
    id: '2', 
    title: 'Badge Earned: Community Helper',
    message: 'Congratulations! You\'ve earned the Community Helper badge.',
    date: new Date('2024-01-18'),
    read: false,
    type: 'achievement' as const
  },
  {
    id: '3',
    title: 'Issue Resolved: Broken streetlight',
    message: 'The streetlight issue you reported has been successfully resolved.',
    date: new Date('2024-01-15'),
    read: true,
    type: 'resolution' as const
  }
];

export function ProfilePage({ currentUser, issues, onNavigate }: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState(initialNotifications);

  const userReportedIssues = issues.filter(issue => issue.reportedBy === currentUser.name);
  const resolvedIssues = userReportedIssues.filter(issue => issue.status === 'Resolved');
  const pendingIssues = userReportedIssues.filter(issue => issue.status === 'Pending');
  const inProgressIssues = userReportedIssues.filter(issue => issue.status === 'In Progress');

  useEffect(() => {
    if (activeTab !== 'notifications') {
      return;
    }
    const templates = [
      {
        title: 'New response from municipality',
        message: 'A caseworker has reviewed your latest report.',
        type: 'update' as const
      },
      {
        title: 'Issue escalated for faster resolution',
        message: 'Your high-priority report has been escalated to senior staff.',
        type: 'update' as const
      },
      {
        title: 'Badge Earned: Consistent Reporter',
        message: 'Thank you for actively reporting issues in your area.',
        type: 'achievement' as const
      },
      {
        title: 'Issue Resolved',
        message: 'One of your previously submitted issues has been marked as resolved.',
        type: 'resolution' as const
      }
    ];
    const intervalId = window.setInterval(() => {
      const template = templates[Math.floor(Math.random() * templates.length)];
      const id = `${Date.now()}`;
      const date = new Date();
      setNotifications(prev => [
        {
          id,
          title: template.title,
          message: template.message,
          date,
          read: false,
          type: template.type
        },
        ...prev
      ].slice(0, 15));
    }, 30000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [activeTab]);

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: { className: string } } = {
      'Pending': { className: 'bg-yellow-100 text-yellow-800' },
      'In Progress': { className: 'bg-blue-100 text-blue-800' },
      'Resolved': { className: 'bg-green-100 text-green-800' },
      'Escalated': { className: 'bg-red-100 text-red-800' }
    };
    return variants[status] || { className: 'bg-gray-100 text-gray-800' };
  };

  const getPriorityBadge = (priority: string) => {
    const variants: { [key: string]: { className: string } } = {
      'High': { className: 'bg-red-100 text-red-800' },
      'Medium': { className: 'bg-orange-100 text-orange-800' },
      'Low': { className: 'bg-gray-100 text-gray-800' }
    };
    return variants[priority] || { className: 'bg-gray-100 text-gray-800' };
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'achievement':
        return <Trophy className="w-4 h-4 text-yellow-600" />;
      case 'resolution':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      default:
        return <Bell className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => onNavigate('home')}
            className="mb-2 text-gray-700 hover:text-gray-900 transition-colors duration-150"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>

        <Card className="mb-8 shadow-lg border border-slate-100">
          <CardContent className="p-8">
            <div className="flex items-center space-x-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={currentUser.avatar} />
                <AvatarFallback className="text-xl">
                  {currentUser.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{currentUser.name}</h1>
                  <Badge className="bg-blue-100 text-blue-800">
                    <User className="w-3 h-3 mr-1" />
                    Citizen
                  </Badge>
                </div>
                <p className="text-gray-600 mb-4">{currentUser.email}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{currentUser.points}</div>
                    <div className="text-sm text-gray-600">Total Reports</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{currentUser.issuesReported}</div>
                    <div className="text-sm text-gray-600">Issues Pending</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">{resolvedIssues.length}</div>
                    <div className="text-sm text-gray-600">Issues Resolved</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">#{4}</div>
                    <div className="text-sm text-gray-600">In Progress</div>
                  </div>
                </div>
              </div>
              
              <Button
                variant="outline"
                className="border-slate-300 text-slate-700 hover:bg-slate-50 transition-all duration-150 hover:shadow-sm hover:-translate-y-[1px]"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white border border-slate-200 rounded-lg">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="reports">My Reports</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Activity Summary */}
              {/* <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Activity Summary</CardTitle>
                  <CardDescription>Your contribution this month</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Reports Submitted</span>
                    <span className="font-semibold">8</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Issues Resolved</span>
                    <span className="font-semibold">6</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Votes Cast</span>
                    <span className="font-semibold">45</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Points Earned</span>
                    <span className="font-semibold text-blue-600">+320</span>
                  </div>
                </CardContent>
              </Card> */}

              {/* Progress to Next Level */}
              {/* <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Progress to Next Level</CardTitle>
                  <CardDescription>Community Champion (2000 points)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Progress value={62} className="h-3" />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{currentUser.points} points</span>
                    <span>2000 points</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    You need <strong>750 more points</strong> to reach Community Champion level.
                  </p>
                </CardContent>
              </Card> */}

              {/* Recent Badges */}
              {/* <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Badges</CardTitle>
                  <CardDescription>Your latest achievements</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {currentUser.badges.slice(0, 3).map((badge, index) => (
                    <div key={badge} className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Award className="w-4 h-4 text-yellow-600" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{badge}</div>
                        <div className="text-xs text-gray-600">Earned Jan {15 + index}</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card> */}
            </div>

            {/* Recent Reports */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Reports</CardTitle>
                <CardDescription>Your latest submitted issues</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userReportedIssues.slice(0, 3).map(issue => (
                    <div key={issue.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      {issue.imageUrl && (
                        <ImageWithFallback
                          src={issue.imageUrl}
                          alt={issue.title}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium">{issue.title}</h4>
                          <Badge {...getStatusBadge(issue.status)}>{issue.status}</Badge>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-3 h-3 mr-1" />
                          {issue.location}
                          <span className="mx-2">•</span>
                          <Calendar className="w-3 h-3 mr-1" />
                          {issue.dateReported.toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <ThumbsUp className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{issue.votes}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            {/* Status Cards */}
            <div className="grid md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900">{userReportedIssues.length}</div>
                  <div className="text-sm text-gray-600">Total Reports</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-600">{pendingIssues.length}</div>
                  <div className="text-sm text-gray-600">Pending</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{inProgressIssues.length}</div>
                  <div className="text-sm text-gray-600">In Progress</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{resolvedIssues.length}</div>
                  <div className="text-sm text-gray-600">Resolved</div>
                </CardContent>
              </Card>
            </div>

            {/* All Reports */}
            <Card>
              <CardHeader>
                <CardTitle>All My Reports</CardTitle>
                <CardDescription>Complete history of your submitted issues</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userReportedIssues.map(issue => (
                    <div key={issue.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-semibold">{issue.title}</h4>
                            <Badge variant="outline" className="text-xs">{issue.id}</Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              {issue.location}
                            </span>
                            <span className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {issue.dateReported.toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Badge {...getPriorityBadge(issue.priority)}>{issue.priority}</Badge>
                          <Badge {...getStatusBadge(issue.status)}>{issue.status}</Badge>
                        </div>
                      </div>
                      
                      {issue.imageUrl && (
                        <ImageWithFallback
                          src={issue.imageUrl}
                          alt={issue.title}
                          className="w-full h-32 object-cover rounded-lg mb-3"
                        />
                      )}
                      
                      <p className="text-sm text-gray-700 mb-3">{issue.description}</p>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center text-gray-600">
                            <ThumbsUp className="w-3 h-3 mr-1" />
                            {issue.votes} votes
                          </span>
                          {issue.assignedDepartment && (
                            <span className="text-gray-600">
                              Assigned to: <strong>{issue.assignedDepartment}</strong>
                            </span>
                          )}
                        </div>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          className="transition-all duration-150 hover:-translate-y-[1px] hover:shadow-sm"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Badges Tab */}
          <TabsContent value="badges" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentUser.badges.map((badge, index) => (
                <Card key={badge} className="text-center">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Crown className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{badge}</h3>
                    <Badge className="bg-green-100 text-green-800 mb-3">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Earned
                    </Badge>
                    <p className="text-sm text-gray-600">
                      Earned on January {10 + index}, 2024
                    </p>
                  </CardContent>
                </Card>
              ))}
              
              {/* Next Badge to Earn */}
              <Card className="text-center border-dashed">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trophy className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Community Champion</h3>
                  <div className="space-y-2 mb-3">
                    <Progress value={62} className="h-2" />
                    <div className="text-xs text-gray-600">62% Complete</div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Earn 2000+ points to unlock this badge
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Notifications</CardTitle>
                <CardDescription>Stay updated on your reports and community activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.map(notification => (
                    <div key={notification.id} className={`flex items-start space-x-4 p-4 rounded-lg ${
                      notification.read ? 'bg-gray-50' : 'bg-blue-50 border-l-4 border-blue-500'
                    }`}>
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className={`font-medium ${!notification.read ? 'text-blue-900' : 'text-gray-900'}`}>
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <Badge className="bg-blue-600 text-white">New</Badge>
                          )}
                        </div>
                        <p className={`text-sm ${!notification.read ? 'text-blue-800' : 'text-gray-600'}`}>
                          {notification.message}
                        </p>
                        <div className="text-xs text-gray-500 mt-2">
                          {notification.date.toLocaleDateString()} at {notification.date.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
