'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

const PIXEL_CELL_SIZE = 15; // Pixel cell size in px
const MOUSE_EFFECT_RADIUS = 4; // Cells around mouse affected by hover
const CLICK_EFFECT_RADIUS = 6; // Cells around mouse affected by click
const OPACITY_DECAY_RATE = 0.015; // How fast opacity decays per frame
const ACTIVE_OPACITY_TARGET = 0.7; // Target opacity on mouse hover
const CLICK_OPACITY_TARGET = 1.0; // Target opacity on click
const INTERACTION_TIMEOUT = 1500; // ms, how long a pixel stays "bright"
const BASE_OPACITY = 0.08; // Minimum opacity for pixels

interface PixelState {
    key: string;
    opacity: number;
    targetOpacity: number;
    color: string;
    lastInteractionTime: number;
}

export default function InteractivePixelbackground() {
    const [pixels, setPixels] = useState<Map<string, PixelState>>(new Map());
    const [gridSize, setGridSize] = useState({ cols: 0, rows: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const animationFrameId = useRef<number | null>(null);

    const getPixelKey = (row: number, col: number) => `${row}-${col}`;

    const reinitializeGridAndPixels = useCallback(() => {
        if (typeof window !== 'undefined') {
            const { innerWidth, innerHeight } = window;
            const newCols = Math.max(1, Math.floor(innerWidth / PIXEL_CELL_SIZE));
            const newRows = Math.max(1, Math.floor(innerHeight / PIXEL_CELL_SIZE));

            setGridSize({ cols: newCols, rows: newRows });

            const newPixelsMap = new Map<string, PixelState>();
            const baseFgColor = 'hsl(var(--foreground))';
            for (let r = 0; r < newRows; r++) {
                for (let c = 0; c < newCols; c++) {
                    const key = getPixelKey(r, c);
                    newPixelsMap.set(key, {
                        key,
                        opacity: BASE_OPACITY,
                        targetOpacity: BASE_OPACITY,
                        color: baseFgColor,
                        lastInteractionTime: 0,
                    });
                }
            }
            setPixels(newPixelsMap);
        }
    }, []);

    useEffect(() => {
        reinitializeGridAndPixels();
        const handleResize = () => reinitializeGridAndPixels();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, [reinitializeGridAndPixels]);

    useEffect(() => {
        if (gridSize.cols === 0 || gridSize.rows === 0 || pixels.size === 0) {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
            return;
        }

        const animate = () => {
            setPixels((prevPixels) => {
                const newPixels = new Map(prevPixels);
                const now = Date.now();
                let changed = false;

                newPixels.forEach((pixelState, key) => {
                    let currentPixel = { ...pixelState };
                    const timeSinceInteraction = now - currentPixel.lastInteractionTime;

                    if (
                        timeSinceInteraction > INTERACTION_TIMEOUT &&
                        currentPixel.targetOpacity > BASE_OPACITY
                    ) {
                        currentPixel.targetOpacity = BASE_OPACITY;
                        currentPixel.color = 'hsl(var(--foreground))';
                        changed = true;
                    }

                    if (Math.abs(currentPixel.opacity - currentPixel.targetOpacity) > 0.001) {
                        currentPixel.opacity +=
                            (currentPixel.targetOpacity - currentPixel.opacity) * 0.2; // Faster interpolation
                        changed = true;
                    } else if (
                        currentPixel.opacity > BASE_OPACITY &&
                        currentPixel.targetOpacity <= BASE_OPACITY
                    ) {
                        // Ensure it fades if target is base
                        currentPixel.opacity = Math.max(
                            BASE_OPACITY,
                            currentPixel.opacity - OPACITY_DECAY_RATE
                        );
                        if (
                            currentPixel.opacity <= BASE_OPACITY &&
                            currentPixel.color !== 'hsl(var(--foreground))'
                        ) {
                            currentPixel.color = 'hsl(var(--foreground))';
                        }
                        changed = true;
                    }

                    if (changed) newPixels.set(key, currentPixel);
                });
                return changed ? newPixels : prevPixels;
            });
            animationFrameId.current = requestAnimationFrame(animate);
        };

        animationFrameId.current = requestAnimationFrame(animate);

        return () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, [gridSize, pixels]);

    const interactWithPixels = useCallback((row: number, col: number, isClick: boolean) => {
        const radius = isClick ? CLICK_EFFECT_RADIUS : MOUSE_EFFECT_RADIUS;
        const targetOpacityBoost = isClick ? CLICK_OPACITY_TARGET : ACTIVE_OPACITY_TARGET;
        const interactionColor = isClick ? 'hsl(var(--accent))' : 'hsl(var(--primary))';
        const now = Date.now();

        setPixels((prevPixels) => {
            const newPixels = new Map(prevPixels);
            let hasChanges = false;
            for (let rOffset = -radius; rOffset <= radius; rOffset++) {
                for (let cOffset = -radius; cOffset <= radius; cOffset++) {
                    const currentTargetRow = row + rOffset;
                    const currentTargetCol = col + cOffset;
                    const distance = Math.sqrt(rOffset ** 2 + cOffset ** 2);

                    if (distance <= radius) {
                        const key = getPixelKey(currentTargetRow, currentTargetCol);
                        const pixel = newPixels.get(key);
                        if (pixel) {
                            const effectStrength = Math.max(0, 1 - distance / radius);
                            const newTargetOpacity =
                                BASE_OPACITY + (targetOpacityBoost - BASE_OPACITY) * effectStrength;
                            if (
                                newTargetOpacity > pixel.targetOpacity ||
                                (isClick && pixel.color !== interactionColor) ||
                                newTargetOpacity > pixel.opacity
                            ) {
                                newPixels.set(key, {
                                    ...pixel,
                                    targetOpacity: Math.min(1, newTargetOpacity),
                                    color: interactionColor,
                                    lastInteractionTime: now,
                                });
                                hasChanges = true;
                            } else if (
                                pixel.lastInteractionTime !== now &&
                                pixel.targetOpacity > BASE_OPACITY
                            ) {
                                newPixels.set(key, { ...pixel, lastInteractionTime: now });
                                hasChanges = true;
                            }
                        }
                    }
                }
            }
            return hasChanges ? newPixels : prevPixels;
        });
    }, []);

    const handleMouseMove = useCallback(
        (event: React.MouseEvent<HTMLDivElement>) => {
            if (!containerRef.current || gridSize.cols === 0 || gridSize.rows === 0) return;
            const rect = containerRef.current.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const col = Math.floor(x / (rect.width / gridSize.cols));
            const row = Math.floor(y / (rect.height / gridSize.rows));
            interactWithPixels(row, col, false);
        },
        [gridSize, interactWithPixels]
    );

    const handleClick = useCallback(
        (event: React.MouseEvent<HTMLDivElement>) => {
            if (!containerRef.current || gridSize.cols === 0 || gridSize.rows === 0) return;
            const rect = containerRef.current.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const col = Math.floor(x / (rect.width / gridSize.cols));
            const row = Math.floor(y / (rect.height / gridSize.rows));
            interactWithPixels(row, col, true);
        },
        [gridSize, interactWithPixels]
    );

    const pixelElements = React.useMemo(() => {
        if (gridSize.cols === 0 || gridSize.rows === 0 || pixels.size === 0) return [];
        const elements = [];
        for (let r = 0; r < gridSize.rows; r++) {
            for (let c = 0; c < gridSize.cols; c++) {
                const key = getPixelKey(r, c);
                const pixel = pixels.get(key);
                elements.push(
                    <div
                        key={key}
                        style={{
                            backgroundColor: pixel?.color || 'hsl(var(--foreground))',
                            opacity: pixel?.opacity || BASE_OPACITY,
                        }}
                    />
                );
            }
        }
        return elements;
    }, [pixels, gridSize.rows, gridSize.cols]);

    if (gridSize.cols === 0 || gridSize.rows === 0) {
        return <div ref={containerRef} className='fixed inset-0 -z-10' />;
    }

    return (
        <section
            ref={containerRef}
            className='fixed inset-0 -z-10 overflow-hidden cursor-default'
            onMouseMove={handleMouseMove}
            onClick={handleClick}
        >
            <div
                className='grid w-full h-full'
                style={{
                    gridTemplateColumns: `repeat(${gridSize.cols}, 1fr)`,
                    gridTemplateRows: `repeat(${gridSize.rows}, 1fr)`,
                }}
            >
                {pixelElements}
            </div>
        </section>
    );
}
