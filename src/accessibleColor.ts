
const tinycolor = require('tinycolor2')

export default function accesibleColor(color:tinycolor.Instance, colors: tinycolor.Instance[]){
    return tinycolor.mostReadable(color, colors, {includeFallbackColors:true}).toHexString()
}