import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner';
import { 
  Search, 
  ThumbsUp, 
  MessageCircle, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  MapPin,
  Calendar
} from 'lucide-react';
import { statusColors, priorityColors, categoryIcons, fetchIssues, fetchComments, createComment } from '../utils/mockData';
import { Issue } from '../types';

export function IssueTracker() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [newComment, setNewComment] = useState('');

  React.useEffect(() => {
    let mounted = true;
    fetchIssues().then((data) => {
      if (!mounted) return;
      // normalize dates
      const normalized = data.map((i: any) => ({
        ...i,
        createdAt: i.createdAt ? new Date(i.createdAt) : new Date(),
        updatedAt: i.updatedAt ? new Date(i.updatedAt) : new Date(),
        comments: Array.isArray(i.comments) ? i.comments.map((c: any) => ({ ...c, createdAt: c.createdAt ? new Date(c.createdAt) : new Date() })) : []
      }));
      setIssues(normalized);
    }).catch(() => {});
    return () => { mounted = false; };
  }, []);
  const filteredIssues = issues.filter(issue =>
    issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    issue.location.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleVote = (issueId: string) => {
    setIssues(prev => prev.map(issue =>
      issue.id === issueId
        ? { ...issue, votes: issue.votes + 1 }
        : issue
    ));
    toast.success('Vote recorded!');
  };

  const addComment = () => {
    if (!newComment.trim() || !selectedIssue) return;
    // optimistic UI: post to API
    createComment(selectedIssue.id, newComment).then((saved: any) => {
      const created = {
        id: saved._id || saved.id || Date.now().toString(),
        text: saved.body || newComment,
        author: saved.authorId ? 'You' : 'Citizen',
        createdAt: saved.createdAt ? new Date(saved.createdAt) : new Date(),
        isOfficial: saved.isOfficial || false
      };
      setIssues(prev => prev.map(issue => 
        String(issue.id) === String(selectedIssue.id) 
          ? { ...issue, comments: [...(issue.comments || []), created] }
          : issue
      ));
      setSelectedIssue(prev => prev ? { ...prev, comments: [...(prev.comments || []), created] } : null);
      setNewComment('');
      toast.success('Comment added successfully');
    }).catch(() => {
      toast.error('Failed to add comment');
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'reported':
        return <AlertCircle className="h-4 w-4" />;
      case 'acknowledged':
        return <Clock className="h-4 w-4" />;
      case 'in-progress':
        return <Clock className="h-4 w-4" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusMessage = (issue: Issue) => {
    switch (issue.status) {
      case 'reported':
        return 'Your report has been submitted and is awaiting review by municipal authorities.';
      case 'acknowledged':
        return 'Your report has been acknowledged and assigned to the relevant department.';
      case 'in-progress':
        return `Work is currently in progress. ${issue.assignedTo ? `Assigned to: ${issue.assignedTo}` : ''}`;
      case 'resolved':
        return `This issue has been resolved on ${issue.resolvedAt?.toLocaleDateString()}.`;
      default:
        return 'Status unknown';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Track Your Reports
          </CardTitle>
          <p className="text-muted-foreground">
            Search and track the status of civic issue reports
          </p>
        </CardHeader>
        <CardContent>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by issue title, description, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredIssues.map((issue) => (
          <Card key={issue.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{categoryIcons[issue.category]}</span>
                    <h3 className="font-semibold">{issue.title}</h3>
                  </div>
                  <p className="text-muted-foreground mb-2">{issue.description}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{issue.location.address}</span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 items-end">
                  <div className="flex gap-2">
                    <Badge className={statusColors[issue.status]}>
                      {getStatusIcon(issue.status)}
                      <span className="ml-1">{issue.status}</span>
                    </Badge>
                    <Badge className={priorityColors[issue.priority]}>
                      {issue.priority}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {issue.createdAt.toLocaleDateString()}
                  </div>
                </div>
              </div>

              {issue.images.length > 0 && (
                <div className="mb-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {issue.images.slice(0, 3).map((image, index) => (
                      <ImageWithFallback
                        key={index}
                        src={image}
                        alt={`Issue photo ${index + 1}`}
                        className="w-full h-32 object-cover rounded"
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="p-3 bg-blue-50 rounded-lg mb-4">
                <div className="flex items-center gap-2 mb-2">
                  {getStatusIcon(issue.status)}
                  <span className="font-medium">Status Update</span>
                </div>
                <p className="text-sm">{getStatusMessage(issue)}</p>
                {issue.department && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Department: <span className="capitalize">{issue.department.replace('-', ' ')}</span>
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleVote(issue.id)}
                    className="flex items-center gap-1"
                  >
                    <ThumbsUp className="h-4 w-4" />
                    {issue.votes}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedIssue(selectedIssue?.id === issue.id ? null : issue)}
                    className="flex items-center gap-1"
                  >
                    <MessageCircle className="h-4 w-4" />
                    {issue.comments.length} Comments
                  </Button>
                </div>

                <div className="text-sm text-muted-foreground">
                  Reported by: {issue.reportedBy.name}
                </div>
              </div>

              {selectedIssue?.id === issue.id && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium mb-3">Comments & Updates</h4>
                  
                  <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                    {issue.comments.map((comment) => (
                      <div
                        key={comment.id}
                        className={`p-3 rounded-lg ${
                          comment.isOfficial 
                            ? 'bg-blue-50 border-l-4 border-l-blue-500' 
                            : 'bg-gray-50'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium text-sm">
                            {comment.author}
                            {comment.isOfficial && (
                              <Badge variant="outline" className="ml-2 text-xs">
                                Official
                              </Badge>
                            )}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {comment.createdAt.toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm">{comment.text}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Add a comment or ask for updates..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={2}
                      className="flex-1"
                    />
                    <Button onClick={addComment} disabled={!newComment.trim()}>
                      Post
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredIssues.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No Issues Found</h3>
            <p className="text-muted-foreground">
              {searchTerm 
                ? 'Try adjusting your search terms to find relevant issues.'
                : 'No civic issues have been reported yet.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
