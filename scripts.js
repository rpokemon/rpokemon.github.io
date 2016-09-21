flair.current_choice = 0;

flair.searchByName = function(needle) {
    var matches = [];
    for (var key in flair.names) {
        if (flair.names.hasOwnProperty(key)) {
            var key_name = flair.names[key];
            if (key_name.toLowerCase().indexOf(needle) !== -1) {
                matches.push([key, key_name]);
            }
        }
    }
    return matches;
}

flair.updateFilter = function(text) {
    if (text.length == 0) {
        n.show(document.querySelectorAll('.flair-choice'));
    }
    
    var is_int = text >>> 0 === parseFloat(text);
    if (is_int) {
        text = text.toString();
    }
    
    text = text.toLowerCase();
    
    for (var key in flair.names) {
        if (flair.names.hasOwnProperty(key)) {
            var key_name = flair.names[key].toLowerCase();
            var el = document.querySelector('.flair-choice[data-id="'+key+'"]');
            
            if (text == key_name || key_name.indexOf(text) !== -1 || text === key) {
                n.show(el);
            } else {
                n.hide(el);
            }
        }
    }
}

flair.sendChoice = function() {
	var flair_text = encodeURIComponent(document.getElementById('flair-selection-text').value);
	window.open("http://www.reddit.com/message/compose/?to=PokemonFlairBot&subject="+flair.current_choice+"&message="+flair_text)
}

flair.selectChoice = function(key) {
    var el = document.querySelector('.flair-choice[data-id="'+key+'"]');
    
    if (!el) {
        return;
    }
    
    n.removeClass(document.querySelectorAll('.flair-choice'), 'selected');
    n.addClass(el, 'selected');
    
    flair.current_choice = key;
    
    document.getElementById('flair-selection-flair').setAttribute('class', 'flair flair-'+key);
    document.getElementById('flair-selection-name').innerHTML = '#'+key + ' ' + flair.names[key];
}

flair.loadChoices = function() {
    flair.loadExtra();
    
    var enter = document.getElementById('flair-choices');
    for (var key in flair.names) {
        if (flair.names.hasOwnProperty(key)) {
            var flair_choice = document.createElement('span');
            flair_choice.setAttribute('class', 'flair flair-choice flair-' + key);
            flair_choice.setAttribute('data-name', flair.names[key]);
            flair_choice.setAttribute('title', '#'+key+' '+flair.names[key]);
            flair_choice.setAttribute('data-id', key);
            flair_choice.setAttribute('onclick', 'flair.selectChoice("'+key+'")');
            
            enter.appendChild(flair_choice);
        }
    }
}

document.addEventListener('DOMContentLoaded', flair.loadChoices, false);

/* UTILITIES
--------------------------------------------------------------------------------*/
var n = {};

n.addClass = function(o, className) {
    if (!o || !className || !className.length)
        return;
    
    o = n.isString(o) ? document.querySelectorAll(o) : o;
    
    function do_stuff(el) {
        if (el.classList) {
            el.classList.add(className);
        } else if (!hasClass(el, className)) {
            el.className += ' ' + className;
        }
    }
    
    if (n.isNodeList(o)) {
        for (var i = 0, len = o.length; i < len; i++)
            do_stuff(o[i]);
    } else do_stuff(o);
}

n.removeClass = function(o, className) {
    if (!o || !className || !className.length)
        return;
    
    o = n.isString(o) ? document.querySelectorAll(o) : o;
    
    function do_stuff(el) {
        if (el.classList) {
            el.classList.remove(className);
        } else {
            var regExp = new RegExp('(?:^|\\s)' + className + '(?!\\S)', 'g');
            document.getElementById("MyElement").className = document.getElementById("MyElement").className.replace(regExp);
        }
    }
    
    if (n.isNodeList(o)) {
        for (var i = 0, len = o.length; i < len; i++)
            do_stuff(o[i]);
    } else do_stuff(o);
}

n.toggleClass = function(o, className) {
    if (!o || !className || !className.length)
        return;
    
    o = n.isString(o) ? document.querySelectorAll(o) : o;
    
    function do_stuff(el) {
        if (el.classList) {
            el.classList.toggle(className);
        } else {
            if (hasClass(el, className)) {
                removeClass(el, className);
            } else {
                el.className += ' ' + className;
            }
        }
    }
    
    if (n.isNodeList(o)) {
        for (var i = 0, len = o.length; i < len; i++)
            do_stuff(o[i]);
    } else do_stuff(o);
}

n.hasClass = function(o, className) {
    if (!o || !className || !className.length)
        return false;
    
    o = n.isString(o) ? document.querySelectorAll(o) : o;
    
    function do_stuff(el) {
        if (el.classList) {
            return el.classList.contains(className);
        } else {
            var regExp = new RegExp('(?:^|\\s)' + className + '(?!\\S)', 'g');
            return document.getElementById("MyElement").className.match(regExp);
        }
    }
    
    if (n.isNodeList(o)) {
        for (var i = 0, len = o.length; i < len; i++)
            if (!do_stuff(o[i]))
                return false;
    } else return do_stuff(o);
    
    return true;
}


n.setClass = function(o, className, state) {
    if (!state && n.hasClass(o, className)) {
        n.removeClass(o, className);
    } else if (state && !n.hasClass(o, className)) {
        n.addClass(o, className);
    }
}

n.isNodeList = function(nodes) {
    var stringRepr = Object.prototype.toString.call(nodes);

    return typeof nodes === 'object' &&
        /^\[object (HTMLCollection|NodeList|Object)\]$/.test(stringRepr) &&
        (typeof nodes.length === 'number') &&
        (nodes.length === 0 || (typeof nodes[0] === "object" && nodes[0].nodeType > 0));
}

n.startsWith = function(str, needle) {
    return str.length >= needle.length && str.substring(0, needle.length) === needle;
}

n.endsWith = function(str, needle) {
    return str.length >= needle.length && str.substring(str.length - needle.length) === needle;
}

// General purpose "contains" function
// For: strings, arrays, objects (check if property exists), nodes
n.contains = function(haystack, needle) {
    if (typeof haystack === 'string' || haystack instanceof String) {
        return haystack.indexOf(needle) > -1;
    } else if (haystack instanceof Array) {
        return n.inArray(needle, haystack);
    } else if (typeof haystack == 'object') {
        return haystack.hasOwnProperty(needle);
    } else if (n.isNode(haystack) && n.isNode(needle)) {
        return haystack.contains(needle);
    }
    return false;
}

n.isString = function(obj) {
    return typeof obj === 'string' || obj instanceof String;
}


n.hide = function(o) {
    o = n.isString(o) ? document.querySelectorAll(o) : o;
    
    if (n.isNodeList(o)) {
        for (var i = 0, len = o.length; i < len; i++) {
            o[i].style.display = 'none';
        }
    } else {
        o.style.display = 'none';
    }
}
n.show = function(o) {
    o = n.isString(o) ? document.querySelectorAll(o) : o;
    
    if (n.isNodeList(o)) {
        for (var i = 0, len = o.length; i < len; i++) {
            o[i].style.display = '';
        }
    } else {
        o.style.display = '';
    }
}