import {
    _connectorPointAlongPathFrom,
    ConnectorPath,
    ELEMENT_CIRCLE,
    ELEMENT_PATH,
    OverlayFactory,
    PaintStyle,
    perpendicularLineTo,
    PointXY,
    SimpleShapeOverlay,
    SimpleShapeOverlayPaintParams
} from "@visuallyjs/browser-ui"

/**
 * Crows foot overlays. There are three basic drawing primitives:
 *
 * - a straight line
 * - a circle
 * - a foot
 *
 * And then we have these overlays:
 *
 * - OneOnly - compound, two single bars
 * - One - draw a single bar
 * - Zero - draw a circle
 * - ZeroOrMany - compound, a circle then a foot
 * - ZeroOrOne - compound, a circle then a line
 * - Many - draw a foot
 * - OneOrMany - compound, a bar then a foot
 *
 */

export interface ZeroOverlayPaintParams extends SimpleShapeOverlayPaintParams {}

export class ZeroOverlay<EL> extends SimpleShapeOverlay<EL> {

    static type= "Zero"
    type:string = ZeroOverlay.type

    contentTags = [ELEMENT_CIRCLE]

    radius = 10

    draw(connector:ConnectorPath, currentConnectionPaintStyle:PaintStyle, absolutePosition?: PointXY): ZeroOverlayPaintParams {
        return drawOneCircle(connector, this.location, this.radius + 2, 2, this.radius, currentConnectionPaintStyle.stroke, "#FFFFFF")
    }
}

/**
 * Draws a single line. Used in the OneOverlay and the OneOnlyOverlay.
 * @param connector
 * @param loc
 * @param offset
 * @param lineWidth
 * @param lineLength
 */
function drawOneBar(connector:ConnectorPath, loc:number, offset:number, lineWidth:number, lineLength:number, stroke:string) {

    const direction = loc < 0.5 ? 1 : -1
    const p1 = _connectorPointAlongPathFrom(connector, loc, direction * offset)
    const p2 = _connectorPointAlongPathFrom(connector, loc, direction * (offset + lineWidth / 2))
    const l = perpendicularLineTo(p1, p2, lineLength)

    const path = `M ${l[0].x} ${l[0].y} L ${l[1].x} ${l[1].y}`

    return {
        atts: [{
            d: path,
            "stroke-width": lineWidth,
            stroke,
            fill:stroke
        }],
        xmin: Math.min(l[0].x, l[1].x),
        xmax: Math.max(l[0].x, l[1].x),
        ymin: Math.min(l[0].y, l[1].y),
        ymax: Math.max(l[0].y, l[1].y),
        tail:p2
    }
}

function drawOneCircle(connector:ConnectorPath, loc:number, offset:number, lineWidth:number, r:number, stroke:string, fill:string) {
    const mult = loc < 0.5 ? 1 : -1
    const center = _connectorPointAlongPathFrom(connector, loc, offset * mult)
    const tail = _connectorPointAlongPathFrom(connector, loc, (offset + r) * mult)
    return {
        atts: [{
            cx: center.x,
            cy:center.y,
            r,
            "stroke-width": lineWidth,
            stroke,
            fill
        }],
        xmin: Math.min(center.x - r, center.x + r),
        xmax: Math.max(center.x - r, center.x + r),
        ymin: Math.min(center.y - r, center.y + r),
        ymax: Math.max(center.y - r, center.y + r),
        tail
    }
}

function drawOneFoot(connector:ConnectorPath, loc:number, offset:number, width:number, length:number, lineWidth:number, stroke:string) {
    const mult = loc < 0.5 ? 1 : -1
    const baseOffset = offset * mult
    const headOffset = mult * (offset + length)

    const base = _connectorPointAlongPathFrom(connector, loc, baseOffset)
    const head = _connectorPointAlongPathFrom(connector, loc, headOffset)
    // dummy point for computing baseline
    const dp = mult * (offset + lineWidth/2)
    const p3 = _connectorPointAlongPathFrom(connector, loc, dp)
    const baseline = perpendicularLineTo(base, p3, width)

    const path = mult === 1 ? `M ${baseline[1].x} ${baseline[1].y} L ${head.x} ${head.y} L ${baseline[0].x} ${baseline[0].y}` : `M ${baseline[0].x} ${baseline[1].y} L ${head.x} ${head.y} L ${baseline[1].x} ${baseline[0].y}`

    return {
        atts: [{
            d: path,
            "stroke-width": lineWidth,
            stroke,
            fill:"none"
        }],
        xmin: Math.min(head.x, baseline[0].x, baseline[1].x),
        xmax: Math.max(head.x, baseline[0].x, baseline[1].x),
        ymin: Math.min(head.y, baseline[0].y, baseline[1].y),
        ymax: Math.max(head.y, baseline[0].y, baseline[1].y),
        tail:head
    }
}

export interface OneOverlayPaintParams extends SimpleShapeOverlayPaintParams {}

export class OneOverlay<EL> extends SimpleShapeOverlay<EL> {
    static type= "One"
    type:string = OneOverlay.type

    contentTags = [ ELEMENT_PATH ]

    lineWidth = 2
    lineLength = 20
    offset = 4

    draw(connector:ConnectorPath, currentConnectionPaintStyle:PaintStyle, absolutePosition?: PointXY): OneOverlayPaintParams {
        return drawOneBar(connector, this.location,
            this.offset, this.lineWidth, this.lineLength, currentConnectionPaintStyle.stroke)
    }

}

export interface OneOnlyOverlayPaintParams extends SimpleShapeOverlayPaintParams {}

export class OneOnlyOverlay<EL> extends SimpleShapeOverlay<EL> {
    static type= "OneOnly"
    type:string = OneOnlyOverlay.type

