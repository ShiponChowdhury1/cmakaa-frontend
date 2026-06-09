import { useRef } from 'react';
import type { NewPardnaFormData } from '../types';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { GripVertical, ChevronUp, ChevronDown, Sparkles, Shuffle } from 'lucide-react';

interface Props {
  data: NewPardnaFormData;
  onChange: (d: Partial<NewPardnaFormData>) => void;
}

const ITEM_TYPE = 'PARTICIPANT';

interface DragItem {
  index: number;
  id: string;
  type: string;
}

interface DraggableRowProps {
  p: any;
  index: number;
  totalPot: number;
  roundLabel: string;
  isFirst: boolean;
  isLast: boolean;
  moveParticipant: (index: number, direction: 'up' | 'down') => void;
  onHoverSwap: (dragIndex: number, hoverIndex: number) => void;
}

function DraggableParticipantRow({
  p,
  index,
  totalPot,
  roundLabel,
  isFirst,
  isLast,
  moveParticipant,
  onHoverSwap,
}: DraggableRowProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop<DragItem, void, unknown>({
    accept: ITEM_TYPE,
    hover(item: DragItem) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      onHoverSwap(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: () => {
      return { id: p.id, index };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`flex items-center justify-between px-4 py-4 border-b border-gray-100 last:border-0 transition-all ${
        isDragging ? 'opacity-40 bg-orange-50/50 scale-[0.98]' : 'hover:bg-gray-50/50'
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Drag handle icon */}
        <div className="text-gray-400 cursor-grab active:cursor-grabbing hover:text-[#E57432] p-1 rounded transition-colors mr-1 shrink-0">
          <GripVertical size={16} />
        </div>
        <span
          className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
          style={{ background: '#E57432' }}
        >
          {index + 1}
        </span>
        <div>
          <p className="text-sm font-semibold text-[var(--color-dark)]">
            Round {index + 1} · {p.name}
          </p>
          <p className="text-xs text-[#64748B] mt-0.5">
            {roundLabel} · £{totalPot.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs font-bold text-[#64748B] bg-[#F1F5F9] px-2 py-1 rounded-md">
          Position {index + 1}
        </span>
        {/* Reorder arrows as fallback/accessibility */}
        <div className="flex flex-col gap-0.5">
          <button
            type="button"
            onClick={() => moveParticipant(index, 'up')}
            disabled={isFirst}
            className="text-[#94A3B8] hover:text-[#E57432] cursor-pointer bg-transparent border-none p-0 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronUp size={14} strokeWidth={2.5} />
          </button>
          <button
            type="button"
            onClick={() => moveParticipant(index, 'down')}
            disabled={isLast}
            className="text-[#94A3B8] hover:text-[#E57432] cursor-pointer bg-transparent border-none p-0 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronDown size={14} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function StepPayout({ data, onChange }: Props) {
  const contribution = Number(data.contributionAmount) || 0;
  const namedParticipants = data.participants.filter((p) => p.name.trim());
  const totalPot = contribution * data.participants.length;



  const moveParticipant = (index: number, direction: 'up' | 'down') => {
    const arr = [...data.participants];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= arr.length) return;
    [arr[index], arr[target]] = [arr[target], arr[index]];
    onChange({ participants: arr });
  };

  const handleHoverSwap = (dragIndex: number, hoverIndex: number) => {
    const arr = [...data.participants];
    const dragItem = arr[dragIndex];
    arr.splice(dragIndex, 1);
    arr.splice(hoverIndex, 0, dragItem);
    onChange({ participants: arr });
  };

  // Fisher-Yates shuffle
  const handleShuffle = () => {
    const arr = [...data.participants];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    onChange({ participants: arr });
  };

  const hasParticipants = namedParticipants.length > 0;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-5 animate-fade-in">

        {/* Title + Shuffle */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-[var(--color-dark)]">Payout schedule</h2>
            <p className="text-xs text-[#64748B] mt-1">
              One payout per round. Drag and drop or use the arrows to set the order before continuing.
            </p>
          </div>
          {hasParticipants && (
            <button
              type="button"
              onClick={handleShuffle}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all hover:shadow-md active:scale-[0.96] border-none shrink-0"
              style={{ background: 'linear-gradient(135deg, #E57432, #F4A261)', color: 'white' }}
            >
              <Shuffle size={14} />
              Shuffle
            </button>
          )}
        </div>

        {/* Payout order list */}
        {hasParticipants ? (
          <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white">
            {namedParticipants.map((p, i) => {
              const isFirst = i === 0;
              const isLast = i === namedParticipants.length - 1;
              const roundLabel = isFirst
                ? 'Pays out first'
                : isLast
                  ? 'Final round'
                  : 'Pays out next';

              return (
                <DraggableParticipantRow
                  key={p.id}
                  p={p}
                  index={i}
                  totalPot={totalPot}
                  roundLabel={roundLabel}
                  isFirst={isFirst}
                  isLast={isLast}
                  moveParticipant={moveParticipant}
                  onHoverSwap={handleHoverSwap}
                />
              );
            })}
          </div>
        ) : (
          /* Empty state */
          <div className="rounded-2xl p-5 text-center border border-dashed border-gray-300" style={{ background: '#FAFAFA' }}>
            <p className="text-sm text-[#94A3B8]">
              Add at least one named participant on the previous step to set the payout order.
            </p>
          </div>
        )}

        {/* Example / Preview */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={14} className="text-[#E57432]" />
            <span className="text-xs font-bold text-[#E57432] tracking-wider">Example</span>
            <span className="text-xs text-[#94A3B8]">Preview</span>
          </div>
          <p className="text-xs text-[#64748B] mb-3">
            Once you've added participants, drag them into the payout order — here's how it'll look.
          </p>

          {/* Example cards */}
          <div className="space-y-2">
            {[
              { round: 1, name: 'Sarah', label: 'Pays out first' },
              { round: 2, name: 'Marcus', label: 'Pays out next' },
              { round: 3, name: 'Aisha', label: 'Final round' },
            ].map((ex) => (
              <div
                key={ex.round}
                className="flex items-center justify-between px-4 py-3.5 rounded-xl border"
                style={{ background: '#FAFAFA', borderColor: '#E5E7EB' }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: '#CBD5E1' }}
                  >
                    {ex.round}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[#94A3B8]">Round {ex.round} · {ex.name}</p>
                    <p className="text-xs text-[#CBD5E1] mt-0.5">{ex.label} · £600</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#CBD5E1] bg-[#F1F5F9] px-2 py-1 rounded-md">
                  Position {ex.round}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-[#94A3B8] mt-2 italic text-center">Example only — not real data.</p>
        </div>
      </div>
    </DndProvider>
  );
}
