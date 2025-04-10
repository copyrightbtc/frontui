import { isDraggableGrid, isResizableGrid} from '../api/config';

export interface LayoutGridGeneralInterface {
    x: number;
    y: number;
    w: number;
    h: number;
    i: string;
}

export interface LayoutGrid {
    lg: LayoutGridGeneralInterface[];
    md: LayoutGridGeneralInterface[];
    sm: LayoutGridGeneralInterface[];
}

export const getStaticHeight = () => {
    const header = document.getElementsByTagName('header')[0];
    const headerHeight = header ? header.clientHeight : 0;
    const headerContainer = document.getElementsByClassName('header-trading')[0];
    const headerContainerHeight = headerContainer ? headerContainer.clientHeight : 0;

    return headerHeight + headerContainerHeight;
};

export const gridUnitsToPixels = (gridUnit: number, rowHeight: number, margin: number) => {
    let res = gridUnit * (rowHeight + margin);
    if (gridUnit > 1) {
        res -= margin;
    }

    return res;
};

export const pixelsToGridUnits = (pixels: number, rowHeight: number, margin: number) => {
    let tmp = pixels;

    if (pixels / (rowHeight + margin) > 1) {
        tmp += margin;
    }

    return tmp / (rowHeight + margin);
};

const getLayouts = () => {
    
    const orderHeight = 22.5;
    const minOrderBookHeight = 21;
    const minRecentTradesHeight = 10;
    const minTradingChartHeight = 21;
    const minOpenOrdersHeight = 7;
    const minMarketsHeight = 10;
    //const staticHeight = getStaticHeight() || 96;
    //const isDraggable = isDraggableGrid();
    //const isResizable = isResizableGrid();

    return {
        lg: [
            { x: 0, y: 0, w: 14, h: 2, i: '1', minH: 4, minW: 2, maxW: 2, isDraggable: false, isResizable: false }, // Header
            { x: 19, y: 23, w: 5, h: 16, i: '2', minH: 4, minW: 4, isDraggable: false, isResizable: false }, // RecentTrades
            { x: 0, y: 2, w: 14, h: 20, i: '3', minH: 4, minW: 4, isDraggable: false, isResizable: false }, // Charts
            { x: 14, y: 0, w: 5, h: 22, i: '4', minH: 4, minW: 4, isDraggable: false, isResizable: false }, // OrderBook
            { x: 0, y: 24, w: 19, h: 16, i: '5', minH: 4, minW: 4, isDraggable: false, isResizable: false }, // OpenOrdersComponent
            { x: 19, y: 0, w: 5, h: 22, i: '6', minH: 4, minW: 4, isDraggable: false, isResizable: false }, // OrderComponent
       ],
       xs: [
            { x: 6, y: 0, w: 12, h: 2, i: '1', minH: 4, minW: 2, maxW: 2, isDraggable: false, isResizable: false }, // Header
            { x: 18, y: 23, w: 3.999, h: 16, i: '2', minH: 4, minW: 4, isDraggable: false, isResizable: false }, // RecentTrades
            { x: 6, y: 2, w: 12, h: 16, i: '3', minH: 4, minW: 4, isDraggable: false, isResizable: false }, // Charts
            { x: 2, y: 17, w: 3.999, h: 22, i: '4', minH: 4, minW: 4, isDraggable: false, isResizable: false }, // OrderBook
            { x: 6, y: 32, w: 12, h: 32, i: '5', minH: 4, minW: 4, isDraggable: false, isResizable: false }, // OpenOrdersComponent
            { x: 6, y: 17, w: 12, h: 14, i: '6', minH: 4, minW: 4, isDraggable: false, isResizable: false }, // OrderComponent
            { x: 18, y: 0, w: 3.999, h: 18, i: '7', minH: 4, minW: 4, isDraggable: false, isResizable: false }, // MarketsComponent
 
        ],
        md: [
            { x: 16, y: 18, w: 8, h: orderHeight, i: '1', minH: orderHeight, maxH: orderHeight, minW: 4, isDraggable: false, isResizable: false },
            { x: 0, y: 0, w: 16, h: 22, i: '2', minH: minTradingChartHeight, minW: 5, isDraggable: false, isResizable: false },
            { x: 16, y: 0, w: 8, h: 22, i: '3', minH: minOrderBookHeight, minW: 4, isDraggable: false, isResizable: false },
            { x: 0, y: 60, w: 16, h: 22, i: '4', minH: minOpenOrdersHeight, minW: 5, isDraggable: false, isResizable: false },
            { x: 0, y: 60, w: 16, h: 22, i: '5', minH: minRecentTradesHeight, minW: 4, isDraggable: false, isResizable: false },
            { x: 20, y: 36, w: 8, h: 22, i: '6', minH: minMarketsHeight, minW: 4, isDraggable: false, isResizable: false },
        ],
        sm: [
            { x: 0, y: 12, w: 12, h: 22, i: '1', minH: 22, maxH: 22, minW: 5, isDraggable: false },
            { x: 0, y: 28, w: 12, h: 30, i: '2', minH: 30, minW: 5, isDraggable: false },
            { x: 0, y: 58, w: 12, h: 18, i: '3', minH: 12, minW: 3, isDraggable: false },
            { x: 0, y: 82, w: 12, h: 20, i: '4', minH: 12, minW: 7, isDraggable: false },
            { x: 0, y: 106, w: 12, h: 20, i: '5', minH: 12, minW: 7, isDraggable: false },
            { x: 0, y: 126, w: 12, h: 20, i: '6', minH: 12, minW: 7, isDraggable: false },
        ],
    };
};

export const layouts = getLayouts();

export const getLayoutFromLS = (key: string): LayoutGrid | undefined => {
    let obj = {};
    if (localStorage) {
        try {
            obj = JSON.parse(localStorage.getItem('rgl') || '') || {};
        } catch (e) {
            // ignore
        }
    }

    return obj[key];
};

export const saveLayoutToLS = (key: string, value): void => {
    if (localStorage) {
        localStorage.setItem(
            'rgl',
            JSON.stringify({[key]: value}),
        );
    }
};

export const resetLayout = (key: string): void => {
    if (localStorage) {
        localStorage.setItem(
            'rgl',
            JSON.stringify({[key]: layouts}),
        );
    }
};
