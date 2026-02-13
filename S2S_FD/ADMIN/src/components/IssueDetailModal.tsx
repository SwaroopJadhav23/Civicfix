import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  MessageCircle,
  ThumbsUp,
  Edit,
  Trash2,
  X
} from 'lucide-react';
import { Issue } from '../types';
import { statusColors, priorityColors, categoryIcons, fetchComments, uploadAttachment } from '../utils/mockData';
import { useState, useEffect } from 'react';

interface IssueDetailModalProps {
  issue: Issue | null;
  open: boolean;
  onClose: () => void;
}

export function IssueDetailModal({ issue, open, onClose }: IssueDetailModalProps) {
  if (!issue) return null;
  const [comments, setComments] = useState<any[]>(issue.comments || []);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetchComments(issue.id).then((c: any) => {
      if (!mounted) return;
      setComments(Array.isArray(c) ? c.map((x: any) => ({ ...x, createdAt: x.createdAt ? new Date(x.createdAt) : new Date() })) : []);
    }).catch(() => {});
    return () => { mounted = false; };
  }, [issue.id]);

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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <DialogTitle className="text-xl flex items-center gap-2">
                <span className="text-2xl">{categoryIcons[issue.category]}</span>
                {issue.title}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                {getStatusBadge(issue.status)}
                {getPriorityBadge(issue.priority)}
                <Badge variant="outline">ID: {issue.id}</Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-6">
            {/* Issue Images */}
            {issue.images && issue.images.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Reported Images</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {issue.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Issue ${issue.id} - Image ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg border"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXZpYyUyMGlzc3VlJTIwcGxhY2Vob2xkZXJ8ZW58MXx8fHwxNzU3NjAxNTQzfDA&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral`;
                        }}
                      />
                      <Button
                        variant="secondary"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => window.open(image, '_blank')}
                      >
                        View Full
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Issue Description */}
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {issue.description}
              </p>
            </div>

            {/* Location & Reporter Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Location */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location
                </h3>
                <div className="space-y-2">
                  <p className="text-sm">{issue.location.address}</p>
                  <p className="text-xs text-muted-foreground">
                    Coordinates: {issue.location.lat.toFixed(4)}, {issue.location.lng.toFixed(4)}
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    View on Map
                  </Button>
                </div>
              </div>

              {/* Reporter */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Reported By
                </h3>
                <div className="space-y-2">
                  <p className="font-medium">{issue.reportedBy.name}</p>
                  {issue.reportedBy.email && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {issue.reportedBy.email}
                    </p>
                  )}
                  {issue.reportedBy.phone && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {issue.reportedBy.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Dates & Assignment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Dates */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Timeline
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reported:</span>
                    <span>{formatDate(issue.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Updated:</span>
                    <span>{formatDate(issue.updatedAt)}</span>
                  </div>
                  {issue.resolvedAt && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Resolved:</span>
                      <span className="text-green-600">{formatDate(issue.resolvedAt)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Assignment */}
              <div>
                <h3 className="font-semibold mb-3">Assignment</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Department:</span>
                    <span className="capitalize">{issue.department.replace('-', ' ')}</span>
                  </div>
                  {issue.assignedTo && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Assigned To:</span>
                      <span>{issue.assignedTo}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div>
              <h3 className="font-semibold mb-3">Community Engagement</h3>
              <div className="flex gap-4">
                <div className="flex items-center gap-1 text-sm">
                  <ThumbsUp className="h-4 w-4 text-blue-600" />
                  <span>{issue.votes} votes</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <MessageCircle className="h-4 w-4 text-green-600" />
                  <span>{issue.comments.length} comments</span>
                </div>
              </div>
            </div>

            {/* Comments */}
                {comments && comments.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Comments & Updates</h3>
                <div className="space-y-4">
                      {comments.map((comment) => (
                    <div 
                      key={comment.id} 
                      className={`p-4 rounded-lg border ${comment.isOfficial ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{comment.author}</span>
                          {comment.isOfficial && (
                            <Badge variant="secondary" className="text-xs">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Official
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                        <p className="text-sm leading-relaxed">{comment.text || comment.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <Separator />
            <div className="flex gap-3 pt-2">
              <label className="flex-1">
                <input type="file" accept="image/*" onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  setUploading(true);
                  try {
                    // token management left to app; this will attempt without token
                    await uploadAttachment(issue.id, f);
                    toast.success('Uploaded image. Refresh to see changes.');
                  } catch (err) {
                    toast.error('Upload failed');
                  } finally {
                    setUploading(false);
                  }
                }} />
              </label>
              <Button variant="outline" className="flex-1">
                <Edit className="h-4 w-4 mr-2" />
                Update Status
              </Button>
              {issue.status !== 'resolved' && (
                <Button className="flex-1">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark Resolved
                </Button>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}