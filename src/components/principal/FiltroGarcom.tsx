
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { User } from 'lucide-react';

interface FiltroGarcomProps {
  onGarcomChange: (garcom: string) => void;
  onFiltroMeusChange: (filtrar: boolean) => void;
  garcomAtual: string;
  filtrarMeus: boolean;
}

const FiltroGarcom = ({ onGarcomChange, onFiltroMeusChange, garcomAtual, filtrarMeus }: FiltroGarcomProps) => {
  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <User className="h-4 w-4" />
          Identificação do Garçom
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <Label htmlFor="garcom" className="text-sm">Nome do Garçom</Label>
          <Input
            id="garcom"
            placeholder="Digite seu nome"
            value={garcomAtual}
            onChange={(e) => onGarcomChange(e.target.value)}
            className="mt-1"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="filtrar-meus"
            checked={filtrarMeus}
            onCheckedChange={(checked) => onFiltroMeusChange(checked as boolean)}
          />
          <Label htmlFor="filtrar-meus" className="text-sm">
            Mostrar apenas minhas mesas
          </Label>
        </div>
      </CardContent>
    </Card>
  );
};

export default FiltroGarcom;
