import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  UserPlus, 
  Building2, 
  Briefcase,
  Trash2,
  Edit2,
  Users
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { storage, Employee } from '../lib/storage';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { AnimatePresence } from 'framer-motion';

const EmployeeManagement = ({ speak }: { speak: (t: string) => void }) => {
  const { t } = useTranslation();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState<Partial<Employee>>({
    type: 'private',
    status: 'active',
    department: '',
    position: '',
    fullName: '',
    employeeId: '',
    salary: 0
  });

  useEffect(() => {
    setEmployees(storage.getEmployees());
  }, []);

  const filteredEmployees = useMemo(() => {
    return employees.filter(e => 
      e.fullName.toLowerCase().includes(search.toLowerCase()) ||
      e.employeeId.toLowerCase().includes(search.toLowerCase()) ||
      e.department.toLowerCase().includes(search.toLowerCase())
    );
  }, [employees, search]);

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmployee.fullName || !newEmployee.employeeId) {
      toast.error('Please fill required fields');
      return;
    }

    const employee: Employee = {
      id: crypto.randomUUID(),
      fullName: newEmployee.fullName!,
      employeeId: newEmployee.employeeId!,
      department: newEmployee.department || 'General',
      position: newEmployee.position || 'Staff',
      salary: Number(newEmployee.salary) || 0,
      type: (newEmployee.type as any) || 'private',
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    storage.saveEmployee(employee);
    setEmployees(storage.getEmployees());
    setIsAddDialogOpen(false);
    setNewEmployee({ type: 'private', status: 'active' });
    toast.success(t('success'));
    speak(`${t('success')}: ${employee.fullName}`);
  };

  const handleDelete = (id: string) => {
    storage.deleteEmployee(id);
    setEmployees(storage.getEmployees());
    toast.info('Employee removed');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{t('employees')}</h1>
          <p className="text-slate-500 mt-1">Manage staff across sectors</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl shadow-lg shadow-primary/20 gap-2 h-11 px-6">
              <Plus size={18} /> {t('addEmployee')}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] rounded-3xl border-none shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <UserPlus className="text-primary" /> {t('addEmployee')}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddEmployee} className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="fullName" className="text-slate-600 ml-1">{t('fullName')}</Label>
                  <Input 
                    id="fullName" 
                    placeholder="e.g. Abebe Kebede" 
                    className="rounded-xl h-11"
                    value={newEmployee.fullName} 
                    onChange={e => setNewEmployee({...newEmployee, fullName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="id" className="text-slate-600 ml-1">{t('employeeId')}</Label>
                  <Input 
                    id="id" 
                    placeholder="EMP-001" 
                    className="rounded-xl h-11"
                    value={newEmployee.employeeId} 
                    onChange={e => setNewEmployee({...newEmployee, employeeId: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-slate-600 ml-1">{t('employeeType')}</Label>
                  <Select 
                    value={newEmployee.type} 
                    onValueChange={v => setNewEmployee({...newEmployee, type: v as any})}
                  >
                    <SelectTrigger id="type" className="rounded-xl h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="government">{t('government')}</SelectItem>
                      <SelectItem value="private">{t('private')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dept" className="text-slate-600 ml-1">{t('department')}</Label>
                  <Input 
                    id="dept" 
                    placeholder="e.g. Finance" 
                    className="rounded-xl h-11"
                    value={newEmployee.department} 
                    onChange={e => setNewEmployee({...newEmployee, department: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salary" className="text-slate-600 ml-1">{t('salary')}</Label>
                  <Input 
                    id="salary" 
                    type="number" 
                    placeholder="0.00" 
                    className="rounded-xl h-11"
                    value={newEmployee.salary} 
                    onChange={e => setNewEmployee({...newEmployee, salary: Number(e.target.value)})}
                  />
                </div>
              </div>
              <DialogFooter className="pt-6">
                <Button type="button" variant="ghost" onClick={() => setIsAddDialogOpen(false)}>{t('cancel')}</Button>
                <Button type="submit" className="rounded-xl h-11 px-8 shadow-lg shadow-primary/20">{t('save')}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary" size={18} />
        <Input 
          placeholder={t('search')} 
          className="pl-11 h-12 bg-white border-slate-200 rounded-xl shadow-sm focus:ring-primary/20 transition-all border-none"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-white/50 backdrop-blur-md rounded-3xl border border-white/20 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-slate-100">
              <TableHead className="font-semibold h-12">{t('fullName')}</TableHead>
              <TableHead className="font-semibold h-12">{t('department')}</TableHead>
              <TableHead className="font-semibold h-12">{t('employeeType')}</TableHead>
              <TableHead className="font-semibold text-right h-12">{t('salary')}</TableHead>
              <TableHead className="w-[80px] h-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="popLayout">
              {filteredEmployees.map((emp) => (
                <TableRow key={emp.id} className="group border-slate-100 hover:bg-white/80 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {emp.fullName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{emp.fullName}</p>
                        <p className="text-xs text-slate-500 font-mono uppercase">{emp.employeeId}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Briefcase size={14} className="text-slate-400" />
                      {emp.department}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={`rounded-xl px-3 py-1 font-medium ${
                      emp.type === 'government' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                    }`}>
                      {emp.type === 'government' ? <Building2 size={12} className="mr-1.5 inline" /> : null}
                      {t(emp.type)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-bold text-slate-900">
                    ${emp.salary.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                          <MoreVertical size={18} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-2xl border-none shadow-xl">
                        <DropdownMenuItem className="gap-2 py-2.5">
                          <Edit2 size={14} /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 py-2.5 text-rose-600 focus:text-rose-600" onClick={() => handleDelete(emp.id)}>
                          <Trash2 size={14} /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </AnimatePresence>
            {filteredEmployees.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-48 text-center text-slate-400">
                  <div className="flex flex-col items-center gap-3">
                    <Users size={40} className="opacity-10" />
                    <p className="text-sm">No employees matched your criteria.</p>
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

export default EmployeeManagement;
