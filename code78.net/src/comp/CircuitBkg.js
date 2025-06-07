import { useState, useRef, useEffect } from 'react';

export default function CircuitBkg() {
        const canvasRef = useRef();
    const [canvasInit, setCanvasInit] = useState(false);

    const animate = (canvasElement) => {
        if (canvasInit) {
            return;
        }
        setCanvasInit(true);
        // "#F80"
        const COL_NODE_COUNT = 30
        const DIVIDERS = ((2 * COL_NODE_COUNT) + 1)
        const dpr = window.devicePixelRatio || 1;
        const rect = canvasElement.getBoundingClientRect();
        canvasElement.width = rect.width * dpr;
        canvasElement.height = rect.height * dpr;
        
        const ctx = canvasElement.getContext('2d');
        ctx.strokeStyle = "#F80";
        
        function coord(n) {
            return n * 2 * canvasElement.width / DIVIDERS;
        }
        
        function drawPath(x, y, dx) {
            const x0 = coord(x + dx + 1)
            const y0 = coord(Math.max(y-1,0))
            const x1 = coord(x + 1)
            const y1 = coord(y)
            ctx.lineWidth = 6;
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.moveTo(x0, y0);
            ctx.lineTo(x1, y1);
            ctx.stroke();

        }
        function dxArrGen() {
            const arr = Array(COL_NODE_COUNT)
            for (let i = 0; i < COL_NODE_COUNT; i++) {
                // arr[i] = Math.floor(Math.random() * 3) - 1;
                const r = Math.random()
                if (r < 0.2) {
                    arr[i] = -1
                } else if (r < 0.4) {
                    arr[i] = 1
                } else {
                    arr[i] = 0
                }

                if (i == 0) {
                    arr[i] = Math.floor(Math.random() * 2);
                    continue;
                }
                if (i == COL_NODE_COUNT - 1) {
                    arr[i] = Math.floor(Math.random() * 2) - 1;
                }
                if (arr[i-1] == 1 && arr[i] == -1) {
                    if (Math.random() < 0.5) {
                        arr[i-1] = 0;
                    } else {
                        arr[i] = 0;
                    }
                }
            }
            return arr
        }

        function updateAnimation() {
            // ctx.clearRect(0, 0, canvasElement.width, canvasElement.height); // Clear canvas
            for (let j = 0; j <= 100; j++) {
                const dxs = dxArrGen()
                for (let i = 0; i < COL_NODE_COUNT; i++) {
                    drawPath(i, j, dxs[i])
                }
            }

            // requestAnimationFrame(updateAnimation);
        }

        updateAnimation();
    }

    useEffect(() => {
        if (canvasRef.current) {
            animate(canvasRef.current);
        }
    }, []);

    return <canvas ref={canvasRef}></canvas>
}