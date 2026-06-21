import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Clock, CheckCircle, XCircle, TrendingUp, DollarSign, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { storage } from '../lib/storage';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

const StatCard = ({ title, value, icon: Icon, color, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
  >
    <Card className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow bg-white/50 backdrop-blur-md border border-white/20">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
          </div>
          <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center text-white shadow-lg`}>
            <Icon size={24} />
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const Dashboard = ({ speak }: { speak: (t: string) => void }) => {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    absentToday: 0,
    totalPayroll: 0,
  });

  useEffect(() => {
    const employees = storage.getEmployees();
    const attendance = storage.getAttendance();
    const today = new Date().toISOString().split('T')[0];
    
    const presentToday = attendance.filter(a => a.date === today).length;
    const totalPayroll = employees.reduce((sum, e) => sum + e.salary, 0);

    setStats({
      totalEmployees: employees.length,
      presentToday: presentToday,
      absentToday: employees.length - presentToday,
      totalPayroll: totalPayroll,
    });

    speak(`${t('dashboard')} ${t('appName')}`);
  }, [t, speak]);

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 text-white shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <Badge className="mb-4 bg-white/20 text-white border-none hover:bg-white/30 backdrop-blur-md">
            {t('appName')} v3.0 <Sparkles size={14} className="ml-1 inline" />
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">
            {t('dashboard')}
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed">
            Revolutionizing HR and Payroll management in Ethiopia. 
            Smart, offline-first, and natively multi-lingual for everyone.
          </p>
        </div>
        <div className="absolute top-0 right-0 h-full w-1/3 opacity-40 mix-blend-overlay">
          <img 
            src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/993eeb5d-b23c-48d3-91ab-bf2a68a7ce40/hr-dashboard-hero-b1827683-1782076146292.webp" 
            alt="Dashboard Background" 
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title={t('totalEmployees')} 
          value={stats.totalEmployees} 
          icon={Users} 
          color="bg-blue-600 shadow-blue-200" 
          delay={0.1}
        />
        <StatCard 
          title={t('presentToday')} 
          value={stats.presentToday} 
          icon={CheckCircle} 
          color="bg-emerald-600 shadow-emerald-200" 
          delay={0.2}
        />
        <StatCard 
          title={t('absentToday')} 
          value={stats.absentToday} 
          icon={XCircle} 
          color="bg-rose-600 shadow-rose-200" 
          delay={0.3}
        />
        <StatCard 
          title={t('payroll')} 
          value={`$${stats.totalPayroll.toLocaleString()}`} 
          icon={DollarSign} 
          color="bg-amber-600 shadow-amber-200" 
          delay={0.4}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-none shadow-sm bg-white/50 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">{t('attendance')} Insights</CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex flex-col items-center justify-center text-slate-400">
            <TrendingUp size={48} className="mb-4 opacity-10 text-primary" />
            <p className="max-w-xs text-center text-sm">Real-time attendance trends will be visualised here as data grows.</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white/50 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Innovation Log</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <Sparkles size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">QR Attendance Enabled</p>
                  <p className="text-xs text-slate-500">Contactless check-in is now active.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                  <Clock size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">Multi-language V3 Update</p>
                  <p className="text-xs text-slate-400">Improved Tigrinya and Somali translations.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
