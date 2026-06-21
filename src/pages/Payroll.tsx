import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  CreditCard, 
  Download, 
  Filter, 
  DollarSign, 
  Calendar,
  ChevronRight,
  Printer,
  FileSpreadsheet,
  PieChart,
  ShieldCheck
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { storage, Employee, AttendanceRecord } from '../lib/storage';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

const Payroll = ({ speak }: { speak: (t: string) => void }) => {
  const { t } = useTranslation();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    setEmployees(storage.getEmployees());
    setAttendance(storage.getAttendance());
    speak(`${t('payroll')} management initialized`);
  }, [t, speak]);

  const calculateDaysWorked = (empId: string) => {
    // Current month filter simulation
    const currentMonth = format(new Date(), 'yyyy-MM');
    return attendance.filter(a => a.employeeId === empId && a.date.startsWith(currentMonth)).length;
  };

  const calculateNetSalary = (basic: number, daysWorked: number) => {
    const daysInMonth = 22; // Working days average
    const perDay = basic / daysInMonth;
    const gross = perDay * daysWorked;
    
    // Simple tax simulation (e.g. 10% tax)
    const tax = gross * 0.1;
    return Math.round(gross - tax);
  };

  const handleExport = () => {
    const data = employees.map(e => ({
      Name: e.fullName,
      ID: e.employeeId,
      Sector: e.type,
      BasicSalary: e.salary,
      DaysWorked: calculateDaysWorked(e.id),
      NetSalary: calculateNetSalary(e.salary, calculateDaysWorked(e.id))
    }));
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ethio-hr-payroll-${format(new Date(), 'yyyy-MM')}.json`;
    a.click();
    toast.success('Payroll exported successfully');
    speak("Payroll report generated and downloaded");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{t('payroll')}</h1>
          <p className="text-slate-500 mt-1">Automated salary computation & taxes</p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-2xl gap-2 border-none bg-white shadow-sm h-11 px-6" onClick={() => window.print()}>
            <Printer size={18} /> Print
          </Button>
          <Button className="rounded-2xl shadow-xl shadow-primary/20 gap-2 h-11 px-6" onClick={handleExport}>
            <FileSpreadsheet size={18} /> {t('generateReport')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-xl bg-primary text-primary-foreground rounded-3xl overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <PieChart size={100} />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-80 uppercase tracking-widest">Total Net Payroll</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold">
              ${employees.reduce((s, e) => s + calculateNetSalary(e.salary, calculateDaysWorked(e.id)), 0).toLocaleString()}
            </div>
            <p className="text-xs mt-2 flex items-center gap-1 opacity-70">
              <ShieldCheck size={12} /> Securely calculated for {format(new Date(), 'MMMM')}
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-sm bg-white/50 backdrop-blur-md rounded-3xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-widest">Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-slate-800">
              {employees.length > 0 ? Math.round((attendance.length / (employees.length * 22)) * 100) : 0}%
            </div>
            <p className="text-xs mt-2 text-slate-400">Monthly attendance rate</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white/50 backdrop-blur-md rounded-3xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-widest">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-emerald-600 flex items-center gap-2">
              Ready <Badge className="bg-emerald-100 text-emerald-700 border-none px-2 py-0 h-5">LIVE</Badge>
            </div>
            <p className="text-xs mt-2 text-slate-400">Offline database is in-sync</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white/50 backdrop-blur-md rounded-3xl border border-white/20 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
              <Filter size={14} />
            </div>
            <span className="font-semibold text-slate-700">Salary Breakdown</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl text-xs font-bold text-slate-500 shadow-sm">
            <Calendar size={12} className="text-primary" />
            {format(new Date(), 'MMMM yyyy')}
          </div>
        </div>
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="border-slate-100 hover:bg-transparent">
              <TableHead className="h-12 font-semibold">Employee</TableHead>
              <TableHead className="h-12 font-semibold text-center">{t('workedDays')}</TableHead>
              <TableHead className="h-12 font-semibold text-right">{t('salary')}</TableHead>
              <TableHead className="h-12 font-semibold text-right">{t('netSalary')}</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((emp) => {
              const days = calculateDaysWorked(emp.id);
              const net = calculateNetSalary(emp.salary, days);
              return (
                <TableRow key={emp.id} className="hover:bg-white/80 border-slate-100 transition-colors">
                  <TableCell>
                    <div className="font-bold text-slate-900">{emp.fullName}</div>
                    <div className="text-[10px] text-slate-400 font-mono uppercase tracking-tighter">{emp.employeeId} • {emp.type}</div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 font-bold text-slate-700 border border-slate-100">
                      {days}
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-slate-500 font-medium">
                    ${emp.salary.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="font-extrabold text-slate-900">${net.toLocaleString()}</div>
                    <div className="text-[10px] text-rose-500 font-bold tracking-tighter">Tax: -${Math.round(net * 0.1).toLocaleString()}</div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 rounded-lg">
                      <ChevronRight size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
            {employees.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-48 text-center text-slate-400">
                  <div className="flex flex-col items-center gap-3">
                    <CreditCard size={40} className="opacity-10" />
                    <p className="text-sm">No payroll data available.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Payroll;
