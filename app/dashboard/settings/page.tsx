'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';

export default function SettingsPage() {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    priceAlerts: true,
    twoFactor: false,
    darkMode: true,
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 mt-2">Manage your account and preferences</p>
      </div>

      {/* Profile Settings */}
      <Card className="border-slate-800 bg-slate-900/50">
        <CardHeader>
          <CardTitle className="text-white">Account</CardTitle>
          <CardDescription className="text-slate-400">Update your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-200">Email Address</label>
            <Input
              type="email"
              defaultValue={user?.email}
              className="bg-slate-900/50 border-slate-700 text-white"
              disabled
            />
            <p className="text-xs text-slate-500">Your email address cannot be changed</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-200">API Key</label>
            <div className="flex gap-2">
              <Input
                type="password"
                value="••••••••••••••••••••••••"
                className="bg-slate-900/50 border-slate-700 text-white"
                disabled
              />
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">Regenerate</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="border-slate-800 bg-slate-900/50">
        <CardHeader>
          <CardTitle className="text-white">Notifications</CardTitle>
          <CardDescription className="text-slate-400">Manage your notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/30">
            <div>
              <p className="font-medium text-slate-200">Email Notifications</p>
              <p className="text-sm text-slate-400">Receive updates about your portfolio</p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={() => handleToggle('emailNotifications')}
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/30">
            <div>
              <p className="font-medium text-slate-200">Price Alerts</p>
              <p className="text-sm text-slate-400">Get notified about price changes</p>
            </div>
            <Switch checked={settings.priceAlerts} onCheckedChange={() => handleToggle('priceAlerts')} />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/30">
            <div>
              <p className="font-medium text-slate-200">Two-Factor Authentication</p>
              <p className="text-sm text-slate-400">Enhance security with 2FA</p>
            </div>
            <Switch
              checked={settings.twoFactor}
              onCheckedChange={() => handleToggle('twoFactor')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Display Settings */}
      <Card className="border-slate-800 bg-slate-900/50">
        <CardHeader>
          <CardTitle className="text-white">Display</CardTitle>
          <CardDescription className="text-slate-400">Customize your interface</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/30">
            <div>
              <p className="font-medium text-slate-200">Dark Mode</p>
              <p className="text-sm text-slate-400">Always on</p>
            </div>
            <Switch checked={settings.darkMode} disabled />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-200">Currency</label>
            <select className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50">
              <option>USD ($)</option>
              <option>EUR (€)</option>
              <option>GBP (£)</option>
              <option>JPY (¥)</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-900 bg-red-950/20">
        <CardHeader>
          <CardTitle className="text-red-400">Danger Zone</CardTitle>
          <CardDescription className="text-red-300/50">Irreversible actions</CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="bg-red-600 hover:bg-red-700 text-white">Delete Account</Button>
        </CardContent>
      </Card>
    </div>
  );
}
