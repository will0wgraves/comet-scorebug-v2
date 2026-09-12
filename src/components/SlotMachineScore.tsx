import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

interface SlotMachineScoreProps {
  score: number;
  className?: string;
  spinKey?: number; // Optional prop to force a spin animation
  itemHeight?: number;
  reelWidth?: number;
}

interface DigitReelProps {
  digit: number;
  isSpinning: boolean;
  reelDelay: number;
  itemHeight?: number;
  reelWidth?: number;
}

const DigitReel: React.FC<DigitReelProps> = ({
  digit,
  isSpinning,
  reelDelay,
  itemHeight = 58,
  reelWidth = 32
}) => {
  // Digit reel items for the slot machine
  // To spin from UP to DOWN: the reel starts positioned higher up and slides downwards to rest at index
  const [displayDigits, setDisplayDigits] = useState<number[]>([digit]);
  const [spinKey, setSpinKey] = useState(0);

  useEffect(() => {
    if (isSpinning) {
      // Build a realistic slot machine strip of 12-16 cycling numbers ending with the target digit
      const strip: number[] = [];
      const reelLength = 14;
      for (let i = 0; i < reelLength - 1; i++) {
        strip.push(Math.floor(Math.random() * 10));
      }
      strip.push(digit);
      setDisplayDigits(strip);
      setSpinKey((prev) => prev + 1);
    } else {
      setDisplayDigits([digit]);
    }
  }, [digit, isSpinning]);

  const ITEM_HEIGHT = itemHeight;

  if (!isSpinning) {
    return (
      <div
        style={{ height: `${ITEM_HEIGHT}px`, minWidth: `${reelWidth}px` }}
        className="relative flex items-center justify-center overflow-visible select-none px-1"
      >
        <span className="font-redhat font-black italic tabular-nums tracking-normal leading-tight inline-flex items-center justify-center pr-1">
          {digit}
        </span>
      </div>
    );
  }

  const totalOffset = (displayDigits.length - 1) * ITEM_HEIGHT;

  return (
    <div
      style={{ height: `${ITEM_HEIGHT}px`, width: `${reelWidth + 4}px` }}
      className="relative overflow-hidden flex items-center justify-center px-1"
    >
      {/* Top & bottom subtle shadow masks for authentic mechanical slot machine depth */}
      <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />

      <motion.div
        key={spinKey}
        initial={{ y: 0, filter: 'blur(2px)' }}
        animate={{
          y: -totalOffset,
          filter: ['blur(0px)', 'blur(2px)', 'blur(1px)', 'blur(0px)']
        }}
        transition={{
          duration: 1.3,
          delay: reelDelay,
          ease: [0.22, 1, 0.36, 1], // snappy slot machine roll into spring brake
        }}
        className="flex flex-col items-center select-none"
      >
        {displayDigits.map((d, idx) => (
          <div
            key={idx}
            style={{ height: `${ITEM_HEIGHT}px` }}
            className="flex items-center justify-center text-center font-redhat font-black italic tracking-normal leading-tight pr-1"
          >
            <span className="tabular-nums inline-flex items-center justify-center">
              {d}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export const SlotMachineScore: React.FC<SlotMachineScoreProps> = ({
  score,
  className = '',
  spinKey = 0,
  itemHeight = 58,
  reelWidth = 32
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const prevScoreRef = useRef<number>(score);
  const isFirstRender = useRef(true);
  const prevSpinKeyRef = useRef<number>(spinKey);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const scoreChanged = prevScoreRef.current !== score;
    const forceSpin = prevSpinKeyRef.current !== spinKey;

    if (scoreChanged || forceSpin) {
      setIsSpinning(true);
      const timer = setTimeout(() => {
        setIsSpinning(false);
      }, 1800);

      prevScoreRef.current = score;
      prevSpinKeyRef.current = spinKey;

      return () => clearTimeout(timer);
    }
  }, [score, spinKey]);

  // Break score into digits
  const scoreStr = Math.max(0, score).toString();
  const digits = scoreStr.split('').map(Number);

  return (
    <div
      className={`flex items-center justify-center font-redhat font-black italic leading-none select-none text-white ${className}`}
      style={{ textShadow: '0 2px 10px rgba(0,0,0,0.9), 0 0 1px rgba(255,255,255,0.4)' }}
    >
      {digits.map((digit, index) => (
        <DigitReel
          key={`${index}-${scoreStr.length}`}
          digit={digit}
          isSpinning={isSpinning}
          reelDelay={index * 0.1} // Cascade spin effect like real multi-wheel slot machine!
          itemHeight={itemHeight}
          reelWidth={reelWidth}
        />
      ))}
    </div>
  );
};
