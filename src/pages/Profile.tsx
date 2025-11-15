import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User, Mail, Phone, Calendar, LogOut, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { appointmentsApi } from '@/lib/api';
import { Booking } from '@/types';

const profileSchema = z.object({
  first_name: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  last_name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  phone: z.string().optional(),
});

const passwordSchema = z.object({
  current_password: z.string().min(6, 'Mot de passe actuel requis'),
  new_password: z.string().min(6, 'Le nouveau mot de passe doit contenir au moins 6 caractères'),
  confirm_password: z.string().min(6, 'Confirmation requise'),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirm_password"],
});

const Profile = () => {
  const { user, logout, updateProfile, changePassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [appointments, setAppointments] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'appointments'>('profile');

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      phone: user?.phone || '',
    },
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      current_password: '',
      new_password: '',
      confirm_password: '',
    },
  });

  useEffect(() => {
    if (user) {
      profileForm.reset({
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone || '',
      });
    }
  }, [user, profileForm]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await appointmentsApi.getMyAppointments();
        if (response.success && response.data) {
          setAppointments(response.data.appointments);
        }
      } catch (error) {
        console.error('Erreur récupération rendez-vous:', error);
      }
    };

    fetchAppointments();
  }, []);

  const onProfileSubmit = async (values: z.infer<typeof profileSchema>) => {
    setIsLoading(true);
    try {
      const success = await updateProfile(values);
      if (success) {
        toast.success('Profil mis à jour avec succès');
      } else {
        toast.error('Erreur lors de la mise à jour');
      }
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setIsLoading(false);
    }
  };

  const onPasswordSubmit = async (values: z.infer<typeof passwordSchema>) => {
    setIsLoading(true);
    try {
      const success = await changePassword(values.current_password, values.new_password);
      if (success) {
        toast.success('Mot de passe modifié avec succès');
        passwordForm.reset();
      } else {
        toast.error('Erreur lors du changement de mot de passe');
      }
    } catch (error) {
      toast.error('Erreur lors du changement de mot de passe');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmé';
      case 'pending': return 'En attente';
      case 'cancelled': return 'Annulé';
      case 'completed': return 'Terminé';
      default: return status;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Accès refusé</h1>
          <p className="text-muted-foreground">Vous devez être connecté pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Mon Profil</h1>
          <p className="text-muted-foreground">Gérez vos informations et rendez-vous</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <User className="h-10 w-10 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold text-lg">{user.first_name} {user.last_name}</h3>
                  <p className="text-muted-foreground">{user.email}</p>
                </div>

                <nav className="space-y-2">
                  <Button
                    variant={activeTab === 'profile' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('profile')}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Informations
                  </Button>
                  <Button
                    variant={activeTab === 'password' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('password')}
                  >
                    <Lock className="mr-2 h-4 w-4" />
                    Mot de passe
                  </Button>
                  <Button
                    variant={activeTab === 'appointments' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('appointments')}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Mes rendez-vous
                  </Button>
                </nav>

                <div className="mt-6 pt-6 border-t">
                  <Button
                    variant="outline"
                    className="w-full justify-start text-red-600 hover:text-red-700"
                    onClick={logout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Se déconnecter
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Content */}
          <div className="lg:col-span-2">
            {activeTab === 'profile' && (
              <Card>
                <CardHeader>
                  <CardTitle>Informations personnelles</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={profileForm.control}
                          name="first_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Prénom</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={profileForm.control}
                          name="last_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nom</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={profileForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Téléphone</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Mise à jour...' : 'Mettre à jour'}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}

            {activeTab === 'password' && (
              <Card>
                <CardHeader>
                  <CardTitle>Changer le mot de passe</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...passwordForm}>
                    <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                      <FormField
                        control={passwordForm.control}
                        name="current_password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mot de passe actuel</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={passwordForm.control}
                        name="new_password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nouveau mot de passe</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={passwordForm.control}
                        name="confirm_password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirmer le nouveau mot de passe</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Modification...' : 'Modifier le mot de passe'}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}

            {activeTab === 'appointments' && (
              <Card>
                <CardHeader>
                  <CardTitle>Historique de mes rendez-vous</CardTitle>
                  <p className="text-sm text-muted-foreground mt-2">
                    {appointments.length} rendez-vous au total
                  </p>
                </CardHeader>
                <CardContent>
                  {appointments.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Aucun rendez-vous pour le moment</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {appointments.map((appointment) => (
                        <div key={appointment.id} className="border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg mb-1">{appointment.service_name || 'Service'}</h3>
                              <p className="text-sm text-muted-foreground mb-2">
                                {formatDate(appointment.start_datetime)}
                              </p>
                              {appointment.employee_name && (
                                <p className="text-sm text-muted-foreground mb-1">
                                  <span className="font-medium">Coiffeur:</span> {appointment.employee_name}
                                </p>
                              )}
                              {appointment.notes && (
                                <p className="text-sm text-muted-foreground mt-2 italic">
                                  "{appointment.notes}"
                                </p>
                              )}
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                              {getStatusText(appointment.status)}
                            </span>
                          </div>
                          <div className="mt-3 pt-3 border-t flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              ID: {appointment.id}
                            </span>
                            <span className="text-muted-foreground">
                              Créé le {new Date(appointment.created_at).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

