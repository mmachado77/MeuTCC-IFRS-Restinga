import { Avatar } from "primereact/avatar";

const GeraNomeLabel = (nomeCompleto) => {
    if (!nomeCompleto) {
        return '';
    }
    const palavras = nomeCompleto.split(' ');
    if (palavras.length === 1) {
        return palavras[0].charAt(0).toUpperCase();
    }
    const primeiroNome = palavras.at(0).charAt(0).toUpperCase();
    const ultimoNome = palavras.at(-1).charAt(0).toUpperCase();
    return primeiroNome + ultimoNome;
}

const CustomAvatar = ({ ...props }) => {
    props.label = props.label || GeraNomeLabel(props?.fullname);
    return <Avatar {...props} className={ props.className + ' bg-indigo-600 text-white select-none' } />
}

export default CustomAvatar;