import { useState, useRef, useEffect } from 'react';

export default function CircuitBkg({page}) {
    const canvasRef = useRef();
    const [canvasInit, setCanvasInit] = useState(false);
    let init = false // Del me

    const LINE_COLOR = "#F80";
    const NODE_COLOR_EMPTY = "#733D00";
    const NODE_COLOR_FILLED = "#E70";
    const COL_NODE_COUNT = 10
    const DIVIDERS = ((2 * COL_NODE_COUNT) + 1)
    const dpr = window.devicePixelRatio || 1;
    
    const NODE_UNSET_ID = 77
    const NODE_START_ID = 78
    
    let lineWidth = null;
    let lineBloom = null;
    let ctx = null;
    let segmentSize = null
    let segmentScreenSize = null;
    let rowNodeCount = null
    const NODE_DIR = []
    const NODE_END = []
    const xArr = []
    const yArr = []
    const dxArr = []
    
    function canvasSetup(canvasElement) {
        const initRect = canvasElement.getBoundingClientRect();
        canvasElement.width = initRect.width * dpr;
        canvasElement.height = initRect.height * dpr;
        lineWidth = canvasElement.width / 120;
        lineBloom = lineWidth * 3
        console.log(lineWidth, lineBloom)
        segmentSize = canvasElement.width / DIVIDERS
        segmentScreenSize = initRect.width / DIVIDERS;
        rowNodeCount = Math.ceil(canvasElement.height / segmentSize)

        NODE_DIR.length = 0
        NODE_END.length = 0
        for (let nodeCol = 0; nodeCol < COL_NODE_COUNT; nodeCol++) {
            const colOfNodeDirs = Array(rowNodeCount).fill(NODE_UNSET_ID)
            const colOfNodeEnds = Array(rowNodeCount).fill(false)
            NODE_DIR.push(colOfNodeDirs)
            NODE_END.push(colOfNodeEnds)
        }
        xArr.length = 0
        yArr.length = 0
        dxArr.length = 0
        
        ctx = canvasElement.getContext('2d');
        ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    }
    const animate = (canvasElement) => {
        if (canvasInit) {
            return;
        }
        setCanvasInit(true);
        if (init) {return} // Del me
        init = true // Del me
        // "#F80"
        canvasSetup(canvasElement)

        const HIGHEST_ROW_PADDING = 0
        function getHighestRow() {
            return Math.max(Math.ceil(0.5 * window.scrollY / segmentScreenSize) + HIGHEST_ROW_PADDING, 1)
        }
        const LOWEST_ROW_PADDING = 0
        function getLowestRow() {
               return Math.min(Math.floor(0.5 * (window.scrollY + window.innerHeight) / segmentScreenSize) - LOWEST_ROW_PADDING, rowNodeCount)
        }
        function coord(n) {
            return ((n * 2) - 0.5) * segmentSize;
        }
        function drawPath(x, y, dx) {
            const x0 = coord(x + dx + 1)
            const y0 = coord(Math.max(y-1,0))
            const x1 = coord(x + 1)
            const y1 = coord(y)
            ctx.strokeStyle = LINE_COLOR;
            ctx.lineWidth = lineWidth;
            ctx.lineCap = "round";
            ctx.shadowColor = LINE_COLOR
            ctx.shadowBlur = lineBloom;
            ctx.beginPath();
            ctx.moveTo(x0, y0);
            ctx.lineTo(x1, y1);
            ctx.stroke();
        }
        function drawNode(x, y, forceFill = false) {
            const x0 = coord(x+1)
            const y0 = coord(y)
            ctx.shadowColor = LINE_COLOR
            ctx.shadowBlur = lineBloom;
            ctx.fillStyle = LINE_COLOR
            ctx.beginPath();
            ctx.arc(x0, y0, lineWidth*2, 0, Math.PI * 2); // x, y, radius, startAngle, endAngle
            ctx.fill();
            ctx.fillStyle = NODE_COLOR_EMPTY
            if (forceFill || Math.random() < 0.5) {
                ctx.fillStyle = NODE_COLOR_FILLED
            }
            ctx.beginPath();
            ctx.arc(x0, y0, lineWidth, 0, Math.PI * 2); // x, y, radius, startAngle, endAngle
            ctx.fill();
        }
        function isValidEnd(x, y) {
            if (NODE_END[x] == undefined) {return false}
            if (NODE_END[x][y]) { return false }
            if (NODE_DIR[x][y] != NODE_UNSET_ID) {return false}
            let blockSize = 1
            if (x-1 == -1) {
                blockSize++
            } else if (NODE_END[x-1][y]) {
                blockSize++
                if (x-2 == -1) {
                    blockSize++
                } else if (NODE_END[x-2][y]) {
                    blockSize++
                }
            }
            if (x+1 == COL_NODE_COUNT) {
                blockSize++
            } else if (NODE_END[x+1][y]) {
                blockSize++
                if (x+2 == COL_NODE_COUNT) {
                    blockSize++
                } else if (NODE_END[x+2][y]) {
                    blockSize++
                }
            }
            return blockSize < 3
        }
        function getDx(x, y) {
            if (y < 1) {return NODE_START_ID}
            if (NODE_END[x] == undefined) {return NODE_START_ID}
            const dxPossibilities = []
            if (x > 0) {
                if (!NODE_END[x-1][y-1] && NODE_DIR[x-1][y] != 1) {
                    dxPossibilities.push(-1)
                }
            }
            if (x < COL_NODE_COUNT - 1) {
                if (!NODE_END[x+1][y-1] && NODE_DIR[x+1][y] != -1) {
                    dxPossibilities.push(1)
                }
            }
            if (!NODE_END[x][y-1]) {
                dxPossibilities.push(0)
            }
            if (dxPossibilities.length == 0) {
                return NODE_START_ID
            }
            return dxPossibilities[Math.floor(Math.random() * dxPossibilities.length)]
        }
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
                while (NODE_DIR[xDraw][yDraw] == NODE_UNSET_ID) {
                    xArr.push(xDraw)
                    yArr.push(yDraw)
                    dxArr.push(dxDraw)
                    NODE_DIR[xDraw][yDraw] = dxDraw
                    if (dxDraw == NODE_START_ID) {
                        break
                    }
                    yDraw--
                    xDraw += dxDraw
                    dxDraw = getDx(xDraw, yDraw)
                    if (NODE_DIR[xDraw] == undefined) {
                        throw new Error("here")
                    }
                }
                //Don't bother animating super short circuits
                if (xArr.length == 1) {
                    xArr.pop()
                    yArr.pop()
                    dxArr.pop()
                    requestAnimationFrame(updateAnimation);
                    return;
                }
            }
            let xNode
            let yNode
            let dxNode
            const highestRow = getHighestRow()
            do {
                xNode = xArr.pop()
                yNode = yArr.pop()
                dxNode = dxArr.pop()
                if (dxNode == NODE_START_ID) {
                    drawNode(xNode, yNode, true)
                } else {
                    drawPath(xNode, yNode, dxNode)
                }
                if (xArr.length == 0) {
                    drawNode(xNode, yNode)
                }
            } while (yNode < highestRow)
            requestAnimationFrame(updateAnimation);
        }
        requestAnimationFrame(updateAnimation);
    }
    useEffect(() => {
        if (canvasRef.current) {
            animate(canvasRef.current);
        }
    }, [page]);
    window.addEventListener("resize", () => {
        if (canvasRef.current) {
            canvasSetup(canvasRef.current);
        }
    })
    return <canvas ref={canvasRef}></canvas>
}