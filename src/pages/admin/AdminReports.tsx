import { useState, useEffect } from 'react';
import { Calendar, TrendingUp, DollarSign, Users, Scissors, Download, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';
import { adminReportsApi } from '@/lib/api';
import { toast } from 'sonner';

interface ReportData {
  totalRevenue: number;
  totalAppointments: number;
  averageAppointmentValue: number;
  topServices: Array<{
    name: string;
    appointments: number;
    revenue: number;
  }>;
  monthlyData: Array<{
    month: string;
    appointments: number;
    revenue: number;
  }>;
  statusDistribution: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
  clientStats: {
    totalClients: number;
    newClients: number;
    returningClients: number;
  };
}

const AdminReports = () => {
  const [period, setPeriod] = useState('30');
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReport();
  }, [period]);

  const loadReport = async () => {
    try {
      setLoading(true);
      const response = await adminReportsApi.getReport(period);
      console.log('Réponse rapport:', response);
      
      if (response.success && response.data) {
        setReportData(response.data as ReportData);
      } else {
        toast.error('Erreur lors du chargement du rapport', {
          description: response.error || 'Une erreur est survenue'
        });
      }
    } catch (error) {
      console.error('Erreur chargement rapport:', error);
      toast.error('Erreur lors du chargement du rapport');
    } finally {
      setLoading(false);
    }
  };

  // Données par défaut si le rapport n'est pas encore chargé
  const data = reportData || {
    totalRevenue: 0,
    totalAppointments: 0,
    averageAppointmentValue: 0,
    topServices: [],
    monthlyData: [],
    statusDistribution: [],
    clientStats: {
      totalClients: 0,
      newClients: 0,
      returningClients: 0
    }
  };

  const handleExport = () => {
    alert('Export en cours de développement');
  };

  return (
    <div className="p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Rapports et Statistiques</h1>
          <p className="text-muted-foreground">Analyse approfondie de l'activité de votre salon</p>
        </div>
        <div className="flex gap-2">
          <select 
            value={period} 
            onChange={(e) => setPeriod(e.target.value)}
            className="px-3 py-2 border border-input bg-background rounded-md"
            disabled={loading}
          >
            <option value="7">7 derniers jours</option>
            <option value="30">30 derniers jours</option>
            <option value="90">90 derniers jours</option>
            <option value="365">365 derniers jours</option>
          </select>
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chiffre d'affaires</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="animate-pulse">
                <div className="h-8 w-24 bg-muted rounded mb-2"></div>
                <div className="h-4 w-32 bg-muted rounded"></div>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{formatPrice(data.totalRevenue)}</div>
                <p className="text-xs text-muted-foreground">
                  Total des revenus confirmés
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Réservations</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="animate-pulse">
                <div className="h-8 w-16 bg-muted rounded mb-2"></div>
                <div className="h-4 w-40 bg-muted rounded"></div>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{data.totalAppointments}</div>
                <p className="text-xs text-muted-foreground">
                  Moyenne: {formatPrice(data.averageAppointmentValue)}/rdv
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="animate-pulse">
                <div className="h-8 w-16 bg-muted rounded mb-2"></div>
                <div className="h-4 w-40 bg-muted rounded"></div>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{data.clientStats.totalClients}</div>
                <p className="text-xs text-muted-foreground">
                  {data.clientStats.newClients} nouveaux clients
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Services & Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scissors className="h-5 w-5 text-primary" />
              Top 5 Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="animate-pulse h-16 bg-muted rounded-lg"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {data.topServices.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">Aucun service trouvé</p>
                ) : (
                  data.topServices.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{service.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {service.appointments} rendez-vous
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatPrice(service.revenue)}                    </div>
                  </div>
                </div>
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Distribution des Statuts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse h-8 bg-muted rounded"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {data.statusDistribution.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">Aucune donnée</p>
                ) : (
                  data.statusDistribution.map((status) => (
                    <div key={status.status} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{status.status}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {status.count} rendez-vous
                        </span>
                      </div>
                      <div className="text-sm font-medium">{status.percentage}%</div>
                    </div>
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Monthly Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Activité Mensuelle (6 derniers mois)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse h-12 bg-muted rounded-lg"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {data.monthlyData.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">Aucune donnée mensuelle</p>
              ) : (
                data.monthlyData.map((month, index) => (
                  <div key={month.month || index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="font-medium">{month.month}</div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Rendez-vous: </span>
                        <span className="font-medium">{month.appointments}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">CA: </span>
                        <span className="font-medium">{formatPrice(month.revenue)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminReports;