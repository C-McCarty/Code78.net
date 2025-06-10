import { useState, useRef, useEffect } from 'react';

export default function CircuitBkg({page}) {
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
        const COL_NODE_COUNT = 10
        const DIVIDERS = ((2 * COL_NODE_COUNT) + 1)
        const dpr = window.devicePixelRatio || 1;
        const initRect = canvasElement.getBoundingClientRect();
        canvasElement.width = initRect.width * dpr;
        canvasElement.height = initRect.height * dpr;
        canvasElement.style.width = initRect.width + "px";
        canvasElement.style.height = initRect.height + "px";

        const SEGMENT_SIZE = canvasElement.width / DIVIDERS
        const ROW_NODE_COUNT = Math.ceil(canvasElement.height / SEGMENT_SIZE)
        const SEGMENT_SCREEN_SIZE = initRect.width / DIVIDERS;
        
        const NODE_L = -1
        const NODE_U = 0
        const NODE_R = 1
        const NODE_UNSET = 2

        const NODE_DIR = [] // Access with NODE_DIR[x][y]
        const NODE_END = [] // Access with NODE_DIR[x][y]
        for (let nodeCol = 0; nodeCol < COL_NODE_COUNT; nodeCol++) {
            const colOfNodeDirs = Array(ROW_NODE_COUNT).fill(NODE_UNSET)
            const colOfNodeEnds = Array(ROW_NODE_COUNT).fill(false)
            NODE_DIR.push(colOfNodeDirs)
            NODE_END.push(colOfNodeEnds)
        }
        const ctx = canvasElement.getContext('2d');
        
        const HIGHEST_ROW_PADDING = 0 // Math.ceil(window.innerHeight * 0.08 / SEGMENT_SIZE)
        function getHighestRow() {
            return Math.max(Math.ceil(0.5 * window.scrollY / SEGMENT_SCREEN_SIZE) + HIGHEST_ROW_PADDING, 1)
        }
        const LOWEST_ROW_PADDING = 0
        function getLowestRow() {
               return Math.min(Math.floor(0.5 * (window.scrollY + window.innerHeight) / SEGMENT_SCREEN_SIZE) - LOWEST_ROW_PADDING, ROW_NODE_COUNT)
        }

        function coord(n) {
            return ((n * 2) - 0.5) * SEGMENT_SIZE;
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
        function drawNode(x, y, forceFill = false) {
            const x0 = coord(x+1)
            const y0 = coord(y)
            ctx.shadowColor = LINE_COLOR
            ctx.shadowBlur = LINE_BLOOM;
            ctx.fillStyle = LINE_COLOR
            ctx.beginPath();
            ctx.arc(x0, y0, LINE_WIDTH*2, 0, Math.PI * 2); // x, y, radius, startAngle, endAngle
            ctx.fill();
            ctx.fillStyle = NODE_COLOR_EMPTY
            if (forceFill || Math.random() < 0.5) {
                ctx.fillStyle = NODE_COLOR_FILLED
            }
            ctx.beginPath();
            ctx.arc(x0, y0, LINE_WIDTH, 0, Math.PI * 2); // x, y, radius, startAngle, endAngle
            ctx.fill();
        }

        function isValidEnd(x, y) {
            if (NODE_END[x] == undefined) {return false}
            if (NODE_END[x][y]) { return false }
            if (NODE_DIR[x][y] != NODE_UNSET) {return false}
            let blockSize = 1
            let xScanner = x - 1
            while (xScanner == - 1 || (NODE_END[xScanner] != undefined && NODE_END[xScanner][y])) {
                blockSize++
                xScanner--
            }
            xScanner = x + 1
            while (xScanner == COL_NODE_COUNT || (NODE_END[xScanner] != undefined && NODE_END[xScanner][y])) {
                blockSize++
                xScanner--
            }
            return blockSize < 3
        }

        const NODE_START = 78
        function getDx(x, y) {
            if (y < 1) {return NODE_START}
            if (NODE_END[x] == undefined) {return NODE_START}
            const dxPossibilities = []
            if (x > 0) {
                if (!NODE_END[x-1][y-1] && NODE_DIR[x-1][y] != NODE_R) {
                    dxPossibilities.push(-1)
                }
            }
            if (x < COL_NODE_COUNT - 1) {
                if (!NODE_END[x+1][y-1] && NODE_DIR[x+1][y] != NODE_L) {
                    dxPossibilities.push(1)
                }
            }
            if (!NODE_END[x][y-1]) {
                dxPossibilities.push(0)
            }
            if (dxPossibilities.length == 0) {
                return NODE_START
            }
            return dxPossibilities[Math.floor(Math.random() * dxPossibilities.length)]
        }

        const xArr = []
        const yArr = []
        const dxArr = []
        let lastFrameTime = 0;
        const FRAME_DURATION = 1000 / 60
        function updateAnimation(time) {
            if ((time - lastFrameTime) < FRAME_DURATION) {
                requestAnimationFrame(updateAnimation);
                return
            }
            lastFrameTime = time

            if (xArr.length == 0) {
                const highestRow = getHighestRow()
                const lowestRow = getLowestRow()
                const FIND_NODE_END_ATTEMPTS = 100
                let xDraw = -1
                let yDraw = -1
                let dxDraw = -1
                for (let _ = 0; _ < FIND_NODE_END_ATTEMPTS; _++) {
                    const x0 = Math.floor(Math.random() * COL_NODE_COUNT)
                    const y0 = Math.floor(Math.random() * (lowestRow - highestRow)) + highestRow
                    if (!isValidEnd(x0, y0)) {continue}
                    xDraw = x0
                    yDraw = y0
                    dxDraw = getDx(x0, y0)
                    break
                }
                if (xDraw == -1) {
                    requestAnimationFrame(updateAnimation);
                    return;
                    // Failed to find new node to begin drawing!
                }
                NODE_END[xDraw][yDraw] = true
                while (NODE_DIR[xDraw][yDraw] == NODE_UNSET) {
                    xArr.push(xDraw)
                    yArr.push(yDraw)
                    dxArr.push(dxDraw)
                    NODE_DIR[xDraw][yDraw] = dxDraw
                    if (dxDraw == NODE_START) {
                        break
                    }
                    yDraw--
                    xDraw += dxDraw
                    dxDraw = getDx(xDraw, yDraw)
                    if (NODE_DIR[xDraw] == undefined) {
                        throw new Error("here")
                    }
                }
                if (xArr.length == 1) {
                    xArr.pop()
                    yArr.pop()
                    dxArr.pop()
                    requestAnimationFrame(updateAnimation);
                    return;
                    //Don't bother animating super short circuits
                }
            }
            let xNode
            let yNode
            let dxNode
            do {
                xNode = xArr.pop()
                yNode = yArr.pop()
                dxNode = dxArr.pop()
                if (dxNode == NODE_START) {
                    drawNode(xNode, yNode, true)
                } else {
                    drawPath(xNode, yNode, dxNode)
                }
                if (xArr.length == 0) {
                    drawNode(xNode, yNode)
                }
            } while (yNode < getHighestRow())
            requestAnimationFrame(updateAnimation);
        }
        requestAnimationFrame(updateAnimation);
    }

    useEffect(() => {
        if (canvasRef.current) {
            animate(canvasRef.current);
        }
    }, [page]);

    return <canvas ref={canvasRef}></canvas>
}