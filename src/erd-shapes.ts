/**
 * Shape library for ERD shapes. This contains the definitions of how to draw each shape type.
 */
const ERD_SHAPES = {
    id:"erd",
    name:"ERD",
    shapes:[
        {
            type: "entity",
            label: "Entity",
            template: '<svg:rect rx="2" x="0" y="0" width="{{width}}" height="{{height}}" stroke-linejoin="bevel" stroke-width="2"/>'
        },
        {
            type:"attribute",
            label:"Attribute",
            template: '<svg:ellipse cx="{{width/2}}" cy="{{height/2}}" rx="{{width/2}}" ry="{{height/2}}" stroke-linejoin="bevel" stroke-width="2"/>'
        },
        {
            type: "relationship",
            label: "Relationship",
            template: '<svg:polygon points="{{width/2}} 0 {{width}} {{height/2}} {{width/2}} {{height}} 0 {{height /2}}" stroke-linejoin="bevel" stroke-width="2"/>'
        }
    ]
}

/**
 * List of prepared shapes: a prepared shape is one in which we've defined what type/category to use for the SVG shape itself, and then we optionally provide an initial size and some initial properties. These are not required in order to create a diagram, but they do provide a nice layer of encapsulation - here we are basically imposing a theme, which we could put inside a function that takes values for the sizes and colors.
 */
const erdShapes = [
    {
        shapeId:"entity",
        label:"Entity",
        type:"entity",
        category:"erd",
        size:{
            "width": 120,
            "height": 80,
        },
        properties:{
            "fill": "#567567",
            "color": "#ffffff",
        }
    },
    {
        shapeId:"relationship",
        label:"Relationship",
        type:"relationship",
        category:"erd",
        size:{
            "width": 120,
            "height": 80,
        },
        properties:{
            "fill": "#e9e2d0",
            "color": "#444444"
        }
    },
    {
        shapeId:"subattribute",
        label:"Sub-attribute",
        type:"attribute",
        category: "erd",
        size:{
            "width": 120,
            "height": 60,
        },
        properties: {
            "fill": "#b2bebe",
            "color": "#64748b"
        }
    },
    {
        shapeId:"attribute",
        label:"Attribute",
        type:"attribute",
        category: "erd",
        size:{
            width:120,
            height:60
        },
        properties: {
            "fill": "#8ea2a2",
            "color": "#1e293b"
        }
    }
]


export {ERD_SHAPES, erdShapes}
