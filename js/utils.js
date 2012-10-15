Utils = {};
Utils.Pair = function(first, second) {
    this.first = first;
    this.second = second;
};

Array.prototype.remove = function(from, to) {
    if(typeof from !== 'number')
    {
        var index = this.indexOf(from);
        if(index === -1)
        {
            return this; // item not in array
        }
        else
        {
            from = index;
        }
    }
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};


Array.prototype.removeAll = function() {
    this.length = 0;
    //return this.slice(0, this.length);
};

function IsNumeric(input)
{
    return (input - 0) == input && input.length > 0;
}

//Function.prototype.method = function (name, func) 
//{
//    if (!this.prototype[name]) 
//    {
//        this.prototype[name] = func;
//        return this;
//    }
//    return undefined;
//};