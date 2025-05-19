import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const Settings: React.FC = () => {
  const { t, i18n } = useTranslation();
  
  const [profileSettings, setProfileSettings] = useState({
    name: "Nikolay Ivanov",
    email: "nikolay.ivanov@example.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100",
    bio: "Legal technology specialist with experience in legislative document management.",
  });

  const [accountSettings, setAccountSettings] = useState({
    username: "nivanov",
    language: i18n.language || "en",
    theme: "light",
  });
  
  // Update i18n language when account settings change
  useEffect(() => {
    if (i18n.language !== accountSettings.language) {
      i18n.changeLanguage(accountSettings.language);
    }
  }, [accountSettings.language, i18n]);

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    documentUpdates: true,
    verificationAlerts: true,
    weeklyDigest: false,
  });

  const [systemSettings, setSystemSettings] = useState({
    apiEndpoint: "https://api.legaltrack.example.com",
    defaultXmlFormat: "AkomaNtoso",
    maxVersionsToKeep: "10",
    enableExperimentalFeatures: false,
  });

  const [aiSettings, setAiSettings] = useState({
    apiKey: "••••••••••••••••••••••••••",
    model: "mistral",
    maxTokens: "2048",
    enableSemanticAnalysis: true,
    enableAutomatedVerification: true,
  });

  const handleSaveProfile = () => {
    // Would save profile to API in a real app
    console.log("Saving profile settings:", profileSettings);
  };

  const handleSaveAccount = () => {
    // Would save account settings to API in a real app
    console.log("Saving account settings:", accountSettings);
  };

  const handleSaveNotifications = () => {
    // Would save notification settings to API in a real app
    console.log("Saving notification settings:", notificationSettings);
  };

  const handleSaveSystem = () => {
    // Would save system settings to API in a real app
    console.log("Saving system settings:", systemSettings);
  };

  const handleSaveAI = () => {
    // Would save AI settings to API in a real app
    console.log("Saving AI settings:", aiSettings);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('settings.title')}</h1>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-5">
          <TabsTrigger value="profile">{t('settings.tabs.profile')}</TabsTrigger>
          <TabsTrigger value="account">{t('settings.tabs.account')}</TabsTrigger>
          <TabsTrigger value="notifications">{t('settings.tabs.notifications')}</TabsTrigger>
          <TabsTrigger value="system">{t('settings.tabs.system')}</TabsTrigger>
          <TabsTrigger value="ai">{t('settings.tabs.aiModels')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Manage your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex-shrink-0">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profileSettings.avatar} alt="Profile" />
                    <AvatarFallback>NI</AvatarFallback>
                  </Avatar>
                </div>
                <div className="space-y-2 flex-grow">
                  <Label htmlFor="avatar">Profile Image</Label>
                  <div className="flex gap-4">
                    <Input id="avatar-upload" type="file" className="max-w-80" />
                    <Button variant="outline">Change</Button>
                  </div>
                </div>
              </div>

              <Separator />
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profileSettings.name}
                      onChange={(e) => setProfileSettings({ ...profileSettings, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileSettings.email}
                      onChange={(e) => setProfileSettings({ ...profileSettings, email: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Biography</Label>
                  <Textarea
                    id="bio"
                    rows={4}
                    value={profileSettings.bio}
                    onChange={(e) => setProfileSettings({ ...profileSettings, bio: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSaveProfile}>Save Profile</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.account.title')}</CardTitle>
              <CardDescription>{t('settings.account.subtitle')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">{t('settings.account.username')}</Label>
                    <Input
                      id="username"
                      value={accountSettings.username}
                      onChange={(e) => setAccountSettings({ ...accountSettings, username: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">{t('settings.account.language')}</Label>
                    <LanguageSwitcher variant="full" className="w-full" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="theme">{t('settings.account.theme')}</Label>
                  <Select
                    value={accountSettings.theme}
                    onValueChange={(value) => setAccountSettings({ ...accountSettings, theme: value })}
                  >
                    <SelectTrigger id="theme">
                      <SelectValue placeholder={t('settings.account.theme')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">{t('settings.account.themes.light')}</SelectItem>
                      <SelectItem value="dark">{t('settings.account.themes.dark')}</SelectItem>
                      <SelectItem value="system">{t('settings.account.themes.system')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Security</h3>
                <Button variant="outline" className="w-full md:w-auto">
                  Change Password
                </Button>
                <Button variant="outline" className="w-full md:w-auto">
                  Enable Two-Factor Authentication
                </Button>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSaveAccount}>Save Account Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Control how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-neutral-500">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, emailNotifications: checked })}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Document Updates</h3>
                    <p className="text-sm text-neutral-500">Notifications when documents you follow are updated</p>
                  </div>
                  <Switch
                    checked={notificationSettings.documentUpdates}
                    onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, documentUpdates: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Verification Alerts</h3>
                    <p className="text-sm text-neutral-500">Receive alerts about verification issues</p>
                  </div>
                  <Switch
                    checked={notificationSettings.verificationAlerts}
                    onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, verificationAlerts: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Weekly Digest</h3>
                    <p className="text-sm text-neutral-500">Receive a weekly summary of system activity</p>
                  </div>
                  <Switch
                    checked={notificationSettings.weeklyDigest}
                    onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, weeklyDigest: checked })}
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSaveNotifications}>Save Notification Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>Configure system-wide settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="apiEndpoint">API Endpoint</Label>
                    <Input
                      id="apiEndpoint"
                      value={systemSettings.apiEndpoint}
                      onChange={(e) => setSystemSettings({ ...systemSettings, apiEndpoint: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="xmlFormat">Default XML Format</Label>
                    <Select
                      value={systemSettings.defaultXmlFormat}
                      onValueChange={(value) => setSystemSettings({ ...systemSettings, defaultXmlFormat: value })}
                    >
                      <SelectTrigger id="xmlFormat">
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AkomaNtoso">Akoma Ntoso</SelectItem>
                        <SelectItem value="LegalDocML">LegalDocML</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxVersions">Max Versions to Keep</Label>
                    <Input
                      id="maxVersions"
                      type="number"
                      value={systemSettings.maxVersionsToKeep}
                      onChange={(e) => setSystemSettings({ ...systemSettings, maxVersionsToKeep: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-8">
                    <Switch
                      id="experimental"
                      checked={systemSettings.enableExperimentalFeatures}
                      onCheckedChange={(checked) => setSystemSettings({ ...systemSettings, enableExperimentalFeatures: checked })}
                    />
                    <Label htmlFor="experimental">Enable Experimental Features</Label>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">System Maintenance</h3>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline">
                    <i className="fas fa-database mr-2"></i>
                    Rebuild Knowledge Graph
                  </Button>
                  <Button variant="outline">
                    <i className="fas fa-arrows-rotate mr-2"></i>
                    Rescan Documents
                  </Button>
                  <Button variant="outline" className="text-red-500">
                    <i className="fas fa-trash mr-2"></i>
                    Clear Cache
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSaveSystem}>Save System Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ai">
          <Card>
            <CardHeader>
              <CardTitle>AI & Models Configuration</CardTitle>
              <CardDescription>Configure AI services and language models</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="apiKey">API Key</Label>
                    <Input
                      id="apiKey"
                      type="password"
                      value={aiSettings.apiKey}
                      onChange={(e) => setAiSettings({ ...aiSettings, apiKey: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">Language Model</Label>
                    <Select
                      value={aiSettings.model}
                      onValueChange={(value) => setAiSettings({ ...aiSettings, model: value })}
                    >
                      <SelectTrigger id="model">
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="llama">Llama 2</SelectItem>
                        <SelectItem value="mistral">Mistral</SelectItem>
                        <SelectItem value="vikhr">Vikhr (Russian/Kazakh)</SelectItem>
                        <SelectItem value="custom">Custom Model</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxTokens">Max Tokens</Label>
                    <Input
                      id="maxTokens"
                      type="number"
                      value={aiSettings.maxTokens}
                      onChange={(e) => setAiSettings({ ...aiSettings, maxTokens: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="space-y-4 pt-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="semanticAnalysis"
                      checked={aiSettings.enableSemanticAnalysis}
                      onCheckedChange={(checked) => setAiSettings({ ...aiSettings, enableSemanticAnalysis: checked })}
                    />
                    <Label htmlFor="semanticAnalysis">Enable Semantic Analysis</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="automatedVerification"
                      checked={aiSettings.enableAutomatedVerification}
                      onCheckedChange={(checked) => setAiSettings({ ...aiSettings, enableAutomatedVerification: checked })}
                    />
                    <Label htmlFor="automatedVerification">Enable Automated Verification</Label>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Model Training</h3>
                <p className="text-sm text-neutral-500">
                  Fine-tune the language model with your specific legislative corpus
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline">
                    <i className="fas fa-brain mr-2"></i>
                    Fine-tune Model
                  </Button>
                  <Button variant="outline">
                    <i className="fas fa-circle-info mr-2"></i>
                    Evaluation Metrics
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSaveAI}>Save AI Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default Settings;
