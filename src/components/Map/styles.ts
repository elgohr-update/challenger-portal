export const layerStyles: { [group: string]: { [state: string]: Partial<maplibregl.LayerSpecification> } } = {
    stations: {
        default: {
            type: 'circle',
            paint: {
                'circle-radius': 7,
                'circle-color': '#d5ab1a',
                'circle-opacity': 0.9
            }
        },
        selected: {
            // This style depends on `pulsingDot` in `components/Map/utils.ts`
            type: 'symbol',
            layout: {
                'icon-image': 'pulsing-dot'
            }
        },
        clustered: {
            type: 'circle',
            filter: ['has', 'point_count'],
            paint: {
                // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
                // with three steps to implement three types of circles:
                //   * #14807c, 15px circles when point count is less than 20
                //   * #32bb39, 20px circles when point count is between 20 and 40
                //   * #98d320, 25px circles when point count is greater than or equal to 40
                'circle-color': ['step', ['get', 'point_count'], '#14807c', 20, '#32bb39', 40, '#98d320'],
                'circle-radius': ['step', ['get', 'point_count'], 15, 20, 20, 40, 25]
            }
        },
        clusterCount: {
            type: 'symbol',
            filter: ['has', 'point_count'],
            layout: {
                'text-field': '{point_count_abbreviated}',
                'text-font': ['Roboto Regular'],
                'text-size': 12
            }
        }
    },
    journeyPath: {
        default: {
            type: 'line',
            layout: {
                'line-join': 'round',
                'line-cap': 'round'
            },
            paint: {
                'line-color': '#e3e7af',
                'line-width': 2
            }
        },
        direction: {
            // This style depends on `directionArrow` in `components/Map/utils.ts`
            type: 'symbol',
            layout: {
                'symbol-placement': 'line',
                'symbol-spacing': 50,
                'icon-rotate': 90,
                'icon-image': 'direction-arrow',
                'icon-size': 1.2
            }
        }
    },
    faoAreas: {
        default: {
            type: 'line',
            paint: {
                'line-color': '#794c5a',
                'line-opacity': 0.5
            }
        }
    }
};

export const mapStyle: maplibregl.StyleSpecification = {
    version: 8,
    glyphs: `${window.API_FONTS}/{fontstack}/{range}.pbf`,
    sources: {},
    layers: []
};
