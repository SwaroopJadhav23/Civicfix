import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { MapPin, Eye, MessageCircle, ThumbsUp } from 'lucide-react';
import { categoryIcons, statusColors, fetchIssues } from '../utils/mockData';
import { Issue } from '../types';

export function IssueMap() {
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [issues, setIssues] = useState<Issue[]>([]);

  React.useEffect(() => {
    let mounted = true;
    fetchIssues().then((data) => {
      if (!mounted) return;
      const normalized = data.map((i: any) => ({ ...i, createdAt: i.createdAt ? new Date(i.createdAt) : new Date() }));
      setIssues(normalized);
    }).catch(() => {});
    return () => { mounted = false; };
  }, []);

  const filteredIssues = issues.filter(issue =>
    filter === 'all' || issue.status === filter
  );

  return (
    <div className="p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Issue Map - Pune, Maharashtra
          </CardTitle>
          <div className="flex gap-2 flex-wrap">
            {['all', 'reported', 'in-progress', 'resolved'].map(status => (
              <Button
                key={status}
                variant={filter === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(status)}
              >
                {status === 'all' ? 'All Issues' : status.replace('-', ' ')}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {/* Map Placeholder */}
          <div className="relative bg-muted rounded-lg h-96 mb-4 overflow-hidden">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1579616043939-95d87a6e8512?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwbWFwJTIwdXJiYW4lMjBwbGFubmluZ3xlbnwxfHx8fDE3NTc1MjI3ODR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="City map"
              className="w-full h-full object-cover opacity-40"
            />
            
            {/* Issue Markers */}
            {filteredIssues.map((issue, index) => (
              <div
                key={issue.id}
                className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-full ${
                  selectedIssue?.id === issue.id ? 'z-10' : 'z-0'
                }`}
                style={{
                  left: `${20 + (index * 15) % 60}%`,
                  top: `${30 + (index * 10) % 40}%`
                }}
                onClick={() => setSelectedIssue(issue)}
              >
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg
                  ${issue.priority === 'urgent' ? 'bg-red-500' : 
                    issue.priority === 'high' ? 'bg-orange-500' :
                    issue.priority === 'medium' ? 'bg-yellow-500' : 'bg-gray-500'
                  }
                  ${selectedIssue?.id === issue.id ? 'ring-4 ring-blue-500' : ''}
                `}>
                  <span className="text-xs">
                    {categoryIcons[issue.category]}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Issue Details */}
          {selectedIssue && (
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold">{selectedIssue.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedIssue.location.address}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={statusColors[selectedIssue.status]}>
                      {selectedIssue.status}
                    </Badge>
                    <Badge variant="outline">
                      {selectedIssue.priority}
                    </Badge>
                  </div>
                </div>

                <p className="text-sm mb-3">{selectedIssue.description}</p>

                {selectedIssue.images.length > 0 && (
                  <div className="mb-3">
                    <ImageWithFallback
                      src={selectedIssue.images[0]}
                      alt="Issue photo"
                      className="w-full h-32 object-cover rounded"
                    />
                  </div>
                )}

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="h-4 w-4" />
                    {selectedIssue.votes} votes
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    {selectedIssue.comments.length} comments
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    View Details
                  </span>
                </div>

                {selectedIssue.assignedTo && (
                  <div className="mt-3 p-2 bg-blue-50 rounded text-sm">
                    <p><strong>Assigned to:</strong> {selectedIssue.assignedTo}</p>
                    <p><strong>Department:</strong> {selectedIssue.department}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