    contentTags = [ELEMENT_PATH, ELEMENT_PATH]

    lineWidth = 2
    lineLength = 20
    gap = 8
    offset = 4

    draw(connector:ConnectorPath, currentConnectionPaintStyle:PaintStyle, absolutePosition?: PointXY): OneOnlyOverlayPaintParams {

        const p1 = drawOneBar(connector, this.location, this.offset, this.lineWidth, this.lineLength, currentConnectionPaintStyle.stroke)

        const p2 = drawOneBar(connector, this.location, this.offset + this.gap, this.lineWidth, this.lineLength, currentConnectionPaintStyle.stroke)

        return _merge(p1, p2)
    }
}
export interface OneOrManyOverlayPaintParams extends SimpleShapeOverlayPaintParams {}

export class OneOrManyOverlay<EL> extends SimpleShapeOverlay<EL> {
    static type= "OneOrMany"
    type:string = OneOrManyOverlay.type

    contentTags = [ELEMENT_PATH, ELEMENT_PATH]

    width = 12
    lineWidth = 2
    length = 14
    gap = 12
    offset = 2

    draw(connector:ConnectorPath, currentConnectionPaintStyle:PaintStyle, absolutePosition?: PointXY): OneOrManyOverlayPaintParams {

        const foot = drawOneFoot(connector, this.location, this.offset, this.width, this.length, this.lineWidth, currentConnectionPaintStyle.stroke)

        // now draw a line, at the apex of the foot
        const headStart = (this.length + this.lineWidth)

        const line = drawOneBar(connector, this.location, headStart, this.lineWidth, this.length, currentConnectionPaintStyle.stroke)

        return _merge(foot, line)
    }
}

export interface ZeroOrManyOverlayPaintParams extends SimpleShapeOverlayPaintParams {}

export class ZeroOrManyOverlay<EL> extends SimpleShapeOverlay<EL> {
    static type= "ZeroOrMany"
    type:string = ZeroOrManyOverlay.type

    contentTags = [ELEMENT_PATH, ELEMENT_CIRCLE]

    width = 12
    lineWidth = 2
    length = 14
    gap = 12
    offset = 0
    radius = 5

    draw(connector:ConnectorPath, currentConnectionPaintStyle:PaintStyle, absolutePosition?: PointXY): ZeroOrManyOverlayPaintParams {

        const foot = drawOneFoot(connector, this.location, this.offset, this.width, this.length, this.lineWidth, currentConnectionPaintStyle.stroke)

        // now draw a line, at the apex of the foot
        const headStart = (this.length + this.lineWidth + this.radius)

        const circle = drawOneCircle(connector, this.location, headStart, this.lineWidth, this.radius, currentConnectionPaintStyle.stroke, "#FFFFFF")

        return _merge(foot, circle)
    }
}

export interface ZeroOrOneOverlayPaintParams extends SimpleShapeOverlayPaintParams {}

export class ZeroOrOneOverlay<EL> extends SimpleShapeOverlay<EL> {
    static type= "ZeroOrOne"
    type:string = ZeroOrOneOverlay.type

    contentTags = [ELEMENT_PATH, ELEMENT_CIRCLE]

    width = 12
    lineWidth = 2
    length = 14
    gap = 2
    offset = 2
    radius = 5

    draw(connector:ConnectorPath, currentConnectionPaintStyle:PaintStyle, absolutePosition?: PointXY): ZeroOrOneOverlayPaintParams {

        const bar = drawOneBar(connector, this.location, this.offset, this.lineWidth, this.length, currentConnectionPaintStyle.stroke)

        // now draw a line, at the apex of the foot
        const headStart = (this.offset + this.gap + this.lineWidth + this.radius)

        const circle = drawOneCircle(connector, this.location, headStart, this.lineWidth, this.radius, currentConnectionPaintStyle.stroke, "#FFFFFF")

        return _merge(bar, circle)
    }
}


export interface ManyOverlayPaintParams extends SimpleShapeOverlayPaintParams {}

/**
 * A crow's foot overlay used to indicate a Many relationship.
 */
export class ManyOverlay<EL> extends SimpleShapeOverlay<EL> {
    static type= "Many"
    type:string = ManyOverlay.type

    contentTags = [ELEMENT_PATH]

    width = 12
    lineWidth = 2
    length = 14
    offset = 2

    draw(connector:ConnectorPath, currentConnectionPaintStyle:PaintStyle, absolutePosition?: PointXY): ManyOverlayPaintParams {
        return drawOneFoot(connector, this.location, 0, this.width, this.length, this.lineWidth, currentConnectionPaintStyle.stroke)
    }

}

function _merge(...paths:Array<any>) {
    return {
        atts:paths.map(p => p.atts[0]),

        xmin:Math.min(...paths.map(_p => _p.xmin)),
        xmax:Math.max(...paths.map(_p => _p.xmax)),
        ymin:Math.min(...paths.map(_p => _p.ymin)),
        ymax:Math.max(...paths.map(_p => _p.ymax)),
        tail:paths[paths.length - 1].tail
    }
}

OverlayFactory.register(ZeroOverlay.type, ZeroOverlay)
OverlayFactory.register(OneOverlay.type, OneOverlay)
OverlayFactory.register(OneOnlyOverlay.type, OneOnlyOverlay)
OverlayFactory.register(ManyOverlay.type, ManyOverlay)
OverlayFactory.register(OneOrManyOverlay.type, OneOrManyOverlay)
OverlayFactory.register(ZeroOrManyOverlay.type, ZeroOrManyOverlay)
OverlayFactory.register(ZeroOrOneOverlay.type, ZeroOrOneOverlay)
