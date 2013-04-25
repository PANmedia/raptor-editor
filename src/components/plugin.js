/**
 * @fileOverview Contains the raptor plugin class code.
 * @license http://www.raptor-editor.com/license
 *
 * @author David Neilsen <david@panmedia.co.nz>
 * @author Michael Robinson <michael@panmedia.co.nz>
 * @author Melissa Richards <melissa@panmedia.co.nz>
 */

/**
 * @class The raptor plugin class.
 *
 * @todo type and desc for name.
 * @param {type} name
 * @param {Object} overrides Options hash.
 * @returns {RaptorPlugin}
 */
function RaptorPlugin(name, overrides) {
    this.name = name;
    for (var key in overrides) {
        this[key] = overrides[key];
    }
}

/**
 * Initialize the raptor plugin.
 */
RaptorPlugin.prototype.init = function() {};

/**
 * Enable the raptor plugin.
 */
RaptorPlugin.prototype.enable = function() {};
