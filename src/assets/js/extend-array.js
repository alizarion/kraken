
Object.defineProperty(Array.prototype, "arrayObjectIndexOf", {
    enumerable: false,
    value: function(obj) {
        for (var i = 0; i < this.length; i++) {

            if (angular.equals(this[i], obj)) {
                return i;
            }


        }
        return -1;
    }
});
Object.defineProperty(Window.prototype, "getParameterByName", {
    enumerable: false,
    value: function(name, url) {
        if (!url) {
            url = window.location.href;
        }
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
});
Object.defineProperty(Array.prototype, "pushUnique", {
    enumerable: false,
    value: function(item) {
        if (this.arrayObjectIndexOf(item) < 0) {
            this.push(item);
        }
    }
});

Object.defineProperty(Array.prototype, "concatUnique", {
    enumerable: false,
    value: function(items) {
        for (var i in items){
            this.pushUnique(items[i]);
        }
        return this;
    }

});
Object.defineProperty(String.prototype, "isEmpty", {
    enumerable: false,
    value: function() {
        return (this.length === 0 || !this.trim());
    }
});