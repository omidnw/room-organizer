import React from 'react';
import Toggle from '../../ui/Toggle';

interface AppearanceProps {
  animations: boolean;
  setAnimations: (value: boolean) => void;
  compactMode: boolean;
  setCompactMode: (value: boolean) => void;
}

function AppearanceSection({ animations, setAnimations, compactMode, setCompactMode }: AppearanceProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-textPrimary">Appearance</h3>
        <p className="text-sm text-textSecondary">Customize the app's appearance</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-textPrimary">Animations</p>
            <p className="text-sm text-textSecondary">Enable motion animations</p>
          </div>
          <Toggle value={animations} onChange={setAnimations} />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-textPrimary">Compact Mode</p>
            <p className="text-sm text-textSecondary">Use a more compact layout</p>
          </div>
          <Toggle value={compactMode} onChange={setCompactMode} />
        </div>
      </div>
    </div>
  );
}

export default AppearanceSection; 