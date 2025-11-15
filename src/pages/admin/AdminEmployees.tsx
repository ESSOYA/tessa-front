import { useState, useEffect } from 'react';
import { PlusCircle, Edit, Trash2, Users, Briefcase, CalendarDays, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { adminEmployeesApi } from '@/lib/api';
import { toast } from 'sonner';

interface Employee {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  hire_date: string;
  note: string;
  is_available: number;
  created_at: string;
}

const AdminEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const response = await adminEmployeesApi.getAll({ page: 1, limit: 100 });
      console.log('Réponse complète employés:', response);
      console.log('Type de response.data:', typeof response.data);
      console.log('response.data est un array?', Array.isArray(response.data));
      
      if (response.success) {
        let employeesData = [];
        
        if (response.data) {
          // Le backend retourne { employees: [...], pagination: {...} }
          if (Array.isArray(response.data)) {
            employeesData = response.data;
          } else if (typeof response.data === 'object') {
            if ((response.data as any).employees) {
              employeesData = (response.data as any).employees;
            } else if ((response.data as any).data && Array.isArray((response.data as any).data)) {
              employeesData = (response.data as any).data;
            }
          }
        }
        
        console.log('Employés récupérés (nombre):', employeesData.length);
        console.log('Premier employé:', employeesData[0]);
        
        if (employeesData.length > 0) {
          setEmployees(employeesData);
          toast.success(`${employeesData.length} employés chargés`);
        } else {
          setEmployees([]);
          console.warn('Aucun employé trouvé dans la réponse');
        }
      } else {
        console.error('Erreur réponse employés:', response);
        toast.error('Erreur lors du chargement des employés', {
          description: response.error || 'Une erreur est survenue'
        });
        setEmployees([]);
      }
    } catch (error) {
      console.error('Erreur chargement employés:', error);
      toast.error('Erreur lors du chargement des employés');
    } finally {
      setLoading(false);
    }
  };

  const totalEmployees = employees.length;
  const activeEmployees = employees.length; // Tous les employés récupérés sont actifs
  const availableEmployees = employees.filter(e => e.is_available === 1).length;

  return (
    <div className="p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestion des Employés</h1>
          <p className="text-muted-foreground">Gérez votre équipe de coiffeurs et collaborateurs</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Ajouter un employé
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-border/50 hover:shadow-card transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Employés
            </CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalEmployees}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {activeEmployees} actifs
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:shadow-card transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Disponibles
            </CardTitle>
            <Briefcase className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{availableEmployees}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Actuellement disponibles
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:shadow-card transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ancienneté Moyenne
            </CardTitle>
            <CalendarDays className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8 mois</div>
            <p className="text-xs text-muted-foreground mt-1">
              Moyenne de l'équipe
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Employees Table */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Liste des Employés</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Chargement des employés...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Date d'embauche</TableHead>
                  <TableHead>Spécialité</TableHead>
                  <TableHead>Disponibilité</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-4">
                      Aucun employé trouvé.
                    </TableCell>
                  </TableRow>
                ) : (
                  employees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {employee.first_name} {employee.last_name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            ID: {employee.id}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">{employee.email}</div>
                          <div className="text-sm text-muted-foreground">{employee.phone || 'N/A'}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {employee.hire_date ? new Date(employee.hire_date).toLocaleDateString('fr-FR') : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {employee.note || 'Aucune spécialité'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Switch
                            checked={employee.is_available === 1}
                            onCheckedChange={async (checked) => {
                              try {
                                const response = await adminEmployeesApi.update(employee.id.toString(), {
                                  is_available: checked
                                });
                                if (response.success) {
                                  toast.success(`Employé marqué comme ${checked ? 'disponible' : 'indisponible'}`);
                                  loadEmployees();
                                } else {
                                  toast.error('Erreur lors de la mise à jour', {
                                    description: response.error
                                  });
                                  // Recharger pour annuler le changement visuel
                                  loadEmployees();
                                }
                              } catch (error) {
                                console.error('Erreur mise à jour disponibilité:', error);
                                toast.error('Erreur lors de la mise à jour');
                                // Recharger pour annuler le changement visuel
                                loadEmployees();
                              }
                            }}
                          />
                          <Badge variant={employee.is_available === 1 ? 'default' : 'secondary'}>
                            {employee.is_available === 1 ? 'Disponible' : 'Indisponible'}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminEmployees;