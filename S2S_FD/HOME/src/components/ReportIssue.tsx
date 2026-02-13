import { useState } from "react";
import { Camera, Video, MapPin, ArrowLeft, RotateCcw, X, Check, Eye, Share2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

interface ReportIssueProps {
  onBack: () => void;
}

export function ReportIssue({ onBack }: ReportIssueProps) {
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priority, setPriority] = useState("Low");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedTokenId, setSubmittedTokenId] = useState("");
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState("");

  const categories = [
    { id: "roads", name: "Roads", icon: "1" },
    { id: "garbage", name: "Garbage", icon: "2" },
    { id: "water", name: "Water", icon: "3" },
    { id: "electricity", name: "Electricity", icon: "4" }
  ];

  const attachmentButtons = [
    { icon: <Camera className="h-5 w-5" />, label: "Upload Photo", type: "photo" },
    { icon: <Video className="h-5 w-5" />, label: "Upload Video", type: "video" }
  ];

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    const priorityMap = {
      electricity: "Emergency",
      water: "High",
      roads: "Medium",
      garbage: "Low"
    };
    setPriority(priorityMap[categoryId as keyof typeof priorityMap] || "Low");
  };

  const [location, setLocation] = useState("");
  const [recentReports, setRecentReports] = useState<
    { tokenId: string; location: string; category: string; createdAt: string }[]
  >([]);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Location services are not available on this device.");
      return;
    }
    setIsLocating(true);
    setLocationError("");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates({ lat: latitude, lng: longitude });
        if (!location) {
          setLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        }
        setIsLocating(false);
      },
      () => {
        setLocationError("Unable to fetch your precise location. Please enter it manually.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = () => {
    const newTokenId = `#2025-${String(Math.floor(Math.random() * 9999)).padStart(4, "0")}`;
    setSubmittedTokenId(newTokenId);
    setShowSuccessModal(true);
    const categoryName = categories.find(c => c.id === selectedCategory)?.name || "Issue";
    const createdAt = new Date().toLocaleString();
    setRecentReports(prev => [
      {
        tokenId: newTokenId,
        location,
        category: categoryName,
        createdAt
      },
      ...prev
    ].slice(0, 5));
  };

  const handleReset = () => {
    setDescription("");
    setSelectedCategory("");
    setPriority("Low");
    setLocation("");
    setCoordinates(null);
    setLocationError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-10">
      <div className="container mx-auto px-4 max-w-5xl">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 text-gray-600 hover:text-gray-900 transition-colors duration-150"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <Card className="shadow-xl border border-slate-100 rounded-2xl">
          <CardHeader className="bg-white border-b border-slate-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="text-2xl md:text-3xl text-slate-900">
                  New Civic Issue Report
                </CardTitle>
                <p className="text-sm text-slate-500 mt-1 max-w-xl">
                  Provide clear and complete information so that the responsible department can review
                  and act on your report efficiently.
                </p>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs uppercase tracking-wide text-slate-400">Reference</span>
                <span className="text-sm font-medium text-slate-700">
                  {submittedTokenId || "Token will be generated after submission"}
                </span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8 space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="description" className="text-gray-800">
                    Describe Your Issue
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide a clear, concise description of the issue."
                    className="mt-2 min-h-[140px] border-slate-200 focus-visible:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Avoid sharing personal information. Focus on the location and nature of the issue.
                  </p>
                </div>

                <div>
                  <Label className="text-gray-800">Add Attachments</Label>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {attachmentButtons.map((button) => (
                      <Button
                        key={button.type}
                        variant="outline"
                        className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-150 hover:-translate-y-[1px] hover:shadow-sm"
                      >
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">{button.icon}</div>
                        <span className="text-xs text-center">{button.label}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-gray-800">Select Category</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                    {categories.map((category) => (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? "default" : "outline"}
                        onClick={() => handleCategorySelect(category.id)}
                        className={`h-auto p-3 flex flex-col items-center space-y-1 rounded-xl transition-all duration-150 ${
                          selectedCategory === category.id
                            ? "bg-blue-600 text-white shadow-sm"
                            : "hover:bg-blue-50 hover:border-blue-300 hover:-translate-y-[1px] hover:shadow-sm"
                        }`}
                      >
                        <span className="text-lg">{category.icon}</span>
                        <span className="text-xs">{category.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {selectedCategory && (
                  <div>
                    <Label className="text-gray-700">Priority</Label>
                    <div className="mt-2">
                      <Badge
                        variant="secondary"
                        className={`text-sm px-3 py-1 ${
                          priority.includes("Emergency")
                            ? "bg-red-100 text-red-800"
                            : priority.includes("High")
                            ? "bg-orange-100 text-orange-800"
                            : priority.includes("Medium")
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {priority}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="location" className="text-gray-800">
                    Location
                  </Label>
                  <div className="mt-2 flex flex-col gap-3">
                    <div className="relative">
                      <Input
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Enter landmark, street name, or area"
                        className="pl-9 border-slate-200 focus-visible:ring-blue-500"
                      />
                      <MapPin className="h-4 w-4 text-blue-600 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleUseCurrentLocation}
                        disabled={isLocating}
                        className="border-blue-200 text-blue-700 hover:bg-blue-50 transition-colors duration-150"
                      >
                        {isLocating ? "Detecting location..." : "Use my current location"}
                      </Button>
                      <p className="text-xs text-gray-500">
                        Example: JSPM University Road, near library building.
                      </p>
                    </div>
                    {locationError && (
                      <p className="text-xs text-red-600">
                        {locationError}
                      </p>
                    )}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
                  <div className="px-4 py-2 flex items-center justify-between border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-slate-800">Location Preview (Google Maps)</span>
                    </div>
                    <span className="text-xs text-slate-500">
                      For reference only
                    </span>
                  </div>
                  <div className="w-full h-56 bg-slate-200">
                    {coordinates || location ? (
                      <iframe
                        title="Issue location on Google Maps"
                        src={
                          coordinates
                            ? `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}&z=18&output=embed`
                            : `https://www.google.com/maps?q=${encodeURIComponent(location)}&output=embed`
                        }
                        width="100%"
                        height="100%"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-slate-500">
                        Enter a location above or use your current location to preview it on the map.
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-lg bg-slate-50 border border-dashed border-slate-200 p-4 text-xs text-slate-500">
                  Once submitted, your report will be routed to the appropriate municipal department.
                  You will receive a token ID to track the status of your complaint.
                  {coordinates && (
                    <div className="mt-2 text-[11px] text-slate-600">
                      Captured coordinates: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 pt-6">
              <Button
                onClick={handleSubmit}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full transition-all duration-150 hover:shadow-md hover:-translate-y-[1px]"
                disabled={!description || !selectedCategory || !location}
              >
                <Check className="mr-2 h-4 w-4" />
                Submit Complaint
              </Button>
              <Button
                variant="outline"
                onClick={handleReset}
                className="border-slate-300 text-slate-700 hover:bg-slate-50 rounded-full transition-all duration-150 hover:-translate-y-[1px] hover:shadow-sm"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset Form
              </Button>
              <Button
                variant="outline"
                onClick={onBack}
                className="text-gray-600 hover:bg-gray-50 rounded-full transition-all duration-150 hover:-translate-y-[1px] hover:shadow-sm"
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>

        {recentReports.length > 0 && (
          <div className="mt-8">
            <Card className="shadow-md border border-slate-100">
              <CardHeader>
                <CardTitle className="text-lg">Recently Submitted Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  {recentReports.map(report => (
                    <div
                      key={report.tokenId}
                      className="flex items-start justify-between rounded-lg border border-slate-100 bg-white px-4 py-3"
                    >
                      <div>
                        <div className="font-medium text-slate-900">{report.category}</div>
                        <div className="text-slate-600">{report.location}</div>
                        <div className="text-[11px] text-slate-500 mt-1">
                          Submitted at {report.createdAt}
                        </div>
                      </div>
                      <Badge variant="outline" className="text-[11px]">
                        {report.tokenId}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
          <DialogContent className="max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-center text-slate-900">
                Complaint Submitted Successfully
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Token ID Generated</p>
                  <p className="text-xl font-semibold text-gray-800">{submittedTokenId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <Badge className="bg-blue-100 text-blue-800">Reported</Badge>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    Your complaint has been recorded. You can use the token ID to track its status.
                  </p>
                </div>
              </div>
              <div className="flex flex-col space-y-3">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white transition-all duration-150 hover:shadow-md hover:-translate-y-[1px]">
                  <Eye className="mr-2 h-4 w-4" />
                  Track My Complaint
                </Button>
                <Button
                  variant="outline"
                  className="border-blue-300 text-blue-600 hover:bg-blue-50 transition-all duration-150 hover:-translate-y-[1px] hover:shadow-sm"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share with Community
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
