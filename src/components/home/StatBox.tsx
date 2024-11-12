import React from 'react';
import Card from '../ui/Card';

interface StatBoxProps {
  label: string;
  value: string;
}

function StatBox({ label, value }: StatBoxProps) {
  return (
    <Card className="text-center">
      <h3 className="text-3xl font-bold text-primary mb-2">{value}</h3>
      <p className="text-textSecondary">{label}</p>
    </Card>
  );
}

export default StatBox; 