import { useState, useEffect } from 'react';
import { X, Plus, Edit, Trash2, Image as ImageIcon, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { adminServiceImagesApi } from '@/lib/api';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

interface ServiceImage {
  id: number;
  service_id: number;
  image_url: string;
  image_order: number;
  is_primary: number;
  created_at: string;
}

interface ServiceImagesManagerProps {
  serviceId: number;
  serviceName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ServiceImagesManager = ({ serviceId, serviceName, open, onOpenChange }: ServiceImagesManagerProps) => {
  const [images, setImages] = useState<ServiceImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingImage, setEditingImage] = useState<ServiceImage | null>(null);
  const [editImageUrl, setEditImageUrl] = useState('');

  useEffect(() => {
    if (open && serviceId) {
      loadImages();
    }
  }, [open, serviceId]);

  const loadImages = async () => {
    try {
      setLoading(true);
      const response = await adminServiceImagesApi.getAll(serviceId.toString());
      if (response.success && response.data) {
        setImages(response.data.images);
      } else {
        toast.error('Erreur lors du chargement des images', {
          description: response.error || 'Une erreur est survenue'
        });
      }
    } catch (error) {
      console.error('Erreur chargement images:', error);
      toast.error('Erreur lors du chargement des images');
    } finally {
      setLoading(false);
    }
  };

  const handleAddImage = async () => {
    if (!newImageUrl.trim()) {
      toast.error('Veuillez entrer une URL d\'image');
      return;
    }

    try {
      setIsAdding(true);
      const response = await adminServiceImagesApi.add(serviceId.toString(), newImageUrl.trim());
      if (response.success && response.data) {
        toast.success('Image ajoutée avec succès');
        setNewImageUrl('');
        loadImages();
      } else {
        toast.error('Erreur lors de l\'ajout de l\'image', {
          description: response.error || 'Une erreur est survenue'
        });
      }
    } catch (error) {
      console.error('Erreur ajout image:', error);
      toast.error('Erreur lors de l\'ajout de l\'image');
    } finally {
      setIsAdding(false);
    }
  };

  const handleUpdateImage = async () => {
    if (!editingImage || !editImageUrl.trim()) {
      return;
    }

    try {
      const response = await adminServiceImagesApi.update(editingImage.id.toString(), {
        image_url: editImageUrl.trim()
      });
      if (response.success) {
        toast.success('Image modifiée avec succès');
        setEditingImage(null);
        setEditImageUrl('');
        loadImages();
      } else {
        toast.error('Erreur lors de la modification de l\'image', {
          description: response.error || 'Une erreur est survenue'
        });
      }
    } catch (error) {
      console.error('Erreur modification image:', error);
      toast.error('Erreur lors de la modification de l\'image');
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) {
      return;
    }

    try {
      const response = await adminServiceImagesApi.delete(imageId.toString());
      if (response.success) {
        toast.success('Image supprimée avec succès');
        loadImages();
      } else {
        toast.error('Erreur lors de la suppression de l\'image', {
          description: response.error || 'Une erreur est survenue'
        });
      }
    } catch (error) {
      console.error('Erreur suppression image:', error);
      toast.error('Erreur lors de la suppression de l\'image');
    }
  };

  const handleSetPrimary = async (imageId: number) => {
    try {
      const response = await adminServiceImagesApi.update(imageId.toString(), {
        is_primary: true
      });
      if (response.success) {
        toast.success('Image principale définie avec succès');
        loadImages();
      } else {
        toast.error('Erreur lors de la définition de l\'image principale', {
          description: response.error || 'Une erreur est survenue'
        });
      }
    } catch (error) {
      console.error('Erreur définition image principale:', error);
      toast.error('Erreur lors de la définition de l\'image principale');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gestion des Images - {serviceName}</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Chargement des images...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Ajouter une nouvelle image */}
            <div className="border rounded-lg p-4 bg-muted/30">
              <Label className="text-base font-semibold mb-3 block">Ajouter une image</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="URL de l'image (ex: https://example.com/image.jpg)"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleAddImage} disabled={isAdding}>
                  <Plus className="h-4 w-4 mr-2" />
                  {isAdding ? 'Ajout...' : 'Ajouter'}
                </Button>
              </div>
            </div>

            {/* Liste des images */}
            {images.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucune image pour ce service</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {images.map((image) => (
                  <div key={image.id} className="border rounded-lg overflow-hidden">
                    <div className="relative aspect-video bg-muted">
                      <img
                        src={image.image_url}
                        alt={`Image ${image.id}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="20" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImage non disponible%3C/text%3E%3C/svg%3E';
                        }}
                      />
                      {image.is_primary === 1 && (
                        <Badge className="absolute top-2 left-2 bg-primary">
                          <Star className="h-3 w-3 mr-1" />
                          Principale
                        </Badge>
                      )}
                    </div>
                    <div className="p-3 bg-background">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-muted-foreground truncate">{image.image_url}</p>
                        </div>
                        <div className="flex gap-1">
                          {image.is_primary !== 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSetPrimary(image.id)}
                              title="Définir comme principale"
                            >
                              <Star className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingImage(image);
                              setEditImageUrl(image.image_url);
                            }}
                            title="Modifier"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteImage(image.id)}
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Dialog de modification */}
        {editingImage && (
          <Dialog open={!!editingImage} onOpenChange={() => setEditingImage(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Modifier l'image</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>URL de l'image</Label>
                  <Input
                    value={editImageUrl}
                    onChange={(e) => setEditImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setEditingImage(null)}>
                    Annuler
                  </Button>
                  <Button onClick={handleUpdateImage}>
                    Enregistrer
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ServiceImagesManager;

