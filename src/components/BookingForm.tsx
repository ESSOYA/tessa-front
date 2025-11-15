import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link } from 'react-router-dom';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { appointmentsApi } from '@/lib/api';
import { Service } from '@/types';
import { useAuth } from '@/hooks/useAuth';

const formSchema = z.object({
  clientName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  clientEmail: z.string().email('Email invalide'),
  clientPhone: z.string().min(10, 'Numéro de téléphone invalide'),
  date: z.date({
    required_error: 'Veuillez sélectionner une date',
  }),
  time: z.string().min(1, 'Veuillez sélectionner une heure'),
  notes: z.string().optional(),
});

interface BookingFormProps {
  service: Service;
  onSuccess?: () => void;
}

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
];

const BookingForm = ({ service, onSuccess }: BookingFormProps) => {
  const { user, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientName: user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : '',
      clientEmail: user?.email || '',
      clientPhone: user?.phone || '',
      notes: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!isAuthenticated || !user) {
      toast.error('Vous devez être connecté pour réserver');
      return;
    }

    setIsSubmitting(true);
    try {
      const startDateTime = `${format(values.date, 'yyyy-MM-dd')} ${values.time}:00`;
      const endDateTime = new Date(new Date(startDateTime).getTime() + service.duration * 60000).toISOString().slice(0, 19).replace('T', ' ');

      const result = await appointmentsApi.create({
        client_user_id: user.id,
        service_id: service.id,
        start_datetime: startDateTime,
        notes: values.notes,
      });

      if (result.success) {
        toast.success('Réservation confirmée !', {
          description: 'Vous recevrez un email de confirmation.',
        });
        form.reset();
        onSuccess?.();
      } else {
        toast.error('Erreur', {
          description: result.error || 'Impossible de créer la réservation',
        });
      }
    } catch (error) {
      toast.error('Erreur', {
        description: 'Une erreur est survenue',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-semibold mb-4">Connexion requise</h3>
        <p className="text-muted-foreground mb-6">
          Vous devez être connecté pour réserver un rendez-vous.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/login"
            className="inline-flex items-center px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Se connecter
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
          >
            S'inscrire
          </Link>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="clientName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom complet</FormLabel>
              <FormControl>
                <Input placeholder="Marie Dupont" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="clientEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="marie@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="clientPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Téléphone</FormLabel>
                <FormControl>
                  <Input placeholder="06 12 34 56 78" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'PPP', { locale: fr })
                        ) : (
                          <span>Choisir une date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date() || date.getDay() === 0
                      }
                      initialFocus
                      locale={fr}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Heure</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir une heure" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (optionnel)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Remarques ou demandes spéciales..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-primary to-primary-light hover:shadow-luxury"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Réservation en cours...' : 'Confirmer la réservation'}
        </Button>
      </form>
    </Form>
  );
};

export default BookingForm;
