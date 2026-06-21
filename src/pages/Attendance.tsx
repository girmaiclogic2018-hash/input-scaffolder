import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Clock, 
  Search, 
  LogIn, 
  LogOut, 
  Calendar,
  User,
  CheckCircle2,
  Clock3,
  QrCode,
  Scan,
  Maximize2
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
import { Input } from '@/components/ui/input';
import { storage, Employee, AttendanceRecord } from '../lib/storage';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';

const Attendance = ({ speak }: { speak: (t: string) => void }) => {
  const { t } = useTranslation();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('checkin');
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    setEmployees(storage.getEmployees());
    setAttendance(storage.getAttendance());
  }, []);

  const handleCheckAction = (empId: string, type: 'in' | 'out') => {
    const now = new Date();
    const timeString = format(now, 'HH:mm:ss');
    const existing = attendance.find(a => a.employeeId === empId && a.date === today);

    if (type === 'in' && existing) {
      toast.error('Already checked in today');
      return;
    }

    if (type === 'out' && !existing) {
      toast.error('Must check in first');
      return;
    }

    const record: AttendanceRecord = existing || {
      id: crypto.randomUUID(),
      employeeId: empId,
      date: today,
      checkIn: timeString,
      offline: !navigator.onLine
    };

    if (type === 'out') {
      record.checkOut = timeString;
    }

    storage.saveAttendance(record);
    setAttendance(storage.getAttendance());
    
    const empName = employees.find(e => e.id === empId)?.fullName || '';
    const msg = type === 'in' ? `${empName} ${t('checkIn')}` : `${empName} ${t('checkOut')}`;
    toast.success(msg);
    speak(msg);
  };

  const filteredEmployees = employees.filter(e => 
    e.fullName.toLowerCase().includes(search.toLowerCase()) ||
    e.employeeId.toLowerCase().includes(search.toLowerCase())
  );

  const getTodayStatus = (empId: string) => {
    return attendance.find(a => a.employeeId === empId && a.date === today);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{t('attendance')}</h1>
          <div className="flex items-center gap-2 text-slate-500">
            <Calendar size={16} />
            <span className="font-medium">{format(new Date(), 'PPPP')}</span>
          </div>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="rounded-2xl gap-2 h-11 px-6 bg-slate-900 shadow-xl shadow-slate-200">
              <QrCode size={18} /> {t('qrCode')}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[400px] rounded-3xl border-none shadow-2xl text-center">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">{t('qrCode')}</DialogTitle>
            </DialogHeader>
            <div className="py-8 flex flex-col items-center gap-6">
              <div className="p-6 bg-white rounded-3xl shadow-inner border border-slate-100">
                <QRCodeSVG 
                  value={`ethio-hr-attendance-${today}`} 
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-800">{t('scanMe')}</p>
                <p className="text-sm text-slate-500 mt-1">Works on any smartphone camera</p>
              </div>
              <div className="w-full flex gap-3 pt-2">
                <Button variant="outline" className="flex-1 rounded-xl h-11" onClick={() => toast.info("Simulated Scanner Ready")}>
                  <Scan size={18} className="mr-2" /> Mock Scan
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-white/50 backdrop-blur-md p-1.5 rounded-2xl mb-6 border border-white/20 h-auto">
          <TabsTrigger value="checkin" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg transition-all">
            Daily Check-in
          </TabsTrigger>
          <TabsTrigger value="history" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg transition-all">
            Log History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="checkin" className="space-y-6">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
            <Input 
              placeholder={t('search')} 
              className="pl-11 h-12 bg-white border-none rounded-2xl shadow-sm"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="bg-white/50 backdrop-blur-md rounded-3xl border border-white/20 shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="border-slate-100 hover:bg-transparent">
                  <TableHead className="h-12">{t('fullName')}</TableHead>
                  <TableHead className="h-12">{t('status')}</TableHead>
                  <TableHead className="h-12">{t('checkIn')}</TableHead>
                  <TableHead className="h-12">{t('checkOut')}</TableHead>
                  <TableHead className="text-right h-12">{t('actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((emp) => {
                  const record = getTodayStatus(emp.id);
                  return (
                    <TableRow key={emp.id} className="border-slate-100 hover:bg-white/80 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                            <User size={14} />
                          </div>
                          <span className="font-semibold text-slate-900">{emp.fullName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {record ? (
                          <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-100 rounded-lg">
                            Present
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-slate-400 border-slate-200 rounded-lg">
                            Pending
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-slate-600 font-mono text-sm">
                        {record?.checkIn || '--:--'}
                      </TableCell>
                      <TableCell className="text-slate-600 font-mono text-sm">
                        {record?.checkOut || '--:--'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {!record && (
                            <Button 
                              size="sm" 
                              className="rounded-xl bg-emerald-600 hover:bg-emerald-700 h-9 px-4 gap-2 shadow-lg shadow-emerald-100"
                              onClick={() => handleCheckAction(emp.id, 'in')}
                            >
                              <LogIn size={14} /> {t('checkIn')}
                            </Button>
                          )}
                          {record && !record.checkOut && (
                            <Button 
                              size="sm" 
                              className="rounded-xl bg-rose-600 hover:bg-rose-700 h-9 px-4 gap-2 shadow-lg shadow-rose-100"
                              onClick={() => handleCheckAction(emp.id, 'out')}
                            >
                              <LogOut size={14} /> {t('checkOut')}
                            </Button>
                          )}
                          {record?.checkOut && (
                            <div className="flex items-center gap-1.5 text-emerald-600 text-sm font-bold pr-2">
                              <CheckCircle2 size={16} /> Completed
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <div className="bg-white/50 backdrop-blur-md rounded-3xl border border-white/20 shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="border-slate-100">
                  <TableHead className="h-12">Date</TableHead>
                  <TableHead className="h-12">Employee</TableHead>
                  <TableHead className="h-12">Check In</TableHead>
                  <TableHead className="h-12">Check Out</TableHead>
                  <TableHead className="h-12">Sync</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendance.sort((a, b) => b.date.localeCompare(a.date)).map((rec) => {
                  const emp = employees.find(e => e.id === rec.employeeId);
                  return (
                    <TableRow key={rec.id} className="border-slate-100 hover:bg-white/80 transition-colors">
                      <TableCell className="font-semibold">{rec.date}</TableCell>
                      <TableCell>{emp?.fullName || 'Deleted Employee'}</TableCell>
                      <TableCell className="font-mono text-slate-600">{rec.checkIn}</TableCell>
                      <TableCell className="font-mono text-slate-600">{rec.checkOut || '--:--'}</TableCell>
                      <TableCell>
                        {rec.offline ? (
                          <Badge variant="outline" className="text-[10px] uppercase font-bold text-orange-600 bg-orange-50 border-orange-100">Offline</Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] uppercase font-bold text-blue-600 bg-blue-50 border-blue-100">Synced</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {attendance.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-48 text-center text-slate-400">
                      <div className="flex flex-col items-center gap-3">
                        <Clock3 size={40} className="opacity-10" />
                        <p className="text-sm">No activity records yet.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Attendance;
