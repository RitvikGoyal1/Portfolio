import { useState } from 'react';
import { Layers3, X } from 'lucide-react';
import './ConceptSwitcher.css';

export type ConceptId = 'signature' | 'obsidian' | 'atelier' | 'signal';
const options: { id: ConceptId; number: string; name: string }[] = [
  { id: 'signature', number: 'NEW', name: 'Signature' },
  { id: 'obsidian', number: '01', name: 'Obsidian' },
  { id: 'atelier', number: '02', name: 'Atelier' },
  { id: 'signal', number: '03', name: 'Signal' },
];

export default function ConceptSwitcher({ current, onSelect }: { current: ConceptId; onSelect: (concept: ConceptId) => void }) {
  const [visible, setVisible] = useState(current !== 'signature');
  if (!visible) return (
    <button className="concept-reopen" onClick={() => setVisible(true)} aria-label="Show design comparison controls"><Layers3 size={15} /><span>Compare designs</span></button>
  );
  return (
    <nav className="concept-switcher" aria-label="Portfolio design explorations">
      <span className="concept-switcher-label"><Layers3 size={15} aria-hidden="true" /><span>EXPLORATIONS</span></span>
      <div className="concept-switcher-options">
        {options.map(option => (
          <button key={option.id} className={`concept-switcher-option${current === option.id ? ' is-active' : ''}`} onClick={() => onSelect(option.id)} aria-pressed={current === option.id}>
            <span className="concept-switcher-number">{option.number}</span><span>{option.name}</span>
          </button>
        ))}
      </div>
      <button className="concept-switcher-close" aria-label="Hide design comparison controls" onClick={() => setVisible(false)}><X size={16} /></button>
    </nav>
  );
}
