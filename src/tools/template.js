var templateCache = { /* <templates/> */ };

function templateGet(name, urlPrefix) {
    if (templateCache[name]) {
        return templateCache[name];
    }

    // Parse the URL
    var url = urlPrefix;
    var split = name.split('.');
    if (split.length === 1) {
        // URL is for an editor core template
        url += 'templates/' + split[0] + '.html';
    } else {
        // URL is for a plugin template
        url += 'plugins/' + split[0] + '/templates/' + split.splice(1).join('/') + '.html';
    }

    // Request the template
    var template;
    $.ajax({
        url: url,
        type: 'GET',
        async: false,
        // <debug>
        cache: false,
        // </debug>
        // 15 seconds
        timeout: 15000,
        error: function() {
            template = null;
        },
        success: function(data) {
            template = data;
        }
    });

    // Cache the template
    templateCache[name] = template;

    return template;
};


function templateConvertTokens(template, variables) {
    // Translate template
    template = template.replace(/_\(['"]{1}(.*?)['"]{1}\)/g, function(match, key) {
        key = key.replace(/\\(.?)/g, function (s, slash) {
            switch (slash) {
                case '\\': {
                    return '\\';
                }
                case '0': {
                    return '\u0000';
                }
                case '': {
                    return '';
                }
                default: {
                    return slash;
                }
            }
        });
        return _(key);
    });

    // Replace variables
    variables = $.extend({}, this.options, variables || {});
    variables = templateGetVariables(variables);
    template = template.replace(/\{\{(.*?)\}\}/g, function(match, variable) {
        // <debug>
        if (typeof variables[variable] === 'undefined') {
            handleError(new Error('Missing template variable: ' + variable));
        }
        // </debug>
        return variables[variable];
    });

    return template;
};

function templateGetVariables(variables, prefix, depth) {
    prefix = prefix ? prefix + '.' : '';
    var maxDepth = 5;
    if (!depth) depth = 1;
    var result = {};
    for (var name in variables) {
        if (typeof variables[name] === 'object' && depth < maxDepth) {
            var inner = templateGetVariables(variables[name], prefix + name, ++depth);
            for (var innerName in inner) {
                result[innerName] = inner[innerName];
            }
        } else {
            result[prefix + name] = variables[name];
        }
    }
    return result;
};
