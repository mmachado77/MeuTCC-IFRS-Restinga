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
    if (!props.image) {
        delete props.image;
        props.label = props.label || GeraNomeLabel(props?.fullname);
    }
    return <Avatar {...props} />
}

export default CustomAvatar;