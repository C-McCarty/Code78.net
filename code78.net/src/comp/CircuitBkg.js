import { useState, useRef, useEffect } from "react";

export default function CircuitBkg({ page }) {
    const canvasRef = useRef();
    const [canvasInit, setCanvasInit] = useState(false);

    let colNodeCount = null;
    let dividers = null;
    let dpr = null;
    let segmentSize = null;
    let segmentScreenSize = null;
    let rowNodeCount = null;
    let lineWidth = null;
    let lineBloom = null;
    const NODE_UNSET_ID = 78;
    const nodeDir = [];
    const nodeEnd = [];
    const xStack = [];
    const yStack = [];
    const dxStack = [];
    let glitchNodeX = null;
    let glitchNodeY = null;
    let glitchState = 0;
    const glitchableNodes = [];
    let ctx = null;
    const MIN_COL_NODE_COUNT = 5;
    const TARGET_COL_WIDTH = 175;
    const MIN_LINE_WIDTH = 1;
    const LINE_WIDTH_PORTION = 0.2;
    const BLOOM_SIZE = 3;
    function canvasSetup(canvasElement) {
        //Get column count
        colNodeCount = Math.max(Math.round(window.innerWidth / TARGET_COL_WIDTH), MIN_COL_NODE_COUNT);
        dividers = 2 * colNodeCount + 1;
        //Sizing canvas
        const rect = canvasElement.getBoundingClientRect();
        dpr = window.devicePixelRatio || 1;
        canvasElement.width = rect.width * dpr;
        canvasElement.height = rect.height * dpr;
        segmentSize = canvasElement.width / dividers;
        segmentScreenSize = rect.width / dividers;
        //Get row count
        rowNodeCount = Math.ceil(canvasElement.height / segmentSize);
        //Sizing lines
        lineWidth = Math.max(segmentSize * LINE_WIDTH_PORTION, MIN_LINE_WIDTH);
        lineBloom = lineWidth * BLOOM_SIZE;
        //Reset internal node representation
        nodeDir.length = 0;
        nodeEnd.length = 0;
        for (let nodeCol = 0; nodeCol < colNodeCount; nodeCol++) {
            const colOfNodeDirs = Array(rowNodeCount).fill(NODE_UNSET_ID);
            const colOfNodeEnds = Array(rowNodeCount).fill(false);
            nodeDir.push(colOfNodeDirs);
            nodeEnd.push(colOfNodeEnds);
        }
        //Reset circuit builder
        xStack.length = 0;
        yStack.length = 0;
        dxStack.length = 0;
        //Reset glitch state
        glitchState = 0;
        glitchableNodes.length = 0;
        //Clear canvas
        ctx = canvasElement.getContext("2d");
        ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    }

    const RANDOMIZER_VAL1 = 0x86753099;
    const RANDOMIZER_VAL2 = 0x78;
    function pseudoRand(n) {
        n = ((n >> 16) ^ n) * RANDOMIZER_VAL1;
        n = ((n >> 16) ^ n) * RANDOMIZER_VAL2;
        n = (n >> 16) ^ n;
        return n & 1;
    }

    const HIGHEST_ROW_PADDING = 0;
    function getHighestRow() {
        return Math.max(Math.ceil((0.5 * window.scrollY) / segmentScreenSize) + HIGHEST_ROW_PADDING, 1);
    }

    const LOWEST_ROW_PADDING = 0;
    function getLowestRow() {
        return Math.min(Math.floor((0.5 * (window.scrollY + window.innerHeight)) / segmentScreenSize) - LOWEST_ROW_PADDING, rowNodeCount);
    }

    function coord(n) {
        return (n * 2 - 0.5) * segmentSize;
    }

    const LINE_COLOR = "#F80";
    function drawPath(x, y, dx, drawBloom = true, drawColor = LINE_COLOR) {
        const [x0, y0] = [coord(x + dx + 1), coord(Math.max(y - 1, 0))];
        const [x1, y1] = [coord(x + 1), coord(y)];
        ctx.strokeStyle = drawColor;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = "round";
        if (drawBloom) {
            ctx.shadowColor = drawColor;
            ctx.shadowBlur = lineBloom;
        } else {
            ctx.shadowBlur = 0;
        }
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
    }

    const NODE_LINE_COLOR = LINE_COLOR
    const NODE_COLOR_EMPTY = "#733D00";
    const NODE_COLOR_FILLED = "#E70";
    function drawNode(x, y, reColor = null) {
        const [x0, y0] = [coord(x + 1), coord(y)];
        ctx.shadowColor = reColor || NODE_LINE_COLOR;
        ctx.shadowBlur = reColor ? 0 : lineBloom;
        ctx.fillStyle = reColor || NODE_LINE_COLOR;
        ctx.beginPath();
        ctx.arc(x0, y0, lineWidth * 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = (reColor && reColor != NODE_LINE_COLOR) ? reColor : NODE_COLOR_FILLED;
        if (pseudoRand((x * colNodeCount) + y) == 0) {
                ctx.fillStyle = NODE_COLOR_EMPTY
        }
        ctx.beginPath();
        ctx.arc(x0, y0, lineWidth, 0, Math.PI * 2);
        ctx.fill();
    }

    function isValidEnd(x, y) {
        if (nodeEnd[x] == undefined) {
            return false;
        }
        if (nodeEnd[x][y]) {
            return false;
        }
        if (nodeDir[x][y] != NODE_UNSET_ID) {
            return false;
        }
        let blockSize = 1;
        if (x - 1 == -1) {
            blockSize++;
        } else if (nodeEnd[x - 1][y]) {
            blockSize++;
            if (x - 2 == -1) {
                blockSize++;
            } else if (nodeEnd[x - 2][y]) {
                blockSize++;
            }
        }
        if (x + 1 == colNodeCount) {
            blockSize++;
        } else if (nodeEnd[x + 1][y]) {
            blockSize++;
            if (x + 2 == colNodeCount) {
                blockSize++;
            } else if (nodeEnd[x + 2][y]) {
                blockSize++;
            }
        }
        return blockSize < 3;
    }

    function getDx(x, y) {
        const dxPossibilities = [];
        if (x > 0) {
            if (!nodeEnd[x - 1][y - 1] && nodeDir[x - 1][y] != 1) {
                dxPossibilities.push(-1);
            }
        }
        if (x < colNodeCount - 1) {
            if (!nodeEnd[x + 1][y - 1] && nodeDir[x + 1][y] != -1) {
                dxPossibilities.push(1);
            }
        }
        if (!nodeEnd[x][y - 1]) {
            dxPossibilities.push(0);
        }
        return dxPossibilities[Math.floor(Math.random() * dxPossibilities.length)];
    }

    const GLITCH_PROB = 1 / 500;
    const GLITCH_COLOR_ARR = ['#ff8800', '#ff8200', '#ff7c00', '#ff7600', '#ff7000', '#ff6a00', '#ff6400', '#ff5e00', '#ff5800', '#ff5200', '#ff4d00', '#ff4700', '#ff4100', '#ff3b00', '#ff3500', '#ff2f00', '#ff2900', '#ff2300', '#ff1d00', '#ff1700', '#ff1100', '#ff1100', '#ff2f20', '#ff4d40', '#ff6a60', '#ff8880', '#ffa69f', '#ffc4bf', '#ffe1df', '#ffffff', '#ffffff', '#ffe1df', '#ffc4bf', '#ffa69f', '#ff8880', '#ff6a60', '#ff4d40', '#ff2f20', '#ff1100', '#ff1100', '#ff1700', '#ff1d00', '#ff2300', '#ff2900', '#ff2f00', '#ff3500', '#ff3b00', '#ff4100', '#ff4700', '#ff4d00', '#ff5200', '#ff5800', '#ff5e00', '#ff6400', '#ff6a00', '#ff7000', '#ff7600', '#ff7c00', '#ff8200', NODE_LINE_COLOR];
    function handleGlitch() {
        if (glitchState == 0) {
            if (glitchableNodes.length > 0 && Math.random() < GLITCH_PROB) {
                [glitchNodeX, glitchNodeY] = glitchableNodes[Math.floor(Math.random() * glitchableNodes.length)];
                glitchState++;
            }
        } else {
            let glitchColor = GLITCH_COLOR_ARR[glitchState];
            let x = glitchNodeX;
            let y = glitchNodeY;
            if (nodeDir[x] != undefined) {
                while (y > 1) {
                    drawPath(x, y, nodeDir[x][y], false, glitchColor);
                    x += nodeDir[x][y];
                    y--;
                }
                drawNode(glitchNodeX, glitchNodeY, glitchColor);
            }
            glitchState++;
            if (glitchState >= GLITCH_COLOR_ARR.length) {
                drawNode(glitchNodeX, glitchNodeY, NODE_LINE_COLOR);
                glitchState = 0;
            }
        }
    }

    function attemptCircuitBuild() {
        const highestRow = getHighestRow();
        const lowestRow = getLowestRow();
        const FIND_NODE_END_ATTEMPTS = 100;
        let x = null;
        let y = null;
        let dx = null;
        for (let _ = 0; _ < FIND_NODE_END_ATTEMPTS; _++) {
            const x0 = Math.floor(Math.random() * colNodeCount);
            const y0 = Math.floor(Math.random() * (lowestRow - highestRow)) + highestRow;
            if (!isValidEnd(x0, y0)) {
                continue;
            }
            [x, y] = [x0, y0];
            dx = getDx(x0, y0);
            break;
        }
        if (!x) {
            return;
            // Failed to find new node to begin drawing! Screen is probably full.
        }
        nodeEnd[x][y] = true;
        while (nodeDir[x][y] == NODE_UNSET_ID) {
            xStack.push(x);
            yStack.push(y);
            dxStack.push(dx);
            nodeDir[x][y] = dx;
            y--;
            x += dx;
            dx = getDx(x, y);
        }
        //Don't bother animating super short circuits.
        if (xStack.length <= 1) {
            xStack.length = 0;
            yStack.length = 0;
            dxStack.length = 0;
        }
    }

    let lastFrameTime = null;
    const FRAME_DURATION = 1000 / 60;
    function updateAnimation(time) {
        if (!lastFrameTime) {
            lastFrameTime = time;
        }
        if (time - lastFrameTime < FRAME_DURATION) {
            requestAnimationFrame(updateAnimation);
            return;
        }
        lastFrameTime += FRAME_DURATION;
        handleGlitch();
        if (xStack.length == 0) {
            attemptCircuitBuild();
        }
        if (xStack.length == 0) {
            //Could not build new circuit!
            requestAnimationFrame(updateAnimation);
            return;
        }
        let x = null;
        let y = null;
        let dx = null;
        const highestRow = getHighestRow();
        do {
            x = xStack.pop();
            y = yStack.pop();
            dx = dxStack.pop();
            drawPath(x, y, dx);
            if (xStack.length == 0) {
                drawNode(x, y);
                glitchableNodes.push([x, y]);
            }
        } while (y < highestRow);
        requestAnimationFrame(updateAnimation);
    }

    const animate = (canvasElement) => {
        if (canvasInit) {
            return;
        }
        setCanvasInit(true);
        canvasSetup(canvasElement);
        requestAnimationFrame(updateAnimation);
    };

    useEffect(() => {
        if (canvasRef.current) {
            animate(canvasRef.current);
        }
    }, [page]);
    
    let prevWidth = window.innerWidth;
    let prevHeight = window.innerHeight;
    window.addEventListener("resize", () => {
        if (!canvasRef.current) {
            return;
        }
        if (window.innerWidth == prevWidth && window.innerHeight == prevHeight) {
            return;
        }
        prevWidth = window.innerWidth;
        prevHeight = window.innerHeight;
        canvasSetup(canvasRef.current);
    });

    return <canvas ref={canvasRef}></canvas>;
}
