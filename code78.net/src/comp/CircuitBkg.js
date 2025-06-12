import { useState, useRef, useEffect } from 'react';

export default function CircuitBkg({page}) {
    const canvasRef = useRef();
    const [canvasInit, setCanvasInit] = useState(false);
    let init = false // Del me

    function pseudoRand(n) {
        n = ((n >> 16) ^ n) * 0x86753099;
        n = ((n >> 16) ^ n) * 0x78;
        n = (n >> 16) ^ n;
        return n & 1;
    }

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
    let glitchNodeX = null
    let glitchNodeY = null
    let glitchState = 0
    const glitchableNodes = []
    
    function canvasSetup(canvasElement) {
        const initRect = canvasElement.getBoundingClientRect();
        canvasElement.width = initRect.width * dpr;
        canvasElement.height = initRect.height * dpr;
        lineWidth = canvasElement.width / 120;
        lineBloom = lineWidth * 3
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
        
        glitchState = 0
        glitchableNodes.length = 0
        
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
        function drawPath(x, y, dx, drawBloom = true, drawColor = LINE_COLOR) {
            const x0 = coord(x + dx + 1)
            const y0 = coord(Math.max(y-1,0))
            const x1 = coord(x + 1)
            const y1 = coord(y)
            ctx.strokeStyle = drawColor;
            ctx.lineWidth = lineWidth;
            ctx.lineCap = "round";
            if (drawBloom) {
                ctx.shadowColor = drawColor
                ctx.shadowBlur = lineBloom;
            } else {
                ctx.shadowBlur = 0;
            }
            ctx.beginPath();
            ctx.moveTo(x0, y0);
            ctx.lineTo(x1, y1);
            ctx.stroke();
        }
        function drawNode(x, y, fillColor = null, drawBloom = true, drawColor = LINE_COLOR) {
            const x0 = coord(x+1)
            const y0 = coord(y)
            if (drawBloom) {
                ctx.shadowColor = drawColor
                ctx.shadowBlur = lineBloom;
            } else {
                ctx.shadowBlur = 0;
            }
            ctx.fillStyle = drawColor
            ctx.beginPath();
            ctx.arc(x0, y0, lineWidth*2, 0, Math.PI * 2); // x, y, radius, startAngle, endAngle
            ctx.fill();
            if (fillColor == null) {
                if (pseudoRand((x * COL_NODE_COUNT)+y) == 1) {
                    ctx.fillStyle = NODE_COLOR_FILLED
                } else {
                    ctx.fillStyle = NODE_COLOR_EMPTY
                }
            } else {
                ctx.fillStyle = fillColor
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
        const GLITCH_PROB = 1 / 240
        const GLITCH_COLOR_ARR = ['#ff8800', '#ff8200', '#ff7c00', '#ff7600', '#ff7000', '#ff6a00', '#ff6400', '#ff5e00', '#ff5800', '#ff5200', '#ff4d00', '#ff4700', '#ff4100', '#ff3b00', '#ff3500', '#ff2f00', '#ff2900', '#ff2300', '#ff1d00', '#ff1700', '#ff1100', '#ff1100', '#ff2f20', '#ff4d40', '#ff6a60', '#ff8880', '#ffa69f', '#ffc4bf', '#ffe1df', '#ffffff', '#ffffff', '#ffe1df', '#ffc4bf', '#ffa69f', '#ff8880', '#ff6a60', '#ff4d40', '#ff2f20', '#ff1100', '#ff1100', '#ff1700', '#ff1d00', '#ff2300', '#ff2900', '#ff2f00', '#ff3500', '#ff3b00', '#ff4100', '#ff4700', '#ff4d00', '#ff5200', '#ff5800', '#ff5e00', '#ff6400', '#ff6a00', '#ff7000', '#ff7600', '#ff7c00', '#ff8200', '#ff8800']
        
        function updateAnimation(time) {
            if ((time - lastFrameTime) < FRAME_DURATION) {
                requestAnimationFrame(updateAnimation);
                return
            }
            lastFrameTime = time

            if (glitchState == 0 ) {
                if (glitchableNodes.length > 0 && Math.random() < GLITCH_PROB) {
                    [glitchNodeX, glitchNodeY] = glitchableNodes[Math.floor(Math.random() * glitchableNodes.length)]
                    glitchState++
                }
            } else {
                let glitchColor = GLITCH_COLOR_ARR[glitchState]
                let gx = glitchNodeX
                let gy = glitchNodeY
                if (NODE_DIR[gx] != undefined) {
                    while (gy > 1) {
                        drawPath(gx, gy, NODE_DIR[gx][gy], false, glitchColor)
                        gx += NODE_DIR[gx][gy]
                        gy--
                    }
                    if (pseudoRand((glitchNodeX * COL_NODE_COUNT)+glitchNodeY) == 1) {
                        drawNode(glitchNodeX, glitchNodeY, glitchColor, false, glitchColor)
                    } else {
                        drawNode(glitchNodeX, glitchNodeY, null, false, glitchColor)
                    }
                }
                glitchState++
                if (glitchState >= GLITCH_COLOR_ARR.length) {
                    drawNode(glitchNodeX, glitchNodeY, null, false)
                    glitchState = 0
                }
            }

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
                if (xArr.length <= 1) {
                    xArr.length = 0
                    yArr.length = 0
                    dxArr.length = 0
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
                    drawNode(xNode, yNode, NODE_COLOR_FILLED)
                } else {
                    drawPath(xNode, yNode, dxNode)
                }
                if (xArr.length == 0) {
                    drawNode(xNode, yNode)
                    glitchableNodes.push([xNode, yNode])
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