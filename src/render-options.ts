import {
    AnchorLocations, CONNECTOR_TYPE_ORTHOGONAL
} from "@visuallyjs/browser-ui";
import {ERD_SHAPES} from "./erd-shapes";
import edgeMappings from "./edge-mappings";

/**
 * Render options control the basic behaviour and appearance of the UI.
 */
const renderOptions = {
    zoomToFit:true,
    edges:{
        editable:false,
        anchor:AnchorLocations.Continuous,
        allowUnattached:false,
        avoidVertices:true,
        propertyMappings:edgeMappings(),
        connector:{
            type:CONNECTOR_TYPE_ORTHOGONAL,
            options:{
                cornerRadius:3,
                stub:20
            }
        }
    },
    grid:{
        size:{
            width:20,
            height:20
        }
    },
    lasso:true,
    shapes:[ERD_SHAPES],
    cells:{
        rotatable:false
    }
}

export default renderOptions
