export const truncateEmail = (str) => {
    //return ` * * * ${str.slice(2)}`;
    //return str.replace(/\B.+@/g, (c, ) => c.split('').slice(-1).map(v => ' * * * ').join('') + '@');
    //const regex = /(?<=.{3}).(?=[^@]*?@)/g;

    var strLen = str.length;
        if (strLen > 4) {
            return str.replace(/(?<=.{3}).+@/g, (c, ) => c.split('').slice(-1).map(v => ' * * * ').join('') + '@');
        } 
        return str.replace(/(?<=.{2}).+@/g, (c, ) => c.split('').slice(-1).map(v => ' * * * ').join('') + '@');
};