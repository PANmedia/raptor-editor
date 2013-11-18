templateRegister("special-characters.dialog", "<div> tr('specialCharactersHelp') <br/> <ul></ul> </div>");
templateRegister("special-characters.tab-button", "<button data-setKey=\"{{setKey}}\" data-charactersIndex=\"{{charactersIndex}}\" title=\"{{description}}\">{{htmlEntity}}</button>");
templateRegister("special-characters.tab-content", "<div id=\"{{baseClass}}-{{key}}\"></div>");
templateRegister("special-characters.tab-li", "<li><a href=\"#{{baseClass}}-{{key}}\">{{name}}</a></li>");