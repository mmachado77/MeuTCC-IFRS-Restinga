const CardData = ({ numero, texto }) => {
    // Se for o ano, pega os dois últimos dígitos; senão, garante que tenha 2 dígitos
    const formattedNumero =
        texto.toUpperCase() === 'ANO'
            ? numero.toString().slice(-2)
            : numero.toString().padStart(2, '0');

    return (
        <div className="rounded-md text-center bg-data-gradient">
            <div className="text-lg text-white">
                <div className="flex flex-col">
                    <div className="p-2 font-medium ">
                        <span className="text-3xl">{formattedNumero}</span>
                    </div>
                    <div className="flex flex-col m-0">
                        <div className="!p-0">
                            <hr className="m-auto border[0.5px] border-dashed border-white p-0 w-full" />
                        </div>
                        <div className="!p-0">
                            <span className="text-base tracking-wider p-0">{texto}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardData;
