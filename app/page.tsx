'use client';

import { useEffect, useRef, useState } from 'react';

const Test: React.FC = () => {
  const [inputValue, setInputValue] = useState<number>(10);
  const [fibonacciSequence, setFibonacciSequence] = useState<number[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [scrollLeft, setScrollLeft] = useState<number>(0);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const generateFibonacci = (count: number): number[] => {
    const sequence = [0, 1];
    for (let i = 2; i < count; i++) {
      sequence.push(sequence[i - 1] + sequence[i - 2]);
    }
    return sequence.slice(0, count);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(
      10,
      Math.min(50, parseInt(e.target.value || '0', 10)),
    );
    setInputValue(value);
    setFibonacciSequence(generateFibonacci(value));
    setActiveIndex(0);
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;

    const scrollLeft = scrollContainerRef.current.scrollLeft;
    const boxWidth = 55;
    const newIndex = Math.round(scrollLeft / boxWidth);

    setActiveIndex(newIndex);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setScrollLeft(scrollContainerRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - startX;
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollLeft - deltaX;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const getFontSize = (value: number): string => {
    if (value < 100) {
      return '16px';
    } else if (value < 1000) {
      return '12px';
    } else {
      return '10px';
    }
  };

  useEffect(() => {
    setFibonacciSequence(generateFibonacci(inputValue));
  }, [inputValue]);

  useEffect(() => {
    const container = scrollContainerRef.current;

    if (container) {
      container.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <main className="flex items-center justify-center h-full">
      <div className="p-2">
        <label>
          Number of boxes (10-50):{' '}
          <input
            type="number"
            className="bg-black text-white"
            min="10"
            max="50"
            value={inputValue}
            onChange={handleChange}
          />
        </label>

        <div
          ref={scrollContainerRef}
          className="mt-4 p-2 flex flex-row flex-nowrap gap-2 w-80 overflow-x-auto bg-white"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          {fibonacciSequence.map((size, index) => (
            <div
              key={index}
              style={{
                width: '50px',
                height: '50px',
                minWidth: 'min-content',
                fontSize: getFontSize(size),
              }}
              className={`hover:shadow-md hover:border-gray-200 duration-300 cursor-grab transition-all hover:-translate-y-1 p-4 flex items-center justify-center border-2 border-gray-100 rounded-md ${
                activeIndex === index ? 'bg-green-500 text-white' : ''
              }`}
            >
              {size.toLocaleString()}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Test;
