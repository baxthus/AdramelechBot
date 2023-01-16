export default function (arr: Array<string>) {
    return String(arr.map(element => {
        return element.charAt(0).toUpperCase() + element.slice(1).toLowerCase().replaceAll('-', ' ');
    })).replace(',', ', ');
}