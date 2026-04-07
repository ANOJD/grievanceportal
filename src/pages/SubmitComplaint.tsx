import { useState } from "react";
import { Mic, Upload, MapPin, Brain, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PriorityBadge } from "@/components/PriorityBadge";
import { categoryLabels, type Category, type Priority, type Sentiment } from "@/lib/data";
import { toast } from "sonner";

export default function SubmitComplaint() {
  const [description, setDescription] = useState("");
  const [aiAnalysis, setAiAnalysis] = useState<{
    category: Category;
    priority: Priority;
    sentiment: Sentiment;
    confidence: number;
    keywords: string[];
  } | null>(null);

  const handleDescriptionChange = (val: string) => {
    setDescription(val);
    if (val.length > 40) {
      setAiAnalysis({
        category: "infrastructure",
        priority: "high",
        sentiment: "negative",
        confidence: 0.91,
        keywords: ["road", "pothole", "accident", "repair"],
      });
    } else {
      setAiAnalysis(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Complaint submitted successfully!", {
      description: "Ticket ID: GRV-2024-0853 has been created.",
    });
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Submit a Complaint</h1>
        <p className="text-sm text-muted-foreground">Describe your issue and our AI will classify it automatically</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="rounded-lg border border-border bg-card p-5 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="Brief summary of the issue..." />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="description">Description</Label>
              <Button type="button" variant="outline" size="sm" className="gap-1.5 text-xs">
                <Mic className="h-3.5 w-3.5" /> Voice Input
              </Button>
            </div>
            <Textarea
              id="description"
              placeholder="Describe the issue in detail. You can write in English, Hindi, Kannada, or Tamil..."
              rows={5}
              value={description}
              onChange={(e) => handleDescriptionChange(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={aiAnalysis?.category}>
                <SelectTrigger>
                  <SelectValue placeholder="Auto-detected by AI..." />
                </SelectTrigger>
                <SelectContent>
                  {(Object.entries(categoryLabels) as [Category, string][]).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <div className="relative">
                <Input placeholder="Auto-detect or type..." />
                <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Attachments</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/40 transition-colors cursor-pointer">
              <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Drop files here or click to upload</p>
              <p className="text-xs text-muted-foreground mt-1">Images, documents up to 10MB</p>
            </div>
          </div>
        </div>

        {aiAnalysis && (
          <div className="rounded-lg border border-secondary/30 bg-secondary/5 p-4 animate-slide-in">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="h-4 w-4 text-secondary" />
              <h3 className="text-sm font-semibold">AI Analysis</h3>
              <span className="text-xs text-muted-foreground ml-auto">
                {Math.round(aiAnalysis.confidence * 100)}% confidence
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Category</p>
                <p className="font-medium flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-secondary" />
                  {categoryLabels[aiAnalysis.category]}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Priority</p>
                <PriorityBadge priority={aiAnalysis.priority} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Sentiment</p>
                <p className="font-medium capitalize">{aiAnalysis.sentiment}</p>
              </div>
            </div>

            <div className="mt-3">
              <p className="text-xs text-muted-foreground mb-1.5">Keywords detected</p>
              <div className="flex flex-wrap gap-1.5">
                {aiAnalysis.keywords.map((kw) => (
                  <span key={kw} className="px-2 py-0.5 bg-secondary/10 text-secondary rounded-full text-xs font-medium">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <Button type="submit" className="bg-primary text-primary-foreground">
            Submit Complaint
          </Button>
          <Button type="button" variant="outline">Save as Draft</Button>
        </div>
      </form>
    </div>
  );
}
