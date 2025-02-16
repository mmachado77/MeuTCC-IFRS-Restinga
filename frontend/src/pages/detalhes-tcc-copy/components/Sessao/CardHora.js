const CardHora = ({ numero, texto }) => {
    // Se for o ano, pega os dois últimos dígitos; senão, garante que tenha 2 dígitos
    const formattedNumero =
        texto.toUpperCase() === 'ANO'
            ? numero.toString().slice(-2)
            : numero.toString().padStart(2, '0');
    const horaMinuto = numero.split(':');
    const hora = horaMinuto[0].toString().padStart(2, '0');
    const minuto = horaMinuto[1]

    return (
        <div className="rounded-md overflow-hidden text-center bg-[#22c55e]">
            <div className="text-lg w-full text-white">
                <div className="flex">
                    <div className="w-1/3 flex justify-center bg-relogio-gradient items-center">
                        <span className="pi pi-clock text-3xl p-2"></span>
                    </div>
                    <div className="">
                        <hr className="border-dashed m-[0] border-white h-full border-1" />
                    </div>
                    <div className="w-2/3 text-3xl bg-hora-gradient p-2">
                        <span className="tracking-wider">{hora}</span>
                        <span className="tracking-wider">:</span>
                        <span className="tracking-wider">{minuto}</span>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default CardHora;
