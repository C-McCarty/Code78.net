import { useState, useRef, useEffect } from 'react';

export default function CircuitBkg() {
    const canvasRef = useRef();
    const [canvasInit, setCanvasInit] = useState(false);
    let init = false // Del me
    const animate = (canvasElement) => {
        if (canvasInit) {
            return;
        }
        setCanvasInit(true);
        if (init) {return} // Del me
        init = true // Del me
        // "#F80"
        const LINE_COLOR = "#F80";
        const NODE_COLOR_EMPTY = "#733D00";
        const NODE_COLOR_FILLED = "#E70";
        const LINE_WIDTH = 4;
        const LINE_BLOOM = 12
        const COL_NODE_COUNT = 40
        const DIVIDERS = ((2 * COL_NODE_COUNT) + 1)
        const dpr = window.devicePixelRatio || 1;
        const rect = canvasElement.getBoundingClientRect();
        canvasElement.width = rect.width * dpr;
        canvasElement.height = rect.height * dpr;
        
        const ctx = canvasElement.getContext('2d');
        
        function coord(n) {
            return n * 2 * canvasElement.width / DIVIDERS;
        }
        
        function drawPath(x, y, dx) {
            const x0 = coord(x + dx + 1)
            const y0 = coord(Math.max(y-1,0))
            const x1 = coord(x + 1)
            const y1 = coord(y)
            ctx.strokeStyle = LINE_COLOR;
            ctx.lineWidth = LINE_WIDTH;
            ctx.lineCap = "round";
            ctx.shadowColor = LINE_COLOR
            ctx.shadowBlur = LINE_BLOOM;
            ctx.beginPath();
            ctx.moveTo(x0, y0);
            ctx.lineTo(x1, y1);
            ctx.stroke();
        }
        function drawNode(x, y) {
            const x0 = coord(x+1)
            const y0 = coord(y)
            ctx.shadowColor = LINE_COLOR
            ctx.shadowBlur = LINE_BLOOM;
            ctx.fillStyle = LINE_COLOR
            ctx.beginPath();
            ctx.arc(x0, y0, LINE_WIDTH*2, 0, Math.PI * 2); // x, y, radius, startAngle, endAngle
            ctx.fill();
            ctx.fillStyle = NODE_COLOR_EMPTY
            if (Math.random() < 0.5) {
                ctx.fillStyle = NODE_COLOR_FILLED
            }
            ctx.beginPath();
            ctx.arc(x0, y0, LINE_WIDTH, 0, Math.PI * 2); // x, y, radius, startAngle, endAngle
            ctx.fill();

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
        let j = 0
        let i = 0
        let dxs = dxArrGen()
        function updateAnimation() {
            // ctx.clearRect(0, 0, canvasElement.width, canvasElement.height); // Clear canvas
            drawPath(i, j, dxs[i])
            i++;
            if (i == COL_NODE_COUNT) {
                i = 0;
                let nextDxs = dxArrGen()
                for (let k = 0; k < COL_NODE_COUNT; k++) {
                    if (nextDxs[k - 1] != 1 && nextDxs[k] != 0 && nextDxs[k+1] != -1) {
                        drawNode(k, j)
                    }
                }
                dxs = nextDxs
                j++;
            }
            if (j < 100) {
                requestAnimationFrame(updateAnimation);
            }
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