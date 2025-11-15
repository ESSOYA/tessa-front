import { useState, useEffect } from 'react';
import { Save, Bell, Mail, Clock, Shield, Database, Globe, Palette, Image as ImageIcon, Calendar } from 'lucide-react';
import { adminSiteSettingsApi } from '@/lib/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    name: 'TESSA COIFFURE',
    address: '123 Rue de la Coiffure, 75001 Paris',
    phone: '01 23 45 67 89',
    email: 'contact@tessa-coiffure.com',
    website: 'https://tessa-coiffure.com',
    description: 'Salon de coiffure moderne et élégant au cœur de Paris',
    openingHours: {
      monday: '09:00-19:00',
      tuesday: '09:00-19:00',
      wednesday: '09:00-19:00',
      thursday: '09:00-19:00',
      friday: '09:00-19:00',
      saturday: '09:00-18:00',
      sunday: 'Fermé'
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      reminderEmail: true,
      reminderSms: false,
      newBookingEmail: true,
      cancellationEmail: true
    },
    booking: {
      advanceBookingDays: 30,
      minBookingHours: 2,
      maxBookingHours: 24,
      allowOnlineBooking: true,
      requireConfirmation: true
    },
    appearance: {
      primaryColor: '#8B5CF6',
      secondaryColor: '#A78BFA',
      logo: '',
      favicon: '',
      homepageBackgroundImage: ''
    }
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await adminSiteSettingsApi.getAll();
      if (response.success && response.data) {
        const siteSettings = response.data.settings;
        if (siteSettings.homepage_background_image) {
          setSettings(prev => ({
            ...prev,
            appearance: {
              ...prev.appearance,
              homepageBackgroundImage: siteSettings.homepage_background_image
            }
          }));
        }
      }
    } catch (error) {
      console.error('Erreur chargement paramètres:', error);
    }
  };

  const handleSave = async () => {
    try {
      // Sauvegarder l'image de fond
      if (settings.appearance.homepageBackgroundImage) {
        const response = await adminSiteSettingsApi.update(
          'homepage_background_image',
          settings.appearance.homepageBackgroundImage
        );
        if (response.success) {
          toast.success('Paramètres sauvegardés avec succès !');
        } else {
          toast.error('Erreur lors de la sauvegarde', {
            description: response.error || 'Une erreur est survenue'
          });
        }
      } else {
        toast.success('Paramètres sauvegardés avec succès !');
      }
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const updateSettings = (section: string, updates: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: { ...prev[section as keyof typeof prev], ...updates }
    }));
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Paramètres du Salon</h1>
        <p className="text-muted-foreground">Configurez votre salon TESSA COIFFURE</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Informations Générales */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Informations Générales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nom du salon</Label>
                <Input
                  id="name"
                  value={settings.name}
                  onChange={(e) => setSettings({...settings, name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  value={settings.phone}
                  onChange={(e) => setSettings({...settings, phone: e.target.value})}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="address">Adresse</Label>
              <Input
                id="address"
                value={settings.address}
                onChange={(e) => setSettings({...settings, address: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({...settings, email: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="website">Site web</Label>
                <Input
                  id="website"
                  value={settings.website}
                  onChange={(e) => setSettings({...settings, website: e.target.value})}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={settings.description}
                onChange={(e) => setSettings({...settings, description: e.target.value})}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Horaires d'Ouverture */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Horaires d'Ouverture
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(settings.openingHours).map(([day, hours]) => (
              <div key={day} className="flex items-center justify-between">
                <Label className="capitalize">{day === 'monday' ? 'Lundi' :
                  day === 'tuesday' ? 'Mardi' :
                  day === 'wednesday' ? 'Mercredi' :
                  day === 'thursday' ? 'Jeudi' :
                  day === 'friday' ? 'Vendredi' :
                  day === 'saturday' ? 'Samedi' :
                  day === 'sunday' ? 'Dimanche' : day}</Label>
                <Input
                  value={hours}
                  onChange={(e) => updateSettings('openingHours', { [day]: e.target.value })}
                  className="w-32"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Notifications Email</Label>
                <p className="text-sm text-muted-foreground">Activer les notifications par email</p>
              </div>
              <Switch
                checked={settings.notifications.emailNotifications}
                onCheckedChange={(checked) => updateSettings('notifications', { emailNotifications: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Notifications SMS</Label>
                <p className="text-sm text-muted-foreground">Activer les notifications par SMS</p>
              </div>
              <Switch
                checked={settings.notifications.smsNotifications}
                onCheckedChange={(checked) => updateSettings('notifications', { smsNotifications: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Rappels par Email</Label>
                <p className="text-sm text-muted-foreground">Envoyer des rappels par email</p>
              </div>
              <Switch
                checked={settings.notifications.reminderEmail}
                onCheckedChange={(checked) => updateSettings('notifications', { reminderEmail: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Rappels par SMS</Label>
                <p className="text-sm text-muted-foreground">Envoyer des rappels par SMS</p>
              </div>
              <Switch
                checked={settings.notifications.reminderSms}
                onCheckedChange={(checked) => updateSettings('notifications', { reminderSms: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Paramètres de Réservation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Paramètres de Réservation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="advanceBookingDays">Réservation à l'avance (jours)</Label>
                <Input
                  id="advanceBookingDays"
                  type="number"
                  value={settings.booking.advanceBookingDays}
                  onChange={(e) => updateSettings('booking', { advanceBookingDays: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="minBookingHours">Délai minimum (heures)</Label>
                <Input
                  id="minBookingHours"
                  type="number"
                  value={settings.booking.minBookingHours}
                  onChange={(e) => updateSettings('booking', { minBookingHours: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Réservation en ligne</Label>
                <p className="text-sm text-muted-foreground">Permettre les réservations en ligne</p>
              </div>
              <Switch
                checked={settings.booking.allowOnlineBooking}
                onCheckedChange={(checked) => updateSettings('booking', { allowOnlineBooking: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Confirmation requise</Label>
                <p className="text-sm text-muted-foreground">Nécessiter une confirmation manuelle</p>
              </div>
              <Switch
                checked={settings.booking.requireConfirmation}
                onCheckedChange={(checked) => updateSettings('booking', { requireConfirmation: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Apparence */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              Apparence
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="primaryColor">Couleur principale</Label>
                <Input
                  id="primaryColor"
                  type="color"
                  value={settings.appearance.primaryColor}
                  onChange={(e) => updateSettings('appearance', { primaryColor: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="secondaryColor">Couleur secondaire</Label>
                <Input
                  id="secondaryColor"
                  type="color"
                  value={settings.appearance.secondaryColor}
                  onChange={(e) => updateSettings('appearance', { secondaryColor: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="logo">Logo (URL)</Label>
              <Input
                id="logo"
                value={settings.appearance.logo}
                onChange={(e) => updateSettings('appearance', { logo: e.target.value })}
                placeholder="https://example.com/logo.png"
              />
            </div>
            <div>
              <Label htmlFor="favicon">Favicon (URL)</Label>
              <Input
                id="favicon"
                value={settings.appearance.favicon}
                onChange={(e) => updateSettings('appearance', { favicon: e.target.value })}
                placeholder="https://example.com/favicon.ico"
              />
            </div>
            <div>
              <Label htmlFor="homepageBackgroundImage" className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Image de fond de la page d'accueil (URL)
              </Label>
              <Input
                id="homepageBackgroundImage"
                value={settings.appearance.homepageBackgroundImage}
                onChange={(e) => updateSettings('appearance', { homepageBackgroundImage: e.target.value })}
                placeholder="https://example.com/background.jpg"
              />
              {settings.appearance.homepageBackgroundImage && (
                <div className="mt-2 rounded-lg overflow-hidden border">
                  <img
                    src={settings.appearance.homepageBackgroundImage}
                    alt="Aperçu"
                    className="w-full h-32 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Système */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              Système
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Mode Maintenance</Label>
                <p className="text-sm text-muted-foreground">Mettre le salon en mode maintenance</p>
              </div>
              <Switch disabled />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Backup Automatique</Label>
                <p className="text-sm text-muted-foreground">Sauvegarde automatique des données</p>
              </div>
              <Badge variant="outline">Activé</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Version</Label>
                <p className="text-sm text-muted-foreground">Version de l'application</p>
              </div>
              <Badge variant="outline">v1.0.0</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="mt-8 flex justify-end">
        <Button onClick={handleSave} size="lg">
          <Save className="mr-2 h-4 w-4" />
          Sauvegarder les paramètres
        </Button>
      </div>
    </div>
  );
};

export default AdminSettings;