import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { IssueDetailModal } from './IssueDetailModal';
import { ChartTooltip } from './ui/chart';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import {
  Users,
  FileText,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Download,
  Calendar as CalendarIcon,
  BarChart3,
  Filter,
  Search,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  ExternalLink,
  Calendar as CalendarOrig,
  Shield,
  UserPlus,
  Mail,
  Phone,
  Ban,
  CheckCircle2
} from 'lucide-react';
import { mockAnalytics, statusColors, categoryIcons, priorityColors, mockUsers, mockAdminUsers, fetchIssues } from '../utils/mockData';

interface AdminDashboardProps {
  key?: number;
}

export function AdminDashboard({ key }: AdminDashboardProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState('month');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<any>(null);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [issues, setIssues] = useState<any[]>([]);

  React.useEffect(() => {
    let mounted = true;
    fetchIssues().then((data) => {
      if (!mounted) return;
      setIssues(data.map((i: any) => ({ ...i, createdAt: i.createdAt ? new Date(i.createdAt) : new Date() })));
    }).catch(() => {});
    return () => { mounted = false; };
  }, []);

  const timeRangeData = {
    week: [
      { name: 'Mon', reports: 12, resolved: 8, pending: 4 },
      { name: 'Tue', reports: 15, resolved: 10, pending: 5 },
      { name: 'Wed', reports: 8, resolved: 6, pending: 2 },
      { name: 'Thu', reports: 18, resolved: 12, pending: 6 },
      { name: 'Fri', reports: 22, resolved: 16, pending: 6 },
      { name: 'Sat', reports: 6, resolved: 4, pending: 2 },
      { name: 'Sun', reports: 9, resolved: 7, pending: 2 }
    ],
    month: [
      { name: 'Week 1', reports: 45, resolved: 32, pending: 13 },
      { name: 'Week 2', reports: 52, resolved: 38, pending: 14 },
      { name: 'Week 3', reports: 38, resolved: 30, pending: 8 },
      { name: 'Week 4', reports: 61, resolved: 45, pending: 16 }
    ],
    quarter: [
      { name: 'Jan', reports: 156, resolved: 124, pending: 32 },
      { name: 'Feb', reports: 189, resolved: 143, pending: 46 },
      { name: 'Mar', reports: 201, resolved: 167, pending: 34 }
    ]
  };

  const resolutionTrend = [
    { month: 'Oct', resolved: 45, target: 50 },
    { month: 'Nov', resolved: 62, target: 55 },
    { month: 'Dec', resolved: 78, target: 60 },
    { month: 'Jan', resolved: 89, target: 65 },
    { month: 'Feb', resolved: 94, target: 70 },
    { month: 'Mar', resolved: 102, target: 75 }
  ];

  const handleDownloadReport = async (type: 'excel' | 'pdf' | 'csv') => {
    setIsDownloading(true);
    
    // Simulate download process
    setTimeout(() => {
      const timeLabel = selectedTimeRange === 'week' ? 'Weekly' : 
                      selectedTimeRange === 'month' ? 'Monthly' : 'Quarterly';
      const filename = `${timeLabel}_Civic_Report_${format(new Date(), 'yyyy-MM-dd')}.${type}`;
      
      toast.success(`${timeLabel} report downloaded as ${type.toUpperCase()}`);
      setIsDownloading(false);
    }, 2000);
  };

  const getStatusBadge = (status: string) => (
    <Badge className={statusColors[status] || 'bg-gray-100 text-gray-800'}>
      {status.replace('-', ' ')}
    </Badge>
  );

  const getPriorityBadge = (priority: string) => (
    <Badge className={priorityColors[priority] || 'bg-gray-100 text-gray-800'}>
      {priority}
    </Badge>
  );

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Administrative Dashboard</h1>
          <p className="text-muted-foreground">Monitor and manage civic issue reports across Maharashtra</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
            </SelectContent>
          </Select>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-40">
                <CalendarIcon className="h-4 w-4 mr-2" />
                {dateRange.from ? format(dateRange.from, 'MMM dd') : 'Select date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Reports</p>
                <p className="text-3xl font-bold">{mockAnalytics.totalReports}</p>
                <p className="text-sm text-green-600 mt-1">+12% from last period</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Resolved Issues</p>
                <p className="text-3xl font-bold">{mockAnalytics.resolvedReports}</p>
                <p className="text-sm text-green-600 mt-1">+8% from last period</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Resolution Time</p>
                <p className="text-3xl font-bold">{mockAnalytics.avgResolutionTime}</p>
                <p className="text-sm text-orange-600 mt-1">days</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Issues</p>
                <p className="text-3xl font-bold">{mockAnalytics.totalReports - mockAnalytics.resolvedReports}</p>
                <p className="text-sm text-red-600 mt-1">-5% from last period</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="exports">Downloads</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Reports Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={timeRangeData[selectedTimeRange as keyof typeof timeRangeData]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip />
                    <Area 
                      type="monotone" 
                      dataKey="reports" 
                      stackId="1"
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      fillOpacity={0.6}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="resolved" 
                      stackId="2"
                      stroke="#82ca9d" 
                      fill="#82ca9d" 
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Resolution Performance vs Target
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={resolutionTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip />
                    <Line type="monotone" dataKey="resolved" stroke="#0f4c81" strokeWidth={2} />
                    <Line type="monotone" dataKey="target" stroke="#6c757d" strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Recent Issues */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Issues</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {issues.slice(0, 5).map((issue) => (
                  <div key={issue.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{categoryIcons[issue.category]}</span>
                      <div>
                        <h4 className="font-medium">{issue.title}</h4>
                        <p className="text-sm text-muted-foreground">{issue.location.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(issue.status)}
                      {getPriorityBadge(issue.priority)}
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Generate Reports
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Download comprehensive reports in multiple formats for analysis and compliance
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-3">Quick Downloads</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="p-4">
                    <div className="text-center space-y-2">
                      <BarChart3 className="h-8 w-8 mx-auto text-sky-800" />
                      <h4 className="font-medium">Monthly Report</h4>
                      <p className="text-sm text-muted-foreground">Current month data</p>
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDownloadReport('excel')}
                          disabled={isDownloading}
                        >
                          Excel
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDownloadReport('pdf')}
                          disabled={isDownloading}
                        >
                          PDF
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Custom Report Builder */}
              <div>
                <h3 className="font-medium mb-3">Custom Report Builder</h3>
                <Card className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <Label className="text-sm font-medium">Time Period</Label>
                      <Select defaultValue="month">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="week">Last Week</SelectItem>
                          <SelectItem value="month">Last Month</SelectItem>
                          <SelectItem value="quarter">Last Quarter</SelectItem>
                          <SelectItem value="year">Last Year</SelectItem>
                          <SelectItem value="custom">Custom Range</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Department</Label>
                      <Select defaultValue="all">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Departments</SelectItem>
                          <SelectItem value="public-works">Public Works</SelectItem>
                          <SelectItem value="sanitation">Sanitation</SelectItem>
                          <SelectItem value="water-dept">Water Department</SelectItem>
                          <SelectItem value="electrical">Electrical</SelectItem>
                          <SelectItem value="traffic-police">Traffic Police</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Format</Label>
                      <Select defaultValue="excel">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                          <SelectItem value="pdf">PDF Report</SelectItem>
                          <SelectItem value="csv">CSV Data</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button 
                    className="w-full"
                    onClick={() => handleDownloadReport('excel')}
                    disabled={isDownloading}
                  >
                    {isDownloading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating Report...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Generate Custom Report
                      </>
                    )}
                  </Button>
                </Card>
              </div>

              <div>
                <h3 className="font-medium mb-3">Recent Downloads</h3>
                <Card className="p-4">
                  <div className="space-y-2">
                    {[
                      { name: 'Monthly_Civic_Report_2025-03.xlsx', date: '2025-03-15', size: '2.4 MB' },
                      { name: 'Monthly_Civic_Report_2025-02.xlsx', date: '2025-02-14', size: '2.3 MB' },
                      { name: 'Custom_Report_2025-03-10.pdf', date: '2025-03-10', size: '1.1 MB' }
                    ].map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-blue-600" />
                          <div>
                            <p className="text-sm font-medium">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{file.date} • {file.size}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other existing tabs content would continue here... */}
        <TabsContent value="reports">
          {/* Issues List with filters and actions */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>All Issues</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search issues..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 w-64"
                    />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="reported">Reported</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {issues.map((issue) => (
                  <div key={issue.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{categoryIcons[issue.category]}</span>
                      <div className="flex-1">
                        <h4 className="font-medium">{issue.title}</h4>
                        <p className="text-sm text-muted-foreground">{issue.location.address}</p>
                        <p className="text-xs text-muted-foreground">
                          Reported on {issue.createdAt.toLocaleDateString()} by {issue.reportedBy.name}
                        </p>
                        {issue.images && issue.images.length > 0 && (
                          <div className="flex gap-1 mt-2">
                            {issue.images.slice(0, 3).map((image, idx) => (
                              <img
                                key={idx}
                                src={image}
                                alt={`Issue ${issue.id}`}
                                className="w-12 h-12 object-cover rounded border"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = `https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXZpYyUyMGlzc3VlJTIwcGxhY2Vob2xkZXJ8ZW58MXx8fHwxNzU3NjAxNTQzfDA&ixlib=rb-4.1.0&q=80&w=100&utm_source=figma&utm_medium=referral`;
                                }}
                              />
                            ))}
                            {issue.images.length > 3 && (
                              <div className="w-12 h-12 bg-gray-100 rounded border flex items-center justify-center text-xs">
                                +{issue.images.length - 3}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(issue.status)}
                      {getPriorityBadge(issue.priority)}
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setSelectedIssue(issue);
                          setIsIssueModalOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <div className="space-y-6">
            {/* Citizen Users Section */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Citizen Users
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search users..."
                        className="pl-8 w-64"
                      />
                    </div>
                    <Button>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add User
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{user.name}</h4>
                            {user.verified && (
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {user.phone}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {user.reportsCount} reports • Last active: {user.lastActive.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {user.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        {user.status === 'active' ? (
                          <Button variant="ghost" size="sm">
                            <Ban className="h-4 w-4 text-red-500" />
                          </Button>
                        ) : (
                          <Button variant="ghost" size="sm">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Admin Users Section */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Administrator Users
                  </CardTitle>
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Admin
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAdminUsers.map((admin) => (
                    <div key={admin.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium">
                            {admin.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{admin.name}</h4>
                            <Badge variant="secondary">{admin.employeeId}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{admin.role} • {admin.department}</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {admin.email}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Last login: {admin.lastLogin.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={admin.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {admin.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

          </div>
        </TabsContent>
      </Tabs>

      {/* Issue Detail Modal */}
      <IssueDetailModal
        issue={selectedIssue}
        open={isIssueModalOpen}
        onClose={() => {
          setIsIssueModalOpen(false);
          setSelectedIssue(null);
        }}
      />
    </div>
  );
}
