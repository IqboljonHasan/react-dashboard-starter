import { SettingOutlined } from '@ant-design/icons';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { SettingsModal } from './SettingsModal';

const SIZE = 48;
const MARGIN = 24;
const DRAG_THRESHOLD = 4;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export function SettingsButton() {
  const { t } = useTranslation('settings');
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState(() => ({
    x: typeof window === 'undefined' ? MARGIN : window.innerWidth - SIZE - MARGIN,
    y: typeof window === 'undefined' ? MARGIN : window.innerHeight - SIZE - MARGIN,
  }));

  const drag = useRef({
    active: false,
    moved: false,
    startX: 0,
    startY: 0,
    offsetX: 0,
    offsetY: 0,
  });

  const handlePointerDown = (e: ReactPointerEvent<HTMLButtonElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = {
      active: true,
      moved: false,
      startX: e.clientX,
      startY: e.clientY,
      offsetX: e.clientX - pos.x,
      offsetY: e.clientY - pos.y,
    };
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    if (!d.active) return;
    if (
      Math.abs(e.clientX - d.startX) > DRAG_THRESHOLD ||
      Math.abs(e.clientY - d.startY) > DRAG_THRESHOLD
    ) {
      d.moved = true;
    }
    setPos({
      x: clamp(e.clientX - d.offsetX, MARGIN, window.innerWidth - SIZE - MARGIN),
      y: clamp(e.clientY - d.offsetY, MARGIN, window.innerHeight - SIZE - MARGIN),
    });
  };

  const handlePointerUp = (e: ReactPointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    if (d.active && !d.moved) setOpen(true);
    d.active = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <>
      <button
        type="button"
        title={t('page.title')}
        aria-label={t('page.title')}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="fixed z-9999 flex items-center justify-center rounded-full text-primary-foreground shadow-lg transition-shadow hover:shadow-xl"
        style={{
          left: 16,
          top: pos.y,
          width: SIZE,
          height: SIZE,
          backgroundColor: 'var(--color-primary)',
          cursor: 'grab',
          touchAction: 'none',
        }}
      >
        <SettingOutlined className="settings-gear text-xl" />
      </button>
      <SettingsModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
