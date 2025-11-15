import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react';

interface TestResult {
  name: string;
  status: 'success' | 'error' | 'warning' | 'loading';
  message: string;
  details?: any;
}

export const RegisterDebug: React.FC = () => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (result: TestResult) => {
    setResults(prev => [...prev, result]);
  };

  const testBackendConnection = async () => {
    addResult({ name: 'Connexion Backend', status: 'loading', message: 'Test en cours...' });
    
    try {
      const response = await fetch('http://localhost:3000/health');
      if (response.ok) {
        const data = await response.json();
        addResult({ 
          name: 'Connexion Backend', 
          status: 'success', 
          message: 'Backend accessible',
          details: data
        });
      } else {
        addResult({ 
          name: 'Connexion Backend', 
          status: 'error', 
          message: `Erreur HTTP: ${response.status}`
        });
      }
    } catch (error) {
      addResult({ 
        name: 'Connexion Backend', 
        status: 'error', 
        message: `Erreur: ${error instanceof Error ? error.message : 'Inconnue'}`
      });
    }
  };

  const testApiEndpoint = async () => {
    addResult({ name: 'API Endpoint', status: 'loading', message: 'Test en cours...' });
    
    try {
      const response = await fetch('http://localhost:3000/api');
      if (response.ok) {
        const data = await response.json();
        addResult({ 
          name: 'API Endpoint', 
          status: 'success', 
          message: 'API accessible',
          details: data
        });
      } else {
        addResult({ 
          name: 'API Endpoint', 
          status: 'error', 
          message: `Erreur HTTP: ${response.status}`
        });
      }
    } catch (error) {
      addResult({ 
        name: 'API Endpoint', 
        status: 'error', 
        message: `Erreur: ${error instanceof Error ? error.message : 'Inconnue'}`
      });
    }
  };

  const testRegisterEndpoint = async () => {
    addResult({ name: 'Endpoint Inscription', status: 'loading', message: 'Test en cours...' });
    
    try {
      const testData = {
        email: 'test@example.com',
        password: 'password123',
        first_name: 'Test',
        last_name: 'User'
      };

      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      });

      const data = await response.json();

      if (response.status === 201) {
        addResult({ 
          name: 'Endpoint Inscription', 
          status: 'success', 
          message: 'Inscription fonctionne',
          details: data
        });
      } else if (response.status === 409) {
        addResult({ 
          name: 'Endpoint Inscription', 
          status: 'warning', 
          message: 'Utilisateur existe déjà (normal)',
          details: data
        });
      } else {
        addResult({ 
          name: 'Endpoint Inscription', 
          status: 'error', 
          message: `Erreur HTTP: ${response.status}`,
          details: data
        });
      }
    } catch (error) {
      addResult({ 
        name: 'Endpoint Inscription', 
        status: 'error', 
        message: `Erreur: ${error instanceof Error ? error.message : 'Inconnue'}`
      });
    }
  };

  const testFrontendConfig = () => {
    addResult({ name: 'Configuration Frontend', status: 'loading', message: 'Vérification...' });
    
    const apiUrl = import.meta.env.VITE_API_URL;
    const nodeEnv = import.meta.env.NODE_ENV;
    const mode = import.meta.env.MODE;
    
    if (apiUrl) {
      addResult({ 
        name: 'Configuration Frontend', 
        status: 'success', 
        message: `API URL configurée: ${apiUrl}`,
        details: { apiUrl, nodeEnv, mode }
      });
    } else {
      addResult({ 
        name: 'Configuration Frontend', 
        status: 'warning', 
        message: 'API URL non configurée, utilisation de la valeur par défaut',
        details: { nodeEnv, mode }
      });
    }
  };

  const runAllTests = async () => {
    setIsLoading(true);
    setResults([]);
    
    testFrontendConfig();
    await testBackendConnection();
    await testApiEndpoint();
    await testRegisterEndpoint();
    
    setIsLoading(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'loading':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-500">OK</Badge>;
      case 'error':
        return <Badge variant="destructive">Erreur</Badge>;
      case 'warning':
        return <Badge variant="secondary">Attention</Badge>;
      case 'loading':
        return <Badge variant="outline">En cours</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🔧 Débogage Page d'Inscription TESSA COIFFURE
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button 
              onClick={runAllTests} 
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : null}
              Lancer tous les tests
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => setResults([])}
            >
              Effacer les résultats
            </Button>
          </div>

          {results.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium">Résultats des tests :</h4>
              {results.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(result.status)}
                    <div>
                      <div className="font-medium">{result.name}</div>
                      <div className="text-sm text-muted-foreground">{result.message}</div>
                      {result.details && (
                        <pre className="text-xs mt-1 bg-gray-100 p-2 rounded overflow-auto">
                          {JSON.stringify(result.details, null, 2)}
                        </pre>
                      )}
                    </div>
                  </div>
                  {getStatusBadge(result.status)}
                </div>
              ))}
            </div>
          )}

          <Alert>
            <AlertDescription>
              <strong>Instructions :</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Ouvrez http://localhost:5173/register dans votre navigateur</li>
                <li>Ouvrez les outils de développement (F12)</li>
                <li>Regardez l'onglet Console pour les erreurs JavaScript</li>
                <li>Regardez l'onglet Network pour les requêtes API</li>
                <li>Testez l'inscription avec des données valides</li>
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

