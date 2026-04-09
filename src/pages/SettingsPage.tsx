import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth, useTranslation } from "@/contexts/AuthContext";
import type { Language } from "@/lib/translations";

export default function SettingsPage() {
  const t = useTranslation();
  const { language, setLanguage } = useAuth();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("settingsTitle")}</h1>
        <p className="text-sm text-muted-foreground">{t("settingsSub")}</p>
      </div>

      <div className="rounded-lg border border-border bg-card p-5 space-y-4">
        <h2 className="text-sm font-semibold">{t("profile")}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>{t("fullName")}</Label>
            <Input defaultValue="Rajesh Kumar" />
          </div>
          <div className="space-y-2">
            <Label>{t("email")}</Label>
            <Input defaultValue="rajesh@example.com" />
          </div>
          <div className="space-y-2">
            <Label>{t("phone")}</Label>
            <Input defaultValue="+91 98765 43210" />
          </div>
          <div className="space-y-2">
            <Label>{t("preferredLanguage")}</Label>
            <Select value={language} onValueChange={(v) => setLanguage(v as Language)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">हिन्दी</SelectItem>
                <SelectItem value="kn">ಕನ್ನಡ</SelectItem>
                <SelectItem value="ta">தமிழ்</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-5 space-y-4">
        <h2 className="text-sm font-semibold">{t("notifications")}</h2>
        <div className="space-y-3">
          {[
            [t("emailNotifications"), t("emailNotificationsSub")],
            [t("pushNotifications"), t("pushNotificationsSub")],
            [t("smsAlerts"), t("smsAlertsSub")],
          ].map(([title, desc]) => (
            <div key={title} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{title}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
              <Switch defaultChecked />
            </div>
          ))}
        </div>
      </div>

      <Button>{t("saveChanges")}</Button>
    </div>
  );
}
