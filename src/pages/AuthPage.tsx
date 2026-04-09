import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Brain, MapPin, Languages, Eye, EyeOff, ChevronRight, Sparkles, User, Lock, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth, useTranslation, type UserRole, type Language } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const languages: { code: Language; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "hi", label: "हिन्दी", flag: "🇮🇳" },
  { code: "kn", label: "ಕನ್ನಡ", flag: "🇮🇳" },
  { code: "ta", label: "தமிழ்", flag: "🇮🇳" },
];

const roleOptions: { value: UserRole; icon: string }[] = [
  { value: "user", icon: "👤" },
  { value: "admin", icon: "🛡️" },
  { value: "department", icon: "🏢" },
];

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("user");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { login, signup, setLanguage, language } = useAuth();
  const t = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  const switchMode = () => {
    setIsAnimating(true);
    setError("");
    setTimeout(() => {
      setIsLogin(!isLogin);
      setName("");
      setPassword("");
      setConfirmPassword("");
      setIsAnimating(false);
    }, 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isLogin) {
      const result = login(name, password);
      if (result.success) {
        if (result.role === "admin") navigate("/admin");
        else if (result.role === "department") navigate("/department");
        else navigate("/");
      } else {
        setError(t("invalidCredentials"));
      }
    } else {
      if (password !== confirmPassword) {
        setError(t("passwordMismatch"));
        return;
      }
      const success = signup(name, password, selectedRole);
      if (success) {
        if (selectedRole === "admin") navigate("/admin");
        else if (selectedRole === "department") navigate("/department");
        else navigate("/");
      } else {
        setError(t("userExists"));
      }
    }
  };

  const currentLang = languages.find((l) => l.code === language) || languages[0];

  return (
    <div className="min-h-screen flex bg-background relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="absolute top-1/2 -right-32 w-80 h-80 rounded-full bg-secondary/8 blur-3xl animate-[pulse_6s_ease-in-out_infinite_1s]" />
        <div className="absolute -bottom-20 left-1/3 w-72 h-72 rounded-full bg-info/5 blur-3xl animate-[pulse_10s_ease-in-out_infinite_2s]" />
      </div>

      {/* Language switcher - floating top right */}
      <div className="absolute top-4 right-4 z-50">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 glass-card border-border/30 backdrop-blur-xl">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium">{currentLang.flag} {currentLang.label}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="glass-card backdrop-blur-xl">
            {languages.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={language === lang.code ? "bg-accent" : ""}
              >
                <span className="mr-2">{lang.flag}</span>
                {lang.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Left panel - branding */}
      <div
        className={`hidden lg:flex lg:w-1/2 relative flex-col justify-center px-16 transition-all duration-700 ${
          mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/5" />
        <div className="relative z-10 max-w-lg">
          <div className="flex items-center gap-3 mb-8">
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl animate-[pulse_3s_ease-in-out_infinite]" />
              <div className="relative h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                <Shield className="h-7 w-7 text-primary-foreground" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight font-display">
                GrievanceAI
              </h1>
              <p className="text-xs text-muted-foreground tracking-widest uppercase">
                Public Service Portal
              </p>
            </div>
          </div>

          <h2 className="text-4xl font-bold text-foreground leading-tight mb-4 font-display">
            {t("tagline")}
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-12">
            {t("taglineSub")}
          </p>

          <div className="space-y-6">
            {[
              { icon: Brain, title: t("feature1"), sub: t("feature1Sub"), delay: "0.1s" },
              { icon: MapPin, title: t("feature2"), sub: t("feature2Sub"), delay: "0.3s" },
              { icon: Languages, title: t("feature3"), sub: t("feature3Sub"), delay: "0.5s" },
            ].map((feature) => (
              <div
                key={feature.title}
                className="flex items-start gap-4 group"
                style={{ animationDelay: feature.delay }}
              >
                <div className="h-10 w-10 rounded-xl bg-accent flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors duration-300">
                  <feature.icon className="h-5 w-5 text-accent-foreground group-hover:text-primary transition-colors duration-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative grid */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Right panel - auth form */}
      <div
        className={`w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 transition-all duration-700 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="w-full max-w-md">
          {/* Mobile branding */}
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground font-display">GrievanceAI</h1>
              <p className="text-[10px] text-muted-foreground tracking-widest uppercase">Portal</p>
            </div>
          </div>

          <div
            className={`transition-all duration-300 ${
              isAnimating ? "opacity-0 scale-95 translate-y-4" : "opacity-100 scale-100 translate-y-0"
            }`}
          >
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-primary animate-[pulse_2s_ease-in-out_infinite]" />
                <h2 className="text-2xl font-bold text-foreground font-display">
                  {isLogin ? t("welcome") : t("getStarted")}
                </h2>
              </div>
              <p className="text-muted-foreground text-sm">
                {isLogin ? t("welcomeSub") : t("getStartedSub")}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-foreground">
                  {t("name")}
                </Label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t("namePlaceholder")}
                    className="pl-10 h-12 bg-muted/30 border-border/50 focus:bg-background focus:border-primary/50 transition-all duration-300"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                  {t("password")}
                </Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t("passwordPlaceholder")}
                    className="pl-10 pr-10 h-12 bg-muted/30 border-border/50 focus:bg-background focus:border-primary/50 transition-all duration-300"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password (signup only) */}
              {!isLogin && (
                <div className="space-y-2 animate-slide-in">
                  <Label htmlFor="confirm" className="text-sm font-medium text-foreground">
                    {t("confirmPassword")}
                  </Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
                    <Input
                      id="confirm"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder={t("confirmPlaceholder")}
                      className="pl-10 h-12 bg-muted/30 border-border/50 focus:bg-background focus:border-primary/50 transition-all duration-300"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Role selector (signup only) */}
              {!isLogin && (
                <div className="space-y-2 animate-slide-in">
                  <Label className="text-sm font-medium text-foreground">{t("role")}</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {roleOptions.map((role) => (
                      <button
                        type="button"
                        key={role.value}
                        onClick={() => setSelectedRole(role.value)}
                        className={`relative flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-300 ${
                          selectedRole === role.value
                            ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                            : "border-border/50 bg-muted/20 hover:border-border hover:bg-muted/40"
                        }`}
                      >
                        <span className="text-xl">{role.icon}</span>
                        <span className="text-xs font-medium text-foreground">{t(role.value)}</span>
                        {selectedRole === role.value && (
                          <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                            <ChevronRight className="h-2.5 w-2.5 text-primary-foreground rotate-[-45deg]" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 animate-slide-in">
                  <p className="text-sm text-destructive font-medium">{error}</p>
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                className="w-full h-12 text-sm font-semibold relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {isLogin ? t("login") : t("signup")}
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            </form>

            {/* Switch mode */}
            <div className="mt-8 text-center">
              <span className="text-sm text-muted-foreground">
                {isLogin ? t("newHere") : t("haveAccount")}{" "}
              </span>
              <button
                onClick={switchMode}
                className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline"
              >
                {isLogin ? t("createAccount") : t("signIn")}
              </button>
            </div>

            {/* Demo credentials */}
            <div className="mt-6 p-4 rounded-xl bg-muted/30 border border-border/30">
              <p className="text-xs font-medium text-muted-foreground mb-2 text-center">Demo Credentials</p>
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { label: "Admin", user: "admin", pass: "admin123" },
                  { label: "User", user: "user", pass: "user123" },
                  { label: "Officer", user: "officer", pass: "officer123" },
                ].map((cred) => (
                  <button
                    key={cred.user}
                    type="button"
                    onClick={() => { setName(cred.user); setPassword(cred.pass); setIsLogin(true); }}
                    className="p-2 rounded-lg bg-background/50 hover:bg-accent/50 border border-border/30 transition-all duration-200 hover:shadow-sm group"
                  >
                    <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">{cred.label}</p>
                    <p className="text-[10px] text-muted-foreground">{cred.user}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
