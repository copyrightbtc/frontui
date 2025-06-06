export const truncateMiddle = (fullStr: string, strLen: number, sep?: string): string => {
    if (!fullStr || fullStr.length <= strLen) { return fullStr; }
    const separator = sep || '...';
    const charsToShow = strLen - separator.length;
    const frontChars = Math.ceil(charsToShow / 2);
    const backChars = Math.floor(charsToShow / 2);

    return `${fullStr.substring(0, frontChars)}${separator}${fullStr.substring(fullStr.length - backChars)}`;
};
