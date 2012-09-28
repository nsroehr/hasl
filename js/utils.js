Utils = {};
Utils.Pair = function(first, second) {
    this.first = first;
    this.second = second;
};

Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};

function IsNumeric(input)
{
    return (input - 0) == input && input.length > 0;
}