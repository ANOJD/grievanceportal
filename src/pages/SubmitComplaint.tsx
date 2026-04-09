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
import { useTranslation } from "@/contexts/AuthContext";

export default function SubmitComplaint() {
  const [description, setDescription] = useState("");
  const t = useTranslation();
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
    toast.success(t("submitComplaint"), {
      description: "Ticket ID: GRV-2024-0853",
    });
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("submitTitle")}</h1>
        <p className="text-sm text-muted-foreground">{t("submitSub")}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="rounded-lg border border-border bg-card p-5 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">{t("title")}</Label>
            <Input id="title" placeholder={t("titlePlaceholder")} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="description">{t("description")}</Label>
              <Button type="button" variant="outline" size="sm" className="gap-1.5 text-xs">
                <Mic className="h-3.5 w-3.5" /> {t("voiceInput")}
              </Button>
            </div>
            <Textarea
              id="description"
              placeholder={t("descriptionPlaceholder")}
              rows={5}
              value={description}
              onChange={(e) => handleDescriptionChange(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("category")}</Label>
              <Select value={aiAnalysis?.category}>
                <SelectTrigger>
                  <SelectValue placeholder={t("autoDetected")} />
                </SelectTrigger>
                <SelectContent>
                  {(Object.entries(categoryLabels) as [Category, string][]).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("location")}</Label>
              <div className="relative">
                <Input placeholder={t("locationPlaceholder")} />
                <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t("attachments")}</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/40 transition-colors cursor-pointer">
              <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">{t("dropFiles")}</p>
              <p className="text-xs text-muted-foreground mt-1">{t("fileLimit")}</p>
            </div>
          </div>
        </div>

        {aiAnalysis && (
          <div className="rounded-lg border border-secondary/30 bg-secondary/5 p-4 animate-slide-in">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="h-4 w-4 text-secondary" />
              <h3 className="text-sm font-semibold">{t("aiAnalysis")}</h3>
              <span className="text-xs text-muted-foreground ml-auto">
                {Math.round(aiAnalysis.confidence * 100)}% {t("confidence")}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground mb-1">{t("category")}</p>
                <p className="font-medium flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-secondary" />
                  {categoryLabels[aiAnalysis.category]}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">{t("priority")}</p>
                <PriorityBadge priority={aiAnalysis.priority} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">{t("sentiment")}</p>
                <p className="font-medium capitalize">{aiAnalysis.sentiment}</p>
              </div>
            </div>

            <div className="mt-3">
              <p className="text-xs text-muted-foreground mb-1.5">{t("keywordsDetected")}</p>
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
            {t("submitComplaint")}
          </Button>
          <Button type="button" variant="outline">{t("saveAsDraft")}</Button>
        </div>
      </form>
    </div>
  );
}
