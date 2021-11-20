String.prototype.replaceAll = function(search, replace) {
    while (this.search(search) != -1)
        this.replace(search, replace)
}

let a = 'asdf'

a.replaceAll('a', 'xyz')
console.log(a)