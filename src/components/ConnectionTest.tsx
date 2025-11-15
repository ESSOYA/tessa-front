import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, XCircle, RefreshCw, ExternalLink } from 'lucide-react';
import { testBackendConnection, getApiInfo, checkConfiguration } from '@/config/connection';

interface ConnectionStatus {
  backend: 'testing' | 'connected' | 'error' | 'idle';
  api: 'testing' | 'connected' | 'error' | 'idle';
  message: string;
  details?: any;
}

export const ConnectionTest: React.FC = () => {
  const [status, setStatus] = useState<ConnectionStatus>({
    backend: 'idle',
    api: 'idle',
    message: 'Prêt à tester la connexion'
  });
  const [config, setConfig] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Vérifier la configuration au chargement
    const configCheck = checkConfiguration();
    setConfig(configCheck);
  }, []);

  const testConnection = async () => {
    setIsLoading(true);
    setStatus({
      backend: 'testing',
      api: 'idle',
      message: 'Test de connexion en cours...'
    });

    try {
      // Test de connexion backend
      const backendResult = await testBackendConnection();
      
      if (backendResult.success) {
        setStatus(prev => ({
          ...prev,
          backend: 'connected',
          message: 'Connexion backend réussie'
        }));

        // Test de l'API
        setStatus(prev => ({
          ...prev,
          api: 'testing',
          message: 'Test de l\'API en cours...'
        }));

        const apiResult = await getApiInfo();
        
        if (apiResult.success) {
          setStatus(prev => ({
            ...prev,
            api: 'connected',
            message: 'Connexion complète réussie',
            details: apiResult.data
          }));
        } else {
          setStatus(prev => ({
            ...prev,
            api: 'error',
            message: `API erreur: ${apiResult.error}`
          }));
        }
      } else {
        setStatus(prev => ({
          ...prev,
          backend: 'error',
          message: backendResult.message
        }));
      }
    } catch (error) {
      setStatus({
        backend: 'error',
        api: 'error',
        message: `Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'testing':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      default:
        return <div className="h-5 w-5 rounded-full bg-gray-300" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge variant="default" className="bg-green-500">Connecté</Badge>;
      case 'error':
        return <Badge variant="destructive">Erreur</Badge>;
      case 'testing':
        return <Badge variant="secondary">Test en cours</Badge>;
      default:
        return <Badge variant="outline">En attente</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Test de Connexion TESSA COIFFURE
          </CardTitle>
          <CardDescription>
            Vérifiez la connexion entre le frontend et le backend
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Configuration */}
          {config && (
            <div className="space-y-2">
              <h4 className="font-medium">Configuration actuelle:</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <strong>Backend URL:</strong> {config.config.backendUrl}
                </div>
                <div>
                  <strong>Frontend URL:</strong> {config.config.frontendUrl}
                </div>
                <div>
                  <strong>App Name:</strong> {config.config.appName}
                </div>
                <div>
                  <strong>Version:</strong> {config.config.appVersion}
                </div>
              </div>
              {config.issues.length > 0 && (
                <Alert>
                  <AlertDescription>
                    <strong>Problèmes détectés:</strong>
                    <ul className="list-disc list-inside mt-1">
                      {config.issues.map((issue, index) => (
                        <li key={index}>{issue}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Status */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(status.backend)}
                <span>Backend</span>
              </div>
              {getStatusBadge(status.backend)}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(status.api)}
                <span>API</span>
              </div>
              {getStatusBadge(status.api)}
            </div>
          </div>

          {/* Message */}
          <Alert>
            <AlertDescription>
              {status.message}
            </AlertDescription>
          </Alert>

          {/* Détails */}
          {status.details && (
            <div className="space-y-2">
              <h4 className="font-medium">Détails de la réponse:</h4>
              <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto">
                {JSON.stringify(status.details, null, 2)}
              </pre>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button 
              onClick={testConnection} 
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Tester la Connexion
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => window.open('http://localhost:3000/api/docs', '_blank')}
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Documentation API
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

